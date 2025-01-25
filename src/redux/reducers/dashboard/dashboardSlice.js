import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reports: {},
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setReports: (state, action) => {
      state.reports = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setReports } = dashboardSlice.actions

export default dashboardSlice.reducer