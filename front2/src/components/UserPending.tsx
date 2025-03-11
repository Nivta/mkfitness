import { useState } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useDispatch } from "react-redux"; // ייבוא של useDispatch
import { Approve, Reject } from "../data/adminActions";
import { User } from "../data/UserType";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashbord.css"
interface UserPendingProps {
  pendingUsers: User[];
  setPendingUsers: React.Dispatch<React.SetStateAction<User[]>>;
  token: string | null;
  isLoading: boolean;
  error: string | null; // הוספתי את error כאן
  setSelectedUser: (user: User | null) => void;
  setNavigateUrl: (str: string) => void;
}

export default function UserPending({
  pendingUsers,
  setPendingUsers,
  token,
  isLoading,
  error, // קבלה של error כפרופס
  setSelectedUser,
  setNavigateUrl
}: UserPendingProps) {
  const dispatch = useDispatch(); // הגדרת dispatch בתוך הקומפוננטה
  const [searchTerm, setSearchTerm] = useState("");
  const nav = useNavigate();

  // סינון המשתמשים הממתינים לפי שם או אימייל
  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

      {/* הצגת הודעת שגיאה אם יש */}
      {error && <div className="error-message">{error}</div>}

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

            <div>
              <button
                className="button view-declaration"
                onClick={() => {
                  setSelectedUser(user);
                  setNavigateUrl("/adminDashbord");
                  nav("/health-declaration");
                }}
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
                onClick={() => Approve(user.idNumber, token, setPendingUsers, dispatch)} // שימוש בdispatch כאן
                disabled={isLoading || user.status === "active"}
                className="button approve-button"
              >
                אשר
              </button>
              <button
                onClick={() => Reject(user.idNumber, token, setPendingUsers, dispatch)} // שימוש בdispatch כאן
                disabled={isLoading}
                className="button reject-button"
              >
                דחה
              </button>
            </div>
          </div>
        ))}

        {/* הצגת הודעה אם אין משתמשים ממתינים */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="empty-message">לא נמצאו משתמשים ממתינים</div>
        )}
      </div>
    </div>
  );
}


