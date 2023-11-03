import { BrowserRouter, Route, Switch } from "react-router-dom";
import { lazy } from "react";
// import Chat from "./Chat/Chat";
import Header from "./Header/Header";
// import History from "./History/History";
// import Home from "./Home/Home";
// import Menu from "./Menu/Menu";
// import Products from "./Products/Products";
// import Users from "./Users/Users";
// import Login from "./Login/Login";
// import NewProduct from "./New/NewProduct";
// import UpdateProduct from "./Update/UpdateProduct";
// import DetailHistory from "./History/DetailHistory";

const Chat = lazy(() => import("./Chat/Chat"));
const History = lazy(() => import("./History/History"));
const Home = lazy(() => import("./Home/Home"));
const Menu = lazy(() => import("./Menu/Menu"));
const Products = lazy(() => import("./Products/Products"));
const Users = lazy(() => import("./Users/Users"));
const Login = lazy(() => import("./Login/Login"));
const NewProduct = lazy(() => import("./New/NewProduct"));
const UpdateProduct = lazy(() => import("./Update/UpdateProduct"));
const DetailHistory = lazy(() => import("./History/DetailHistory"));

import { AuthContextProvider } from "./Context/AuthContext";
import { useEffect } from "react";

function App() {
  // select expiryDate to check token is still valid
  const expiryDate = localStorage.getItem("expiryDate");

  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <div
            id="main-wrapper"
            data-theme="light"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
            data-boxed-layout="full"
          >
            <Header />

            {expiryDate && <Menu />}

            <Switch>
              <Route exact path="/" component={Home} />
              {expiryDate && <Route path="/chat" component={Chat} />}
              {expiryDate && <Route path="/products" component={Products} />}
              {expiryDate && <Route path="/history" component={History} />}
              {expiryDate && (
                <Route path="/detail/:orderId" component={DetailHistory} />
              )}
              {!expiryDate && <Route path="/login" component={Login} />}
              {expiryDate && <Route path="/new" component={NewProduct} />}
              {expiryDate && <Route path="/users" component={Users} />}
              {expiryDate && (
                <Route path="/update/:productId" component={UpdateProduct} />
              )}
            </Switch>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
