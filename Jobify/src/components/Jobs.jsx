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

  useEffect(() => {
    const fetchJobs = async () => {
      // console.log("Fetching jobs from API...");
      try {
        const response = await fetchAllJobs(); 

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Jobs received:", data.jobs); 

        setJobListings(data.jobs || []);
        setFilteredJobs(data.jobs || []); 
      } catch (error) {
        console.error("Error fetching jobs:", error);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Find Your Dream Job
            </h2>

            <div className="flex shadow-md rounded-lg overflow-hidden mb-8 items-center border border-gray-300">
              <Search className="h-5 w-5 text-gray-500 ml-3" />
              <input
                type="text"
                name="searchTerm"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Enter Job Role..."
                className="w-full px-4 py-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="salaryRange"
                  value={salaryRange}
                  onChange={handleChange}
                  placeholder="Salary Range"
                  className="w-full outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-lg">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  name="jobType"
                  value={jobType}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="all">All</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-lg">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <select
                  name="experience"
                  value={experience}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="all">All</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
            </div>

            <JobList jobListings={filteredJobs} />

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Recommended Job Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Software Engineer",
                    description: "Build and maintain software applications.",
                  },
                  {
                    title: "Data Scientist",
                    description:
                      "Analyze and interpret complex data to drive business decisions.",
                  },
                  {
                    title: "Product Manager",
                    description:
                      "Manage the development and lifecycle of a product.",
                  },
                ].map((role, index) => (
                  <div
                    key={index}
                    className="p-5 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition bg-white"
                  >
                    <h4 className="text-lg font-semibold">{role.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{role.description}</p>
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
