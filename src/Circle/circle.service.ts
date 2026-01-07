import { Types } from "mongoose";
import { Circle } from "./circle.model";
import { ICircle, IAllowedInfo } from "./circle.types";

export class CircleService {
  private readonly circleModel = Circle;

  private async checkCircleAndOwner (circleId:string, ownerId:string): Promise<ICircle> {
    const circle = await this.circleModel.findById(circleId);
    if(!circle) throw new Error ("Error: Circle not found");

    if(ownerId && circle.circleOwnerId.toString() !== ownerId) {
      throw new Error("Unauthorized: not the owner of the circle");
    }

    return circle;
  }

  //check
  async hasContact(circleId:string, ownerId: string, contactId:string):Promise<boolean> {
    const circle = await this.checkCircleAndOwner(circleId,ownerId);

    return circle.circleContacts.some(
      (cId) => cId.toString() === contactId
    );
  }
  //add
  async addContact(circleId:string, ownerId: string, contactId: string): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId,ownerId);

    const exists = circle.circleContacts.some(
      (cId) => cId.toString() === contactId
    );

    if (exists) return circle; //ja existeix

    circle.circleContacts.push(new Types.ObjectId(contactId));
    await circle.save();
    return circle;
  }
  //erase
  async removeContact(circleId:string, ownerId: string, contactId:string): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId,ownerId);

    circle.circleContacts = circle.circleContacts.filter(
      (cId) => cId.toString() !== contactId
    );

    await circle.save();
    return circle;
  }
  //info
  async updateAllowedInfo(circleId:string, ownerId: string, newAllowedInfo: IAllowedInfo): Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId,ownerId);

    circle.circleAllowedInfo = {...circle.circleAllowedInfo, ...newAllowedInfo};
    await circle.save();
    return circle;
  }
  //rename
  async updateName(circleId:string, ownerId: string, newName:string):Promise<ICircle> {
    const circle = await this.checkCircleAndOwner(circleId,ownerId);

    circle.circleName = newName;
    await circle.save();
    return circle;
  }
  //delete
  async deleteCircle(circleId:string, ownerId: string):Promise<void> {
    await this.checkCircleAndOwner(circleId,ownerId);
    await this.circleModel.findByIdAndDelete(circleId);
  }
}
