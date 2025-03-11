// AdminDashbord.tsxז
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, setError, logout } from "../state/userSlice";
import { fetchPendingUsers } from "../data/adminActions";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import { User } from "../data/UserType";
import UserPending from "./UserPending"; // ייבוא של קומפוננטת UserPending
import TrainingProgram from "./TrainingProgram";
import "../styles/adminDashbord.css"
import PlanChangeRequest from "./PlanChangeReques";

interface AdminDashbordProps {
  setSelectedUser: (user: User | null) => void;
  setNavigateUrl: (str: string) => void;
}

export default function AdminDashbord({ setSelectedUser, setNavigateUrl }: AdminDashbordProps) {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.userState
  );
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<string>("pendingUsers"); // ניהול איזו קומפוננטה להציג
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

      <div className="admin-navigation">
        <button onClick={() => setCurrentView("pendingUsers")}>משתמשים ממתינים</button>
        <button onClick={() => setCurrentView("trainingProgram")}>תוכנית אימון</button>
        <button onClick={() => setCurrentView("planChangeRequest")}>בקשות שינוי תוכנית</button>
      </div>

      <div className="admin-container">
        {/* הצגת שגיאה אם יש */}
        {error && <div className="error-message">{error}</div>}

        {/* הצגת הקומפוננטה הנבחרת */}
        {currentView === "pendingUsers" && (
          <UserPending
            pendingUsers={pendingUsers}
            setPendingUsers={setPendingUsers}
            token={token}
            isLoading={isLoading}
            error={error} // העברת error ל-UserPending
            setSelectedUser={setSelectedUser}
            setNavigateUrl={setNavigateUrl}
          />
        )}

        {currentView === "trainingProgram" && (
          <TrainingProgram  />
        )}
        {currentView === "planChangeRequest" && <PlanChangeRequest />}
      </div>
    </div>
  );
}




