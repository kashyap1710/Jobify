import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const applicationStatusEnum = pgEnum('application_status', ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  roleName: varchar("role_name", { length: 50 }).notNull(), // JOB_SEEKER, EMPLOYER
  verified: boolean("verified").default(false),
  enabled: boolean("enabled").default(true),
  resume: text("resume"), // URL/Path to resume file
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  location: varchar("location", { length: 255 }),
  salary: varchar("salary", { length: 100 }),
  jobType: varchar("job_type", { length: 50 }),
  experience: varchar("experience", { length: 50 }),
  description: text("description"),
  requirements: text("requirements"),
  employerId: uuid("employer_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  status: applicationStatusEnum("status").default('PENDING'),
  appliedAt: timestamp("applied_at").defaultNow(),
});
