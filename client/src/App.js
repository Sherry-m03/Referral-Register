import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import Register from "./components/Register.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register/*" element={<Register />} />
          <Route path="profile/*" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
