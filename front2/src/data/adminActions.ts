import axios from 'axios';
import { User } from './UserType';

export const fetchPendingUsers = async (token: string|null, setPendingUsers: React.Dispatch<React.SetStateAction<User[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await axios.get('http://localhost:3000/admin/pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setPendingUsers(response.data);
  } catch (error) {
    setError('שגיאה בטעינת המשתמשים');
    console.error('Error fetching users:', error);
  } finally {
    setIsLoading(false);
  }
};

export const Approve = async (userId: string, token: string|null, setPendingUsers: React.Dispatch<React.SetStateAction<User[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    setIsLoading(true);
    setError(null);
    await axios.post(`http://localhost:3000/admin/approve/${userId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setPendingUsers(prevUsers =>
      prevUsers.map(user =>
        user.idNumber === userId ? { ...user, status: 'active' } : user
      )
    );
  } catch (error) {
    setError('שגיאה באישור המשתמש');
    console.error('Error approving user:', error);
  } finally {
    setIsLoading(false);
  }
};

export const Reject = async (userId: string, token: string|null, setPendingUsers: React.Dispatch<React.SetStateAction<User[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    setIsLoading(true);
    setError(null);
    await axios.delete(`http://localhost:3000/admin/deny/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setPendingUsers(prevUsers =>
      prevUsers.filter(user => user.idNumber !== userId)
    );
  } catch (error) {
    setError('שגיאה בדחיית המשתמש');
    console.error('Error rejecting user:', error);
  } finally {
    setIsLoading(false);
  }
};
