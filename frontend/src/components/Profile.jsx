import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiFileText, FiCheck, FiX, FiUpload, FiDownload, FiUser } from "react-icons/fi";
import { fetchPostedJobs, fetchApplicants, deleteJob, updateJob, uploadResume, updateApplicationStatus, fetchUserByEmail } from "../api/api";
import { toast } from "react-toastify";

const Profile = () => {
    // Note: We need to properly manage user state. localStorage "user" might be stale if resume is updated.
    // Ideally we should fetch user profile on mount. 
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")) || {});
    // handle case where userData exists but data property is missing or empty
    const user = userData.data || {};

    const [postedJobs, setPostedJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState("");

    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editJobData, setEditJobData] = useState({
        id: "",
        jobTitle: "",
        roleName: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
        experience: "",
        jobType: "",
    });
    
    // Resume state
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Refresh user data function
    const refreshUser = async () => {
        if(user.email){
             try{
                 const res = await fetchUserByEmail(user.email);
                 if (res.ok) {
                     const data = await res.json();
                     const updatedData = { ...userData, data: data };
                     setUserData(updatedData);
                     localStorage.setItem("user", JSON.stringify(updatedData));
                 }
             } catch(e) { console.error("Refresh user failed", e)}
        }
    }

    useEffect(() => {
        if (user.email) {
            refreshUser();
        }
    }, []);

    useEffect(() => {
        const loadPostedJobs = async () => {
            try {
                const response = await fetchPostedJobs(user.id);
                const jobs = response.data;

                if (Array.isArray(jobs)) {
                    setPostedJobs(jobs);
                } else {
                    console.error("Expected an array but got:", jobs);
                    setPostedJobs([]);
                }
            } catch (error) {
                console.error("Error fetching posted jobs:", error);
            }
        };

        if (user.roleName === "EMPLOYER") {
            loadPostedJobs();
        }
    }, [user.id, user.roleName]);

    // Check if user data is valid
    useEffect(() => {
        if (!user.email) {
            // Auto-clear invalid session
            localStorage.removeItem("user");
        }
    }, [user.email]);

    if (!user.email) {
         return (
            <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
                <Navbar />
                 <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
                </div>
                <div className="glass p-10 rounded-2xl shadow-2xl text-center border border-white/10 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Session Expired</h2>
                    <p className="text-slate-400 mb-8">Redirecting to login...</p>
                    <button 
                        onClick={() => {
                             window.location.href = "/login";
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        Click here if not redirected
                    </button>
                </div>
            </div>
        );
    }

    const handleApplicantsClick = async (jobId, jobTitle) => {
        try {
            const res = await fetchApplicants(jobId);
            if (!res.ok) throw new Error("Failed to fetch applicants");

            const data = await res.json();
            setApplicants(data);
            setSelectedJobTitle(jobTitle);
            setShowModal(true);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
            toast.error("Failed to fetch applicants");
        }
    };
    
    const handleApplicantSelect = (applicant) => {
        setSelectedApplicant(applicant);
        setShowApplicantDetails(true);
    };
    
    const handleStatusUpdate = async (status) => {
        if (!selectedApplicant) return;
        try {
            await updateApplicationStatus(selectedApplicant.applicationId, status);
            toast.success(`Application ${status.toLowerCase()}! Email sent.`);
            
            // Update local state
            setApplicants(prev => prev.map(app => 
                app.applicationId === selectedApplicant.applicationId ? { ...app, status } : app
            ));
            
            // Close details modal
            setShowApplicantDetails(false);
            
        } catch (error) {
            console.error("Update status failed", error);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await deleteJob(jobId);
            setPostedJobs((prev) => prev.filter((job) => job.id !== jobId));
            toast.success("Job deleted");
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete the job.");
        }
    };

    const handleUpdateJob = (job) => {
        setEditJobData({
            id: job.id,
            jobTitle: job.jobTitle,
            roleName: job.roleName,
            location: job.location || "",
            salary: job.salary || "",
            description: job.description || "",
            requirements: job.requirements || "",
            experience: job.experience || "entry",
            jobType: job.jobType || "Full time",
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditJobData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateJob(editJobData.id, editJobData);
            toast.success("Job updated successfully!");
            setShowEditModal(false);

            const res = await fetchPostedJobs(user.id);
            setPostedJobs(res.data);
        } catch (err) {
            console.error("Failed to update job:", err);
            toast.error("Failed to update job.");
        }
    };
    
    // Resume Upload Handler
    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if(!resumeFile) return;
        
        setIsUploading(true);
        try {
            await uploadResume(user.id, resumeFile);
            toast.success("Resume uploaded successfully!");
            
            await refreshUser(); // Fetch updated user with new resume link
            setResumeFile(null);
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Failed to upload resume.");
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="min-h-screen pt-16 relative overflow-hidden">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
                <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow transform-gpu"></div>
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow transform-gpu" style={{ animationDelay: '2s' }}></div>
            </div>

            <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
                <div className="glass rounded-3xl shadow-2xl p-8 border border-white/10">
                    <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">My Profile</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-white/5 p-6 rounded-2xl border border-white/5 data-card">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Full Name</p>
                            <p className="text-slate-100 text-xl font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Email Address</p>
                            <p className="text-slate-100 text-xl font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Account Role</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.roleName === 'EMPLOYER' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                {user.roleName}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Member Since</p>
                            <p className="text-slate-100 text-xl font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {user.roleName === "JOB_SEEKER" ? (
                        <>  
                            {/* Resume Section */}
                            <div className="mb-12">
                                 <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm"><FiFileText /></span>
                                    My Resume
                                </h3>
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6">
                                     {user.resume ? (
                                        <div className="flex-1">
                                            <p className="text-green-400 font-medium flex items-center gap-2 mb-2"><FiCheck /> Resume Uploaded</p>
                                            <a 
                                                href={`http://localhost:5000${user.resume}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center gap-1"
                                            >
                                                <FiDownload /> View / Download Current Resume
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <p className="text-slate-400">No resume uploaded. Please upload your resume to apply for jobs.</p>
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleResumeUpload} className="flex gap-3 items-center">
                                        <input 
                                            type="file" 
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setResumeFile(e.target.files[0])}
                                            className="text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={!resumeFile || isUploading}
                                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${!resumeFile || isUploading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                        >
                                            {isUploading ? "Uploading..." : <span className="flex items-center gap-2"><FiUpload /> Upload</span>}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">Briefcase</span>
                                Applied Jobs
                            </h3>
                            {user.jobs && user.jobs.length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-slate-300">
                                            <tr>
                                                <th className="p-4 font-medium">Job Title</th>
                                                <th className="p-4 font-medium">Company</th>
                                                <th className="p-4 font-medium">Location</th>
                                                <th className="p-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {user.jobs.map((job) => (
                                                <tr key={job.id} className="hover:bg-white/5 transition-colors text-slate-300">
                                                    <td className="p-4">{job.jobTitle}</td>
                                                    <td className="p-4">{job.company}</td>
                                                    <td className="p-4 text-slate-400">{job.location}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                            job.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            job.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                            {job.status || 'PENDING'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 dashed-border">
                                    <p className="text-slate-400">You haven&apos;t applied for any jobs yet.</p>
                                </div>
                            )}
                        </>
                    ) : user.roleName === "EMPLOYER" ? (
                        <>
                            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">Briefcase</span>
                                Posted Jobs
                            </h3>
                            {Array.isArray(postedJobs) && postedJobs.length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-slate-300">
                                            <tr>
                                                <th className="p-4 font-medium">Job Title</th>
                                                <th className="p-4 font-medium">Location</th>
                                                <th className="p-4 font-medium">Applicants</th>
                                                <th className="p-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {postedJobs.map((job) => (
                                                <tr key={job.id} className="hover:bg-white/5 transition-colors text-slate-300">
                                                    <td className="p-4 font-medium text-white">{job.jobTitle}</td>
                                                    <td className="p-4 text-slate-400">{job.location}</td>
                                                    <td className="p-4">
                                                        <button 
                                                            className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center gap-2"
                                                            onClick={() => handleApplicantsClick(job.id, job.jobTitle)}
                                                        >
                                                            <div className="bg-blue-500/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                                                {job.users ? job.users.length : 0}
                                                            </div>
                                                            Applicants
                                                        </button>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => handleUpdateJob(job)} 
                                                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FiEdit size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteJob(job.id)} 
                                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 dashed-border">
                                    <p className="text-slate-400">You haven&apos;t posted any jobs yet.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Welcome to Jobify.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Applicants List Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass bg-slate-900/90 p-8 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl animate-fade-in text-white relative">
                        <h4 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Applicants for {selectedJobTitle}
                        </h4>
                        
                        <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {applicants.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-300 sticky top-0 backdrop-blur-md">
                                        <tr>
                                            <th className="p-4 font-medium">Name</th>
                                            <th className="p-4 font-medium">Email</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {applicants.map((applicant, idx) => (
                                            <tr 
                                                key={idx} 
                                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                                                onClick={() => handleApplicantSelect(applicant)}
                                            >
                                                <td className="p-4 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                                    <FiUser /> {applicant.name}
                                                </td>
                                                <td className="p-4 text-slate-300">{applicant.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        applicant.status === 'ACCEPTED' ? 'text-green-400 bg-green-500/10' :
                                                        applicant.status === 'REJECTED' ? 'text-red-400 bg-red-500/10' :
                                                        'text-yellow-400 bg-yellow-500/10'
                                                    }`}>
                                                        {applicant.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    No applicants found for this job.
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/5"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicant Details Modal */}
            {showApplicantDetails && selectedApplicant && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="glass bg-slate-900/95 p-8 rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl animate-scale-up text-white relative">
                        <button 
                            onClick={() => setShowApplicantDetails(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
                                {selectedApplicant.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{selectedApplicant.name}</h3>
                            <p className="text-slate-400">{selectedApplicant.email}</p>
                            <div className="mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    selectedApplicant.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                    selectedApplicant.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    Status: {selectedApplicant.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h5 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                    <FiFileText className="text-blue-400" /> Resume
                                </h5>
                                {selectedApplicant.resume ? (
                                    <a 
                                        href={`http://localhost:5000${selectedApplicant.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline flex items-center gap-2 text-sm"
                                    >
                                        <FiDownload /> View / Download Resume
                                    </a>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">No resume uploaded by user.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleStatusUpdate('ACCEPTED')}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2"
                            >
                                <FiCheck /> Accept
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('REJECTED')}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                <FiX /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass bg-slate-900/95 p-8 rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl animate-slide-up text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Edit Job: {editJobData.jobTitle}</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={editJobData.roleName}
                                        disabled
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editJobData.location}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Salary</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={editJobData.salary}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Job Type</label>
                                    <select
                                        name="jobType"
                                        value={editJobData.jobType}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all [&>option]:bg-slate-800 cursor-pointer"
                                    >
                                        <option value="Full time">Full time</option>
                                        <option value="Part time">Part time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Experience</label>
                                    <select
                                        name="experience"
                                        value={editJobData.experience}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all [&>option]:bg-slate-800 cursor-pointer"
                                    >
                                        <option value="entry">Entry</option>
                                        <option value="mid">Mid</option>
                                        <option value="senior">Senior</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={editJobData.description}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-600 min-h-[100px]"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Requirements</label>
                                <textarea
                                    name="requirements"
                                    value={editJobData.requirements}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-600 min-h-[100px]"
                                    rows={3}
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
