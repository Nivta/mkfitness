import { logout, setIsLoading, setError } from '../state/userSlice';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import '../styles/userDashbord.css';
import { useNavigate } from 'react-router-dom';
import { User } from '../data/UserType';
import axios from 'axios';
import { useEffect, useState } from 'react';
import apiURL from '../data/apiConfig';

interface dashbordProps {
  setNavigateUrl: (str: string) => void;
  setSelectedUser(user: User | null): void;
}

export default function Dashboard({ setSelectedUser, setNavigateUrl }: dashbordProps) {
  const dispatch = useDispatch();
  const { user,isLoading,error } = useSelector((state: RootState) => state.userState);
  const nav = useNavigate();
  const [trainingPlan, setTrainingPlan] = useState<any>(null);

  useEffect(() => {
    const fetchTrainingPlan = async () => {
      if (user && "idNumber" in user) {
        try {
          const response = await axios.post(apiURL + "/api/training-programs/createTrainingPlanByUser", 
            { idNumber: user.idNumber });
          
          // הדפס את ה-trainingPlan כדי לבדוק את התוכן שלו
          console.log('trainingPlan:', response.data.selectedTrainingPlan);
  
          setTrainingPlan(response.data.selectedTrainingPlan);
          dispatch(setIsLoading(false));  
        } catch (err) {
          dispatch(setError('Error fetching training plan' + err));
          dispatch(setIsLoading(false));
        }
      }
    };
  
    fetchTrainingPlan();
  }, [user]);

  function Logout() {
    dispatch(logout());
    nav("/");
  }

  const updateTrainingPlan = async (difficultyString: string, totalCalories: number, difficultyLevel: number, idNumber: string) => {
    try {
      const response = await axios.post(apiURL + "/api/training-programs/update-training-plan", {
        idNumber: idNumber, 
        difficultyLevel: difficultyLevel,
        totalCalories: totalCalories,
        difficultyString: difficultyString
      });
      setTrainingPlan(response.data.selectedTrainingPlan);
      console.log("תוכנית האימון עודכנה בהצלחה");
    } catch (error) {
      console.error("שגיאה בעדכון תוכנית האימון:", error);
    }
  };
  const goToUpdateProfile = () => {
    nav("/Edit-profile"); // ניווט לדף של שינוי פרטי ההרשמה
  };

  // פונקציה לשלוח את הבקשה למנהל להוריד קלוריות
  const requestLowerCalories = async () => {
    console.log("הבקשה הוגשה");
    if(user && "idNumber" in user){
    try {
        
        const response = await axios.post(apiURL +"/api/diet-request/request-change",
          { idNumber: user.idNumber }
        );

        console.log(response.data); // הודעת הצלחה
        alert("בקשה לשינוי תפריט נשלחה בהצלחה!");
    } catch (error: any) {
        console.error("שגיאה בשליחת הבקשה", error.response?.data || error.message);
        alert(error.response?.data?.error || "שגיאה בשליחת הבקשה");
    }
  }
};

  const handleEasyPlan = () => {
    if (user && "idNumber" in user) {
      updateTrainingPlan('קל', trainingPlan.totalCalories, trainingPlan.difficultyLevel, user.idNumber);
    }
  };

  const handleHardPlan = () => {
    if (user && "idNumber" in user) {
      updateTrainingPlan('קשה', trainingPlan.totalCalories, trainingPlan.difficultyLevel, user.idNumber);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>ברוך הבא לדשבורד</h1>
      <div className={`user-info ${user ? '' : 'hidden'}`}>
        <h2>שלום, {user?.fullName}!</h2>
        <p>אימייל: {user?.email}</p>
        


        {/* כפתור לשליחת בקשה למנהל להוריד קלוריות */}
        <button className="request-lower-calories-btn" onClick={requestLowerCalories}>
          בקשה למנהל להוריד קלוריות
        </button>

        {/* כפתור לגישה לדף הצהרת הבריאות */}
        <button
          className="health-declaration-btn"
          onClick={() => {
            if (user && "idNumber" in user) {
              setSelectedUser(user);
            }
            setNavigateUrl("/dashboard");
            nav("/health-declaration");
          }}
        >
          הצהרת בריאות
        </button>
        <button className="update-profile-btn" onClick={goToUpdateProfile}>
          שינוי פרטי ההרשמה
        </button>
        {/* כפתור למדידות */}
        <button className="measurements-btn" onClick={() =>{ 
          if (user && "idNumber" in user) {
            setSelectedUser(user);
          }
          setNavigateUrl("/dashboard");
          nav("/measurements")}}>
          מעבר למדידות
        </button>
        <button className="measurements-btn" onClick={() =>{ 
          if (user && "idNumber" in user) {
            setSelectedUser(user);
          }
          setNavigateUrl("/dashboard");
          nav("/measurements-list")}}>
          היסטורית מדידות 
        </button>
        {/* הצגת תוכנית האימון */}
        {isLoading ? (
          <p>טוען תוכנית אימון...</p>
        ) : error ? (
          <p>{error}</p>
        ) : trainingPlan ? (
          <div className="training-plan-info">
            <h3>תוכנית האימון שלך</h3>
            <p><strong>תרגילים:</strong> {trainingPlan.exercises.join(',')}</p>
            <p><strong>סך הכל קלוריות:</strong> {trainingPlan.totalCalories}</p>
            <p><strong>מזון:</strong> {trainingPlan.foods.join(',')}</p>
            <p><strong>רמת קושי:</strong> 
              {trainingPlan.difficultyLevel === 1 ? 'מתחיל' : 
                trainingPlan.difficultyLevel === 2 ? 'בינוני' : 
                trainingPlan.difficultyLevel === 3 ? 'קשה' : 'לא צוינה רמת קושי'}
            </p>

            {/* שני הכפתורים */}
            <div className="plan-difficulty-buttons">
              <button className="easy-plan-btn" onClick={handleEasyPlan}>
                תוכנית קלה לי
              </button>
              <button className="hard-plan-btn" onClick={handleHardPlan}>
                תוכנית קשה לי
              </button>
            </div>
          </div>
        ) : (
          <p>לא נמצאה תוכנית אימון.</p>
        )}
            {/* כפתור התנתקות */}
                <button className="logout-btn" onClick={Logout}>
          <LogOut /> התנתקות
        </button>
      </div>
    </div>
  );
}







