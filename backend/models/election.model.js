import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
      filename: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    candidates: [
      {
        name: {
          type: String,
          required: true,
        },
        party: {
          type: String,
          required: true,
        },
        motto: {
          type: String,
        },
        avatar: {
          data: Buffer,
          contentType: String,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    voterRegistry: [
      {
        type: String,
      },
    ],
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pincode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Election = mongoose.model("Election", electionSchema);

export default Election;
