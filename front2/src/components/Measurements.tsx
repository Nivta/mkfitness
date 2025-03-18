import { useState, useEffect } from "react";
import axios from "axios";
import apiURL from "../data/apiConfig";
import { useNavigate } from "react-router-dom";

// הגדרת הממשק של מדידה
interface Measurement {
  userId: string|undefined;
  date: string;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  arm: number;
}

export default function Measurements({ userId ,navigateUrl}: { userId: string|undefined,navigateUrl:string}) {
  // סטייט לאחסון כל המדידות של המשתמש
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const nav=useNavigate()
  // סטייט לאחסון מדידה חדשה שמוזנת בטופס, כולל תאריך נוכחי כברירת מחדל
  const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, "userId">>({
    date: new Date().toISOString().split("T")[0], // ברירת מחדל: תאריך נוכחי בפורמט YYYY-MM-DD
    weight: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    arm: 0,
  });

  // שימוש ב-useEffect כדי להביא את הנתונים מהשרת בעת טעינת הקומפוננטה או שינוי ב-userId
  useEffect(() => {
    console.log("User ID:", userId); // להדפיס את ה-userId לפני כל בקשה לשרת
    const fetchMeasurements = async () => {
      if (!userId) return; // אם אין משתמש מחובר, לא מבצעים קריאה לשרת
      try {
        console.log("Fetching measurements for user:", userId);
        const res = await axios.post(apiURL + "/api/measurements/getMeasurements", { userId });
        console.log("Measurements fetched:", res.data);
        setMeasurements(res.data);
      } catch (err) {
        console.error("Error fetching measurements:", err);
      }
    };
  
    fetchMeasurements();
  }, [userId]);
  

  // פונקציה לעדכון הסטייט של המדידה החדשה כאשר המשתמש מקליד בטופס
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeasurement({
      ...newMeasurement,
      [e.target.name]: e.target.value, // מעדכן את השדה המתאים לפי שם ה-input
    });
  };

  // פונקציה ששולחת מדידה חדשה לשרת בעת לחיצה על "שמור"
  const handleSubmit = async () => {
    console.log("Submitting new measurement:", newMeasurement); // הדפסת המדידה החדשה
    try {
      const measurementData = { ...newMeasurement, userId }; // הוספת userId לנתונים
      const res = await axios.post(apiURL + "/api/measurements/addMeasurment", measurementData);
      console.log("Measurement saved:", res.data); // הדפסת התשובה מהשרת
      setMeasurements([...measurements, res.data]);
    } catch (err) {
      console.error("Error saving measurement:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">מעקב שקילה שבועית</h1>

      {/* טופס להזנת מדידה חדשה */}
      <div className="flex flex-col gap-2">
        <input type="date" name="date" value={newMeasurement.date} onChange={handleChange} required />
        <input type="number" name="weight" placeholder="משקל" onChange={handleChange} required />
        <input type="number" name="chest" placeholder="היקף חזה" onChange={handleChange} required />
        <input type="number" name="waist" placeholder="היקף טבור" onChange={handleChange} required />
        <input type="number" name="hips" placeholder="היקף אגן" onChange={handleChange} required />
        <input type="number" name="arm" placeholder="היקף יד" onChange={handleChange} required />
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">שמור</button>
      </div>

      {/* הצגת היסטוריית המדידות */}
      <h2 className="text-xl mt-4">היסטוריית מדידות</h2>
      <ul>
        {measurements.map((m, i) => (
          <li key={i}>{`${m.date} - משקל: ${m.weight} ק"ג`}</li>
        ))}
      </ul>
       {/* ✅ כפתור חזרה לדף הקודם */}
       <button onClick={() => { nav(navigateUrl); }}
            className="bg-gray-500 text-white p-2 rounded mt-2">
        חזרה
      </button>
    </div>
  );
}

