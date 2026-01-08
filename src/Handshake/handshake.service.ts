import { Types } from 'mongoose';
import { Handshake } from './handshake.model';
import { IHandshake } from './handshake.types';
import { CircleService } from '../Circle/circle.service';

export class HandshakeService {
  private readonly handshakeModel = Handshake;

  constructor(private readonly circleService: CircleService) {}

  async createHandshake(senderId: string): Promise<IHandshake> {
    return this.handshakeModel.create({
      senderId: new Types.ObjectId(senderId),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async acceptHandshake(
    handshakeId: string,
    receiverId: string
  ): Promise<void> {
    const handshake = await this.handshakeModel.findById(handshakeId);
    if (!handshake) {
      throw new Error('Error: Handshake expired or invalid');
    }

    const senderId = handshake.senderId.toString();
    const senderCircle = await this.circleService.getDefaultCircle(senderId);
    const receiverCircle =
      await this.circleService.getDefaultCircle(receiverId);

    await this.circleService.addContact(
      senderCircle._id.toString(),
      senderId,
      receiverId
    );
    await this.circleService.addContact(
      receiverCircle._id.toString(),
      receiverId,
      senderId
    );

    await this.handshakeModel.findByIdAndDelete(handshakeId);
  }

  async deleteHandshake(senderId: string, handshakeId: string): Promise<void> {
    const handshake = await this.handshakeModel.findById(handshakeId);

    if (!handshake) {
      throw new Error('Error: Handshake expired or invalid');
    }
    if (handshake.senderId.toString() !== senderId) {
      throw new Error('Error: not the owner of the handshake');
    }

    await this.handshakeModel.findByIdAndDelete(handshakeId);
  }
}
