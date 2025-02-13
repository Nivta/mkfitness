// src/data/LoginActions.ts
import axios from 'axios';
import { store } from '../state/store';
import { setUser, setToken } from '../state/userSlice';
import apiURL from './apiConfig';

export default async function login(
  values: { email: string; password: string },
  setStatus: any
): Promise<string> {
  try {
    const response = await axios.post(apiURL + "/api/auth/login", values);
    console.log('Response from server:', response.data);

    const user = response.data.user;
    const token = response.data.token;

    // עדכון ה-Redux store
    store.dispatch(setUser(user));
    if (token) {
      store.dispatch(setToken(token));
      // שמירת המשתמש, הטוקן וזמן התחברות ב-localStorage
      localStorage.setItem('userState', JSON.stringify({ user, token, loginTimestamp: Date.now() }));
    } else {
      // במקרה שאין טוקן (למשתמש רגיל), עדיין נשמור את הזמן
      localStorage.setItem('userState', JSON.stringify({ user, loginTimestamp: Date.now() }));
    }

    // החזרת סוג המשתמש
    if (response.data.userType === 'admin') {
      return 'admin';
    } else {
      return 'user';
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      setStatus(err.response.data.message || 'שגיאה בהתחברות');
    } else {
      setStatus('שגיאה בהתחברות למערכת');
    }
    throw new Error('Login failed');
  }
}

