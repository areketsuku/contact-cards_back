import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserWithPassword } from './user.types';

const UserSchema = new Schema<IUserWithPassword>(
  {
    userName: {
      type: String,
      required: true,
      trim: true
    },
    userSurname1: {
      type: String,
      trim: true
    },
    userSurname2: {
      type: String,
      trim: true
    },
    userEmail1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userEmail2: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    userPhone1: {
      type: String,
      unique: true,
      sparse: true
    },
    userPhone2: {
      type: String,
      unique: true,
      sparse: true
    },
    userCountry: {
      type: String,
      trim: true
    },
    userAddress: {
      type: String,
      trim: true
    },
    userLink1: {
      type: String,
      trim: true
    },
    userLink2: {
      type: String,
      trim: true
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    userAvatar: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('userPassword')) return;
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
});

UserSchema.methods.userComparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.userPassword);
};

export const User = model<IUserWithPassword>('User', UserSchema);
