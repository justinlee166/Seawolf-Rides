export const STONY_BROOK_EMAIL_DOMAIN = 'stonybrook.edu';
export const MIN_PASSWORD_LENGTH = 8;

export type AuthMode = 'signIn' | 'register';

export interface EmailCredentials {
  email: string;
  password: string;
}

export type CredentialErrors = Partial<Record<keyof EmailCredentials, string>>;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isStonyBrookEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  const atIndex = normalized.indexOf('@');

  if (atIndex <= 0 || /\s/.test(normalized)) {
    return false;
  }

  return normalized.slice(atIndex + 1) === STONY_BROOK_EMAIL_DOMAIN;
}

export function validateCredentials(
  mode: AuthMode,
  { email, password }: EmailCredentials,
): CredentialErrors {
  const errors: CredentialErrors = {};

  if (!email.trim()) {
    errors.email = 'Enter your Stony Brook email.';
  } else if (!isStonyBrookEmail(email)) {
    errors.email = `Use your @${STONY_BROOK_EMAIL_DOMAIN} email address.`;
  }

  if (!password) {
    errors.password =
      mode === 'register' ? 'Create a password for your account.' : 'Enter your password.';
  } else if (mode === 'register' && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

export function hasCredentialErrors(errors: CredentialErrors): boolean {
  return Object.values(errors).some(Boolean);
}
