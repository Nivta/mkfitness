import axios from "axios";
import { User } from "./UserType";
import apiURL from "./apiConfig";

export const updateUserAction = async (values: User, setSubmitStatus: Function) => {
    try {
      const response = await axios.post(apiURL+'/api/users/update', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        setSubmitStatus({ isSubmitting: false, success: 'Profile updated successfully!', error: '' });
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error: any) {
      setSubmitStatus({ isSubmitting: false, success: '', error: error.message });
    }
  };