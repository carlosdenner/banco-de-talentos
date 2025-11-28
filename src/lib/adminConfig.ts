/**
 * Admin configuration
 * Add email addresses that should have admin access
 */
export const ADMIN_EMAILS = [
  'carlosdenner@gmail.com',
] as const;

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
}
