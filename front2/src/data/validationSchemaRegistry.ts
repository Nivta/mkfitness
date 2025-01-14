import * as Yup from 'yup';

export const validationSchema = Yup.object({
  fullName: Yup.string().required('שם מלא נדרש'),
  email: Yup.string().email('כתובת אימייל לא תקינה').required('אימייל נדרש'),
  idNumber: Yup.string().matches(/^\d{9}$/, 'תעודת זהות חייבת להכיל 9 ספרות').required('תעודת זהות נדרשת'),
  password: Yup.string()
    .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
    .matches(/[A-Z]/, 'סיסמה חייבת להכיל לפחות אות גדולה אחת')
    .matches(/[a-z]/, 'סיסמה חייבת להכיל לפחות אות קטנה אחת')
    .matches(/[0-9]/, 'סיסמה חייבת להכיל לפחות מספר אחד')
    .required('סיסמה נדרשת'),
  phone: Yup.string().required('מספר טלפון נדרש'),
  age: Yup.number().required('גיל נדרש').positive('גיל חייב להיות חיובי').min(15, 'הגיל חייב להיות לפחות 15').max(100, 'הגיל לא יכול להיות יותר מ-100'),
  height: Yup.number().required('גובה נדרש').positive('גובה חייב להיות חיובי'),
  weight: Yup.number().required('משקל נדרש').positive('משקל חייב להיות חיובי'),
  gender: Yup.string().required('מין נדרש'),
  activityLevel: Yup.string().required('רמת פעילות נדרשת'),
  eatsEggs: Yup.boolean(),
  eatsDairy: Yup.boolean(),
  eatsFish: Yup.boolean(),
  goal: Yup.string(),
  dangerousFoods: Yup.string(),
  favoriteFoods: Yup.string(),
  dislikeFoods: Yup.string(),
  trainingLocation: Yup.string().required('מיקום אימון נדרש'),
  acceptTerms: Yup.boolean().oneOf([true], 'יש לאשר את התנאים וההגבלות'),
  diet: Yup.mixed().nullable()
});
