import { EmailCredentials, normalizeEmail } from './authValidation';

export type AuthProvider = 'google' | 'email';

export interface AuthUser {
  id: string;
  email: string;
  provider: AuthProvider;
  isNewUser: boolean;
}

// M2 prototype: sign-in is simulated on the device. No request reaches Firebase
// Auth yet; these functions are the seam the real implementation will replace.
const SIMULATED_LATENCY_MS = 700;

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

function createUser(email: string, provider: AuthProvider, isNewUser: boolean): AuthUser {
  const normalized = normalizeEmail(email);
  return { id: `local-${provider}-${normalized}`, email: normalized, provider, isNewUser };
}

export async function signInWithEmail({ email }: EmailCredentials): Promise<AuthUser> {
  await simulateLatency();
  return createUser(email, 'email', false);
}

export async function registerWithEmail({ email }: EmailCredentials): Promise<AuthUser> {
  await simulateLatency();
  return createUser(email, 'email', true);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await simulateLatency();
  return createUser('wolfie.seawolf@stonybrook.edu', 'google', false);
}
