import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      // localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="glass p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 relative z-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Welcome Back</h2>
        {error && <p className="text-red-400 text-center mb-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all transform ${isLoading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"}`}
          >
            {isLoading ? <span className="loader"></span> : "Login"}
          </button>
        </form>
        <p className="text-center mt-8 text-slate-400">
          Don&apos;t have an account? <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
