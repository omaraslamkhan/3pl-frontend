import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  inventoryList: null,
}

export const inventoryManagementSlice = createSlice({
  name: 'inventoryManagement',
  initialState,
  reducers: {
    setInventoryList: (state, action) => {
      state.inventoryList = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setInventoryList } = inventoryManagementSlice.actions

export default inventoryManagementSlice.reducer