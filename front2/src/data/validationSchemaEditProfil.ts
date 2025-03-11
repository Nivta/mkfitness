import * as Yup from 'yup';

export const validationSchema = Yup.object({
  fullName: Yup.string().required('שם מלא הוא שדה חובה'),
  email: Yup.string().email('כתובת דוא"ל לא תקינה').required('דוא"ל הוא שדה חובה'),
  idNumber: Yup.string().matches(/^\d{9}$/, 'מספר תעודת זהות לא תקין').required('תעודת זהות היא שדה חובה'),
  password: Yup.string()
    .min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
  phone: Yup.string()
    .matches(/^05\d{8}$/, 'מספר טלפון לא תקין')
    .required('טלפון הוא שדה חובה'),
  age: Yup.number().min(15, 'הגיל חייב להיות לפחות 15').required('גיל הוא שדה חובה'),
  height: Yup.number().min(50, 'גובה חייב להיות לפחות 50').required('גובה הוא שדה חובה'),
  weight: Yup.number().min(30, 'משקל חייב להיות לפחות 30').required('משקל הוא שדה חובה'),
  gender: Yup.string().required('מין נדרש'),
  activityLevel: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'רמת פעילות לא תקינה')
    .required('רמת פעילות היא שדה חובה'),
  dangerousFoods: Yup.string(),
  diet: Yup.string().oneOf(['meat', 'vegetarian', 'vegan'], 'דיאטה לא תקינה').nullable().required('דיאטה היא שדה חובה'),
  eatsEggs: Yup.boolean().required('אנא ציין אם אתה אוכל ביצים'),
  eatsDairy: Yup.boolean().required('אנא ציין אם אתה אוכל מוצרי חלב'),
  eatsFish: Yup.boolean().required('אנא ציין אם אתה אוכל דגים'),
  favoriteFoods: Yup.string(),
  dislikeFoods: Yup.string(),
  goal: Yup.string().required('מטרה היא שדה חובה'),
  trainingLocation: Yup.string().required('מיקום אימונים הוא שדה חובה'),
  acceptTerms: Yup.boolean().oneOf([true], 'עליך להסכים לתנאים והגבלות').required('הסכמה לתנאים היא שדה חובה'),
  healthQuestions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required(),
      answer: Yup.string().required('יש לבחור תשובה'),
    })
  ),
  status: Yup.string().required('סטטוס הוא שדה חובה'),
  dailyCalories: Yup.number().min(1000, 'הקלוריות היומיות חייבות להיות לפחות 1000').required('קלוריות יומיות הן שדה חובה'),
});
