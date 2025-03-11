import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FoodInput from './FoodInput';
import axios from 'axios';
import '../styles/TrainingProgram.css';
import apiURL from '../data/apiConfig';

export default function TrainingProgram() {
  interface Exercise {
    name: string;
    repetitions: number;
    weight?: number;
    tips: string;
  }

  interface ProgramValues {
    exercises: Exercise[];
    totalCalories: number;
    foods: string[];
    difficultyLevel: number;
  }

  const validationSchema = Yup.object({
    exercises: Yup.array().of(
      Yup.object({
        name: Yup.string().required('שם התרגיל חובה'),
        repetitions: Yup.number().required('חייב מספר חזרות').positive('המספר חייב להיות חיובי').integer('חייב להיות מספר שלם'),
        weight: Yup.number().positive('המשקל חייב להיות חיובי').notRequired(),
        tips: Yup.string().required('דגשים חובה')
      })
    ),
    totalCalories: Yup.number().required('חייב להוסיף קלוריות').positive('הקלוריות חייבות להיות חיוביות'),
    foods: Yup.array().of(Yup.string()).required('חייב להוסיף מאכלים'),
    difficultyLevel: Yup.number().oneOf([1, 2, 3], 'בחר רמת קושי תקינה').required('חייב לבחור רמת קושי')
  });

  // פונקציה לשליחת נתוני הטופס ל-API
  const submitForm = async (values: ProgramValues) => {
    try {
      const response = await axios.post(apiURL+'/api/training-programs', values);
      alert(response.data.message);
    } catch (error) {
      console.error('שגיאה בשמירה', error);
      alert('לא ניתן לשמור את תוכנית האימון');
    }
  };

  return (
    <Formik<ProgramValues>
      initialValues={{
        exercises: [{ name: '', repetitions: 0, tips: '' }],
        totalCalories: 0,
        foods: [],
        difficultyLevel: 0
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        submitForm(values); // שליחת נתוני הטופס ל-API
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="form-container">
          <h1 className="form-title">יצירת תוכנית אימון</h1>

          <FieldArray name="exercises">
            {({ push, remove }) => (
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>שם התרגיל</th>
                      <th>חזרות</th>
                      <th>משקל</th>
                      <th>דגשים</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.exercises.map((exercise, index) => (
                      <tr key={index}>
                        <td>
                          <Field 
                            name={`exercises[${index}].name`} 
                            className="input-field"
                            value={exercise.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFieldValue(`exercises[${index}].name`, e.target.value)
                            }
                          />
                          <ErrorMessage name={`exercises[${index}].name`} component="div" className="error-message" />
                        </td>
                        <td>
                          <Field 
                            type="number" 
                            name={`exercises[${index}].repetitions`} 
                            className="input-field"
                            value={exercise.repetitions}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFieldValue(`exercises[${index}].repetitions`, e.target.value)
                            }
                          />
                          <ErrorMessage name={`exercises[${index}].repetitions`} component="div" className="error-message" />
                        </td>
                        <td>
                          <Field 
                            type="number" 
                            name={`exercises[${index}].weight`} 
                            className="input-field"
                            value={exercise.weight || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFieldValue(`exercises[${index}].weight`, e.target.value)
                            }
                          />
                          <ErrorMessage name={`exercises[${index}].weight`} component="div" className="error-message" />
                        </td>
                        <td>
                          <Field 
                            name={`exercises[${index}].tips`} 
                            className="input-field"
                            value={exercise.tips}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFieldValue(`exercises[${index}].tips`, e.target.value)
                            }
                          />
                          <ErrorMessage name={`exercises[${index}].tips`} component="div" className="error-message" />
                        </td>
                        <td>
                          {values.exercises.length > 1 && (
                            <button type="button" className="delete-button" onClick={() => remove(index)}>
                              מחק תרגיל
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button type="button" className="add-exercise-button" onClick={() => push({ name: '', repetitions: 0, tips: '' })}>
                  הוסף תרגיל
                </button>
              </div>
            )}
          </FieldArray>

          <div>
            <label className="label">קלוריות האימון:</label>
            <Field type="number" name="totalCalories" className="input-field" />
            <ErrorMessage name="totalCalories" component="div" className="error-message" />
          </div>

          <FoodInput foods={values.foods} setFieldValue={setFieldValue} />

          <div>
            <label className="label">רמת קושי:</label>
            <Field 
              as="select" 
              name="difficultyLevel" 
              className="select-field" 
              value={values.difficultyLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFieldValue('difficultyLevel', Number(e.target.value))
              }
            >
              <option value="">בחר רמת קושי</option>
              <option value="1">מתחיל</option>
              <option value="2">בינוני</option>
              <option value="3">קשה</option>
            </Field>
            <ErrorMessage name="difficultyLevel" component="div" className="error-message" />
          </div>

          <button type="submit" className="submit-button">שלח</button>
        </Form>
      )}
    </Formik>
  );
}








