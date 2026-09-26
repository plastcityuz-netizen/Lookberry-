import { NextRequest } from 'next/server';

export function isAdminAuthorized(request: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get('x-admin-password') || '';

  if (configured) return provided === configured;

  // Local/demo safety valve: admin works in development preview, but production must set ADMIN_PASSWORD.
  return process.env.NODE_ENV !== 'production';
}

export function adminConfigError() {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV === 'production';
}
