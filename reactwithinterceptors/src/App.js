import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Home from "./pages/homepage/home";
import { AuthProvider } from "./utils/provider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
