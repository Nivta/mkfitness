import  { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Interface for weekly data
interface WeeklyTracking {
  date: string;
  weight: number;
  chest: number;
  belly: number;
  hips: number;
  arm: number;
}

export default function WeeklyTrackingPage() {
  // State to hold the client's weekly tracking data
  const [trackingData, setTrackingData] = useState<WeeklyTracking[]>([]);
  
  // Validation schema for form data
  const validationSchema = Yup.object({
    date: Yup.string().required("תאריך הוא שדה חובה"),
    weight: Yup.number().required("המשקל הוא שדה חובה").positive("המספר חייב להיות חיובי"),
    chest: Yup.number().required("היקף חזה הוא שדה חובה").positive("המספר חייב להיות חיובי"),
    belly: Yup.number().required("היקף טבור הוא שדה חובה").positive("המספר חייב להיות חיובי"),
    hips: Yup.number().required("היקף אגן הוא שדה חובה").positive("המספר חייב להיות חיובי"),
    arm: Yup.number().required("היקף יד הוא שדה חובה").positive("המספר חייב להיות חיובי")
  });

  // Function to handle form submission
  const handleFormSubmit = (values: WeeklyTracking) => {
    setTrackingData((prevState) => [...prevState, values]);
  };

  useEffect(() => {
    // כאן תוכל להוסיף את הקוד לשאול את הלקוח אם יש לו נתונים קודמים ולהציג אותם
    // לדוגמה, אם הנתונים שמורים בבסיס נתונים, נוכל לשלוף אותם ולהציג
  }, []);

  return (
    <div className="weekly-tracking-container">
      <h1>מעקב שקילה והיקפים שבועי</h1>

      {/* Form to add weekly data */}
      <Formik
        initialValues={{
          date: "",
          weight: 0,
          chest: 0,
          belly: 0,
          hips: 0,
          arm: 0
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {() => (
          <Form>
            <div>
              <label>תאריך:</label>
              <Field type="date" name="date" />
              <ErrorMessage name="date" component="div" className="error" />
            </div>

            <div>
              <label>משקל (ק"ג):</label>
              <Field type="number" name="weight" />
              <ErrorMessage name="weight" component="div" className="error" />
            </div>

            <div>
              <label>היקף חזה (ס"מ):</label>
              <Field type="number" name="chest" />
              <ErrorMessage name="chest" component="div" className="error" />
            </div>

            <div>
              <label>היקף טבור (ס"מ):</label>
              <Field type="number" name="belly" />
              <ErrorMessage name="belly" component="div" className="error" />
            </div>

            <div>
              <label>היקף אגן (ס"מ):</label>
              <Field type="number" name="hips" />
              <ErrorMessage name="hips" component="div" className="error" />
            </div>

            <div>
              <label>היקף יד (ס"מ):</label>
              <Field type="number" name="arm" />
              <ErrorMessage name="arm" component="div" className="error" />
            </div>

            <button type="submit">שמור</button>
          </Form>
        )}
      </Formik>

      {/* Display previous entries */}
      <div className="previous-data">
        <h2>הנתונים הקודמים שלך:</h2>
        <table>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>משקל</th>
              <th>היקף חזה</th>
              <th>היקף טבור</th>
              <th>היקף אגן</th>
              <th>היקף יד</th>
            </tr>
          </thead>
          <tbody>
            {trackingData.map((data, index) => (
              <tr key={index}>
                <td>{data.date}</td>
                <td>{data.weight}</td>
                <td>{data.chest}</td>
                <td>{data.belly}</td>
                <td>{data.hips}</td>
                <td>{data.arm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reminder for next data entry */}
      <div className="reminder">
        <h3>אל תשכח למלא את הנתונים השבוע!</h3>
      </div>
    </div>
  );
}
