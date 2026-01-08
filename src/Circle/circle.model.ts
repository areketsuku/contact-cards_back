import { Schema, model } from 'mongoose';
import { IAllowedInfo, ICircle } from './circle.types';

const CircleOwnerAllowedInfoSchema = new Schema<IAllowedInfo>(
  {
    name: { type: Boolean, default: true },
    surname1: { type: Boolean, default: false },
    surname2: { type: Boolean, default: false },
    email1: { type: Boolean, default: false },
    email2: { type: Boolean, default: false },
    phone1: { type: Boolean, default: false },
    phone2: { type: Boolean, default: false },
    country: { type: Boolean, default: false },
    address: { type: Boolean, default: false },
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
      ref: 'User',
      required: true,
      index: true,
    },
    circleType: {
      type: String,
      enum: ['default', 'custom'],
      default: 'custom',
      required: true,
    },
    circleName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value: string) {
          const doc = this as ICircle;
          if (doc.circleType === 'default') {
            return value === 'contacts';
          }
          return true;
        },
        message: "Default circle must be named 'contacts'",
      },
    },

    circleContacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    circleAllowedInfo: {
      type: CircleOwnerAllowedInfoSchema,
      required: true,
    },
  },
  { timestamps: true }
);

CircleSchema.index(
  { circleOwnerId: 1, circleType: 1 },
  {
    unique: true,
    partialFilterExpression: { circleType: 'default' },
  }
);

export const Circle = model<ICircle>('Circle', CircleSchema);
