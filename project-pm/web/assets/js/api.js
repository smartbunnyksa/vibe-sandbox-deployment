const socket = new WebSocket('ws://localhost:3001'); // Adjust the URL as needed

socket.onopen = () => {
  console.log('WebSocket connection established.');
};

socket.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onclose = () => {
  console.log('WebSocket connection closed.');
};

// API utility for communicating with the backend
const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // User methods
  async getUser(id) {
    return await this.request(`/users/${id}`);
  }

  async updateUser(id, data) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Branch methods
  async getBranches() {
    return await this.request('/branches');
  }

  async getBranch(id) {
    return await this.request(`/branches/${id}`);
  }

  async createBranch(data) {
    return await this.request('/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBranch(id, data) {
    return await this.request(`/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBranch(id) {
    return await this.request(`/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Training session methods
  async getSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/sessions?${queryString}`);
  }

  async getSession(id) {
    return await this.request(`/sessions/${id}`);
  }

  async createSession(data) {
    return await this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSession(id, data) {
    return await this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSession(id) {
    return await this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create global API client instance
window.api = new ApiClient();
