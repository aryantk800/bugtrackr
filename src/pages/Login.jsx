import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 w-full">Login</button>
        <p className="text-sm mt-2">
          Don't have an account? <a href="/register" className="text-blue-500 underline">Register</a>
        </p>
      </form>
    </div>
  );
}
