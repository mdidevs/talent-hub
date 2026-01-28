import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

class AxiosMiddleware {
  private instance: AxiosInstance;

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL: baseURL || (import.meta.env.VITE_API_URL),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  //if need to change baseURL dynamically
  public setUrl(baseURL: string): AxiosInstance {
    this.instance.defaults.baseURL = baseURL;
    return this.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - auto set headers
    this.instance.interceptors.request.use(
      (config) => {
        // Add authorization token if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add any other custom headers
        config.headers['X-Requested-With'] = 'XMLHttpRequest';

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle responses and errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
const axiosMiddleware = new AxiosMiddleware();
export default axiosMiddleware;
