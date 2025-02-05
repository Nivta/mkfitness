
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/Login.css';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../state/userSlice';
import { UserIcon, LockIcon } from 'lucide-react';
import login from "../data/LoginActions";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // בדיקת המידע ב-localStorage על מנת לאתחל את ה-Redux store אחרי ריפרוש
  useEffect(() => {
    const storedUserState = localStorage.getItem('userState');
    if (storedUserState) {
      const { user, token } = JSON.parse(storedUserState);
      dispatch(setUser(user));
      if (token) {
        dispatch(setToken(token));
      }

      // ניווט לדף המתאים אם המשתמש מחובר
      if (user) {
        // אם יש משתמש, נוודא אם מדובר במנהל או משתמש רגיל
        if (token) {
          // אם יש טוקן, מדובר במנהל
          navigate('/adminDashbord');
        } else {
          // אם אין טוקן, מדובר במשתמש רגיל
          navigate('/dashboard');
        }
      } else {
        navigate('/');
      }
    }
  }, [dispatch, navigate]);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('כתובת אימייל לא תקינה')
        .required('שדה חובה'),
      password: Yup.string().required('שדה חובה'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const userType = await login(values, setStatus);
        if (userType) {
          // ניווט לדף המתאים לאחר ההתחברות
          if (userType === 'admin') {
            navigate('/adminDashbord');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">התחברות למערכת</h2>
        <form onSubmit={formik.handleSubmit} noValidate>
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

          <div className="form-group">
            <div className="input-icon">
              <input
                type="password"
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
          </div>
          {formik.status && (
            <div className="login-alert">
              <div className="login-alert-text">{formik.status}</div>
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'מתחבר...' : 'התחבר'}
          </button>

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


