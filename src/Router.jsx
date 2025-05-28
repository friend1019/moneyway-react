import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginTestPage from "./component/login/login-testPage";


function AppRouter() {
  return (
    <Router>
      <Routes>
        {<Route path="/logintest" element={<LoginTest />} />}
      </Routes>
    </Router>
  );
}

export default AppRouter;