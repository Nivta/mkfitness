import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, setError, logout } from "../state/userSlice";
import { fetchPendingUsers, Reject, Approve } from "../data/adminActions";
import { RootState } from "../state/store";
import "../styles/adminDashbord.css";
import { useNavigate } from "react-router-dom";
import { User } from "../data/UserType";
interface AdminDashbordProps {
  setSelectedUser: (user: User) => void; // פונקציה שמקבלת משתמש
}
export default function AdminDashbord({ setSelectedUser }: AdminDashbordProps) {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.userState
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      fetchPendingUsers(token, dispatch, setPendingUsers);
      dispatch(setIsLoading(false));
    } else {
      dispatch(setError("Invalid user"));
      dispatch(setIsLoading(false));
    }
  }, [token]);

  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function Logout() {
    dispatch(logout());
    nav("/");
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <h1>לוח הבקרה של המנהל</h1>
        <h2>ברוך הבא {user?.fullName}!</h2>
        <button className="logout-button" onClick={Logout}>
          <LogOut size={16} />
          התנתקות
        </button>
      </div>

      <div className="admin-container">
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">ניהול משתמשים ממתינים</h2>
            <input
              type="text"
              className="search-input"
              placeholder="חיפוש לפי שם או אימייל..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading && <div className="loading-message">טוען...</div>}

          <div className="users-list">
            <div className="list-header">
              <div>שם מלא</div>
              <div>אימייל</div>
              <div>גיל</div>
              <div>תהליך מבוקש</div>
              <div>הצהרת בריאות</div>
              <div>סטטוס</div>
              <div>פעולות</div>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.idNumber} className="list-item">
                <div>{user.fullName}</div>
                <div>{user.email}</div>
                <div>{user.age}</div>
                <div>{user.goal}</div>

                {/* כפתור להצגת הצהרת בריאות */}
                <div>
                  <button
                    className="button view-declaration"
                    onClick={() =>{ 
                      setSelectedUser(user)
                      nav("/health-declaration", { state: { user } })}}
                  >
                    הצג הצהרת בריאות
                  </button>
                </div>

                <div className="status">
                  {user.status === "pending" ? (
                    <div className="status status-pending">
                      <AlertCircle size={16} />
                      <span>ממתין</span>
                    </div>
                  ) : user.status === "active" ? (
                    <div className="status status-active">
                      <CheckCircle size={16} />
                      <span>מאושר</span>
                    </div>
                  ) : (
                    <div className="status status-rejected">
                      <XCircle size={16} />
                      <span>נדחה</span>
                    </div>
                  )}
                </div>

                <div className="actions">
                  <button
                    onClick={() => Approve(user.idNumber, token, setPendingUsers, dispatch)}
                    disabled={isLoading || user.status === "active"}
                    className="button approve-button"
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => Reject(user.idNumber, token, setPendingUsers, dispatch)}
                    disabled={isLoading}
                    className="button reject-button"
                  >
                    דחה
                  </button>
                </div>
              </div>
            ))}

            {!isLoading && filteredUsers.length === 0 && (
              <div className="empty-message">לא נמצאו משתמשים ממתינים</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




