import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from './UserContext';
import { fetchPendingUsers, Reject, Approve } from '../data/adminActions'; // ייבוא הפונקציות
import '../styles/adminDashbord.css';
import { User } from "../data/UserType";

export default function AdminDashbord() {
  const { user, token } = useUser(); // הוספנו את ה-token מקונטקסט
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers(token, setPendingUsers, setIsLoading, setError);
  }, [token]);

  const filteredUsers = pendingUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {/* Admin Header Section */}
      <div className="admin-welcome">
        <h1>לוח הבקרה של המנהל</h1>
        <h2>ברוך הבא {user?.fullName}!</h2>
      </div>

      {/* Main Admin Panel */}
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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoading && <div className="loading-message">טוען...</div>}

          <div className="users-list">
            <div className="list-header">
              <div>שם מלא</div>
              <div>אימייל</div>
              <div>גיל</div>
              <div>תהליך מבוקש</div>
              <div>סטטוס</div>
              <div>פעולות</div>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.idNumber} className="list-item">
                <div>{`${user.fullName}`}</div>
                <div>{user.email}</div>
                <div>{user.age}</div>
                <div>{user.goal}</div>
                <div className="status">
                  {user.status === 'pending' ? (
                    <div className="status status-pending">
                      <AlertCircle size={16} />
                      <span>ממתין</span>
                    </div>
                  ) : user.status === 'active' ? (
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
                    onClick={() => Approve(user.idNumber, token, setPendingUsers, setIsLoading, setError)}
                    disabled={isLoading || user.status === 'active'}
                    className="button approve-button"
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => Reject(user.idNumber, token, setPendingUsers, setIsLoading, setError)}
                    disabled={isLoading}
                    className="button reject-button"
                  >
                    דחה
                  </button>
                </div>
              </div>
            ))}

            {!isLoading && filteredUsers.length === 0 && (
              <div className="empty-message">
                לא נמצאו משתמשים ממתינים
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



