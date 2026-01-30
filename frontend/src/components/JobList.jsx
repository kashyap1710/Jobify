import PropTypes from "prop-types";
import { Briefcase, MapPin, DollarSign, User } from "lucide-react";
import { toast } from "react-toastify"; 
import { applyToJob } from '../api/api';

const JobList = ({ jobListings }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.data?.id; 

  const handleApply = async (job) => {
    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }

    try {
      const response = await applyToJob(userId,job.id);

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          data: {
            ...user.data,
            jobs: [...(user.data.jobs || []), job], 
          },
        };

        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        alert("Successfully applied for the job!");
        toast.success("Successfully applied for the job!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(error.response?.data?.message || "Failed to apply for job.");
    }
  };

  return (
    <div className="w-full">
      {jobListings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No jobs found matching your criteria</p>
        </div>
      ) : (
        jobListings.map((job) => {
          const hasApplied = user?.data?.jobs?.some((appliedJob) => appliedJob.id === job.id);

          return (
            <div
              key={job.id}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-6 hover:bg-white/10 transition-all duration-300 hover:border-blue-500/30 group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{job.jobTitle}</h3>
                  <p className="text-slate-400 font-medium mt-2 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-400" /> <span className="text-slate-300">{job.company}</span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-2 mt-2 text-sm">
                    <MapPin size={16} /> {job.location}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 capitalize flex items-center gap-1">
                       <User size={12} /> {job.experience} Level
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-300 border border-green-500/20 flex items-center gap-1">
                      <DollarSign size={12} /> ${job.salary}
                    </span>
                  </div>
                </div>

                  <div className="md:w-48 flex-shrink-0">
                  {user?.data?.roleName === "JOB_SEEKER" ? (
                    <button
                      className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                        hasApplied
                          ? "bg-slate-700 cursor-not-allowed text-slate-400 border border-slate-600"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25"
                      }`}
                      onClick={() => handleApply(job)}
                      disabled={hasApplied}
                    >
                      {hasApplied ? "Applied" : "Apply Now"}
                    </button>
                  ) : (
                    <button
                        className="w-full py-3 rounded-xl font-bold bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                        disabled
                    >
                        {user?.data?.roleName === "EMPLOYER" ? "Employer View" : "Login to Apply"}
                    </button>
                  )}
                  </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">{job.description}</p>
                
                {job.requirements && (
                  <div className="mt-4">
                    <strong className="text-slate-300 text-sm block mb-2">Requirements:</strong>
                    <ul className="list-disc ml-4 text-slate-500 text-sm space-y-1">
                      {Array.isArray(job.requirements) ? (
                        job.requirements.slice(0, 3).map((req, i) => <li key={i}>{req}</li>)
                      ) : (
                        <li>{job.requirements}</li>
                      )}
                      {Array.isArray(job.requirements) && job.requirements.length > 3 && (
                         <li className="list-none text-blue-400 text-xs mt-1 italic">+ {job.requirements.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

JobList.propTypes = {
  jobListings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      jobTitle: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      jobType: PropTypes.string.isRequired,
      requirements: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      salary: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default JobList;
