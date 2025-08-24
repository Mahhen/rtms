import mongoose, { Schema, Document } from "mongoose";

interface Role {
  role_id: string;
  role_name: string;
  role_desc?: string;
}

interface Login {
  login_id: string;
  login_username: string;
  login_password_hash: string;
  role: Role;
}

interface Permission {
  per_id: string;
  name_of_official: string;
}

export interface IUser extends Document {
  user_id: string;
  user_name: string;
  user_mobile: string;
  user_email: string;
  user_address: string;
  login: Login;
  permission: Permission;
}

const roleSchema = new Schema<Role>(
  {
    role_id: { type: String, required: true },
    role_name: { type: String, required: true },
    role_desc: { type: String },
  },
  { _id: false }
);

const loginSchema = new Schema<Login>(
  {
    login_id: { type: String, required: true },
    login_username: { type: String, required: true },
    login_password_hash: { type: String, required: true },
    role: { type: roleSchema, required: true },
  },
  { _id: false }
);

const permissionSchema = new Schema<Permission>(
  {
    per_id: { type: String, required: true },
    name_of_official: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>({
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  user_mobile: { type: String, required: true },
  user_email: { type: String, required: true },
  user_address: { type: String, required: false },
  login: { type: loginSchema, required: true },
  permission: { type: permissionSchema, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
