import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPortal from "./pages/AdminPortal";
import TeacherPortal from "./pages/TeacherPortal";
import StudentPortal from "./pages/StudentPortal";
import RegistrarPortal from "./pages/RegistrarPortal";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">
        My School Management System
      </h1>
      <p className="text-gray-600 mb-6">
        A platform built under the Ghana Education Service standard
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Login
        </Link>
        <Link to="/signup" className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-100">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/teacher" element={<TeacherPortal />} />
        <Route path="/student" element={<StudentPortal />} />
        <Route path="/registrar" element={<RegistrarPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
