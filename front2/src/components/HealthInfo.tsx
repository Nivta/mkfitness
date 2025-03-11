import { FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { calculateBMR, calculateCalories } from '../data/calculateHealthInfo';
import { User } from '../data/UserType';

interface HealthInfoProps {
  formik: FormikProps<User>;
  goNext: () => void;
  goBack: () => void;
  initialValues?: User;
}

export default function HealthInfo({ formik, goNext, goBack, initialValues }: HealthInfoProps) {
  const [genderFocused, setGenderFocused] = useState(false);
  const [activityLevelFocused, setActivityLevelFocused] = useState(false);
  const dailyCaloriesRef = useRef<number | null>(formik.values.dailyCalories);

  console.log("Gender value in formik:", formik.values.gender);

  useEffect(() => {
    console.log("Updated formik values:", formik.values);
    console.log("Current gender value:", formik.values.gender);
    console.log("Current activity level:", formik.values.activityLevel);
  }, [formik.values]);

  useEffect(() => {
    const bmr = calculateBMR(formik.values.age, formik.values.height, formik.values.weight, formik.values.gender);
    const dailyCalories = calculateCalories(bmr, formik.values.activityLevel);

    console.log("Calculated BMR:", bmr);
    console.log("Calculated Daily Calories:", dailyCalories);

    if (dailyCalories !== dailyCaloriesRef.current) {
      dailyCaloriesRef.current = dailyCalories;

      if (dailyCalories !== null) {
        console.log("Updating formik field: dailyCalories ->", dailyCalories);
        formik.setFieldValue('dailyCalories', dailyCalories);
      }
    }
  }, [
    formik.values.age,
    formik.values.height,
    formik.values.weight,
    formik.values.gender,
    formik.values.activityLevel,
  ]);

  return (
    <div className="form-section">
      <h3 className="section-title">פרטי בריאות</h3>

      {/* גיל, גובה, משקל */}
      <div className="measurements-grid">
        <div className="form-group">
          <input
            type="number"
            id="age"
            className={`form-input ${formik.errors.age && formik.touched.age ? 'error' : ''}`}
            placeholder="גיל"
            {...formik.getFieldProps('age')}
            defaultValue={initialValues?.age || ''}
          />
          {formik.touched.age && formik.errors.age && (
            <div className="error-message">{formik.errors.age}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="number"
            id="height"
            className={`form-input ${formik.errors.height && formik.touched.height ? 'error' : ''}`}
            placeholder="גובה"
            {...formik.getFieldProps('height')}
            defaultValue={initialValues?.height || ''}
          />
          {formik.touched.height && formik.errors.height && (
            <div className="error-message">{formik.errors.height}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="number"
            id="weight"
            className={`form-input ${formik.errors.weight && formik.touched.weight ? 'error' : ''}`}
            placeholder="משקל"
            {...formik.getFieldProps('weight')}
            defaultValue={initialValues?.weight || ''}
          />
          {formik.touched.weight && formik.errors.weight && (
            <div className="error-message">{formik.errors.weight}</div>
          )}
        </div>
      </div>

      {/* שדה המין */}
      <div className="form-group">
        <select
          id="gender"
          className={`form-input ${formik.errors.gender && formik.touched.gender ? 'error' : ''}`}
          {...formik.getFieldProps('gender')}
          onFocus={() => setGenderFocused(true)}
          onBlur={() => setGenderFocused(false)}
        >
          {!genderFocused && <option value="">בחר מין</option>}
          <option value="male" selected={initialValues?.gender === 'male'}>זכר</option>
          <option value="female" selected={initialValues?.gender === 'female'}>נקבה</option>
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <div className="error-message">{formik.errors.gender}</div>
        )}
      </div>

      {/* שדה רמת פעילות */}
      <div className="form-group">
        <select
          id="activityLevel"
          className={`form-input ${formik.errors.activityLevel && formik.touched.activityLevel ? 'error' : ''}`}
          {...formik.getFieldProps('activityLevel')}
          onFocus={() => setActivityLevelFocused(true)}
          onBlur={() => setActivityLevelFocused(false)}
        >
          {!activityLevelFocused && <option value="">בחר רמת פעילות</option>}
          <option value="inactive" selected={initialValues?.activityLevel === 'inactive'}>ישיבה רוב היום עם מעט פעילות</option>
          <option value="low" selected={initialValues?.activityLevel === 'low'}>פעילות קלה 1-3 פעמים בשבוע</option>
          <option value="medium" selected={initialValues?.activityLevel === 'medium'}>פעילות 3-5 פעמים בשבוע</option>
          <option value="high" selected={initialValues?.activityLevel === 'high'}>פעילות קשה 6-7 פעמים בשבוע</option>
        </select>
        {formik.touched.activityLevel && formik.errors.activityLevel && (
          <div className="error-message">{formik.errors.activityLevel}</div>
        )}
      </div>

      {/* תוצאה */}
      {formik.values.dailyCalories && (
        <div className="bmr-result">
          <h4>BMR: {formik.values.dailyCalories.toFixed(2)} קלוריות ביום</h4>
        </div>
      )}

      {/* שדה מזונות מסוכנים */}
      <div className="form-group">
        <input
          type="text"
          id="dangerousFoods"
          className={`form-input ${formik.errors.dangerousFoods && formik.touched.dangerousFoods ? 'error' : ''}`}
          placeholder="מזונות מסוכנים או אלרגיה"
          {...formik.getFieldProps('dangerousFoods')}
          defaultValue={initialValues?.dangerousFoods || ''}
        />
        {formik.touched.dangerousFoods && formik.errors.dangerousFoods && (
          <div className="error-message">{formik.errors.dangerousFoods}</div>
        )}
      </div>

      <div className="button-group">
        <button type="button" className="next-button" onClick={goNext}>הבא →</button>
        <button type="button" className="prev-button" onClick={goBack}>← הקודם</button>
      </div>
    </div>
  );
}










