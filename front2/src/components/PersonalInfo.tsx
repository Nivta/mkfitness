import { FormikProps } from 'formik';
import { User } from '../data/UserType';

interface PersonalInfoProps {
  formik: FormikProps<User>;
  goNext: () => void;
  initialValues?: User; // אפשרות לקבל ערכים אם מדובר בעריכה
  isEditMode: boolean; // מצב עריכה
}

export default function PersonalInfo({ formik, goNext, initialValues, isEditMode }: PersonalInfoProps) {
  return (
    <div className="form-section">
      <h3 className="section-title">פרטים אישיים</h3>
      <div className="name-grid">
        <div className="form-group">
          <input
            type="text"
            id="fullName"
            className={`form-input ${formik.errors.fullName && formik.touched.fullName ? 'error' : ''}`}
            placeholder="שם ממלא"
            {...formik.getFieldProps('fullName')}
            defaultValue={initialValues?.fullName || ''}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="error-message">{formik.errors.fullName}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <input
          type="email"
          id="email"
          className={`form-input ${formik.errors.email && formik.touched.email ? 'error' : ''}`}
          placeholder="אימייל"
          {...formik.getFieldProps('email')}
          defaultValue={initialValues?.email || ''}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}
      </div>

      {/* הצגת שדה הסיסמה רק אם זה לא מצב עריכה */}
      {!isEditMode && (
        <div className="form-group">
          <input
            type="password"
            id="password"
            className={`form-input ${formik.errors.password && formik.touched.password ? 'error' : ''}`}
            placeholder="סיסמה"
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          id="idNumber"
          className={`form-input ${formik.errors.idNumber && formik.touched.idNumber ? 'error' : ''}`}
          placeholder="תעודת זהות"
          {...formik.getFieldProps('idNumber')}
          defaultValue={initialValues?.idNumber || ''}
        />
        {formik.touched.idNumber && formik.errors.idNumber && (
          <div className="error-message">{formik.errors.idNumber}</div>
        )}
      </div>

      {/* שדה טלפון */}
      <div className="form-group">
        <input
          type="text"
          id="phone"
          className={`form-input ${formik.errors.phone && formik.touched.phone ? 'error' : ''}`}
          placeholder="מספר טלפון"
          {...formik.getFieldProps('phone')}
          defaultValue={initialValues?.phone || ''}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="error-message">{formik.errors.phone}</div>
        )}
      </div>
      <div className="button-group">
        <button type="button" className="next-button" onClick={() => goNext()}>הבא →</button>
      </div>
    </div>
  );
}





  
