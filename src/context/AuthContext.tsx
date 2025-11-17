import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Session = {
  email: string;
  remember: boolean;
};

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: { email: string } | null;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = '@session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const s: Session = JSON.parse(raw);
          setSession(s);
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const signIn = async (email: string, _password: string, remember: boolean = true) => {
    const s: Session = { email, remember };
    setSession(s);
    if (remember) {
      try { await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
    } else {
      try { await AsyncStorage.removeItem(SESSION_KEY); } catch {}
    }
  };

  const signOut = async () => {
    setSession(null);
    try { await AsyncStorage.removeItem(SESSION_KEY); } catch {}
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isLoading,
      isLoggedIn: !!session,
      user: session ? { email: session.email } : null,
      signIn,
      signOut,
    }),
    [isLoading, session]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
