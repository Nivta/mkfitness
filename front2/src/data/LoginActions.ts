// src/data/LoginActions.ts
import axios from 'axios';
import apiURL from './apiConfig';

export default async function login(
  values: { email: string; password: string },
  setStatus: any
): Promise<void> {  // לא מחזירים את סוג המשתמש, אלא פשוט נשמור הכל ב-localStorage
  try {
    const response = await axios.post(apiURL + "/api/auth/login", values);
    console.log('Response from server:', response.data);
      let userType
    const user = response.data.user;
    const token = response.data.token;
    if(token){
         userType="admin";
    }
    else{
      userType=="user"
    }
    // שמירת כל המידע ב-localStorage
    localStorage.setItem('userState', JSON.stringify({ user, token, userType }));

  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      setStatus(err.response.data.message || 'שגיאה בהתחברות');
    } else {
      setStatus('שגיאה בהתחברות למערכת');
    }
    throw new Error('Login failed');
  }
}
