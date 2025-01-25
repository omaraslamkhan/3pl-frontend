import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderFulfillment: [],
  payouts: [],
  stores: [],
}

export const fulfillmentSlice = createSlice({
  name: 'fulfillment',
  initialState,
  reducers: {
    setOrderFulfillment: (state, action) => {
      // Set Order Fulfillment List
      state.orderFulfillment = action.payload;
      // Set Saler Dropdown List 
      console.log('action', action)
      state.stores = action.payload?.map((item) => {
        return {
          label: item?.shop?.name, 
          value: item?.shop?.gid
        }
      });
    },
    setPayouts: (state, action) => {
      state.payouts = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setOrderFulfillment, setPayouts } = fulfillmentSlice.actions

export default fulfillmentSlice.reducer