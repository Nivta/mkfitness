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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUserState = localStorage.getItem('userState');
    if (!storedUserState) return;

    const { user, token,userType } = JSON.parse(storedUserState);

    // אם יש מידע ב-localStorage, נעדכן את Redux עם פרטי המשתמש
    dispatch(setUser(user));  // עדכון Redux עם המידע של המשתמש
    if (token) {
      dispatch(setToken(token));  // אם יש טוקן, מעדכנים את Redux
      navigate(userType === 'admin' ? '/adminDashbord' : '/dashboard');
    }
  }, [dispatch, navigate]);

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
      console.log('הגשה של טופס התחברות');
      try {
        await login(values, setStatus);  // עכשיו login לא מחזירה שום דבר, אלא רק שומרת ב-localStorage

        // קריאה ל-localStorage
        const storedUserState = JSON.parse(localStorage.getItem('userState') || '{}');
        const user = storedUserState.user;  // קבלת פרטי המשתמש מה-localStorage
        const token = storedUserState.token;  // קבלת הטוקן מה-localStorage
        
        // עדכון Redux עם פרטי המשתמש
        dispatch(setUser(user));
        if (token) {
          dispatch(setToken(token));  // אם יש טוקן, נעדכן את Redux
        }

        // ניתוב לפי סוג המשתמש
        navigate( token ? '/adminDashbord' : '/dashboard');
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
                className={`login-input ${formik.touched.email && formik.errors.email ? 'login-error' : ''}`}
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
                className={`login-input ${formik.touched.password && formik.errors.password ? 'login-error' : ''}`}
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
              <Link to="/registerAdmin">מנהל</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


