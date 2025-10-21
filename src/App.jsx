import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentPortal from "./pages/StudentPortal";
import TeacherPortal from "./pages/TeacherPortal";
import AdminPortal from "./pages/AdminPortal";
import RegistrarPortal from "./pages/RegistrarPortal";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/teacher" element={<TeacherPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/registrar" element={<RegistrarPortal />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
