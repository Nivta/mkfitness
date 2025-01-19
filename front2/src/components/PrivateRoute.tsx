import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store'; // יש לוודא ש-RootState מוגדר בצורה הנכונה

interface PrivateRouteProps {
  children: React.ReactNode; // טיפוס עבור הילדים (מה שיוצג אם יש תוקן)
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  // שליפת התוקן מ-Redux Store
  const token = useSelector((state: RootState) => state.user.token);

  // אם אין תוקן, הפנה לדף ההתחברות
  if (!token) {
    return <Navigate to="/" />;
  }

  // אם יש תוקן, הצג את הרכיב המבוקש (children)
  return <>{children}</>;
}
