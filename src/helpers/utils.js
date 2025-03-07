import axios from "axios";

const BASE_URL = "https://3plv3.vercel.app/";
// Credentials

// admin@3pl.com
// admin

// "admin@3plvalley.com",
// "3plvalley@123!",

// MongoDB Creds
// umeraslamjs
// Pa55w0rd1!

// const BASE_URL = "https://944c-144-48-129-96.ngrok-free.app/";
// admin@3pl.com
// admin

export const fetchApi = async (
  endpoint,
  method,
  body = null,
  headers = {},
) => {
  try {
    const token = localStorage.getItem("token");

    const combinedHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    };

    const response = await axios({
      method: method,
      url: `${BASE_URL}${endpoint}`,
      headers: combinedHeaders,
      data: body,
    });

    return response.data;
  } catch (error) {
    return error;
  }
};
