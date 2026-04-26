import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Rate from "./pages/Rate";

const Available = () => <main className="pt-24 text-center text-2xl text-gray-600">Available Rooms - Coming Soon</main>;
const Contact = () => <main className="pt-24 text-center text-2xl text-gray-600">Contact - Coming Soon</main>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="available" element={<Available />} />
          <Route path="contact" element={<Contact />} />
          <Route path="rate" element={<Rate />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
