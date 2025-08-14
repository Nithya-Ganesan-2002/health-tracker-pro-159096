import { API_BASE_URL } from "../config";

/**
 * Simple API client for making HTTP requests to the backend with JWT support.
 */
class ApiClient {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  // PUBLIC_INTERFACE
  /**
   * Set or clear the JWT token.
   * @param {string|null} token JWT token to use for future requests.
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Build a full URL for a given path.
   * @param {string} path REST path starting with /
   * @returns {string}
   */
  buildUrl(path) {
    if (!this.baseUrl) return path;
    return `${this.baseUrl}${path}`;
  }

  /**
   * Core request method with JSON support and error handling.
   * @param {string} method HTTP method
   * @param {string} path API path (e.g., /api/foods)
   * @param {object} options Additional options: body, headers, query
   * @returns {Promise<any>} Parsed JSON or null for 204
   */
  async request(method, path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = this.buildUrl(path);
    const fetchOptions = {
      method,
      headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    };

    const res = await fetch(url, fetchOptions);

    if (res.status === 204) {
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || res.statusText || "Request failed";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // PUBLIC_INTERFACE
  /** Perform a GET request */
  get(path) {
    return this.request("GET", path);
  }

  // PUBLIC_INTERFACE
  /** Perform a POST request */
  post(path, body) {
    return this.request("POST", path, { body });
  }

  // PUBLIC_INTERFACE
  /** Perform a PUT request */
  put(path, body) {
    return this.request("PUT", path, { body });
  }

  // PUBLIC_INTERFACE
  /** Perform a DELETE request */
  delete(path) {
    return this.request("DELETE", path);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
