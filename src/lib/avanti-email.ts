const AVANTI_EMAIL_DOMAIN = 'avantifellows.org';

export const GOOGLE_WORKSPACE_DOMAIN = AVANTI_EMAIL_DOMAIN;

export function isAvantiEmail(email?: string | null) {
  return email?.toLowerCase().endsWith(`@${AVANTI_EMAIL_DOMAIN}`) ?? false;
}
