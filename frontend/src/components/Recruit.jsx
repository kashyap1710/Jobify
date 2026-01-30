import { useState } from 'react';
import {
    Briefcase,
    DollarSign,
    MapPin,
    Clock,
    Building2,
    GraduationCap,
    Users,
    CheckCircle2
} from 'lucide-react';
import Navbar from './Navbar';
import { postNewJob } from '../api/api';

function Recruit() {
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experience: 'entry',
        description: '',
        requirements: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (!user || user.data.roleName !== "EMPLOYER") {
            alert("Only employers can post jobs.");
            return;
        }
    
        const jobData = {
            ...formData,
            employerId: user.data.id 
        };
        
        try {
            const response = await postNewJob(jobData);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Job posted successfully:', result);
    
                setFormData({
                    jobTitle: '',
                    company: '',
                    location: '',
                    salary: '',
                    jobType: 'full-time',
                    experience: 'entry',
                    description: '',
                    requirements: '',
                });
    
                alert('Job posted successfully!');
            } else {
                console.error('Failed to post job:', response.statusText);
                alert('Failed to post job. Please try again.');
            }
        } catch (error) {
            console.error('Error while posting job:', error);
            alert('An error occurred. Please try again.');
        }
    }; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen pt-16">
            <Navbar></Navbar>
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
                <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="glass rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">Post a New Job</h2>

                        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="flex items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex-shrink-0 bg-blue-500/10 p-3 rounded-xl">
                                    <Users className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-slate-200">Reach Candidates</h3>
                                    <p className="mt-1 text-sm text-slate-400">Connect with professionals actively seeking opportunities.</p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex-shrink-0 bg-purple-500/10 p-3 rounded-xl">
                                    <CheckCircle2 className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-slate-200">Easy Management</h3>
                                    <p className="mt-1 text-sm text-slate-400">Track applications and manage candidates efficiently.</p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex-shrink-0 bg-pink-500/10 p-3 rounded-xl">
                                    <GraduationCap className="h-6 w-6 text-pink-400" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-slate-200">Smart Matching</h3>
                                    <p className="mt-1 text-sm text-slate-400">AI-powered matching to find the best candidates.</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div>
                                    <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-300 mb-2">
                                        Job Title
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            id="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                            placeholder="e.g. Senior Software Engineer"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="company"
                                            id="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                            placeholder="Your Company Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                            placeholder="e.g. San Francisco, CA"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="salary" className="block text-sm font-medium text-slate-300 mb-2">
                                        Salary Range
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="salary"
                                            id="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                            placeholder="e.g. $80,000 - $120,000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="jobType" className="block text-sm font-medium text-slate-300 mb-2">
                                        Job Type
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <select
                                            name="jobType"
                                            id="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer [&>option]:bg-slate-800 appearance-none"
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-slate-300 mb-2">
                                        Experience Level
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <GraduationCap className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <select
                                            name="experience"
                                            id="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer [&>option]:bg-slate-800 appearance-none"
                                        >
                                            <option value="entry">Entry Level</option>
                                            <option value="mid">Mid Level</option>
                                            <option value="senior">Senior Level</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                                    Job Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                        placeholder="Describe the role, responsibilities, and ideal candidate..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="requirements" className="block text-sm font-medium text-slate-300 mb-2">
                                    Requirements
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        rows={4}
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                                        placeholder="List the required skills, qualifications, and experience..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Post Job Opportunity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Recruit;