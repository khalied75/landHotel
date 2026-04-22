import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
// Placeholder pages — fill these in later
const Available = () => <main className="pt-24 text-center text-gray-600 text-2xl">Available Rooms — Coming Soon</main>;
const Contact   = () => <main className="pt-24 text-center text-gray-600 text-2xl">Contact — Coming Soon</main>;
const Rate      = () => <main className="pt-24 text-center text-gray-600 text-2xl">Rate Us — Coming Soon</main>;
 
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
