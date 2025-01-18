import { logout } from '../state/userSlice'; // פעולות Redux
import { LogOut } from 'lucide-react'; // הוספנו את האייקון של התנתקות
import { useDispatch, useSelector } from 'react-redux'; // שימוש ב-Redux hooks
import { RootState } from '../state/store'; // ייבוא RootState
import '../styles/userDashbord.css'; // ייבוא קובץ ה-CSS
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user); // שליפת המידע מ-Redux
  const nav=useNavigate()

  // פונקציה שמטפלת בהתנתקות
  function Logout() {
    dispatch(logout()); // שליחת פעולה של התנתקות
    nav("/")
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      
      {/* אם יש משתמש מחובר, הצג את פרטי המשתמש */}
      {user ? (
        <div>
          <h2>Hello, {user.fullName}!</h2>
          <p>Email: {user.email}</p>
          {/* כפתור התנתקות */}
          <button className="logout-btn" onClick={Logout}>
            <LogOut /> Logout
          </button>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
}


