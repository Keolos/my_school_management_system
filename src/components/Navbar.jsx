import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">My School Management System</h1>
      <div className="space-x-4">
        <Link to="/">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}
