import { useState, useEffect } from "react";
import { Briefcase, DollarSign, MapPin, Search, Filter } from "lucide-react";
import Navbar from "./Navbar";
import JobList from "./JobList";
import { fetchAllJobs } from "../api/api"; 

function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState("all");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobListings, setJobListings] = useState([]); 
  const [filteredJobs, setFilteredJobs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllJobs(); 

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setJobListings(data.jobs || []);
        setFilteredJobs(data.jobs || []); 
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  useEffect(() => {
    const filtered = jobListings.filter((job) =>
      (searchTerm === "" || job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (location === "" || job.location.toLowerCase().includes(location.toLowerCase())) &&
      (salaryRange === "" || job.salary.toString().includes(salaryRange)) &&
      (jobType === "all" || job.jobType.toLowerCase() === jobType.toLowerCase()) &&
      (experience === "all" || job.experience.toLowerCase() === experience.toLowerCase())
    );

    setFilteredJobs(filtered);
  }, [searchTerm, location, jobType, experience, salaryRange, jobListings]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchTerm") setSearchTerm(value);
    else if (name === "location") setLocation(value);
    else if (name === "jobType") setJobType(value);
    else if (name === "experience") setExperience(value);
    else if (name === "salaryRange") setSalaryRange(value);
  };

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="glass rounded-3xl p-8 border border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              Find Your Dream Job
            </h2>

            {/* Main Search Bar */}
            <div className="flex bg-white/5 rounded-2xl overflow-hidden mb-8 items-center border border-white/10 focus-within:border-blue-500/50 transition-all shadow-lg shadow-black/20">
              <Search className="h-6 w-6 text-slate-400 ml-5" />
              <input
                type="text"
                name="searchTerm"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search by Job Role or Keyword..."
                className="w-full px-5 py-4 outline-none bg-transparent text-slate-200 placeholder-slate-500 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <MapPin className="h-5 w-5 text-blue-400" />
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full outline-none bg-transparent text-slate-200 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <DollarSign className="h-5 w-5 text-green-400" />
                <input
                  type="text"
                  name="salaryRange"
                  value={salaryRange}
                  onChange={handleChange}
                  placeholder="Salary Range"
                  className="w-full outline-none bg-transparent text-slate-200 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <Filter className="h-5 w-5 text-purple-400" />
                <select
                  name="jobType"
                  value={jobType}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-slate-200 cursor-pointer [&>option]:bg-slate-800"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <Briefcase className="h-5 w-5 text-pink-400" />
                <select
                  name="experience"
                  value={experience}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-slate-200 cursor-pointer [&>option]:bg-slate-800"
                >
                  <option value="all">All Experience</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="loader w-12 h-12 border-4"></div>
                </div>
            ) : (
                <JobList jobListings={filteredJobs} />
            )}

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-200 mb-8 pl-2 border-l-4 border-blue-500">
                Recommended Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Software Engineer",
                    description: "Build and maintain software applications.",
                    icon: <Briefcase className="w-6 h-6 text-blue-400"/>
                  },
                  {
                    title: "Data Scientist",
                    description: "Analyze and interpret complex data.",
                    icon: <Search className="w-6 h-6 text-purple-400"/>
                  },
                  {
                    title: "Product Manager",
                    description: "Manage the development and lifecycle.",
                    icon: <Briefcase className="w-6 h-6 text-pink-400"/>
                  },
                ].map((role, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="mb-4 bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      {role.icon}
                    </div>
                    <h4 className="text-lg font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{role.title}</h4>
                    <p className="text-slate-500 text-sm mt-2">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
