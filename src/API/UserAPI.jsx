import axiosClient from "./axiosClient";

const token = localStorage.getItem("token");

const UserAPI = {
  getAllData: () => {
    const url = "/admin";
    return axiosClient.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },

  getDetailData: (id) => {
    const url = `/admin/detail?userId=${id}`;
    return axiosClient.get(url);
  },

  postSignUp: (query) => {
    const url = `/admin/signup/${query}`;
    return axiosClient.post(url);
  },
  postLogin: (query) => {
    const url = `/admin/login/${query}`;
    return axiosClient.post(url);
  },
  postResetPassword: (body) => {
    const url = `/admin/resetpassword`;
    return axiosClient.post(url, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  deleteAccount: (query) => {
    const url = `/admin/deleteaccount/delete${query}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
};

export default UserAPI;
