import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        // Skip adding token for public endpoints
        const publicEndpoints = ['/jobs', '/jobs/'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
            config.url.endsWith(endpoint) && config.method === 'get'
        );
        
        if (!isPublicEndpoint) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else if (config.url !== '/token/' && config.url !== '/token/refresh/') {
                console.warn('No access token found for request to:', config.url);
            }
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        
        // If the error status is 401 and we haven't tried to refresh the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            console.log('Received 401, attempting token refresh...');
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/token/`, {
                        refresh: refreshToken
                    });
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } else {
                    console.error('No refresh token available');
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Clear invalid tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        console.error(`API Error (${error.response.status}):`, {
            url: originalRequest?.url,
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
        });
        
        return Promise.reject(error);
    }
);

// ! For Authentication Endpoints
const Register_URL = `${API_BASE_URL}/register/`;
const Login_URL = `${API_BASE_URL}/token/`;

const loginUser = (credentials) => api.post(Login_URL, credentials);
const registerUser = (userData) => api.post(Register_URL, userData);

// ! For Employees Endpoints
const Employees_URL = `${API_BASE_URL}/employees/`;
const getEmployees = (filters = {}) => api.get(Employees_URL, { params: filters });
const getEmployee = (id) => api.get(`${Employees_URL}${id}/`);
const updateEmployee = (id, employee) => api.put(`${Employees_URL}${id}/`, employee);
const deleteEmployee = (id) => api.delete(`${Employees_URL}${id}/`);

// ! For Employers Endpoints
const Employers_URL = `${API_BASE_URL}/employers/`;
const getEmployers = () => api.get(Employers_URL);
const getEmployer = (id) => api.get(`${Employers_URL}${id}/`);
const updateEmployer = (id, employer) => api.put(`${Employers_URL}${id}/`, employer);
const deleteEmployer = (id) => api.delete(`${Employers_URL}${id}/`);

// ! For Jobs Endpoints
const Jobs_URL = `${API_BASE_URL}/jobs/`;
const getJobs = (filters = {}) => api.get(Jobs_URL, { params: filters });
const getJob = (id) => api.get(`${Jobs_URL}${id}/`);
const createJob = (job) => api.post(Jobs_URL, job);
const updateJob = (id, job) => api.put(`${Jobs_URL}${id}/`, job);
const deleteJob = (id) => api.delete(`${Jobs_URL}${id}/`);

// ! For Applications Endpoints
const Applications_URL = `${API_BASE_URL}/applications/`;
const getApplications = () => api.get(Applications_URL);
const getApplicationsForJob = (jobId) => api.get(`${Applications_URL}?job=${jobId}`);
const getApplication = (id) => api.get(`${Applications_URL}${id}/`);
const createApplication = (application) => api.post(Applications_URL, application);
const updateApplication = (id, application) => api.put(`${Applications_URL}${id}/`, application);
const deleteApplication = (id) => api.delete(`${Applications_URL}${id}/`);

// ! For Admins Endpoints
const Admins_URL = `${API_BASE_URL}/admins/`;
const getAdmins = () => api.get(Admins_URL);
const getAdmin = (id) => api.get(`${Admins_URL}${id}/`);
const updateAdmin = (id, admin) => api.put(`${Admins_URL}${id}/`, admin);
const deleteAdmin = (id) => api.delete(`${Admins_URL}${id}/`);


export {
    loginUser,
    registerUser,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployers,
    getEmployer,
    updateEmployer,
    deleteEmployer,
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationsForJob,
    getAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin
}