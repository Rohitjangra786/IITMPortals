// Branding is GENERAL by default. IITM Janakpuri branding (logo + maroon
// accent) is shown only when the signed-in user's email belongs to IITM.
export const IITM_EMAIL_DOMAIN = "iitmipu.ac.in";

export function isIitmEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith(`@${IITM_EMAIL_DOMAIN}`);
}
