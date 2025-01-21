import { logout } from '../state/userSlice'; // פעולות Redux
import { LogOut } from 'lucide-react'; // הוספנו את האייקון של התנתקות
import { useDispatch, useSelector } from 'react-redux'; // שימוש ב-Redux hooks
import { RootState } from '../state/store'; // ייבוא RootState
import '../styles/userDashbord.css'; // ייבוא קובץ ה-CSS
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userState); // שליפת המידע מ-Redux
  const nav = useNavigate();

  // פונקציה שמטפלת בהתנתקות
  function Logout() {
    dispatch(logout()); // שליחת פעולה של התנתקות
    nav("/");
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>

      {/* הצגת פרטי המשתמש או הודעה ב-CSS */}
      <div className={`user-info ${user ? '' : 'hidden'}`}>
        <h2>Hello, {user?.fullName}!</h2>
        <p>Email: {user?.email}</p>
        {/* כפתור התנתקות */}
        <button className="logout-btn" onClick={Logout}>
          <LogOut /> Logout
        </button>
      </div>
        
    </div>
  );
}


