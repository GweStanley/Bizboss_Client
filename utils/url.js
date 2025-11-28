// client/utils/url.js
export function getPublicBase() {
  // prefer explicit API base if provided
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';
  if (apiBase) {
    // remove trailing "/api" if present and any trailing slash
    return apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }

  // fallback to window origin when running in browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // safe fallback
  return '';
}
