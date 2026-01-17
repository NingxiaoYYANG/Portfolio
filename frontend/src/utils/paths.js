/**
 * Get the base URL for assets (handles GitHub Pages subdirectory)
 * @returns {string} Base URL path (e.g., '/Portfolio/' or '/')
 */
export function getBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Resolve a public asset path with the correct base URL
 * @param {string} path - Asset path (e.g., '/CourseMapper/image.png' or 'CourseMapper/image.png')
 * @returns {string} Resolved path with base URL
 */
export function resolvePublicPath(path) {
  if (!path) return '';
  
  // If path already starts with http:// or https://, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get base URL (ensure it ends with /)
  let baseUrl = getBaseUrl();
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return combined path
  return `${baseUrl}${cleanPath}`;
}
