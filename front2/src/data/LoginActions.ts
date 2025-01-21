// src/data/LoginActions.ts
import axios from 'axios';
import { store } from '../state/store';
import { setUser, setToken } from '../state/userSlice';

export default async function login(
  values: { email: string; password: string },
  setStatus: any
): Promise<string> {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', values);
    console.log('Response from server:', response.data);

    const user = response.data.user;
    const token = response.data.token;

    // עדכון ה-Redux store במקום localStorage
    store.dispatch(setUser(user));
    if (token) {
      store.dispatch(setToken(token));
    }

    // אם יש טוקן, נשמור גם את ה-token. אם אין טוקן, נשמור רק את המשתמש.
    if (token) {
      localStorage.setItem('userState', JSON.stringify({ user, token }));
    } else {
      localStorage.setItem('userState', JSON.stringify({ user }));
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
