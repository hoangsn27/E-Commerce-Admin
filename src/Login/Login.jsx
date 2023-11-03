import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";
import queryString from "query-string";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const { loading, error, dispatch } = useContext(AuthContext);
  // const navigate = useNavigate();

  const handleSubmit = () => {
    const fetchData = async () => {
      const params = { email: email, password: password };

      const query = "?" + queryString.stringify(params);

      const response = await UserAPI.postLogin(query);
      console.log(response);

      if (response.statusCode === 200) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("id_user", response.userId);
        const timeRemaining = 1000 * 60 * 60 * 3;
        const expiryDate = new Date(new Date().getTime() + timeRemaining);
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        window.location.replace("/");
      }
      if (response.statusCode === 422 || response.statusCode === 401) {
        setErrorMessage(response.message);
      }
      return console.log(response);
    };

    fetchData();
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading border rounded">
              <h2>Đăng Nhập</h2>
              {errorMessage && (
                <div>
                  <p className="text-danger">*{errorMessage}</p>
                </div>
              )}
              <form>
                <div className="input-group input-group-lg ">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group input-group-lg ">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border"
                    placeholder="Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="button" className="float" onClick={handleSubmit}>
                  Đăng Nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
