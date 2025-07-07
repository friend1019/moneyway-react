import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Search from "./component/search/SearchMain";
import RequireAuth from "./component/RequireAuth";
import Main from "./component/main/Main";
import LoginPage from "./component/login/LoginPage";
import MyPage from "./component/main/MyPage";
import Signup from "./component/login/Signup";
import Signin from "./component/login/Signin";
import ForgotPwd from "./component/login/ForgotPwd";
import EmailCode from "./component/login/EmailCode";
import ResetPassword from "./component/login/ResetPassword";

import AIPeriod from './component/aiplan/AIPeriod';
import AIPeople from './component/aiplan/AIPeople';
import AIName from './component/aiplan/AIName';
import AIBudget from "./component/aiplan/AIBudget";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {<Route path="/" element={<Main />} />}
        {<Route path="/login" element={<LoginPage />} />}
        {<Route path="/signup" element={<Signup />} />}
        {<Route path="/signin" element={<Signin />} />}
        {<Route path="/forgot-pwd" element={<ForgotPwd />} />}
        {<Route path="/emailcode" element={<EmailCode />} />}
        {<Route path="/resetpassword" element={<ResetPassword />} />}

        <Route
          path="/mypage"
          element={
            // <RequireAuth>
              <MyPage />
            //</RequireAuth>
          }
        />
        {<Route path="/search" element={<Search />} />}
        {<Route path="/aiplan" element={<AIBudget />} />}
        {<Route path="/ai-period" element={<AIPeriod />} />}
        {<Route path="/ai-people" element={<AIPeople />} />}
        {<Route path="/ai-name" element={<AIName />} />}
      </Routes>
    </Router>
  );
}

export default AppRouter;
