import { FormikProps } from 'formik';
import { FormValues } from '../data/FormValuesRegister';

interface Props {
  formik: FormikProps<FormValues>;
  goNext: () => void;
  goBack: () => void;
}

export default function HealthDeclaration({ formik, goNext, goBack }: Props) {
  return (
    <div>
      <h2>הצהרת בריאות</h2>
      {formik.values.healthQuestions.map((item, index) => (
        <div key={index} className="health-question">
          <p>{item.question}</p>
          <label>
            <input
              type="radio"
              name={`healthQuestions.${index}.answer`}
              value="כן"
              checked={item.answer === "כן"}
              onChange={() => formik.setFieldValue(`healthQuestions.${index}.answer`, "כן")}
            />
            כן
          </label>
          <label>
            <input
              type="radio"
              name={`healthQuestions.${index}.answer`}
              value="לא"
              checked={item.answer === "לא"}
              onChange={() => formik.setFieldValue(`healthQuestions.${index}.answer`, "לא")}
            />
            לא
          </label>
        </div>
      ))}
      <button onClick={goBack}>חזור</button>
      <button onClick={goNext}>המשך</button>
    </div>
  );
}


