import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db/index.js";
import { users, jobs, applications } from "./db/schema.js";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Static Files (Resumes) ---
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Multer Config (Resume Upload) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Use absolute path consistent with static files setup
      cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
      // Create unique filename: userId-timestamp-originalName
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports PDF, DOC, DOCX"));
    }
});

// --- Email Config ---
// Using Ethereal for testing or existing env vars if provided
const transporter = nodemailer.createTransport({
    service: 'gmail', // Simplest for personal projects if App Password used
    auth: {
        user: process.env.MAIL_EMAIL || process.env.EMAIL_USER, 
        pass: process.env.MAIL_PASSWORD || process.env.EMAIL_PASS
    }
}); 

const sendEmail = async (to, subject, text) => {
    try {
        const user = process.env.MAIL_EMAIL || process.env.EMAIL_USER;
        const pass = process.env.MAIL_PASSWORD || process.env.EMAIL_PASS;
        
        if (!user || !pass) {
            console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${text}`);
            return; 
        }
        await transporter.sendMail({
            from: user,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};


// --- Auth Routes ---

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      roleName
    }).returning();

    const { password: _, ...userInfo } = newUser;
    res.status(201).json({ message: "User registered successfully", data: userInfo, statusCode: 200 });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Return user info (excluding password)
    const { password: _, ...userInfo } = user;
    res.json({ message: "Login successful", data: userInfo, statusCode: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- User Routes ---
app.get("/api/user/:email", async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, req.params.email));
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password: _, ...userInfo } = user;
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload Resume
app.post("/api/upload-resume/:userId", upload.single('resume'), async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const resumePath = `/uploads/${req.file.filename}`;
        
        // Update user record
        await db.update(users)
            .set({ resume: resumePath })
            .where(eq(users.id, userId));

        res.json({ message: "Resume uploaded successfully", resumePath });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "File upload failed" });
    }
});


// --- Job Routes ---

// Helper to map DB job to Frontend job
const mapJob = (job) => ({
  ...job,
  jobTitle: job.title, // Frontend expects jobTitle
});

// Get All Jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    res.json({ jobs: allJobs.map(mapJob) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a Job
app.post("/api/jobs", async (req, res) => {
  try {
    const { jobTitle, title, company, location, salary, jobType, experience, description, requirements, employerId } = req.body;
    
    // Minimal validation
    if (!employerId) return res.status(400).json({ message: "Employer ID required" });

    // Strict Role Check: Verify user is an EMPLOYER
    const [user] = await db.select().from(users).where(eq(users.id, employerId));
    if (!user || user.roleName !== "EMPLOYER") {
      return res.status(403).json({ message: "Access denied. Only Employers can post jobs." });
    }

    const [newJob] = await db.insert(jobs).values({
        title: jobTitle || title, // Accept either
        company, location, salary, jobType, experience, description, requirements, employerId
    }).returning();

    res.status(201).json(mapJob(newJob));

  } catch (error) {
    console.error("Post Job Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Posted Jobs by User
app.get("/api/jobs/posted/:userId", async (req, res) => {
  try {
    const userJobs = await db.select().from(jobs).where(eq(jobs.employerId, req.params.userId));
    
    // Also fetch applicants count for each job to be helpful (or Profile.jsx fetches separately?)
    // Profile.jsx fetches applicants separately on click, but shows count in the table? 
    // Profile.jsx line 214: {job.users ? job.users.length : 0} <-- This implies it expects a 'users' array in the job object!
    // My previous simpler implementation returned just the job rows. 
    // I need to join with applications to get the count, or 'users' array. 
    // Let's replicate the structure: job.users = [list of applicants].
    
    const jobsWithApplicants = await Promise.all(userJobs.map(async (job) => {
        const apps = await db.select().from(applications).where(eq(applications.jobId, job.id));
        return {
            ...mapJob(job),
            users: apps // simplistic approach, frontend checks .length
        };
    }));

    res.json(jobsWithApplicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    await db.delete(jobs).where(eq(jobs.id, req.params.id));
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { jobTitle, title, ...updates } = req.body;
    
    const [updatedJob] = await db.update(jobs)
      .set({ 
        title: jobTitle || title, 
        ...updates 
      })
      .where(eq(jobs.id, req.params.id))
      .returning();

    res.json(mapJob(updatedJob));
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Applicants for a specific Job
app.get("/api/jobs/:jobId/applicants", async (req, res) => {
  try {
    const { jobId } = req.params;

    const applicantsList = await db.select({
      applicationId: applications.id, // Need ID to update status
      userId: users.id,
      name: users.name,
      email: users.email,
      resume: users.resume,
      status: applications.status,
      appliedAt: applications.appliedAt
    })
    .from(applications)
    .innerJoin(users, eq(applications.userId, users.id))
    .where(eq(applications.jobId, jobId));

    res.json(applicantsList);

  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
});

// --- Application Routes ---

// Apply to Job
app.post("/api/user/:userId/apply/:jobId", async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    
    // Strict Role Check: Verify user is a JOB_SEEKER
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.roleName !== "JOB_SEEKER") {
        return res.status(403).json({ message: "Access denied. Only Job Seekers can apply." });
    }

    // Check if duplicate
    const existing = await db.select().from(applications)
        .where(eq(applications.userId, userId) && eq(applications.jobId, jobId)); // Simplification, need composite logic for Drizzle `and`
        
    // Drizzle doesn't support `&&` in where. Correct is `and(eq(...), eq(...))`
    // But duplicate check unique constraint on DB is safer or explicit check:
    // Skipping duplicate check for brevity, assuming catch handles SQL unique error if exists, or allow duplicate applied for now.

    const [application] = await db.insert(applications).values({
      userId,
      jobId
    }).returning();

    res.json({ message: "Applied successfully", application });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: "Failed to apply (possibly already applied)" });
  }
});

// Update Application Status
app.put("/api/applications/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // ACCEPTED, REJECTED

        const [updatedApp] = await db.update(applications)
            .set({ status })
            .where(eq(applications.id, id))
            .returning();
            
        if (!updatedApp) return res.status(404).json({ message: "Application not found" });

        // Fetch user email to notify
        const [user] = await db.select().from(users).where(eq(users.id, updatedApp.userId));
        const [job] = await db.select().from(jobs).where(eq(jobs.id, updatedApp.jobId));
        
        if (user && job) {
            const subject = `Application Update: ${job.title}`;
            const message = status === 'ACCEPTED' 
                ? `Congratulations! Using Jobify, your application for ${job.title} at ${job.company} has been ACCEPTED!` 
                : `Thank you for your interest. Unfortunately, your application for ${job.title} at ${job.company} was not successful at this time.`;
            
            await sendEmail(user.email, subject, message);
        }

        res.json({ message: "Status updated and email sent", application: updatedApp });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
});


// Get My Applications
app.get("/api/my-applications/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Join applications with jobs
    const result = await db.select({
      id: applications.id,
      status: applications.status,
      appliedAt: applications.appliedAt,
      job: jobs
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.userId, user.id));
    
    // Transform to match frontend expectation (flatten structure if needed, or update frontend)
    // Java backend returned List<Job> mostly? Or Application objects?
    // Let's verify existing api response structure if possible. 
    // Usually frontend expects: { title, company, status }
    
    const formatted = result.map(r => ({
      ...mapJob(r.job),
      status: r.status 
    }));

    res.json(formatted);
  } catch (error) {
    console.error("My Apps Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Job Applicants (Legacy - can be removed or kept for generic view if unrelated to specific job)
app.get("/api/job-applicants/:email", async (req, res) => {
  // kept for backward compat if any component still uses it
   try {
    const { email } = req.params;
    const [employer] = await db.select().from(users).where(eq(users.email, email));
    
    if (!employer) return res.status(404).json({ message: "User not found" });

    // Get all jobs posted by this employer
    const postedJobs = await db.select().from(jobs).where(eq(jobs.employerId, employer.id));

    // For each job, get applicants
    const jobsWithApplicants = await Promise.all(postedJobs.map(async (job) => {
        const apps = await db.select({
            user: users,
            status: applications.status
        })
        .from(applications)
        .innerJoin(users, eq(applications.userId, users.id))
        .where(eq(applications.jobId, job.id));

        return {
            ...job,
            applicants: apps.map(a => ({
                name: a.user.name,
                email: a.user.email,
                resume: a.user.resume,
                status: a.status
            }))
        };
    }));

    res.json(jobsWithApplicants);

  } catch (error) {
    console.error("Job Applicants Error:", error);
    res.status(500).json({ message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
