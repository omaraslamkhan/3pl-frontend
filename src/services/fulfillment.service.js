import { fetchApi } from "../helpers/utils";

export const fulfillmentService = {
  fetchOrderFulfillment: async (storeName) => {
    try {
      const res = await fetchApi("shop/getAllShops", "GET");
      return res;
    } catch (error) {
      return error;
    }
  },
};
