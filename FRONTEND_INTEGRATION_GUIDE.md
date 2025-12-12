# Frontend Integration Quick Guide

## 🚀 Quick Start

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:3000';  // Development
// const API_BASE_URL = 'https://studex-backend-api.onrender.com';  // Production
```

### Authentication Flow
```javascript
// 1. Sign Up
const signup = async (formData) => {
  const data = new FormData();
  data.append('matric', formData.matricNo);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('firstName', formData.firstName);
  data.append('lastName', formData.lastName);
  data.append('username', formData.username);
  data.append('schoolName', formData.department);
  data.append('skillCategory', formData.userRole);  // Client, Freelancer, or Hybrid
  data.append('interests', JSON.stringify(formData.skills));
  if (formData.profileImage) {
    data.append('profileImage', formData.profileImage);
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body: data
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));
  }
  return result;
};

// 2. Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));
  }
  return result;
};

// 3. Get Profile
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

## 📝 Common API Calls

### Services (Freelancer Features)

```javascript
// Create Service
const createService = async (serviceData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  formData.append('title', serviceData.title);
  formData.append('description', serviceData.description);
  formData.append('category', serviceData.category);
  formData.append('price', serviceData.price);
  formData.append('priceType', serviceData.priceType || 'FIXED');
  formData.append('skills', JSON.stringify(serviceData.skills));
  
  // Add portfolio images
  if (serviceData.portfolioImages) {
    serviceData.portfolioImages.forEach(image => {
      formData.append('portfolioImages', image);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/services`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};

// Get All Services (for Home page)
const getServices = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.category && filters.category !== 'All' && { category: filters.category }),
    ...(filters.search && { search: filters.search })
  });

  const response = await fetch(`${API_BASE_URL}/api/services?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Get Service Details
const getServiceById = async (serviceId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Get My Services
const getMyServices = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/services/my-services`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

### Jobs (Client Features)

```javascript
// Post a Job
const postJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      budget: parseInt(jobData.budget),
      deadline: jobData.deadline,
      skills: jobData.skills.split(',').map(s => s.trim())
    })
  });
  return response.json();
};

// Get All Jobs (for Freelancers)
const getJobs = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.category && filters.category !== 'All' && { category: filters.category })
  });

  const response = await fetch(`${API_BASE_URL}/api/jobs?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Get My Posted Jobs
const getMyJobs = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/jobs/my-jobs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

### User Management

```javascript
// Update Profile
const updateProfile = async (updates) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  return response.json();
};

// Update Profile Image
const updateProfileImage = async (imageFile) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/auth/profile/image`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};

// Get All Users (for discovery)
const getUsers = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.skillCategory && { skillCategory: filters.skillCategory }),
    ...(filters.schoolName && { schoolName: filters.schoolName })
  });

  const response = await fetch(`${API_BASE_URL}/api/auth/users?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Search Users
const searchUsers = async (query, page = 1) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_BASE_URL}/api/auth/users/search?q=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

## 🎯 Page-Specific Integration

### Home Page (Services Display)
```javascript
useEffect(() => {
  const fetchServices = async () => {
    const result = await getServices({
      page: 1,
      limit: 12,
      category: activeCategory,
      search: searchQuery
    });
    
    if (result.success) {
      setServices(result.data.services);
      setPagination(result.data.pagination);
    }
  };
  
  fetchServices();
}, [activeCategory, searchQuery]);
```

### Jobs Page (Client View)
```javascript
useEffect(() => {
  const fetchMyJobs = async () => {
    const result = await getMyJobs();
    if (result.success) {
      setPostedJobs(result.data);
    }
  };
  
  fetchMyJobs();
}, []);
```

### Jobs Page (Freelancer View)
```javascript
useEffect(() => {
  const fetchJobs = async () => {
    const result = await getJobs({
      page: 1,
      limit: 10,
      category: selectedCategory
    });
    
    if (result.success) {
      setJobs(result.data.jobs);
    }
  };
  
  fetchJobs();
}, [selectedCategory]);
```

### Profile Page
```javascript
useEffect(() => {
  const fetchProfile = async () => {
    const result = await getProfile();
    if (result.success) {
      setUserData(result.data);
    }
  };
  
  fetchProfile();
}, []);
```

## 🔄 Data Mapping

### Backend to Frontend Mapping

```javascript
// Backend User -> Frontend User
const mapUser = (backendUser) => ({
  id: backendUser.id,
  name: `${backendUser.firstName} ${backendUser.lastName}`,
  username: backendUser.username,
  avatar: backendUser.profileImage || 'https://picsum.photos/seed/default/200/200',
  role: backendUser.skillCategory.toUpperCase(),  // CLIENT, FREELANCER, HYBRID
  rating: 4.8,  // Mock for now
  walletBalance: 15400  // Mock for now
});

// Backend Service -> Frontend Service
const mapService = (backendService) => ({
  id: backendService.id,
  freelancerId: backendService.freelancerId,
  freelancerName: backendService.freelancerName,
  freelancerAvatar: backendService.freelancerAvatar,
  title: backendService.title,
  description: backendService.description,
  category: backendService.category,
  price: backendService.price,
  priceType: backendService.priceType,
  rating: backendService.rating,
  reviewsCount: backendService.reviewsCount,
  portfolioImages: backendService.portfolioImages,
  aiMatchScore: backendService.aiMatchScore
});

// Backend Job -> Frontend Job
const mapJob = (backendJob) => ({
  id: backendJob.id,
  title: backendJob.title,
  description: backendJob.description,
  budget: backendJob.budget,
  postedDate: backendJob.postedDate,
  applicants: backendJob.applicants,
  status: backendJob.status,
  category: backendJob.category
});
```

## ⚠️ Error Handling

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const result = await apiFunction();
    
    if (!result.success) {
      // Handle API errors
      if (result.errors) {
        // Validation errors
        Object.entries(result.errors).forEach(([field, message]) => {
          console.error(`${field}: ${message}`);
        });
      } else {
        // General error
        console.error(result.message);
      }
      return null;
    }
    
    return result.data;
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
    return null;
  }
};

// Usage
const services = await handleApiCall(() => getServices({ page: 1 }));
if (services) {
  setServices(services.services);
}
```

## 🔐 Token Expiration Handling

```javascript
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }
  
  return response.json();
};
```

## 📊 Categories

Use these exact category values:
```javascript
const CATEGORIES = [
  'All',
  'Design',
  'Development',
  'Photography',
  'Tutoring',
  'Writing',
  'Beauty',
  'Laundry',
  'Video'
];
```

## 🎨 Skill Categories

```javascript
const SKILL_CATEGORIES = {
  CLIENT: 'Client',
  FREELANCER: 'Freelancer',
  HYBRID: 'Hybrid'
};
```

## ✅ Testing Checklist

- [ ] Sign up with all fields
- [ ] Sign up with profile image
- [ ] Login and store token
- [ ] Get profile data
- [ ] Update profile
- [ ] Update profile image
- [ ] Create service (freelancer)
- [ ] Get all services
- [ ] Filter services by category
- [ ] Search services
- [ ] Post job (client)
- [ ] Get all jobs
- [ ] Get my posted jobs
- [ ] Search users
- [ ] Get all users with filters

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Backend already has CORS enabled. Check if you're using correct URL.

### Issue: 401 Unauthorized
**Solution**: Check if token is being sent in Authorization header.

### Issue: File upload not working
**Solution**: Use FormData and don't set Content-Type header (browser sets it automatically).

### Issue: Images not displaying
**Solution**: Images are served from Cloudinary. Check if profileImage/portfolioImages fields exist.

## 📞 Support

- Swagger Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`
- Complete API Docs: See `COMPLETE_API_DOCS.md`