import { useState } from "react";
import ProductAPI from "../API/ProductAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const NewProduct = () => {
  const userId = localStorage.getItem("id_user");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState();

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

  const addProductHandler = (e) => {
    e.preventDefault();

    const postAddProduct = async () => {
      if (!userId) {
        return;
      }
      if (!name) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Nhập Tên Sản Phẩm");
        return;
      }
      if (!price) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Nhập Giá Của Sản Phẩm");
        return;
      }
      if (!category) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Nhập Thể Loại Của Sản Phẩm");
        return;
      }
      if (!shortDesc) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Nhập Mô Tả Ngắn Về Sản Phẩm");
        return;
      }
      if (!longDesc) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Nhập Mô Tả Chi Tiết Về Sản Phẩm");
        return;
      }
      if (!images) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Hãy Chọn 4 Hình Ảnh Của Sản Phẩm");
        return;
      }
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("shortDesc", shortDesc);
      formData.append("longDesc", longDesc);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const response = await ProductAPI.postAddProduct(formData);

      if (response.statusCode === 200) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.success(response.message);
        setName("");
        setPrice("");
        setCategory("");
        setShortDesc("");
        setLongDesc("");
        setQuantity("");

        return;
      }
      if (response.statusCode === 422 || response.statusCode === 401) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error(response.message);
        return;
      }
    };
    postAddProduct();
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            onSubmit={addProductHandler}
            style={{ width: "50%", marginLeft: "40px" }}
            encType="multipart/form-data"
          >
            <div className="form-group">
              <label>Tên Sản Phẩm</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="form-group">
              <label>Giá Sản Phẩm</label>
              <input
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Nhập mức giá"
              />
            </div>
            <div className="form-group">
              <label>Thể Loại</label>
              <input
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Nhập thể loại"
              />
            </div>
            <div className="form-group">
              <label>Số Lượng</label>
              <input
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Nhập số lượng"
              />
            </div>
            <div className="form-group">
              <label>Mô Tả Ngắn</label>
              <textarea
                value={shortDesc}
                onChange={(e) => {
                  setShortDesc(e.target.value);
                }}
                className="form-control"
                rows="3"
                placeholder="Nhập mô tả ngắn"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Mô Tả Chi Tiết</label>
              <textarea
                value={longDesc}
                onChange={(e) => {
                  setLongDesc(e.target.value);
                }}
                className="form-control"
                rows="6"
                placeholder="Nhập mô tả chi tiết"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlFile1">
                Tải Lên Hình Ảnh (4 Hình Ảnh)
              </label>
              <input
                onChange={(e) => {
                  setImages(e.target.files);
                }}
                type="file"
                className="form-control-file"
                id="exampleFormControlFile1"
                multiple
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Xác Nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
