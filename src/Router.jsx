import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./component/main/main";
import LoginPage from "./component/login/LoginPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {<Route path="/" element={<Main />} />}
        {<Route path="/login" element={<LoginPage />} />}
      </Routes>
    </Router>
  );
}

export default AppRouter;
