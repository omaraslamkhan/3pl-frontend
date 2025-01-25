import { fetchApi } from "../helpers/utils";

export const inventoryManagement = {
  getInventoryList: async () => {
    try {
      const res = await fetchApi("inventory/list", "GET");
      return res;
    } catch (error) {
      return error;
    }
  },
  addInventoryItem: async (body) => {
    try {
      const res = await fetchApi("inventory/list", "POST", body);
      return res;
    } catch (error) {
      return error;
    }
  },
  updateInventoryItem: async (body) => {
    try {
      const res = await fetchApi("inventory/list", "PUT", body);
      return res;
    } catch (error) {
      return error;
    }
  },
  deleteInventoryItem: async (body) => {
    try {
      const res = await fetchApi("inventory/list", "DELETE", body);
      return res;
    } catch (error) {
      return error;
    }
  },
  uploadFile: async (body) => {
    try {
      const res = await fetchApi("file/upload", "POST", body,
        { "Content-Type": "multipart/form-data" }
      );
      return res;
    } catch (error) {
      return error;
    }
  },
};
