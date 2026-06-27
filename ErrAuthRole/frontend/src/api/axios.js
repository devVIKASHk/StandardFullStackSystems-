/**
 * =============================================================
 * AXIOS INSTANCE — API Client with Interceptors
 * =============================================================
 *
 * This is the MOST IMPORTANT file in our API layer. It creates
 * a pre-configured Axios instance that ALL API calls will use.
 *
 * KEY CONCEPTS:
 *
 * 1. BASE URL — All requests are prefixed with our API server URL
 *    so we don't have to type it every time.
 *
 * 2. CREDENTIALS — `withCredentials: true` tells the browser to
 *    send/receive cookies with every request. This is critical
 *    because our refresh token lives in an httpOnly cookie.
 *
 * 3. ACCESS TOKEN IN MEMORY — Unlike many tutorials that store
 *    tokens in localStorage (which is vulnerable to XSS attacks),
 *    we store the access token in a simple module-level variable.
 *    This is more secure because JavaScript from other sources
 *    can't access module-scoped variables.
 *
 * 4. REQUEST INTERCEPTOR — Before every request goes out, we
 *    automatically attach the access token to the Authorization
 *    header. This way, our API functions don't need to worry
 *    about authentication at all.
 *
 * 5. RESPONSE INTERCEPTOR — This is where the magic happens.
 *    If ANY request gets a 401 (Unauthorized) response, we:
 *    a) Try to refresh the access token silently
 *    b) If successful, retry the original request with the new token
 *    c) If refresh fails too, redirect to login
 *
 *    This creates a seamless experience — users never see 401 errors
 *    as long as their refresh token is valid.
 *
 * FLOW DIAGRAM:
 *
 *   Request → [Add Token] → Server
 *                              ↓
 *   Success ← ────────── 200 OK
 *                              ↓
 *   401 Error → [Refresh Token] → New Token → [Retry Original] → Success
 *                    ↓
 *              Refresh Failed → [Clear Token] → [Redirect to /login]
 *
 * =============================================================
 */

import axios from 'axios';
import toast from 'react-hot-toast';

/* =============================================================
   MODULE-LEVEL ACCESS TOKEN STORAGE
   =============================================================
   We store the access token in a simple variable. This is:
   - ✅ More secure than localStorage (not accessible via XSS)
   - ✅ More secure than sessionStorage
   - ⚠️ Lost on page refresh (that's why we have the refresh flow)
   ============================================================= */
let accessToken = null;

/**
 * setAccessToken — Updates the in-memory access token.
 * Called after login, register, or token refresh.
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * getAccessToken — Returns the current access token.
 * Useful for checking if we have a token without importing the variable.
 */
export const getAccessToken = () => accessToken;

/* =============================================================
   CREATE AXIOS INSTANCE
   =============================================================
   This instance has our defaults baked in. Every API call made
   through this instance will automatically use these settings.
   ============================================================= */
const api = axios.create({
  baseURL: 'http://localhost:5000', // Our backend API server
  withCredentials: true, // CRITICAL: Send cookies with every request
  headers: {
    'Content-Type': 'application/json', // We always send JSON
  },
});

/* =============================================================
   REQUEST INTERCEPTOR
   =============================================================
   This runs BEFORE every request is sent to the server.
   
   Think of it as a "middleware" for outgoing requests.
   Its job: attach the access token to the Authorization header.
   
   Format: "Bearer <token>" — this is the standard JWT format.
   The server reads this header to identify the user.
   ============================================================= */
api.interceptors.request.use(
  (config) => {
    // If we have an access token, add it to the request header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // If something goes wrong preparing the request, reject it
    return Promise.reject(error);
  }
);

/* =============================================================
   RESPONSE INTERCEPTOR — Automatic Token Refresh
   =============================================================
   This runs AFTER every response comes back from the server.
   
   The key logic here handles 401 (Unauthorized) errors:
   
   1. When the access token expires, the server returns 401
   2. We catch that 401 and try to get a new token via /auth/refresh
   3. The refresh endpoint uses the httpOnly cookie (sent automatically)
   4. If we get a new token, we retry the original failed request
   5. If refresh fails, the user must log in again
   
   IMPORTANT: We use a flag `_retry` on the request config to
   prevent infinite loops. Without it, a failed refresh would
   trigger another refresh, which would fail, which would trigger
   another, and so on forever.
   
   We also skip the interceptor for the refresh endpoint itself.
   Otherwise, if the refresh token is expired, calling /auth/refresh
   returns 401, which triggers the interceptor to call /auth/refresh
   again — infinite loop!
   ============================================================= */
api.interceptors.response.use(
  // Success handler
  (response) => {
    // If the backend returns success: true and has a message, toast it globally
    // We only toast for mutations (POST, PUT, PATCH, DELETE) to avoid toasting on simple GET queries
    if (
      response.data?.success === true &&
      response.data?.message &&
      ['post', 'put', 'patch', 'delete'].includes(response.config.method?.toLowerCase())
    ) {
      toast.success(response.data.message);
    }
    return response;
  },

  // Error handler — this is where we handle 401s
  async (error) => {
    // Get the original request config that failed
    const originalRequest = error.config;

    /**
     * Check three conditions before attempting a refresh:
     * 1. The error is a 401 (Unauthorized)
     * 2. We haven't already retried this request (prevent infinite loop)
     * 3. The failed request is NOT the refresh endpoint itself
     */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      // Mark this request as "already retried" to prevent loops
      originalRequest._retry = true;

      try {
        /**
         * Attempt to refresh the access token.
         * 
         * This POST request goes to /auth/refresh.
         * The browser automatically sends the httpOnly refresh cookie.
         * If the refresh token is valid, we get a new access token back.
         */
        const response = await api.post('/auth/refresh');
        const newToken = response.data.data.accessToken;

        // Store the new access token in memory
        setAccessToken(newToken);

        // Update the failed request's Authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        /**
         * RETRY the original request with the new token.
         * To the user, it looks like the request just took a bit longer.
         * They never see the 401 error — seamless experience!
         */
        return api(originalRequest);
      } catch (refreshError) {
        /**
         * If the refresh fails (e.g., refresh token is expired too),
         * we can't authenticate the user anymore.
         * Clear everything and send them to the login page.
         */
        setAccessToken(null);

        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // For non-401 errors (or if 401 was already retried/failed), handle global error messages
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (!error.response) {
      // Network Error
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('The requested resource could not be found.');
    } else if (status === 409) {
      toast.error(message || 'A conflict occurred.');
    } else if (status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (status >= 500) {
      toast.error('Something went wrong. Please try again later.');
    } else if (status !== 401 && status !== 400) {
      // Unexpected error
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default api;
