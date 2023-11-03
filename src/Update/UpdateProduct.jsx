import { useState } from "react";
import ProductAPI from "../API/ProductAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const UpdateProduct = () => {
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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [images, setImages] = useState();

  const { productId } = useParams();

  // get detail infor product to update
  useEffect(() => {
    const getDetailProduct = async () => {
      const response = await ProductAPI.getDetail(productId);

      setName(response.name);
      setPrice(response.price);
      setCategory(response.category);
      setShortDesc(response.short_desc);
      setLongDesc(response.long_desc);
      if (response.count > 0) {
        setQuantity(response.count);
      }
    };
    getDetailProduct();
  }, [productId]);

  const addProductHandler = (e) => {
    e.preventDefault();
    if (!userId) {
      return;
    }
    if (!productId) {
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

    const postAddProduct = async () => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("productId", productId);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("shortDesc", shortDesc);
      formData.append("longDesc", longDesc);
      formData.append("quantity", quantity);

      const response = await ProductAPI.postUpdateProduct(formData);

      if (response.statusCode === 200) {
        alertify.set("notifier", "position", "bottom-right");
        alertify.success(response.message);
        window.location.replace("/products");
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
                placeholder="Enter Product Name"
              />
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Enter Product Price"
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
                placeholder="Enter Category"
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
                placeholder="Enter Quantity"
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
                placeholder="Enter Short Description"
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
                placeholder="Enter Long Description"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlFile1">
                Bạn Không Thể Chỉnh Sửa Ảnh
              </label>
              <input
                disabled
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
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
