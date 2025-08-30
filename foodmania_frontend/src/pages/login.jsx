import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetAtom } from "jotai";
import { loginState } from "../atom/atom.js";

function Login() {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Move this to the top level of the component
  const setLoginState = useSetAtom(loginState);

  const FormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const user = {
      email,
      password,
    };

    try {
      // Make API call to backend
      const response = await axios.post("http://localhost:8000/api/auth/login", user, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        console.log("Login successful", response.data);
        
        // Set login state
        setLoginState({
          isLogin: true,
          user: response.data.user,
          loading: false
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('loginState', JSON.stringify({
          isLogin: true,
          user: response.data.user,
          loading: false
        }));
        
        // Navigate to dishes page on successful login
        navigator("/dishes");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed. Please try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d327b] text-white font-fancy flex items-center justify-center relative px-6 py-16">
      
      {/* Big backdrop text */}
      <h1 className="absolute w-full text-center text-[14rem] md:text-[18rem] font-main text-white/10 top-[-3rem] md:top-[-3rem] left-1/2 -translate-x-1/2 z-0 select-none pointer-events-none">
        LOGIN
      </h1>

      {/* Form Container */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl z-10">
        <h2 className="text-5xl font-main text-amber-400 text-center mb-8">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={FormSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-transparent border border-white rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-transparent border border-white rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-amber-400 text-[#0d327b] font-bold py-3 rounded-xl hover:bg-amber-300 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center">New Here? try <Link className="text-amber-400" to="/signup">Signup</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Login;