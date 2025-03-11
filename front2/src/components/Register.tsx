
import { useFormik } from 'formik'; // שימוש ב-Formik לניהול הטפסים
import { useState } from 'react'; // שימוש ב-state לניהול מצב של שליחה וסטטוסים
import PersonalInfo from './PersonalInfo'; // רכיב המידע האישי
import HealthInfo from './HealthInfo'; // רכיב המידע הבריאותי
import DietaryPreferences from './DietaryPreferences'; // רכיב העדפות תזונה
import ProcessTypeAndTrainingLocation from './ProcessTypeAndTrainingLocation'; // רכיב סוג תהליך ומיקום אימון
import { registerAction } from "../data/registerAction"; // ייבוא הפונקציה שמטפלת בהגשת הטופס
import "../styles/Register.css"; // סגנונות לקובץ הרישום
import { validationSchema } from '../data/validationSchemaRegistry';
import HealthDeclaration from './HealthDeclaration';
import { User } from '../data/UserType';

export default function Register() {
  // מצב של שליחה וסטטוסים (מה קורה במהלך ואחרי השליחה)
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false, // האם יש שליחה מתבצעת כרגע
    success: "", // הודעת הצלחה
    error: "" // הודעת שגיאה
  });
  const [step, setStep] = useState(1);

  // שימוש ב-Formik לניהול הטופס
  const formik = useFormik<User>({
    initialValues:  {
      fullName: '',
      email: '',
      idNumber: '',
      password: '',
      phone: '',
      age: 0,
      height: 0,
      weight: 0,
      gender: '',
      activityLevel: '',
      dangerousFoods:[],
      diet: null,
      eatsEggs: false,
      eatsDairy: false,
      eatsFish: false,
      favoriteFoods: [],
      dislikeFoods: [],
      goal: '',
      trainingLocation: '',
      acceptTerms: false,
      healthQuestions:  [
        { question: "האם חווית אובדן הכרה מכל סיבה שהיא?", answer: "" },
        { question: "האם חווית אירועי עילפון?", answer: "" },
        { question: "האם חווית פעולות חוזרות בלתי מוסברות?", answer: "" },
        { question: "האם יש לך מגבלות פיזיות כלשהן?", answer: "" },
        { question: "האם עברת ניתוחים בעבר?", answer: "" },
        { question: "האם אתה נוטל תרופות באופן קבוע?", answer: "" },
        { question: "האם אובחנת עם מחלת לב?", answer: "" },
        { question: "האם במשפחתך מדרגת קרבה ראשונה יש היסטוריה של מחלות לב?", answer: "" },
        { question: "האם אתה סובל מלחץ דם גבוה?", answer: "" },
        { question: "האם אתה גבר מעל גיל 55 או אישה מעל גיל 65?", answer: "" },
        { question: "האם עברת בדיקות רפואיות בשלושת החודשים האחרונים בהן נאמר לך להימנע מפעילות גופנית?", answer: "" },
      ],
      status: 'pending',
      dailyCalories: 0,
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

  const handleNext = async () => {
    await formik.validateForm(); // מאמת את כל השדות בטופס
    formik.setTouched(
      Object.keys(formik.values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      true
    );
  
    const currentStepFields = getFieldsForStep(step); // השדות שצריך לבדוק בשלב הנוכחי
    const errorsInCurrentStep = Object.keys(formik.errors).filter((key) => currentStepFields.includes(key));
  
    if (errorsInCurrentStep.length === 0) {
      setStep((prev) => prev + 1);
    }
  };
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["fullName", "email", "idNumber", "password", "phone"];
      case 2:
        return ["age", "height", "weight", "gender", "activityLevel"];
      case 3:
        return Object.keys(formik.values.healthQuestions); // כל השאלות הבריאותיות
      case 4:
        return [ "dangerousFoods", "favoriteFoods", "dislikeFoods"];
      case 5:
        return ["goal","trainingLocation", "acceptTerms"];
      default:
        return [];
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
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
            {step === 1 && <PersonalInfo formik={formik} goNext={handleNext} isEditMode={false} />}
            {step === 2 && <HealthInfo formik={formik} goNext={handleNext} goBack={handleBack} />}
            {step === 3 && <HealthDeclaration formik={formik} goNext={handleNext} goBack={handleBack} />}
            {step === 4 && <DietaryPreferences formik={formik} goNext={handleNext} goBack={handleBack} />}
            {step === 5 && (
              <div>
                <ProcessTypeAndTrainingLocation formik={formik} goBack={handleBack} />

                {/* קטע תנאי השימוש */}
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
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


