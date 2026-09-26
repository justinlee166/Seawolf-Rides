import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { AuthUser } from './authService';

interface Session {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

const SessionContext = createContext<Session | null>(null);

// Frontend-only M2 session. It resets whenever the app reloads.
export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const session = useMemo<Session>(
    () => ({ user, signIn: setUser, signOut: () => setUser(null) }),
    [user],
  );

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return session;
}
