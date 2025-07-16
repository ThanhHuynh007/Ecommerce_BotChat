// import React, { Fragment, useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { routes } from './routes';
// import Default from './components/DefaultComponent/Default';
// import { isJsonString } from './utils';
// import { jwtDecode } from "jwt-decode";
// import { useDispatch, useSelector } from 'react-redux';
// import * as UserService from './services/UserService';
// import { updateUser } from './redux/slices/userSlide';
// import Loading from './components/LoadingComponent/Loading';

// function App() {
//   const dispatch = useDispatch()
//   const [isPending, setIsPending] = useState(false)
//   const user = useSelector((state) => state.user)

//   useEffect(() => {
//     setIsPending(true)
//     const { storageData, decoded } = handleDecoded()
//     if (decoded?.id) {
//       handleGetDetailsUser(decoded?.id, storageData)
//     }
//   }, [])

//   const handleDecoded = () => {
//     let storageData = localStorage.getItem('access_token')
//     let decoded = {}
//     if (storageData && isJsonString(storageData)) {
//       storageData = JSON.parse(storageData)
//       decoded = jwtDecode(storageData)
//     }
//     return { decoded, storageData }
//   }

//   UserService.axiosJWT.interceptors.request.use(async (config) => {
//     const currentTime = new Date()
//     const { decoded } = handleDecoded()
//     if (decoded?.exp < currentTime.getTime() / 1000) {
//       const data = await UserService.refreshToken()
//       config.headers['token'] = `Bearer ${data?.access_token}`
//     }
//     return config;
//   }, (err) => {
//     return Promise.reject(err)
//   })

//   const handleGetDetailsUser = async (id, token) => {
//     try {
//         const res = await UserService.getDetailsUser(id, token);
//         dispatch(updateUser({ ...res?.data, access_token: token }));
//         setIsPending(false)
//     } catch (err) {
//         console.error('Lỗi lấy thông tin người dùng:', err.response?.data || err.message);
//         localStorage.removeItem('access_token');
//         window.location.href = '/sign-in';
//     }
//   };

//   return (
//     <div>
//         <Loading isPending={isPending}>
//           <Router>
//             <Routes>
//               {routes.map((route) => {
//                 const Page = route.page;
//                 const ischeckAuth = !route.isPrivate || user.isAdmin
//                 const Layout = route.isShowHeader ? Default : Fragment
//                 return (
//                   <Route key={route.path} path={ischeckAuth && route.path} element={
//                     <Layout>
//                       <Page />
//                     </Layout>
//                   } />
//                 )
//               })}
//             </Routes>
//           </Router>
//         </Loading>
//     </div>
//   );
// }

// export default App;

import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Default from "./components/DefaultComponent/Default";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "./services/UserService";
import { updateUser } from "./redux/slices/userSlide";
import Loading from "./components/LoadingComponent/Loading";
import Chatbot from "./components/ChatBotComponent/ChatBotComponent";

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsPending(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsPending(false);
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (err) {
      console.error(
        "Lỗi lấy thông tin người dùng:",
        err.response?.data || err.message
      );
      localStorage.removeItem("access_token");
      window.location.href = "/sign-in";
    }
  };

  return (
    <div>
      <Loading isPending={isPending}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader ? Default : Fragment;

              // Chỉ render Route nếu isCheckAuth là true
              if (!isCheckAuth) return null;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: "360px",
          maxHeight: "80vh",
        }}
      >
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
