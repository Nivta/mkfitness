import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/Login.css';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../state/userSlice';
import { UserIcon, LockIcon } from 'lucide-react';
import login from "../data/LoginActions";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ניהול מצב להצגת הסיסמה
  const [showPassword, setShowPassword] = useState(false);

  // בדיקה אם עברו 10 דקות מאז ההתחברות
  useEffect(() => {
    const storedUserState = localStorage.getItem('userState');

    if (storedUserState) {
      const { user, token, loginTimestamp } = JSON.parse(storedUserState);
      const currentTime = Date.now();

      // אם עברו 3 שעות, ננתק את המשתמש
      if (loginTimestamp && currentTime - loginTimestamp >3*60 * 60 * 1000) {
        localStorage.removeItem('userState');
        dispatch(setUser(null));
        dispatch(setToken(null));
        navigate('/');
        return;
      }

      // עדכון ה-Redux עם פרטי המשתמש
      dispatch(setUser(user));
      if (token) dispatch(setToken(token));

      // הגדרת טיימר לניתוק אוטומטי בעוד הזמן שנותר
      const timeLeft = 3*60 * 60 * 1000 - (currentTime - loginTimestamp);
      if (timeLeft > 0) {
        setTimeout(() => {
          localStorage.removeItem('userState');
          dispatch(setUser(null));
          dispatch(setToken(null));
          navigate('/');
        }, timeLeft);
      }
    }
  }, [dispatch, navigate]);

  // הגדרת טופס עם Formik
  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('כתובת אימייל לא תקינה').required('שדה חובה'),
      password: Yup.string().required('שדה חובה'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const userType = await login(values, setStatus);
        if (userType) {
          // יצירת נתוני המשתמש ושמירת זמן ההתחברות
          const userState = {
            user: userType,
            token: userType === 'admin' ? 'admin-token' : null, // טוקן למנהלים בלבד
            loginTimestamp: Date.now(), // שמירת זמן הכניסה
          };

          localStorage.setItem('userState', JSON.stringify(userState));

          // ניתוב לפי סוג המשתמש
          navigate(userType === 'admin' ? '/adminDashbord' : '/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">התחברות למערכת</h2>
        <form onSubmit={formik.handleSubmit} noValidate>
          
          {/* שדה אימייל */}
          <div className="form-group">
            <div className="input-icon">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="אימייל"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`login-input ${
                  formik.touched.email && formik.errors.email ? 'login-error' : ''
                }`}
              />
              <UserIcon size={20} />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="login-error-text">{formik.errors.email}</div>
            )}
          </div>

          {/* שדה סיסמה עם אפשרות הצגה */}
          <div className="form-group">
            <div className="input-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="סיסמה"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`login-input ${
                  formik.touched.password && formik.errors.password ? 'login-error' : ''
                }`}
              />
              <LockIcon size={20} />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="login-error-text">{formik.errors.password}</div>
            )}

            {/* Checkbox להצגת הסיסמה */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">הצג סיסמה</label>
            </div>
          </div>

          {/* הצגת הודעת שגיאה אם קיימת */}
          {formik.status && (
            <div className="login-alert">
              <div className="login-alert-text">{formik.status}</div>
            </div>
          )}

          {/* כפתור התחברות */}
          <button
            type="submit"
            className="login-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'מתחבר...' : 'התחבר'}
          </button>

          {/* קישור ליצירת חשבון חדש */}
          <div className="register-link">
            <p>אין לך חשבון?</p>
            <div className="register-options">
              <Link to="/register">צור משתמש חדש</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
