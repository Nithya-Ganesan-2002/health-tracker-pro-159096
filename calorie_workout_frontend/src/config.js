 // PUBLIC_INTERFACE
 /**
  * API base URL for the backend.
  * This uses REACT_APP_API_BASE_URL from environment variables.
  * If not provided, requests will use relative paths (suitable if a proxy is configured).
  */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
