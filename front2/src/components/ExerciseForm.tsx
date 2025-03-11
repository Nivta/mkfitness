// src/ExerciseForm.tsx

import { Field, ErrorMessage } from 'formik';

export default function ExerciseForm({ exercise, index }: { exercise: { name: string; repetitions: number; weight?: number; tips: string }; index: number }) {
  return (
    <div className="exercise-form">
      <h3>תרגיל {index + 1}</h3>
      <div>
        <label>שם התרגיל:</label>
        <Field name={`exercises[${index}].name`} value={exercise.name} />
        <ErrorMessage name={`exercises[${index}].name`} component="div" />
      </div>

      <div>
        <label>חזרות:</label>
        <Field type="number" name={`exercises[${index}].repetitions`} value={exercise.repetitions} />
        <ErrorMessage name={`exercises[${index}].repetitions`} component="div" />
      </div>

      <div>
        <label>הוספת משקל (לא חובה):</label>
        <Field type="number" name={`exercises[${index}].weight`} value={exercise.weight} />
      </div>

      <div>
        <label>דגשים:</label>
        <Field name={`exercises[${index}].tips`} value={exercise.tips} />
        <ErrorMessage name={`exercises[${index}].tips`} component="div" />
      </div>
    </div>
  );
}

