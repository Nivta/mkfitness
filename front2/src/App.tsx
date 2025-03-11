import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading, setError} from './state/userSlice'; // ייבוא של הפעולות
import Login from './components/Login';
import Register from './components/Register';
import AdminRegistration from './components/AdminRegistration';
import AdminDashbord from './components/AdminDashbord';
import PrivateRoute from './components/PrivateRoute'; // ייבוא של ה-PrivateRoute
import { RootState } from './state/store'; // ייבוא של RootState
import Dashboard from './components/Dashboard';
import apiURL from './data/apiConfig';
import HealthDeclarationPage from './components/HealthDeclarationPage';
import { User } from './data/UserType';
import EditProfile from './components/EditProfile';


export default function App() {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [navigateUrl, setNavigateUrl] = useState<string>("");
  // שליפת מידע מ-Redux Store
  const isLoading = useSelector((state: RootState) => state.userState.isLoading);
  const error = useSelector((state: RootState) => state.userState.error);
console.log(process.env)
  // פונקציה לשליחת בקשה לשרת
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(apiURL);
        dispatch(setIsLoading(false)); // עדכון מצב טעינה
      } catch (err) {
        console.error("Error during API call:", err);
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
        <Route path="//Edit-profile" element={<EditProfile />} />
        <Route path="/health-declaration" element={<HealthDeclarationPage selectedUser={selectedUser} navigateUrl={navigateUrl} />} />
        
        {/* עטיפת ה-Routes שדורשים גישה פרטית בתוך ה-PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard setNavigateUrl={setNavigateUrl} setSelectedUser={setSelectedUser} />} />
          <Route path="/adminDashbord" element={<AdminDashbord setSelectedUser={setSelectedUser} setNavigateUrl={setNavigateUrl} />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

