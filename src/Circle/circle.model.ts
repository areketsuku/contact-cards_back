import { Schema, model } from 'mongoose';
import { IAllowedInfo, ICircle } from './circle.types';

const CircleOwnerAllowedInfoSchema = new Schema<IAllowedInfo>(
  {
    userName: { type: Boolean, default: true },
    userSurname1: { type: Boolean, default: false },
    userSurname2: { type: Boolean, default: false },
    userEmail1: { type: Boolean, default: false },
    userEmail2: { type: Boolean, default: false },
    userPhone1: { type: Boolean, default: false },
    userPhone2: { type: Boolean, default: false },
    userCountry: { type: Boolean, default: false },
    userAddress: { type: Boolean, default: false },
    userLink1: { type: Boolean, default: false },
    userLink2: { type: Boolean, default: false },
    userAvatar: { type: Boolean, default: false },
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
