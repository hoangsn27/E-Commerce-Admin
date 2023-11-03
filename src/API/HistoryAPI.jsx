import axiosClient from "./axiosClient";

const token = localStorage.getItem("token");

const HistoryAPI = {
  getHistoryAPI: (query) => {
    const url = `/admin/fetch${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/histories/detail/fetch?orderId=${id}`;

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAll: (id) => {
    const url = `/admin/all/fetch?userId=${id}`;
    return axiosClient.get(url);
  },
};

export default HistoryAPI;
