import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
    description: {
      type: String,
      required: true,
      minLength: 6,
    },
    type: {
      type: String,
      required: true,
      enum: ["room", "studio", "apartment", "villa"],
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "The property's price must be greater than 0",
      },
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      neighborhood: {
        type: String,
        required: true,
        trim: true,
      },
    },
    features: {
      water: {
        type: String,
        required: true,
        enum: [
          "indoor_borehole",
          "outdoor_borehole",
          "indoor_running_water",
          "outdoor_running_water",
          "well",
        ],
      },
      hasPrepaidElectricity: {
        type: Boolean,
        required: true,
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "At least one image must be provided.",
      },
    },
  },
  { timestamps: true },
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
