import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",  
        password: "",
        roleName: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // console.log("Form Data before sending:", formData); 
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await registerUser(formData);
            // console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err) {
            console.error("Error registering user:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="flex justify-center items-center min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="glass p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 relative z-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Create Account</h2>
        {error && <p className="text-red-400 text-center mb-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors placeholder-slate-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors placeholder-slate-500"
              placeholder="john@example.com"
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-2">I am a...</label>
            <select
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors cursor-pointer [&>option]:bg-slate-800"
              required
            >
              <option value="">Select Role</option>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all transform mt-4 ${isLoading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"}`}
          >
            {isLoading ? <span className="loader"></span> : "Register"}
          </button>
        </form>
        <p className="text-center mt-8 text-slate-400">
          Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
