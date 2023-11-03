import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";

function DetailHistory(props) {
  const { orderId } = useParams();

  const [cart, setCart] = useState([]);

  const [information, setInformation] = useState();
  console.log(orderId);

  useEffect(() => {
    if (orderId) {
      const fetchData = async () => {
        const response = await HistoryAPI.getDetail(orderId);

        setCart(response.products);
        console.log(response);

        setInformation(response);
      };

      fetchData();
    }
  }, []);

  return (
    <div className="container">
      {information && (
        <div className="p-5">
          <h1 className="h2 text-uppercase">Thông Tin Chi Tiết Đơn Hàng</h1>
          <p>
            <strong>ID Người Dùng:</strong> {information.userId}
          </p>
          <p>
            <strong>Họ Và Tên:</strong> {information.fullname}
          </p>
          <p>
            <strong>Số Điện Thoại:</strong> {information.phone}
          </p>
          <p>
            <strong>Địa Chỉ:</strong> {information.address}
          </p>
          <p>
            <strong>Phương Thức Thanh Toán:</strong> {information.payment}
          </p>
          <p>
            <strong>Tổng Thanh Toán:</strong> {information.total}$
          </p>
          <p>
            <strong>Ngày Đặt Hàng:</strong> {information.date.slice(0, 10)}
          </p>
        </div>
      )}

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">
                  ID Sản Phẩm
                </strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Hình Ảnh</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">
                  Tên Sản Phẩm
                </strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Giá</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Số Lượng</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {cart &&
              cart.map((value) => (
                <tr className="text-center" key={value._id}>
                  <td className="align-middle border-0">
                    <h4 className="mb-0">{value.productId._id}</h4>
                  </td>
                  <td className="pl-0 border-0">
                    <div className="media align-items-center justify-content-center">
                      <Link
                        className="reset-anchor d-block animsition-link"
                        to={`/detail/${value.productId._id}`}
                      >
                        <img src={value.productId.img1} alt="..." width="200" />
                      </Link>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    <h4 className="mb-0">{value.productId.name}</h4>
                  </td>
                  <td className="align-middle border-0">
                    <h4 className="mb-0">{value.productId.price}</h4>
                  </td>
                  <td className="align-middle border-0">
                    <h4 className="mb-0">{value.quantity}</h4>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailHistory;
