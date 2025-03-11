// src/FoodInput.tsx


import { Field, ErrorMessage } from 'formik';

export default function FoodInput({ foods, setFieldValue }: { foods: string[]; setFieldValue: any }) {
  return (
    <div>
      <label>מאכלים:</label>
      <Field
        name="newFood"
        render={({ field }: any) => (
          <input
            type="text"
            {...field}
            onBlur={(e) => {
              if (e.target.value) {
                // אם foods לא מאותחל, נאתחל אותו כמערך
                setFieldValue('foods', Array.isArray(foods) ? [...foods, e.target.value] : [e.target.value]);
                e.target.value = ''; // ריקון שדה הטקסט אחרי הוספה
              }
            }}
          />
        )}
      />
      <ErrorMessage name="newFood" component="div" />
      
      <div>
        <h4>מאכלים שנבחרו:</h4>
        <ul>
          {foods.map((food, index) => (
            <li key={index}>{food}</li> // הצגת המאכלים ברשימה
          ))}
        </ul>
      </div>
    </div>
  );
}


