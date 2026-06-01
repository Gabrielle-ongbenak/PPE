import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["agent", "admin"],
      default: "agent",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "expired"],
      default: "inactive",
    },
    isAuthorized: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
