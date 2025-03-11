import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PlanChangeRequest.css"; // ייבוא קובץ ה-CSS
import apiURL from "../data/apiConfig";

interface Exercise {
  name: string;
  repetitions: number;
  weight?: number;
  tips: string;
}

interface DietPlan {
  exercises: Exercise[];
  totalCalories: number;
  foods: string[];
  difficultyLevel: number;
}

interface DietRequest {
  _id: string;
  idNumber: string;
  currentDietPlan: DietPlan;
  status: string;
}

export default function PlanChangeRequest() {
  const [requests, setRequests] = useState<DietRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiURL + `/api/diet-request/pending-requests`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchData();
  }, []);

 
    
  async function approve(id:string) 
  {
    try {
      console.log("Approving request", id);
      
      const response = await axios.post(apiURL+"/api/diet-request/approve-change", { idNumber: id });

      console.log("Response:", response.data);
      alert("התוכנית אושרה בהצלחה!");
  } catch (error) {
      console.error("Error approving request:", error);
      alert("שגיאה באישור התוכנית");
  }
  }

  async function reject(id: string) {
    try {
        console.log("Rejecting request", id);

        const response = await axios.post(apiURL+"/api/diet-request/reject-change", { idNumber: id });

        console.log("Response:", response.data);
        alert("בקשת שינוי התוכנית נדחתה בהצלחה!");
    } catch (error) {
        console.error("Error rejecting request:", error);
        alert("שגיאה בדחיית הבקשה");
    }
}

  return (
    <div className="container">
      <h2>בקשות לשינוי תוכנית</h2>
      <table>
        <thead>
          <tr>
            <th>ID משתמש</th>
            <th>קלוריות</th>
            <th>אוכל</th>
            <th>רמת קושי</th>
            <th>תרגילים</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.idNumber}</td>
              <td>{request.currentDietPlan.totalCalories}</td>
              <td>{request.currentDietPlan.foods.join(", ")}</td>
              <td>{request.currentDietPlan.difficultyLevel}</td>
              <td>
                <ul>
                  {request.currentDietPlan.exercises.map((exercise, index) => (
                    <li key={index}>
                      {exercise.name} - {exercise.repetitions} חזרות{" "}
                      {exercise.weight ? `, ${exercise.weight} ק"ג` : ""} (
                      {exercise.tips})
                    </li>
                  ))}
                </ul>
              </td>
              <td>{request.status}</td>
              <td>
                <button className="approve" onClick={() => approve(request.idNumber)}>
                  אשר
                </button>
                <button className="reject" onClick={() => reject(request.idNumber)}>
                  דחה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

