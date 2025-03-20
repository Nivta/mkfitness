
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // ייבוא axios
import '../styles/AdminRegistration.css'; // ייבוא של קובץ ה-CSS
import apiURL from '../data/apiConfig';

const AdminRegistration = () => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        // קריאה לשרת לשליחת נתוני ההרשמה
        const response = await axios.post(apiURL+'/api/admin/register-admin', values);
        console.log('Admin Registered:', response.data);
        // כאן תוכל להציג הודעה או לבצע פעולה אחרת לאחר ההרשמה
        alert('Admin registered successfully!');
      } catch (error) {
        console.error('Error registering admin:', error);
        // כאן תוכל להציג הודעת שגיאה במידה ויש בעיה
        alert('Registration failed. Please try again.');
      }
    },
  });

  return (
    <div className="container">
      <h1>Admin Registration</h1>
      <form onSubmit={formik.handleSubmit} className="form">
        <div>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            className="input"
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <div>{formik.errors.fullName}</div>
          ) : null}
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="input"
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="input"
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>
        <button type="submit" disabled={!formik.isValid || !formik.dirty} className="button">
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegistration;

