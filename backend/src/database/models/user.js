import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
 
  permissions: [
    {
      permission_name: { type: String },
      permission_value: { type: Boolean },
      permission_expiry: { type: Date },
    },
  ],
  hasAttemptedTrial: {
    type: Boolean,
    default: false,
  },
  trialAttempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  language: {
    type: String,
    default: "rw",
  },
  // Single active session enforcement
  sessionId: {
    type: String,
    default: null,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
