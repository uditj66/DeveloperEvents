import { Schema, model, models, Document } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one agenda item is required",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * FIX: Using async function instead of next() callback.
 * This prevents the "next is not a function" TypeError.
 */
EventSchema.pre("save", async function () {
  // 'this' refers to the document being saved
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Helper function to generate URL-friendly slug
/**
 * Creates a URL-friendly slug from a title and appends a short random suffix to reduce collisions.
 *
 * The slug is lowercase and hyphen-separated; a 4-character alphanumeric suffix is appended (e.g., `my-event-a1b2`).
 *
 * @param title - The source title to convert into a slug
 * @returns The generated slug string
 */
function generateSlug(title: string): string {
  // 1. Create the base slug from the title
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // 2. Generate a small random string (4 characters)
  const randomId = Math.random().toString(36).substring(2, 6);

  // 3. Combine them: workshop -> workshop-a7b2
  return `${baseSlug}-${randomId}`;
}

/**
 * Normalize a date string to the ISO date format (YYYY-MM-DD).
 *
 * @param dateString - Input date string parseable by the JavaScript Date constructor (for example, an ISO timestamp, "YYYY-MM-DD", or a human-readable date).
 * @returns The date portion in `YYYY-MM-DD` format.
 * @throws Error if `dateString` cannot be parsed as a valid date.
 */
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date.toISOString().split("T")[0];
}

/**
 * Normalize a time string to 24-hour `HH:MM` format.
 *
 * Accepts `HH:MM` or `HH:MM AM/PM` (hours may be 1 or 2 digits, minutes exactly 2 digits).
 *
 * @param timeString - The input time string to normalize.
 * @returns The time in 24-hour `HH:MM` format (zero-padded hours).
 * @throws Error if the input does not match the supported formats or contains invalid hour/minute values.
 */
function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  if (period) {
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  if (
    hours < 0 ||
    hours > 23 ||
    parseInt(minutes) < 0 ||
    parseInt(minutes) > 59
  ) {
    throw new Error("Invalid time values");
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Indexes for better performance
// EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;