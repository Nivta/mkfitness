import { useEffect } from 'react';
import { FormikProps } from 'formik';
import { User } from '../data/UserType';

interface HealthDeclarationProps {
  formik: FormikProps<User>;
  goNext: () => void;
  goBack: () => void;
  initialValues?: User; // ערכים קיימים במצב עריכה
}

export default function HealthDeclaration({ formik, goNext, goBack, initialValues }: HealthDeclarationProps) {
  // בעת טעינת הרכיב, אם יש ערכים ראשוניים - נעדכן אותם ב-Formik
  useEffect(() => {
    if (initialValues?.healthQuestions) {
      formik.setFieldValue('healthQuestions', initialValues.healthQuestions);
    }
  }, [initialValues, formik.setFieldValue]);

  return (
    <div className="form-section">
      <h3 className="section-title">הצהרת בריאות</h3>

      {formik.values.healthQuestions.map((item, index) => (
        <div key={index} className="form-group">
          <p>{item.question}</p>

          <label>
            <input
              type="radio"
              name={`healthQuestions.${index}.answer`}
              value="כן"
              checked={formik.values.healthQuestions[index]?.answer === "כן"}
              onChange={() => formik.setFieldValue(`healthQuestions.${index}.answer`, "כן")}
            />
            כן
          </label>

          <label>
            <input
              type="radio"
              name={`healthQuestions.${index}.answer`}
              value="לא"
              checked={formik.values.healthQuestions[index]?.answer === "לא"}
              onChange={() => formik.setFieldValue(`healthQuestions.${index}.answer`, "לא")}
            />
            לא
          </label>
        </div>
      ))}

      {/* כפתורי ניווט */}
      <div className="button-group">
        <button type="button" className="prev-button" onClick={goBack}>← הקודם</button>
        <button type="button" className="next-button" onClick={goNext}>הבא →</button>
      </div>
    </div>
  );
}


