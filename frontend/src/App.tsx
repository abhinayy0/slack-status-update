import React, { useState } from "react";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// const LoginPage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = () => {
//     // Call to Express API to validate login
//     // If successful, set isLoggedIn to true
//     setIsLoggedIn(true);
//   };

//   return (
//     <div>
//       <button onClick={handleLogin}>Login</button>
//       {isLoggedIn && <Redirect to="/homepage" />}
//     </div>
//   );
// };

// const HomePage = () => <h1>Home Page</h1>;

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
  </Router>
);

export default App;
