import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "./Component/Pagination";
import alertify from "alertifyjs";

function Products(props) {
  const expiryDate = localStorage.getItem("expiryDate");
  const timeRemaining = new Date(expiryDate).getTime() - new Date().getTime();

  const autoLogout = (miliseconds) => {
    setTimeout(() => {
      localStorage.clear();
      window.location.replace("/login");
      return;
    }, miliseconds);
  };

  autoLogout(timeRemaining);

  const userId = localStorage.getItem("id_user");
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState(false);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
  });

  const [search, setSearch] = useState("");

  const onChangeText = (e) => {
    const value = e.target.value;

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  //Tổng số trang
  const [totalPage, setTotalPage] = useState();

  //Hàm này dùng để thay đổi state pagination.page
  //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
  const handlerChangePage = (value) => {
    console.log("Value: ", value);

    //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  //Gọi hàm useEffect tìm tổng số sản phẩm để tính tổng số trang
  //Và nó phụ thuộc và state pagination
  useEffect(() => {
    const fetchAllData = async () => {
      const response = await ProductAPI.getAPI();

      //Tính tổng số trang = tổng số sản phẩm / số lượng sản phẩm 1 trang
      const totalPage = Math.ceil(
        parseInt(response.length) / parseInt(pagination.count)
      );
      console.log(totalPage);

      setTotalPage(totalPage);
    };

    fetchAllData();
  }, [pagination]);

  //Gọi hàm Pagination
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);

      const response = await ProductAPI.getPagination(query);
      console.log(response);

      setProducts(response);
    };

    fetchData();
  }, [pagination, load]);

  // delete product
  const deleteProductHandler = async (productId) => {
    if (window.confirm("Bạn Có Chắc Chắn Muốn Xóa Sản Phẩm?")) {
      // const query = queryString
      const params = {
        userId: userId,
        productId: productId,
      };
      const query = "?" + queryString.stringify(params);
      const response = await ProductAPI.deleteProduct(query);
      if (response.statusCode === 200) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.success(response.message);
        setLoad(true);
        return;
      }
      if (response.statusCode === 422 || response.statusCode === 401) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error(response.message);
        return;
      }
    }
  };

  // reload product after delete handler
  useEffect(() => {
    if (load) {
      setLoad(false);
    }
  }, [load]);
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Thống Kê Sản Phẩm
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      Trang Chủ
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Sản Phẩm
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Sản Phẩm</h4>
                <input
                  className="form-control w-25"
                  onChange={onChangeText}
                  type="text"
                  placeholder="Enter Search!"
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Hình Ảnh</th>
                        <th>Thể Loại</th>
                        <th>Số Lượng Trong Kho</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products &&
                        products.map((value) => (
                          <tr key={value._id}>
                            <td>{value._id}</td>
                            <td>{value.name}</td>
                            <td>{value.price}</td>
                            <td>
                              <img
                                src={value.img1}
                                style={{
                                  height: "60px",
                                  width: "60px",
                                }}
                                alt=""
                              />
                            </td>
                            <td>{value.category}</td>
                            <td>{value.count}</td>
                            <td>
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                                href={`/update/${value._id}`}
                              >
                                Cập Nhật
                              </a>
                              &nbsp;
                              <a
                                onClick={() => {
                                  deleteProductHandler(value._id);
                                }}
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-danger"
                              >
                                Xóa
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Pagination
                    pagination={pagination}
                    handlerChangePage={handlerChangePage}
                    totalPage={totalPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center text-muted"></footer>
    </div>
  );
}

export default Products;
