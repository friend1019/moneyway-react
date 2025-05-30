import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginTest from "./component/login/LoginTestPage";
import LoginPage from "./component/login/LoginPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {<Route path="/logintest" element={<LoginTest />} />}
        {<Route path="/login" element={<LoginPage />} />}
      </Routes>
    </Router>
  );
}

export default AppRouter;
