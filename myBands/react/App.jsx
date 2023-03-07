import { Suspense, useState, useEffect } from "react";
import "./App.css";
import Navigation from "./components/page/Navigation";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "./routes";
import Home from "./components/Home";
import Login from "./components/page/Login";
import { getCurrentUser, getUserById } from "./services/usersService";

var incrementer = 0;
const placeholder = "Admin";
const defaultUser = {
  id: "",
  firstName: "",
  avatarUrl: "",
  isLoggedIn: false,
  role: "",
};

function App() {
  const { state } = useLocation();
  const [user, setUser] = useState(defaultUser);
  const [login, setLogin] = useState(false);

  const getMappedRoutes = (routes) => {
    return routes.map((route) => {
      return (
        <Route
          key={`Route-${incrementer++}`}
          path={route.path}
          exact={route.exact}
          roles={route.roles}
          element={route.component}
        />
      );
    });
  };

  const mappedRoutes = getMappedRoutes(routes);

  const getFilteredRoutes = (mappedRoutes) => {
    return mappedRoutes.filter((mappedRoute) => {
      return mappedRoute.props.roles.find((role) => role === placeholder);
    });
  };

  const filteredRoutes = getFilteredRoutes(mappedRoutes);

  const onLogin = () => {
    setLogin(true);
  };

  const loginClose = () => {
    setLogin(false);
  };

  useEffect(() => {
    getCurrentUser().then(onGetCurrentUserSuccess).catch(onGetCurrentUserError);
  }, []);

  useEffect(() => {
    if (state?.type === "LOGIN_VIEW" && state?.payload) {
      setUser((prevState) => {
        return { ...prevState, ...state.payload };
      });
    }
  }, [state]);

  const onGetCurrentUserError = () => {
    setLogin(true);
  };

  const onGetCurrentUserSuccess = (response) => {
    let id = response.data.item.id;
    getUserById(id).then(onGetUserByIdSuccess).catch(onGetUserByIdError);
  };

  const onGetUserByIdError = (response) => {
    console.error(response);
  };

  const onGetUserByIdSuccess = (response) => {
    let user = response.data.item;
    setUser((prevState) => {
      const newUser = { ...prevState };
      newUser.id = user.id;
      newUser.firstName = user.firstName;
      newUser.avatarUrl = user.avatarUrl;
      newUser.isLoggedIn = user.isLoggedIn;
      newUser.role = user.role;
      return newUser;
    });
  };

  return (
    <>
      <Login show={login} handleClose={loginClose} />
      <Navigation
        firstName={user.firstName}
        isLoggedIn={user.isLoggedIn}
        avatarUrl={user.avatarUrl}
        onLogin={onLogin}
      />
      <Suspense>
        <Routes>
          {filteredRoutes.map((route) => {
            return (
              <Route
                key={route.key}
                path={route.props.path}
                element={<route.props.element />}
              />
            );
          })}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
