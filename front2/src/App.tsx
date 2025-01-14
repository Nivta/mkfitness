import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import UserProvider from './components/UserContext'; // UserProvider בלבד, בלי useUser
import Login from './components/Login';
import Register from './components/Register';
import AdminRegistration from './components/AdminRegistration';
import AdminDashbord from './components/AdminDashbord';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true); // מצב טעינה
  const [error, setError] = useState<string | null>(null); // מצב שגיאה

  // פונקציה טיפול בהתחברות
  
  // שליחת בקשת GET לשרת
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:3000/');
        setLoading(false);
      } catch (err) {
        setError('Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, []); // בקשה תתבצע רק בפעם הראשונה

  if (loading) return <div>Loading...</div>; // אם בטעינה
  if (error) return <div>{error}</div>; // אם יש שגיאה

  return (
    <UserProvider> {/* עטיפת כל האפליקציה ב-UserProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerAdmin" element={<AdminRegistration />} />
          <Route path="/adminDashbord" element={<AdminDashbord />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

