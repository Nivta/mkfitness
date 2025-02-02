import { FormValues } from './FormValuesRegister';
import axios from 'axios';
import { validationSchema } from './validationSchemaRegistry';
import apiURL from './apiConfig';

export const registerAction = async (values: FormValues, setSubmitStatus: React.Dispatch<React.SetStateAction<any>>) => {
  try {
    // עדכון סטטוס: התחלת שליחה
    setSubmitStatus({ isSubmitting: true, success: "", error: "" });

    // המרת שדות מספריים
    const formattedValues = {
      ...values,
      age: Number(values.age),
      height: Number(values.height),
      weight: Number(values.weight)
    };

    // וידוא תקינות לפני שליחה
    const isValid = await validationSchema.isValid(formattedValues);
    if (!isValid) {
      throw new Error('הטופס לא תקין');
    }

    console.log('נתונים לשליחה:', formattedValues);

    // שליחה לשרת
    const response = await axios.post(apiURL+"/api/users/register", formattedValues);

    // אם ההרשמה הצליחה, הצגת הודעת alert
    alert('חכה לאישור מנהל' + response);

    setSubmitStatus({
      isSubmitting: false,
      success: 'ההרשמה בוצעה בהצלחה!',
      error: ""
    });

  } catch (error) {
    console.error('שגיאה בהרשמה:', error);
    let errorMessage = 'אירעה שגיאה בתהליך ההרשמה';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data?.message || 'שגיאה בשליחת הטופס';
      } else if (error.request) {
        errorMessage = 'לא ניתן להתחבר לשרת, אנא בדוק את החיבור לאינטרנט';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setSubmitStatus({
      isSubmitting: false,
      success: "",
      error: errorMessage
    });
  }
};
