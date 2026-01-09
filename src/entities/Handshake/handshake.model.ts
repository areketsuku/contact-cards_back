import { Schema, model } from 'mongoose';
import { IHandshake } from './handshake.types';

const HandshakeSchema = new Schema<IHandshake>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

HandshakeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Handshake = model<IHandshake>('Handshake', HandshakeSchema);
