import { fetchApi } from "../helpers/utils";

export const authService = {
  registerUser: async (body) => {
    try {
      const res = await fetchApi("register", "POST", body);
      return res;
    } catch (error) {
      return error;
    }
  },
  loginUser: async ({
    email,
    password,
  }) => {
    try {
      const res = await fetchApi("login", "POST", {
        email: email,
        password: password,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  updateUser: async (id, body) => {
    try {
      const res = await fetchApi(`users/${id}`, "PUT", body);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  getById: async (id) => {
    try {
      const res = await fetchApi(`users/${id}`, "GET");
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  // logout: async () => {
  //   try {
  //     const res = await fetchApi("logout", "DELETE");
  //     return res;
  //   } catch (error) {
  //     return error;
  //   }
  // },
};
