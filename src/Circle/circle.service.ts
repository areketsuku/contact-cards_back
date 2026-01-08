import { Types } from 'mongoose';
import { Circle } from './circle.model';
import { ICircle, IAllowedInfo } from './circle.types';

export class CircleService {
  private readonly circleModel = Circle;

  async createDefaultCircle(ownerId: string): Promise<ICircle> {
    return this.circleModel.create({
      circleOwnerId: new Types.ObjectId(ownerId),
      circleType: 'default',
      circleName: 'contacts',
      circleContacts: [],
      circleAllowedInfo: {
        name: true,
        surname1: false,
        surname2: false,
        email1: false,
        email2: false,
        phone1: false,
        phone2: false,
        country: false,
        address: false,
        link1: false,
        link2: false,
        avatar: false,
      },
    });
  }

  async createCustomCircle(
    ownerId: string,
    circleName: string
  ): Promise<ICircle> {
    return this.circleModel.create({
      circleOwnerId: new Types.ObjectId(ownerId),
      circleType: 'custom',
      circleName: circleName,
      circleContacts: [],
      circleAllowedInfo: {
        name: true,
        surname1: false,
        surname2: false,
        email1: false,
        email2: false,
        phone1: false,
        phone2: false,
        country: false,
        address: false,
        link1: false,
        link2: false,
        avatar: false,
      },
    });
  }

  async getDefaultCircle(ownerId: string): Promise<ICircle> {
    const circle = await this.circleModel.findOne({
      circleOwnerId: ownerId,
      circleType: 'default',
    });

    if (!circle) {
      throw new Error('Error: default circle does not exists');
    }

    return circle;
  }

  private async checkCircleAndOwner(
    circleId: string,
    ownerId: string
  ): Promise<ICircle> {
    const circle = await this.circleModel.findById(circleId);
    if (!circle) throw new Error('Error: Circle not found');

    if (ownerId && circle.circleOwnerId.toString() !== ownerId) {
      throw new Error('Unauthorized: not the owner of the circle');
    }

    return circle;
  }

  async hasContact(
    circleId: string,
    ownerId: string,
    contactId: string
  ): Promise<boolean> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    return circle.circleContacts.some((cId) => cId.toString() === contactId);
  }

  async addContact(
    circleId: string,
    ownerId: string,
    contactId: string
  ): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    const exists = circle.circleContacts.some(
      (cId) => cId.toString() === contactId
    );

    if (exists) return circle; //ja existeix

    circle.circleContacts.push(new Types.ObjectId(contactId));
    await circle.save();
    return circle;
  }

  async removeContact(
    circleId: string,
    ownerId: string,
    contactId: string
  ): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    circle.circleContacts = circle.circleContacts.filter(
      (cId) => cId.toString() !== contactId
    );

    await circle.save();
    return circle;
  }

  async updateAllowedInfo(
    circleId: string,
    ownerId: string,
    newAllowedInfo: IAllowedInfo
  ): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    circle.circleAllowedInfo = {
      ...circle.circleAllowedInfo,
      ...newAllowedInfo,
    };
    await circle.save();
    return circle;
  }

  async updateName(
    circleId: string,
    ownerId: string,
    newName: string
  ): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    if (circle.circleType === 'default') {
      throw new Error("Error: can't rename default circle");
    }

    circle.circleName = newName;
    await circle.save();
    return circle;
  }

  async deleteCircle(circleId: string, ownerId: string): Promise<void> {
    const circle = await this.checkCircleAndOwner(circleId, ownerId);

    if (circle.circleType === 'default') {
      throw new Error("Error: can't delete default circle");
    }

    await this.circleModel.findByIdAndDelete(circleId);
  }
}
