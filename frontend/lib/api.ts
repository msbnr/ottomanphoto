import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to requests and start loading
api.interceptors.request.use(
  (config) => {
    // Start loading progress (only in browser)
    if (typeof window !== 'undefined') {
      import('nprogress').then((NProgress) => {
        NProgress.default.start()
      })
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ottoman_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    // Stop loading progress (only in browser)
    if (typeof window !== 'undefined') {
      import('nprogress').then((NProgress) => {
        NProgress.default.done()
      })
    }
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally and stop loading
api.interceptors.response.use(
  (response) => {
    // Stop loading progress (only in browser)
    if (typeof window !== 'undefined') {
      import('nprogress').then((NProgress) => {
        NProgress.default.done()
      })
    }
    return response
  },
  (error) => {
    // Stop loading progress (only in browser)
    if (typeof window !== 'undefined') {
      import('nprogress').then((NProgress) => {
        NProgress.default.done()
      })
    }

    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('ottoman_token')
      localStorage.removeItem('ottoman_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  registerCustomer: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => api.post('/auth/register/customer', data),

  registerDealer: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    companyName?: string
    taxNumber?: string
    address?: string
  }) => api.post('/auth/register/dealer', data),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data: any) => api.put('/auth/profile', data),

  // Address management
  getAddresses: () => api.get('/auth/addresses'),

  addAddress: (data: {
    title: string
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    country?: string
    postalCode: string
    isDefault?: boolean
  }) => api.post('/auth/addresses', data),

  updateAddress: (addressId: string, data: any) =>
    api.put(`/auth/addresses/${addressId}`, data),

  deleteAddress: (addressId: string) => api.delete(`/auth/addresses/${addressId}`),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),

  // Admin: User management
  getAllUsers: () => api.get('/auth/admin/users'),

  createUser: (data: {
    email: string
    password: string
    userType: 'customer' | 'dealer' | 'admin'
    dealerTier?: 'small' | 'medium' | 'large' | 'main_dealer'
    firstName: string
    lastName: string
    phone?: string
    companyName?: string
    taxNumber?: string
  }) => api.post('/auth/admin/users', data),

  updateUser: (userId: string, data: any) =>
    api.put(`/auth/admin/users/${userId}`, data),

  deleteUser: (userId: string) =>
    api.delete(`/auth/admin/users/${userId}`),

  toggleUserStatus: (userId: string) =>
    api.patch(`/auth/admin/users/${userId}/toggle-status`),

  resetUserPassword: (userId: string, newPassword: string) =>
    api.patch(`/auth/admin/users/${userId}/reset-password`, { newPassword }),
}

// Product API
export const productAPI = {
  getAll: (params?: {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
  }) => api.get('/products', { params }),

  getById: (id: string) => api.get(`/products/${id}`),

  create: (data: any) => api.post('/products', data),

  update: (id: string, data: any) => api.put(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
}

// Order API
export const orderAPI = {
  create: (data: {
    items: Array<{
      productId: string
      name: string
      sku: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      fullName: string
      phone: string
      street: string
      city: string
      state: string
      country: string
      postalCode: string
    }
    paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery'
    notes?: string
  }) => api.post('/orders', data),

  getMyOrders: () => api.get('/orders/my-orders'),

  getById: (id: string) => api.get(`/orders/${id}`),

  getAll: () => api.get('/orders'),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
}

// Franchise API
export const franchiseAPI = {
  apply: (data: {
    fullName: string
    email: string
    phone: string
    city: string
    concept: string
    notes?: string
    termsAccepted: boolean
    privacyAccepted: boolean
  }) => {
    // Transform frontend data to backend format
    const payload = {
      fullName: data.fullName,
      location: {
        city: data.city,
        country: 'Türkiye', // Default country
      },
      concept: data.concept,
      contact: {
        phone: data.phone,
        email: data.email,
      },
      agreements: {
        terms: data.termsAccepted,
        privacy: data.privacyAccepted,
        contract: data.termsAccepted,
      },
      notes: data.notes,
    }
    return api.post('/franchise/apply', payload)
  },

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/franchise', { params }),

  getById: (id: string) => api.get(`/franchise/${id}`),

  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/franchise/${id}/status`, { status, notes }),
}

// Contact API
export const contactAPI = {
  submit: (data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
  }) => api.post('/contact', data),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/contact', { params }),

  getById: (id: string) => api.get(`/contact/${id}`),

  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/contact/${id}/status`, { status, notes }),

  delete: (id: string) => api.delete(`/contact/${id}`),
}

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),

  update: (data: any) => api.put('/settings', data),

  getFranchiseConcepts: () => api.get('/settings/franchise-concepts'),

  getFranchiseFeatures: () => api.get('/settings/franchise-features'),
}

// Gallery API
export const galleryAPI = {
  getAll: (params?: { albumId?: string }) => api.get('/gallery', { params }),

  getAllAdmin: () => api.get('/gallery/admin/all'),

  getById: (id: string) => api.get(`/gallery/${id}`),

  create: (data: any) => api.post('/gallery', data),

  update: (id: string, data: any) => api.put(`/gallery/${id}`, data),

  delete: (id: string) => api.delete(`/gallery/${id}`),

  uploadImage: (formData: FormData) => {
    return api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Album API
export const albumAPI = {
  getAll: () => api.get('/albums'),

  getAllAdmin: () => api.get('/albums/admin/all'),

  getById: (id: string) => api.get(`/albums/${id}`),

  create: (data: any) => api.post('/albums', data),

  update: (id: string, data: any) => api.put(`/albums/${id}`, data),

  delete: (id: string) => api.delete(`/albums/${id}`),
}

// Banner API
export const bannerAPI = {
  getAll: () => api.get('/banners'),

  getAllAdmin: () => api.get('/banners/admin'),

  getById: (id: string) => api.get(`/banners/${id}`),

  create: (formData: FormData) => {
    return api.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update: (id: string, formData: FormData) => {
    return api.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete: (id: string) => api.delete(`/banners/${id}`),
}

// Campaign API
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),

  getAllAdmin: (params?: { page?: number; limit?: number; type?: string; isActive?: boolean }) =>
    api.get('/campaigns/admin/all', { params }),

  getById: (id: string) => api.get(`/campaigns/${id}`),

  apply: (data: { campaignId: string; cart: any }) =>
    api.post('/campaigns/apply', data),

  create: (data: any) => api.post('/campaigns/admin', data),

  update: (id: string, data: any) => api.put(`/campaigns/admin/${id}`, data),

  delete: (id: string) => api.delete(`/campaigns/admin/${id}`),

  toggle: (id: string) => api.patch(`/campaigns/admin/${id}/toggle`),
}

// Page API (CMS)
export const pageAPI = {
  getAll: () => api.get('/pages'),

  getMenu: () => api.get('/pages/menu'),

  getBySlug: (slug: string) => api.get(`/pages/slug/${slug}`),

  getAllAdmin: (params?: { page?: number; limit?: number }) =>
    api.get('/pages/admin/all', { params }),

  getById: (id: string) => api.get(`/pages/admin/${id}`),

  create: (data: any) => api.post('/pages/admin', data),

  update: (id: string, data: any) => api.put(`/pages/admin/${id}`, data),

  delete: (id: string) => api.delete(`/pages/admin/${id}`),

  togglePublish: (id: string) => api.patch(`/pages/admin/${id}/toggle-publish`),
}
