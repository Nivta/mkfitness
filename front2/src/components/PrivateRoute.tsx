import { Navigate,Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store'; // יש לוודא ש-RootState מוגדר בצורה הנכונה


export default function PrivateRoute() {
  // שליפת המשתמש מ-Redux Store
  const user = useSelector((state: RootState) => state.userState.user); // כאן אנחנו בודקים את ה-user

  // אם אין משתמש מחובר, הפנה לדף ההתחברות
  if (!user) {
    return <Navigate to="/" />;
  }

  // אם יש משתמש מחובר, הצג את הרכיב המבוקש (Outlet)
  return <Outlet />;
}
