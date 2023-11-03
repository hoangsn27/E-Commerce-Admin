import React, { useEffect, useState } from "react";
import HistoryAPI from "../API/HistoryAPI";
import alertify from "alertifyjs";

import io from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ["websocket"] });

function History(props) {
  const [history, setHistory] = useState([]);

  const [load, setLoad] = useState(false);

  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await HistoryAPI.getAll();

      setHistory(response);
    };

    fetchData();
  }, []);

  //Hàm này dùng để nhận socket từ server gửi lên
  useEffect(() => {
    //Nhận dữ liệu từ server gửi lên thông qua socket với key receive_order
    socket.on("receive_order", (data) => {
      alertify.set("notifier", "position", "bottom-right");
      alertify.success(`Người Dùng: ${data} Vừa Đặt Hàng`);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    });
  }, []);

  //hàm này dùng để xác nhận đơn đặt hàng:
  const confirmOrderHandler = (data) => {
    console.log(data);
    socket.emit("confirm_order", data);
    window.location.reload();
  };
  const cancleOrderHandler = (data) => {
    console.log(data);
    socket.emit("cancle_order", data);
    window.location.reload();
  };
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Thống Kê Đơn Hàng
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      Quản Lý
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Đơn Hàng
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
                <h4 className="card-title">Đơn Hàng</h4>

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
                        <th>ID Người Dùng</th>
                        <th>Tên</th>
                        <th>Số Điện Thoại</th>
                        <th>Địa Chỉ</th>
                        <th>Tổng Thanh Toán</th>
                        <th>Phương Thức Thanh Toán</th>
                        <th>Ngày Đặt Hàng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                        <th>Chi Tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history &&
                        history.map((value) => (
                          <tr key={value._id}>
                            <td>{value.userId}</td>
                            <td>{value.fullname}</td>
                            <td>{value.phone}</td>
                            <td>{value.address}</td>
                            <td>{value.total}</td>
                            <td>{value.payment}</td>
                            <td>{value.date.slice(0, 10)}</td>
                            <td>
                              {value.status === 1
                                ? " Xác Nhận"
                                : `Chờ Xác Nhận`}
                              {value.status === 1 && (
                                <svg
                                  width="30px"
                                  height="30px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></g>
                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path
                                      opacity="0.4"
                                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                      fill="#12dd0e"
                                    ></path>{" "}
                                    <path
                                      d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                                      fill="#12dd0e"
                                    ></path>{" "}
                                  </g>
                                </svg>
                              )}
                            </td>
                            <td>
                              {value.status === 0 && (
                                <a
                                  style={{
                                    cursor: "pointer",
                                    color: "white",
                                  }}
                                  className="btn btn-success"
                                  onClick={() => {
                                    confirmOrderHandler(value._id);
                                  }}
                                >
                                  Xác Nhận
                                </a>
                              )}
                              {value.status === 1 && (
                                <a
                                  onClick={() => {
                                    cancleOrderHandler(value._id);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "white",
                                  }}
                                  className="btn btn-error"
                                >
                                  Hủy
                                </a>
                              )}
                            </td>
                            <td>
                              <a
                                href={`/detail/${value._id}`}
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                              >
                                Xem
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

export default History;
