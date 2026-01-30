import { useNavigate } from 'react-router-dom';
import {
    Users,
    CheckCircle2,
    GraduationCap,
    Heart,
} from 'lucide-react';
import Navbar from './Navbar';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-16">
            <Navbar />

            {/* Hero Section */}
            <header className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dream Job</span> <br />
                        or Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Opportunities</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Jobify connects professionals and top-tier employers seamlessly. Elevate your career or build your dream team today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button 
                            className="px-8 py-4 text-white font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
                            onClick={() => navigate('/jobs')}>
                            Find Jobs
                        </button>
                        <button 
                            className="px-8 py-4 text-slate-200 font-semibold rounded-full glass hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
                            onClick={() => navigate('/recruit')}>
                            Post Jobs
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-blue-400">Jobify</span>?</h2>
                        <p className="text-slate-400">Experience the future of recruitment.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="glass p-8 rounded-2xl md:hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Extensive Network</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Access thousands of premium job opportunities across top industries worldwide.
                            </p>
                        </div>
                        <div className="glass p-8 rounded-2xl md:hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                                <CheckCircle2 className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Verified Employers</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Connect with trusted companies and verified recruiters for safe hiring.
                            </p>
                        </div>
                        <div className="glass p-8 rounded-2xl md:hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition-colors">
                                <GraduationCap className="h-8 w-8 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Career Growth</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Find roles that match your skills and aspirations to accelerate your career.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16">What People Are Saying</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="glass p-8 rounded-2xl text-left relative">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-slate-300 mb-6 italic">
                                "Jobify helped me land my dream role in just a week! The interface is stunning and easy to use."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                                <div>
                                    <h3 className="font-bold text-slate-100">Priya Sharma</h3>
                                    <p className="text-xs text-blue-400">Software Engineer</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass p-8 rounded-2xl text-left relative">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-slate-300 mb-6 italic">
                                "Posting a job was so easy and I received quality applications fast. Highly recommended."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                                <div>
                                    <h3 className="font-bold text-slate-100">Rajesh Mehta</h3>
                                    <p className="text-xs text-blue-400">HR Manager</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass p-8 rounded-2xl text-left relative">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-slate-300 mb-6 italic">
                                "The smart matching feature saved me so much time. It felt like the jobs were picked just for me."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                                <div>
                                    <h3 className="font-bold text-slate-100">Aditi Kapoor</h3>
                                    <p className="text-xs text-blue-400">Product Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="glass border-t border-white/10 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Jobify</h2>
                            <p className="text-sm text-slate-500 mt-2">&copy; 2025 Jobify. All rights reserved.</p>
                        </div>
                        <div className="flex space-x-8">
                            <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;