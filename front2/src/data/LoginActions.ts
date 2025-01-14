import axios from 'axios';
export default  async function login(
    values: { email: string; password: string },
    setStatus: any
  ): Promise<string> { // הפונקציה מחזירה Promise<string>
    try {
      const response = await axios.post('http://localhost:3000/login', values);
      console.log('Response from server:', response.data);

      // עדכון המידע ב-localStorage
      const user = response.data.user;
      const token = response.data.token;
      localStorage.setItem('user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('token', token);
      }

      // ניווט לדף המתאים (לפי סוג המשתמש)
      if (response.data.userType === 'admin') {
        return 'admin'; // מחזירים את סוג המשתמש
      } else {
        return 'user'; // מחזירים את סוג המשתמש
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setStatus(err.response.data.message || 'שגיאה בהתחברות');
      } else {
        setStatus('שגיאה בהתחברות למערכת');
      }
      throw new Error('Login failed'); // כדי לוודא שיש הודעת שגיאה במידה ויש בעיה
    }
  }
