CREATE TABLE `course_offerings` (
	`id` integer PRIMARY KEY NOT NULL,
	`course_id` integer,
	`semester_id` integer,
	`is_deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `course_prerequisite` (
	`id` integer PRIMARY KEY NOT NULL,
	`course_id` integer,
	`prerequisite_course` integer,
	`is_deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prerequisite_course`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`credit_hours` integer NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer,
	`course_id` integer,
	`completed` integer NOT NULL,
	`passed` integer,
	`semwester_taken` integer,
	`is_deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`semwester_taken`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`term` integer NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL
);
