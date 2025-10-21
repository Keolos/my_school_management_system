import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
      <p className="text-center mt-4">
        New user? <Link className="text-blue-600" to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
