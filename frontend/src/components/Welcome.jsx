import { useNavigate } from 'react-router-dom';
// import React from 'react';
import {
    Users,
    CheckCircle2,
    GraduationCap,
    Heart,
} from 'lucide-react';
import Navbar from './Navbar';

function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-16 relative overflow-hidden">
            <Navbar></Navbar>
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
                {/* Random Blobs */}
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow transform-gpu"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow transform-gpu" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <header className="relative py-24 sm:py-32 text-center text-white z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight animate-fade-in">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dream Job</span> <br />
                        or Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Opportunities</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto animate-slide-up">
                        Jobify connects professionals and employers seamlessly with advanced matching and a premium experience.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95"
                            onClick={() => navigate('/jobs')}>
                            Find Jobs
                        </button>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95"
                            onClick={() => navigate('/recruit')}>
                            Post Jobs
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">Why Choose Jobify?</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                            <Users className="h-12 w-12 text-blue-400 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-100 mb-3">Extensive Network</h3>
                            <p className="text-slate-400">
                                Access thousands of job opportunities across industries connecting you with the best.
                            </p>
                        </div>
                        <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                            <CheckCircle2 className="h-12 w-12 text-purple-400 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-100 mb-3">Verified Employers</h3>
                            <p className="text-slate-400">
                                Work with trusted companies and verified recruiters ensuring safety and reliability.
                            </p>
                        </div>
                        <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-pink-500/20"></div>
                            <GraduationCap className="h-12 w-12 text-pink-400 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-100 mb-3">Career Growth</h3>
                            <p className="text-slate-400">
                                Find roles that match your skills and aspirations to accelerate your career trajectory.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">What People Are Saying</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="glass p-8 rounded-2xl relative text-left">
                            <Heart className="h-8 w-8 text-red-500 mb-4" />
                            <p className="text-slate-300 mb-6 italic">
                                &quot;Jobify helped me land my dream role in just a week! The interface is simply stunning and easy to use.&quot;
                            </p>
                            <h3 className="font-bold text-slate-100">- Priya Sharma</h3>
                        </div>
                        <div className="glass p-8 rounded-2xl relative text-left">
                            <Heart className="h-8 w-8 text-red-500 mb-4" />
                            <p className="text-slate-300 mb-6 italic">
                                &quot;Posting a job was so easy and I received quality applications fast. Highly recommended for recruiters.&quot;
                            </p>
                            <h3 className="font-bold text-slate-100">- Rajesh Mehta</h3>
                        </div>
                        <div className="glass p-8 rounded-2xl relative text-left">
                            <Heart className="h-8 w-8 text-red-500 mb-4" />
                            <p className="text-slate-300 mb-6 italic">
                                &quot;The smart matching feature saved me so much time. I found exactly what I was looking for.&quot;
                            </p>
                            <h3 className="font-bold text-slate-100">- Aditi Kapoor</h3>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="glass border-t border-white/10 py-12 mt-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-slate-400">
                        <p className="text-sm">&copy; 2025 Jobify. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm hover:text-white transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Welcome;