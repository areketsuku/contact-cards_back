import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.types';

const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, 'El nom és obligtori'],
      trim: true,
    },
    userSurname1: {
      type: String,
      required: false,
      trim: true,
    },
    userSurname2: {
      type: String,
      required: false,
      trim: true,
    },
    userEmail1: {
      type: String,
      required: [true, 'Un email es obligtori'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    userEmail2: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userPhone1: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    userPhone2: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    userCountry: {
      type: String,
      required: false,
      trim: true,
    },
    userAdress: {
      type: String,
      required: false,
      trim: true,
    },
    userLink1: {
      type: String,
      required: false,
      trim: true,
    },
    userLink2: {
      type: String,
      required: false,
      trim: true,
    },
    userPassword: {
      type: String,
      required: [true, 'La contrasenya és obligatòria'],
      minlength: [6, 'La contrasenya ha de tenir almenys 6 caràcters'],
    },
    userAvatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
});

UserSchema.methods.userComparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.userPassword);
};

export const User = model<IUser>('User', UserSchema);
