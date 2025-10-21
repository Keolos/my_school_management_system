import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" type="text" placeholder="Full Name" />
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link className="text-blue-600" to="/">Login</Link>
      </p>
    </div>
  );
}
