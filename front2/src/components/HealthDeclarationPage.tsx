import { User } from "../data/UserType"
import { useNavigate } from "react-router-dom";
interface HealthDeclarationPageProps {
    selectedUser: User | null;
}
interface HealthQuestion {
  question: string;
  answer: string;
}

export default function HealthDeclarationPage({ selectedUser }: HealthDeclarationPageProps) {
    const nav=useNavigate()
  if (!selectedUser) return <div>לא נמצא משתמש</div>;


  return (
    <div className="health-declaration">
      <h1>🩺 הצהרת בריאות - {selectedUser.fullName}</h1>
      <p>
        <strong>📧 אימייל:</strong> {selectedUser.email}
      </p>
      <p>
        <strong>🎂 גיל:</strong> {selectedUser.age}
      </p>
      <p>
        <strong>🎯 מטרה:</strong> {selectedUser.goal}
      </p>

      <h2>📝 תשובות להצהרת הבריאות:</h2>
      <ul>
      {selectedUser.healthQuestions.map((q: HealthQuestion, index: number) => (
  <li key={index}>
    <strong>{q.question}:</strong> {q.answer}
  </li>
))}

      </ul>
      <button onClick={() => nav("/adminDashbord")}>
        חזרה לדף ניהול
      </button>

    </div>
  );
}
