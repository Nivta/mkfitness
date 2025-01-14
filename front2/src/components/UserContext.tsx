import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Admin } from '../data/UserType'; // כאן אתה משתמש בסוגים המתאימים שלך

type UserType = User | Admin;

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

// יצירת ה-Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// הוק לשימוש ב-Context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// יצירת ה-UserProvider
export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // טעינת המידע שנשמר ב-localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // עדכון localStorage כאשר המידע משתנה
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}

