
import { useFormik } from 'formik'; // שימוש ב-Formik לניהול הטפסים
import { useState } from 'react'; // שימוש ב-state לניהול מצב של שליחה וסטטוסים
import PersonalInfo from './PersonalInfo'; // רכיב המידע האישי
import HealthInfo from './HealthInfo'; // רכיב המידע הבריאותי
import DietaryPreferences from './DietaryPreferences'; // רכיב העדפות תזונה
import ProcessTypeAndTrainingLocation from './ProcessTypeAndTrainingLocation'; // רכיב סוג תהליך ומיקום אימון
import { FormValues } from '../data/FormValuesRegister'; // סוג הנתונים של הטופס
import { registerAction } from "../data/registerAction"; // ייבוא הפונקציה שמטפלת בהגשת הטופס
import "../styles/Register.css"; // סגנונות לקובץ הרישום
import {validationSchema} from "../data/validationSchemaRegistry"

export default function Register() {
  // מצב של שליחה וסטטוסים (מה קורה במהלך ואחרי השליחה)
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false, // האם יש שליחה מתבצעת כרגע
    success: "", // הודעת הצלחה
    error: "" // הודעת שגיאה
  });

  // שימוש ב-Formik לניהול הטופס
  const formik = useFormik<FormValues>({
    initialValues: {
      fullName: '', // שם מלא
      email: '', // כתובת אימייל
      idNumber: '', // תעודת זהות
      password: '', // סיסמה
      phone: '', // טלפון
      age: 0, // גיל
      height: 0, // גובה
      weight: 0, // משקל
      gender: '', // מין
      activityLevel: '', // רמת פעילות
      eatsEggs: false, // אוכל ביצים
      eatsDairy: false, // אוכל מוצרי חלב
      eatsFish: false, // אוכל דגים
      goal: '', // מטרת דיאטה
      dangerousFoods: '', // מאכלים מסוכנים
      favoriteFoods: '', // מאכלים אהובים
      dislikeFoods: '', // מאכלים שלא אהובים
      trainingLocation: '', // מיקום אימון
      acceptTerms: false, // הסכמה לתנאים והגבלות
      diet: null, // דיאטה
      dailyCalories: null // קלוריות יומיות
    },
    validationSchema,  // החיבור לאימות
    validateOnChange: true,  // ודא שהאימות קורה על שינוי
    validateOnBlur: true, 
    onSubmit: async (values, { setSubmitting }) => { // פונקציה שנקראת כאשר הטופס נשלח
      console.log('התחלת שליחת הטופס');
      
      // קריאה לפונקציה registerAction לשליחה של הטופס ולטיפול בנתונים
      await registerAction(values, setSubmitStatus);
      
      setSubmitting(false); // בסיום השליחה, עצור את תהליך השליחה
    },
  });

  // פונקציה שנקראת בעת שליחה של הטופס
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // מונע את הרענון של הדף בעת שליחת הטופס
    console.log('ערכי הטופס:', formik.values); // הצגת הערכים הנכנסים של הטופס
    console.log('שגיאות:', formik.errors); // הצגת השגיאות בטופס

    // בדיקה אם יש שגיאות בטופס לפני שליחה
    if (Object.keys(formik.errors).length > 0) {
      setSubmitStatus({
        isSubmitting: false, // ביטול שליחת טופס אם יש שגיאות
        success: "",
        error: "יש לתקן את כל השגיאות בטופס לפני השליחה" // הצגת הודעת שגיאה
      });
      return;
    }
    
    formik.handleSubmit(e); // קריאה לפונקציה של Formik לשליחת הטופס
  };

  return (
    <div className="register-page"> {/* דף הרשמה */}
      <div className="registration-card"> {/* כרטיס הרשמה */}
        <div className="register-page-card-header">
          <h1 className="register-page-title">הרשמה למערכת</h1> {/* כותרת */}
        </div>

        {/* הצגת הודעות הצלחה או שגיאה */}
        {submitStatus.error && <div className="register-page-error-message">{submitStatus.error}</div>}
        {submitStatus.success && <div className="success-alert">{submitStatus.success}</div>}

        <div className="card-content">
          {/* טופס ההרשמה */}
          <form onSubmit={handleSubmit} className="registration-form">
            <PersonalInfo formik={formik} /> {/* רכיב פרטי אישיים */}
            <HealthInfo formik={formik} /> {/* רכיב בריאות */}
            <DietaryPreferences formik={formik} /> {/* רכיב העדפות תזונה */}
            <ProcessTypeAndTrainingLocation formik={formik} /> {/* רכיב מיקום אימון וסוג תהליך */}

            {/* קטע של תיבת הסימון להסכמה לתנאים */}
            <div className="form-section">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="form-checkbox"
                  {...formik.getFieldProps('acceptTerms')} // חיבור עם Formik
                />
                <label htmlFor="acceptTerms">אני מסכים/ה לתנאים וההגבלות</label>
              </div>
              {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                <div className="error-message">{formik.errors.acceptTerms}</div> // הצגת שגיאה אם לא הסכים לתנאים
              )}
            </div>

            {/* כפתור לשליחת הטופס */}
            <button
              type="submit"
              className="submit-button"
              disabled={submitStatus.isSubmitting || Object.keys(formik.errors).length > 0} // השבתת כפתור שליחה אם יש שגיאות או שהשליחה בתהליך
            >
              {submitStatus.isSubmitting ? 'שולח...' : 'הרשמה'} {/* טקסט כפתור משתנה */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


