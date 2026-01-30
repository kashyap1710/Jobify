import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './Navbar';
import { User, Mail, Briefcase } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import {fetchUserByEmail, setUserRole, fetchMyApplications, fetchJobApplicants} from "../api/api"; 

function AuthProfile() {
  const { getAccessTokenSilently } = useAuth0();
    const { user, isAuthenticated } = useAuth0();
    const [role, setRole] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
    const [jobApplicants, setJobApplicants] = useState([]);
    const [isSelectingRole, setIsSelectingRole] = useState(false);
    
    useEffect(() => {
      const fetchUserRole = async () => {
          if (isAuthenticated && user) {
              try {
                  const token = await getAccessTokenSilently();
                  console.log("Fetched Token:", token);  
  
                  const response = await fetchUserByEmail(user.email, token);
  
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
  
                  const text = await response.text();
                  const data = text ? JSON.parse(text) : {}; 
  
                  if (data.role) {
                      setRole(data.role);
                  } else {
                      setIsSelectingRole(true);
                  }
              } catch (error) {
                  console.error("Error fetching user role:", error);
              }
          }
      };
      
      if(user.email) fetchUserRole();
  }, [isAuthenticated, user, getAccessTokenSilently, user.email]);

  const handleRoleSelection = async (selectedRole) => {
    try {
        const token = await getAccessTokenSilently();
        const response = await setUserRole(user.email, selectedRole, token);

        if (response.ok) {
            setRole(selectedRole);
            setIsSelectingRole(false);
        } else {
            console.error("Failed to set role:", response.statusText);
        }
    } catch (error) {
        console.error("Error setting role:", error);
    }
};

useEffect(() => {
  const fetchApplications = async () => {
      if (role === "job_seeker") {
          try {
              const token = await getAccessTokenSilently();
              const response = await fetchMyApplications(user.email, token);

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              setMyApplications(data);
          } catch (error) {
              console.error("Error fetching applications:", error);
          }
      }
  };

  fetchApplications();
}, [role, user.email, getAccessTokenSilently]);

useEffect(() => {
  const fetchJobApplicants = async () => {
      if (role === "employer") {
          try {
              const token = await getAccessTokenSilently();
              const response = await fetchJobApplicants(user.email, token);

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              setJobApplicants(data);
          } catch (error) {
              console.error("Error fetching job applicants:", error);
          }
      }
  };

  fetchJobApplicants();
}, [role, user.email, getAccessTokenSilently]);


    if (!isAuthenticated) {
        return <p className="text-center text-gray-500 text-lg mt-10">Please log in to view your profile.</p>;
    }

    return (
        <div className="min-h-screen pt-16 relative overflow-hidden">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
                <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="glass rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/10">
                    <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">My Profile</h2>

                    {isSelectingRole ? (
                        <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-semibold text-slate-200 mb-4">Select Your Role</h3>
                            <div className="flex justify-center gap-4">
                                <button 
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                                    onClick={() => handleRoleSelection("job_seeker")}
                                >
                                    Job Seeker
                                </button>
                                <button 
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-green-500/25"
                                    onClick={() => handleRoleSelection("employer")}
                                >
                                    Employer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg"></p>
                    )}
                    
                    <div className="flex items-center space-x-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <img src={user.picture} alt="Profile" className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-lg" />
                        <div>
                            <h3 className="text-2xl font-bold text-slate-100">{user.name}</h3>
                            <p className="text-slate-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <User className="h-6 w-6 text-blue-400" />
                            <span className="ml-4 text-slate-300 text-lg">Full Name: <strong className="text-white ml-2">{user.name}</strong></span>
                        </div>
                        <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <Mail className="h-6 w-6 text-purple-400" />
                            <span className="ml-4 text-slate-300 text-lg">Email: <strong className="text-white ml-2">{user.email}</strong></span>
                        </div>
                        <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <Briefcase className="h-6 w-6 text-pink-400" />
                            <span className="ml-4 text-slate-300 text-lg">Role: <strong className="text-white ml-2 capitalize">{role}</strong></span>
                        </div>
                    </div>

                    {role === "job_seeker" && (
                        <div className="mt-10">
                            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">#</span>
                                My Applications
                            </h3>
                            {myApplications.length > 0 ? (
                                <ul className="space-y-3">
                                    {myApplications.map((job, index) => (
                                        <li key={index} className="bg-white/5 hover:bg-white/10 p-5 rounded-xl border border-white/5 transition-all">
                                            <p className="text-lg font-bold text-white mb-1">{job.title}</p>
                                            <div className="flex justify-between items-center text-sm">
                                                <p className="text-slate-400">{job.company}</p>
                                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-medium">
                                                    {job.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                    <p className="text-slate-400">You have not applied to any jobs yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {role === "employer" && (
                        <div className="mt-10">
                            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">#</span>
                                Job Applicants
                            </h3>
                            {jobApplicants.length > 0 ? (
                                <div className="space-y-4">
                                    {jobApplicants.map((job, index) => (
                                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/5">
                                            <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">{job.title}</h4>
                                            <ul className="space-y-3">
                                                {job.applicants.map((applicant, i) => (
                                                    <li key={i} className="flex justify-between items-start bg-slate-900/50 p-4 rounded-lg">
                                                        <div>
                                                            <p className="text-slate-200 font-medium">{applicant.name}</p>
                                                            <p className="text-slate-500 text-sm">{applicant.email}</p>
                                                        </div>
                                                        <div className="text-slate-400 text-sm bg-white/5 px-2 py-1 rounded">
                                                            Resume: {applicant.resume || 'Not uploaded'}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                    <p className="text-slate-400">No applicants yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AuthProfile;