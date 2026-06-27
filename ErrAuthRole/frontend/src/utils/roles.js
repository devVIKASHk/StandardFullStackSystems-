/**
 * =============================================================
 * ROLES UTILITY — Role Constants & Helper Functions
 * =============================================================
 *
 * This file centralizes all role-related constants and helpers.
 *
 * WHY a separate file for roles?
 * - Avoids "magic strings" scattered throughout the codebase
 * - Single source of truth: if role names change on the backend,
 *   we only update this one file
 * - Helper functions make role checks cleaner in components
 *
 * Our app has two roles:
 * 1. USER  — Can manage their own notes and profile
 * 2. ADMIN — Can do everything a user can, PLUS manage other users
 * =============================================================
 */

/**
 * ROLES constant — an object mapping role names to their string values.
 * Usage: if (user.role === ROLES.ADMIN) { ... }
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

/**
 * isAdmin — checks if a given user object has the admin role.
 *
 * @param {Object} user - The user object (must have a `role` property)
 * @returns {boolean} - True if the user is an admin, false otherwise
 *
 * We use optional chaining (?.) to safely handle cases where
 * `user` might be null or undefined (e.g., before auth loads).
 */
export const isAdmin = (user) => user?.role === ROLES.ADMIN;
