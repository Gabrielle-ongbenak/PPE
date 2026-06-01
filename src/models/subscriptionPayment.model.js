import mongoose from "mongoose";

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 1000;
        },
        message: "The amount should be equal or greater than 1000 XAF",
      },
    },
    currency: {
      type: String,
      default: "XAF",
    },
    operator: {
      type: String,
      enum: ["mtn_momo", "orange_money"],
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const SubscriptionPayment = mongoose.model(
  "SubscriptionPayment",
  subscriptionPaymentSchema,
);
export default SubscriptionPayment;
