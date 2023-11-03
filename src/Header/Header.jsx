import React from "react";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

import Logoicon from "../Image/logo-icon.png";
import Logotext from "../Image/logo-text.png";

import { useState, useEffect } from "react";
import UserAPI from "../API/UserAPI";

const userId = localStorage.getItem("id_user");
function Header(props) {
  const { loading, error, dispatch } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const response = await UserAPI.getDetailData(userId);
      setName(response.name);
      setRole(response.role);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch("LOGOUT");
  };

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md">
        <div className="navbar-header" data-logobg="skin6">
          <a
            className="nav-toggler waves-effect waves-light d-block d-md-none"
            href="#"
          >
            <i className="ti-menu ti-close"></i>
          </a>
          <div className="navbar-brand">
            <a href="/">
              <b className="logo-icon">
                <img src={Logoicon} alt="homepage" className="dark-logo" />
              </b>
              <span className="logo-text">
                <img src={Logotext} alt="homepage" className="dark-logo" />
              </span>
            </a>
          </div>
        </div>
        {userId && (
          <div className="navbar-collapse collapse" id="navbarSupportedContent">
            <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
              <li className="nav-item dropdown">
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav float-right">
              <li className="nav-item dropdown show">
                <a
                  className="nav-link dropdown-toggle"
                  id="dropdownMenuLink"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src="../assets/images/AdminAVT.jpg"
                    alt="user"
                    className="rounded-circle"
                    width="40"
                  />
                  <span className="ml-2 d-none d-lg-inline-block">
                    <span>{`Xin Chào ${role} `}</span>{" "}
                    <span className="text-dark">{name ? name : ""}</span>{" "}
                    <i data-feather="chevron-down" className="svg-icon"></i>
                  </span>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right user-dd animated flipInY"
                  aria-labelledby="dropdownMenuLink"
                >
                  <a
                    href="/login"
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i data-feather="power" className="svg-icon mr-2 ml-1"></i>
                    Đăng Xuất
                  </a>
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
