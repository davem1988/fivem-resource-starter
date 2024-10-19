// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface File {
  name: string;
  content: string; // You can change this to your preferred type for file content
}

interface Folder {
  name: string;
  files: File[];
  folders: Folder[];
}

interface Project {
  title: string;
  description: string;
  rootFolder: Folder;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDocument extends Document {
  clerkId: string;
  email: string;
  username: string; // Optional: you can add more user fields as needed
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<File>({
  name: { type: String, required: true },
  content: { type: String, required: true },
});

const FolderSchema = new Schema<Folder>({
  name: { type: String, required: true },
  files: [FileSchema],
  folders: [{ type: Schema.Types.Mixed, ref: 'Folder' }],
});

const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rootFolder: FolderSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<UserDocument>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  projects: [ProjectSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure proper indexing
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
