import { createSlice } from '@reduxjs/toolkit'

// Check for token and user in localStorage
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  token: token ? token : null,
  loggedInUser: user ? user : null,
  roles: ['admin', 'seller'],
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setLoggedOut: (state) => {
      state.loggedInUser = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoggedInUser, setLoggedOut } = authSlice.actions

export default authSlice.reducer