/**
 * Admin configuration
 * Add email addresses that should have admin access
 */
export const ADMIN_EMAILS = [
  'carlosdenner@gmail.com',
  'carlosdenner@unb.br',
  'isadora.lima@gigacandanga.net.br',
  'paulo.angelo@gigacandanga.net.br',
  'andre.drummond@gigacandanga.net.br',
  'rh@gigacandanga.net.br',
] as const;

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
}
