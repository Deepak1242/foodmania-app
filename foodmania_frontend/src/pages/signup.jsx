import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const FormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const user = {
      email,
      password,
      firstName,
      lastName
    };
    
    try {
      const response = await axios.post("http://localhost:8000/api/auth/signin", user);
      
      if (response.status === 201) {
        console.log("Successful signup");
        // After successful signup, redirect to login page
        navigator("/login");
      } else {
        console.log("Signup failed with status:", response.status);
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        setError(error.response.data.message || "Signup failed. Please try again.");
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
      <h1 className="absolute text-[14rem] w-full text-center  md:text-[18rem] font-main text-white/10 top-[-3rem] md:top-[-3rem] left-1/2 -translate-x-1/2 z-0 select-none pointer-events-none">
        SIGN UP
      </h1>

      {/* Form Container */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl z-10">
        <h2 className="text-5xl font-main text-amber-400 text-center mb-8">Sign Up</h2>
        
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
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 px-4 py-3 bg-transparent border border-white rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 px-4 py-3 bg-transparent border border-white rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center">Already have an account? <Link className="text-amber-400" to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
