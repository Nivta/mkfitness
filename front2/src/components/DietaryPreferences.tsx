import { FormikProps } from 'formik';

import { User } from '../data/UserType';

interface DietaryPreferencesProps {
  formik: FormikProps<User>;
  goNext: () => void;
  goBack: () => void;
  initialValues?: User; // אפשרות לקבל ערכים אם מדובר בעריכה
}

export default function DietaryPreferences({ formik, goNext, goBack, initialValues }: DietaryPreferencesProps) {
  const { diet, eatsEggs, eatsDairy, eatsFish } = formik.values;

  const isMeatSelected = diet === 'meat';
  const isVegetarianSelected = diet === 'vegetarian';
  const isVeganSelected = diet === 'vegan';

  // עדכון הסטטוס של הדיאטה ב-Formik כשיש שינוי
  const DietChange = (newDiet: 'meat' | 'vegetarian' | 'vegan') => {
    formik.setFieldValue('diet', newDiet);

    // אם נבחר טבעוני, נבטל את הבחירות של ביצים, דגים, וחלב
    if (newDiet === 'vegan') {
      formik.setFieldValue('eatsEggs', false);
      formik.setFieldValue('eatsDairy', false);
      formik.setFieldValue('eatsFish', false);
    }
  };

  return (
    <div className="form-section">
      <h3 className="section-title">העדפות תזונה</h3>

      {/* כפתור עבור אוכל בשר */}
      <div className="form-group">
        <input
          type="radio"
          id="eatsMeat"
          name="diet"
          value="meat"
          checked={isMeatSelected}
          onChange={() => DietChange('meat')}
        />
        <label htmlFor="eatsMeat">אוכל בשר</label>
      </div>

      {/* כפתור עבור צמחוני */}
      <div className="form-group">
        <input
          type="radio"
          id="isVegetarian"
          name="diet"
          value="vegetarian"
          checked={isVegetarianSelected}
          onChange={() => DietChange('vegetarian')}
        />
        <label htmlFor="isVegetarian">צמחוני</label>
      </div>

      {/* כפתור עבור טבעוני */}
      <div className="form-group">
        <input
          type="radio"
          id="isVegan"
          name="diet"
          value="vegan"
          checked={isVeganSelected}
          onChange={() => DietChange('vegan')}
        />
        <label htmlFor="isVegan">טבעוני</label>
      </div>

      {/* שדה עבור אוכל ביצים */}
      <div className="form-group">
        <input
          type="checkbox"
          id="eatsEggs"
          checked={eatsEggs}
          onChange={() => formik.setFieldValue('eatsEggs', !eatsEggs)}
          disabled={isVeganSelected} // לא ניתן לבחור ביצים אם נבחר טבעוני
        />
        <label htmlFor="eatsEggs">אוכל ביצים</label>
      </div>

      {/* שדה עבור אוכל מוצרי חלב */}
      <div className="form-group">
        <input
          type="checkbox"
          id="eatsDairy"
          checked={eatsDairy}
          onChange={() => formik.setFieldValue('eatsDairy', !eatsDairy)}
          disabled={isVeganSelected} // לא ניתן לבחור חלב אם נבחר טבעוני
        />
        <label htmlFor="eatsDairy">אוכל מוצרי חלב</label>
      </div>

      {/* שדה עבור אוכל דגים */}
      <div className="form-group">
        <input
          type="checkbox"
          id="eatsFish"
          checked={eatsFish}
          onChange={() => formik.setFieldValue('eatsFish', !eatsFish)}
          disabled={isVeganSelected} // לא ניתן לבחור דגים אם נבחר טבעוני
        />
        <label htmlFor="eatsFish">אוכל דגים</label>
      </div>

      {/* שדה עבור אוכל מועדף */}
      <div className="form-group">
        <label htmlFor="favoriteFoods">מה הם המזונות האהובים עליך</label>
        <textarea
          id="favoriteFoods"
          rows={4}
          {...formik.getFieldProps('favoriteFoods')}
          defaultValue={initialValues?.favoriteFoods || ''} // קריאה לערכים במקרה של עריכה
        />
        {formik.touched.favoriteFoods && formik.errors.favoriteFoods && (
          <div className="error-message">{formik.errors.favoriteFoods}</div>
        )}
      </div>

      {/* שדה עבור אוכל לא מועדף */}
      <div className="form-group">
        <label htmlFor="dislikeFoods">מה הם המזונות שלא אהובים עליך</label>
        <textarea
          id="dislikeFoods"
          rows={4}
          {...formik.getFieldProps('dislikeFoods')}
          defaultValue={initialValues?.dislikeFoods || ''} // קריאה לערכים במקרה של עריכה
        />
        {formik.touched.dislikeFoods && formik.errors.dislikeFoods && (
          <div className="error-message">{formik.errors.dislikeFoods}</div>
        )}
      </div>

      <div className="button-group">
        <button type="button" className="next-button" onClick={goNext}>הבא →</button>
        <button type="button" className="prev-button" onClick={goBack}>← הקודם</button>
      </div>
    </div>
  );
}











