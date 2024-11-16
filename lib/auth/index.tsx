'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { use } from 'react';
import { users, UserRole } from '@/lib/db/schema';
import type { InferModel } from 'drizzle-orm';

type User = InferModel<typeof users>;

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  role: keyof typeof UserRole | null;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  let initialUser = use(userPromise);
  let [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const role = user ? user.role : null;

  return (
    <UserContext.Provider value={{ user, setUser, role }}>
      {children}
    </UserContext.Provider>
  );
}
