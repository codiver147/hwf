
const authApi = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

export default authApi;

