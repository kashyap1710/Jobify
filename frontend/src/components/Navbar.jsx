import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Briefcase, PlusCircle, User, LogOut } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/home");
        window.location.reload(); 
    };

    return (
        <header className="fixed w-full top-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h1
                            className="ml-3 text-3xl font-bold font-sans cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight"
                            onClick={() => navigate('/home')}
                        >
                            Jobify
                        </h1>
                    </div>

                    <div className="hidden md:flex space-x-6 items-center absolute left-1/2 transform -translate-x-1/2">
                        <button
                            className="group flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-300"
                            onClick={() => navigate('/jobs')}
                        >
                            <div className="p-1.5 rounded-lg bg-white/5 mr-2 group-hover:bg-blue-500/20 transition-colors">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                            </div>
                            Browse Jobs
                        </button>

                        {
                            user ? (
                                user.data?.roleName === "EMPLOYER" && (
                                    <button
                                        className="group flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-300"
                                        onClick={() => navigate('/recruit')}
                                    >
                                        <div className="p-1.5 rounded-lg bg-white/5 mr-2 group-hover:bg-purple-500/20 transition-colors">
                                            <PlusCircle className="w-5 h-5 text-purple-400" />
                                        </div>
                                        Post a Job
                                    </button>
                                )
                            ) : (
                                <button
                                    className="group flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-300"
                                    onClick={() => navigate('/recruit')}
                                >
                                    <div className="p-1.5 rounded-lg bg-white/5 mr-2 group-hover:bg-purple-500/20 transition-colors">
                                        <PlusCircle className="w-5 h-5 text-purple-400" />
                                    </div>
                                    Post a Job
                                </button>
                            )
                        }
                    </div>

                    <div className="flex space-x-4 items-center">
                        {user ? (
                            <>
                                <button
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-200 border border-white/10 hover:bg-white/5 transition-all"
                                    onClick={() => navigate('/profile')}
                                >
                                    <User className="w-4 h-4 mr-2 text-slate-400" />
                                    Profile
                                </button>

                                <button
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>

                                <button
                                    className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
