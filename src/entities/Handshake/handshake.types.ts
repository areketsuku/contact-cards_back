import { Document, Types } from 'mongoose';

export interface IHandshake extends Document {
  senderId: Types.ObjectId;
  receiverId?: Types.ObjectId;
  expiresAt: Date;
}
