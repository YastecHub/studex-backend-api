import Service, { IService } from '../models/Service';
import User from '../models/User';
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';
import { uploadToCloudinary } from '../utils/cloudinary';

export class ServiceService {
  async createService(userId: string, data: any, images?: Express.Multer.File[]): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.skillCategory === 'Client') {
      throw new UnauthorizedError('Only freelancers can create services');
    }

    let portfolioImages: string[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const imageUrl = await uploadToCloudinary(image);
        if (imageUrl) portfolioImages.push(imageUrl);
      }
    }

    const service = new Service({
      freelancerId: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      price: parseInt(data.price),
      priceType: data.priceType || 'FIXED',
      skills: Array.isArray(data.skills) ? data.skills : data.skills?.split(',').map((s: string) => s.trim()) || [],
      portfolioImages,
    });

    await service.save();
    return this.formatServiceResponse(service, user);
  }

  async getServices(query: any): Promise<any> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }
    
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { skills: { $in: [new RegExp(query.search, 'i')] } }
      ];
    }

    const [services, total] = await Promise.all([
      Service.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Service.countDocuments(filter)
    ]);

    const servicesWithFreelancers = await Promise.all(
      services.map(async (service) => {
        const freelancer = await User.findById(service.freelancerId);
        return this.formatServiceResponse(service, freelancer);
      })
    );

    return {
      services: servicesWithFreelancers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getServiceById(serviceId: string): Promise<any> {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const freelancer = await User.findById(service.freelancerId);
    return this.formatServiceResponse(service, freelancer);
  }

  async getUserServices(userId: string): Promise<any> {
    const services = await Service.find({ freelancerId: userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);
    
    return services.map(service => this.formatServiceResponse(service, user));
  }

  private formatServiceResponse(service: any, freelancer: any) {
    return {
      id: service._id.toString(),
      freelancerId: service.freelancerId,
      freelancerName: freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Unknown',
      freelancerAvatar: freelancer?.profileImage || 'https://picsum.photos/seed/default/200/200',
      freelancerUsername: freelancer?.username || 'unknown',
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      priceType: service.priceType,
      skills: service.skills,
      portfolioImages: service.portfolioImages.length > 0 ? service.portfolioImages : ['https://picsum.photos/seed/default/400/300'],
      rating: 4.8, // Mock rating
      reviewsCount: Math.floor(Math.random() * 50) + 1,
      aiMatchScore: Math.floor(Math.random() * 30) + 70,
      isActive: service.isActive,
      createdAt: service.createdAt,
    };
  }
}

export const serviceService = new ServiceService();