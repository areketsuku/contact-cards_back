import { Schema, model } from "mongoose";
import { IAllowedInfo, ICircle } from "./circle.types";

const CircleOwnerAllowedInfoSchema = new Schema<IAllowedInfo>({
  name: { type: Boolean, default: true },
  surname1: { type: Boolean, default: false },
  surname2: { type: Boolean, default: false },
  email1: { type: Boolean, default: false },
  email2: { type: Boolean, default: false },
  phone1: { type: Boolean, default: false },
  phone2: { type: Boolean, default: false },
  country: { type: Boolean, default: false },
  adress: { type: Boolean, default: false },
  link1: { type: Boolean, default: false },
  link2: { type: Boolean, default: false },
  avatar: { type: Boolean, default: false },
},
  { _id: false }
);

const CircleSchema = new Schema<ICircle>(
  {
    circleOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    circleName: {
      type: String,
      required: true,
      trim: true,
    },

    circleContacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    circleAllowedInfo: {
      type: CircleOwnerAllowedInfoSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const Circle = model<ICircle>("Circle", CircleSchema);
