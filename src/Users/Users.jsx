import React, { useEffect, useState } from "react";
import UserAPI from "../API/UserAPI";
import alertify from "alertifyjs";
import queryString from "query-string";

function Users(props) {
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

  const [users, setUsers] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserAPI.getAllData();

      const userLoaded = [];
      for (const key in response) {
        if (response[key].role.isClient) {
          userLoaded.push(response[key]);
        }
      }

      setUsers(userLoaded);
    };

    fetchData();
  }, []);

  const resetPasswordHandler = async () => {
    if (newPassword !== confirmNewPassword) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.error("Mật Khẩu Xác Nhận Cần Trùng Khớp");
      return;
    }

    console.log(userId);
    const params = {
      userId: userId,
      password: newPassword,
    };

    const response = await UserAPI.postResetPassword(params);
    console.log(response);
    if (response.statusCode === 200) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.success(response.message);
      setNewPassword("");
      setconfirmNewPassword("");
      return;
    }
    if (response.statusCode === 422) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.error(response.message);

      return;
    }
  };

  // delete account
  const deleteAccountHandler = async (id) => {
    if (window.confirm("Bạn Có Chắc Chắn Muốn Người Dùng Này?")) {
      const params = {
        userId: id,
      };
      const query = "?" + queryString.stringify(params);
      const response = await UserAPI.deleteAccount(query);
      if (response.statusCode === 200) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div id="open_form_change_password" className="modal fade show">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="container">
                <div className="row">
                  <div className="col-md-7 p-4 mt-4 ">
                    <div className="d-flex justify-content-between mb-3">
                      <label>Mật Khẩu Mới</label>
                      <input
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                        type="password"
                        value={newPassword}
                      />
                    </div>
                    <div className="d-flex mb-3 justify-content-between">
                      <label>Xác Nhận Mật Khẩu Mới</label>
                      <input
                        onChange={(e) => {
                          setconfirmNewPassword(e.target.value);
                        }}
                        type="password"
                        value={confirmNewPassword}
                      />
                    </div>
                    <div className="d-flex justify-content-center ">
                      <button
                        onClick={resetPasswordHandler}
                        className="px-5 btn btn-dark round "
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                  <div className="col-md-5 d-flex justify-content-end ">
                    {" "}
                    <a
                      className="close p-4"
                      type="button"
                      href="#"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      ×
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Thống Kê Người Dùng
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
                    Quản Lý
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
                <h4 className="card-title">Người Dùng</h4>
                <input
                  className="form-control w-25"
                  type="text"
                  placeholder="Enter Search!"
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ Và Tên</th>
                        <th>Email</th>
                        <th>Số Điện Thoại</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users &&
                        users.map((value) => (
                          <tr key={value._id}>
                            <td>{value._id}</td>
                            <td>{value.fullname}</td>
                            <td>{value.email}</td>
                            <td>{value.phone}</td>
                            <td>
                              <a
                                onClick={() => {
                                  setUserId(value._id);
                                }}
                                href="#open_form_change_password"
                                data-toggle="modal"
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                              >
                                Đổi Mật Khẩu
                              </a>
                              &nbsp;
                              <a
                                onClick={() => {
                                  deleteAccountHandler(value._id);
                                }}
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-danger"
                              >
                                Xóa Tài Khoản
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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

export default Users;
