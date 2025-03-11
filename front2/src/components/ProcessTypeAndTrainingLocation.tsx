import { FormikProps } from 'formik';

import { useState } from 'react';
import { User } from '../data/UserType';

interface ProcessTypeAndTrainingLocationProps {
  formik: FormikProps<User>;
  goBack: () => void;
  initialValues?: User; // הוספתי אפשרות לקבל ערכים בהגדרה, לצורך עריכה
}

export default function ProcessTypeAndTrainingLocation({
  formik, 
  goBack, 
  initialValues
}: ProcessTypeAndTrainingLocationProps) {
  // יצירת מצב לפוקוס של כל select
  const [processTypeFocused, setProcessTypeFocused] = useState(false);
  const [trainingLocationFocused, setTrainingLocationFocused] = useState(false);

  // שימוש בערכים הראשוניים אם מדובר בעריכה
  const selectedProcessType = initialValues?.goal || formik.values.goal;
  const selectedTrainingLocation = initialValues?.trainingLocation || formik.values.trainingLocation;

  return (
    <div className="form-section">
      <h3 className="section-title">סוג תהליך ומיקום אימון</h3>

      <div className="form-group">
        <select
          id="processType"
          className={`form-input ${formik.errors.goal && formik.touched.goal ? 'error' : ''}`}
          {...formik.getFieldProps('goal')}
          onFocus={() => setProcessTypeFocused(true)} // כשלוחצים על ה- select
          onBlur={() => setProcessTypeFocused(false)} // כשלוחצים מחוץ ל- select
          value={selectedProcessType} // לוודא שהערך נשאר עקבי בעריכה
        >
          {!processTypeFocused && <option value="">בחר סוג תהליך</option>} {/* רק אם לא בפוקוס תציג את האופציה הזו */}
          <option value="weightLoss">חיטוב וירידה במשקל</option>
          <option value="muscleGain">מסה ועליה במשקל</option>
        </select>
        {formik.touched.goal && formik.errors.goal && (
          <div className="error-message">{formik.errors.goal}</div>
        )}
      </div>

      <div className="form-group">
        <select
          id="trainingLocation"
          className={`form-input ${formik.errors.trainingLocation && formik.touched.trainingLocation ? 'error' : ''}`}
          {...formik.getFieldProps('trainingLocation')}
          onFocus={() => setTrainingLocationFocused(true)} // כשלוחצים על ה- select
          onBlur={() => setTrainingLocationFocused(false)} // כשלוחצים מחוץ ל- select
          value={selectedTrainingLocation} // לוודא שהערך נשאר עקבי בעריכה
        >
          {!trainingLocationFocused && <option value="">אני רוצה לקבל תוכנית אימון</option>} {/* רק אם לא בפוקוס תציג את האופציה הזו */}
          <option value="home">בית</option>
          <option value="park">פארק</option>
          <option value="gym">חדר כושר</option>
        </select>
        {formik.touched.trainingLocation && formik.errors.trainingLocation && (
          <div className="error-message">{formik.errors.trainingLocation}</div>
        )}
      </div>
      <div className="button-group">
        <button type="button" className="prev-button" onClick={goBack}>← הקודם</button>
      </div>
    </div>
  );
}


