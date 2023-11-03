import axiosClient from "./axiosClient";

const token = localStorage.getItem("token");

const ProductAPI = {
  getAPI: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getCategory: (query) => {
    const url = `/products/category/fetch?${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/products/detail?id=${id}`;
    return axiosClient.get(url);
  },

  getPagination: (query) => {
    const url = `/products/pagination/fetch?${query}`;
    return axiosClient.get(url);
  },
  postAddProduct: (body) => {
    const url = `admin/addproduct`;
    return axiosClient.post(url, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    });
  },
  postUpdateProduct: (body) => {
    const url = `admin/updateproduct`;
    return axiosClient.post(url, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    });
  },
  deleteProduct: (query) => {
    const url = `admin/deleteproduct/delete${query}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
};

export default ProductAPI;
