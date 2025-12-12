import Job, { IJob } from '../models/Job';
import User from '../models/User';
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';

export class JobService {
  async createJob(userId: string, data: any): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const job = new Job({
      clientId: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      budget: parseInt(data.budget),
      deadline: new Date(data.deadline),
      skills: Array.isArray(data.skills) ? data.skills : data.skills?.split(',').map((s: string) => s.trim()) || [],
    });

    await job.save();
    return this.formatJobResponse(job, user);
  }

  async getJobs(query: any): Promise<any> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { status: 'open' };
    
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Job.countDocuments(filter)
    ]);

    const jobsWithClients = await Promise.all(
      jobs.map(async (job) => {
        const client = await User.findById(job.clientId);
        return this.formatJobResponse(job, client);
      })
    );

    return {
      jobs: jobsWithClients,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getUserJobs(userId: string): Promise<any> {
    const jobs = await Job.find({ clientId: userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);
    return jobs.map(job => this.formatJobResponse(job, user));
  }

  private formatJobResponse(job: any, client: any) {
    return {
      id: job._id.toString(),
      clientId: job.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
      clientAvatar: client?.profileImage || 'https://picsum.photos/seed/default/200/200',
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      deadline: job.deadline,
      skills: job.skills,
      status: job.status,
      applicants: job.applicants.length,
      postedDate: this.getRelativeTime(job.createdAt),
      createdAt: job.createdAt,
    };
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  }
}

export const jobService = new JobService();