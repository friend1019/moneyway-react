import { Routes, Route } from "react-router-dom";

import Search from "./component/search/SearchMain";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./component/main/Main";
import LoginPage from "./component/login/LoginPage";
import MyPage from "./component/mypage/MyPage";
import Signup from "./component/login/Signup";
import Signin from "./component/login/Signin";
import ForgotPwd from "./component/login/ForgotPwd";
import EmailCode from "./component/login/EmailCode";
import ResetPassword from "./component/login/ResetPassword";
import ChangePassword from "./component/login/ChangePassword";

import AIPeriod from "./component/aiplan/AIPeriod";
import AIPeople from "./component/aiplan/AIPeople";
import AIName from "./component/aiplan/AIName";
import AIBudget from "./component/aiplan/AIBudget";
import MyPlanPage from "./component/myplan/MyPlanPage";
import CartMain from "./component/shopping/CartMain";
import PlanList from "./component/common/PlanList";
import CreatePlan from "./component/aiplan/CreatePlan";
import CommunityMain from "./component/community/CommunityMain";
import PostCreate from "./component/community/PostCreate";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-pwd" element={<ForgotPwd />} />
      <Route path="/emailcode" element={<EmailCode />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/search" element={<Search />} />
      <Route path="/aiplan" element={<AIBudget />} />
      <Route path="/ai-period" element={<AIPeriod />} />
      <Route path="/ai-people" element={<AIPeople />} />
      <Route path="/ai-name" element={<AIName />} />
      
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />

       
      <Route
        path="/myplan"
        element={
          <ProtectedRoute>
            <MyPlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartMain />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planlist"
        element={
          <ProtectedRoute>
            <PlanList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-plan"
        element={
          <ProtectedRoute>
            <CreatePlan />
          </ProtectedRoute>
        }
      />
      <Route path="/community" element={<CommunityMain />} />
      <Route path="/community/create" element={<PostCreate />} />
    </Routes>
  );
}

export default AppRouter;
