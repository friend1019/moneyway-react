import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RequireAuth from "./component/RequireAuth";
import Main from "./component/main/Main";
import LoginPage from "./component/login/LoginPage";
import MyPage from "./component/main/MyPage";
import Signup from "./component/login/Signup";
import Signin from "./component/login/Signin";
import ForgotPwd from "./component/login/ForgotPwd";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {<Route path="/" element={<Main />} />}
        {<Route path="/login" element={<LoginPage />} />}
        {<Route path="/signup" element={<Signup />} />}
        {<Route path="/signin" element={<Signin />} />}
        {<Route path="/forgot-pwd" element={<ForgotPwd />} />}

        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
