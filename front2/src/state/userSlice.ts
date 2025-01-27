//src/state/userSlice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin, User } from '../data/UserType';

// הגדרת סוגי המשתמש
type UserType = Admin |User

export interface UserState {
  user: UserType | null;
  token: string | null;
  isLoading: boolean; // הוספת המשתנה isLoading
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isLoading: true,  // ערך התחלתי של isLoading
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userState');
    },
  },
});

export const { setUser, setToken,setIsLoading,setError, logout } = userSlice.actions;

export default userSlice.reducer;
