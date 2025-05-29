import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from "./component/main/main";


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;