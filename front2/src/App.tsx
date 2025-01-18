import  { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading, setError } from './state/userSlice'; // ייבוא של הפעולות
import Login from './components/Login';
import Register from './components/Register';
import AdminRegistration from './components/AdminRegistration';
import AdminDashbord from './components/AdminDashbord';
import PrivateRoute from './components/PrivateRoute'; // ייבוא של ה-PrivateRoute
import { RootState } from './state/store'; // ייבוא של RootState
import Dashboard from './components/Dashboard';

export default function App() {
  const dispatch = useDispatch();

  // שליפת מידע מ-Redux Store
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);

  // פונקציה לשליחת בקשה לשרת
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:3000/');
        dispatch(setIsLoading(false)); // עדכון מצב טעינה
      } catch (err) {
        dispatch(setError('Something went wrong'));
        dispatch(setIsLoading(false)); // עדכון מצב טעינה
      }
    };

    fetchData();
  }, [dispatch]); // ה-useEffect רץ פעם אחת אחרי שהקומפוננטה נטענה
  if (isLoading) return <div>Loading...</div>; // אם בטעינה
  if (error) return <div>{error}</div>; // אם יש שגיאה

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerAdmin" element={<AdminRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* הגנה על דף ה-adminDashbord עם PrivateRoute */}
        <Route
          path="/adminDashbord"
          element={
            <PrivateRoute>
              <AdminDashbord />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

