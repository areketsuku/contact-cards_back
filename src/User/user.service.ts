import { User } from "./user.model";
import { IUser, IUserWithPassword } from "./user.types";
import { Circle } from "../Circle/circle.model";
import { IAllowedInfo, ICircle } from "../Circle/circle.types";

interface UserBaseDTO {
  userName: string;
  userSurname1?: string;
  userSurname2?: string;
  userEmail1: string;
  userEmail2?: string;
  userPhone1?: string;
  userPhone2?: string;
  userCountry?: string;
  userAddress?: string;
  userLink1?: string;
  userLink2?: string;
  userAvatar?: string;
}
export interface CreateUserDTO extends UserBaseDTO { userPassword: string; }
export interface UpdateUserDTO extends Partial<UserBaseDTO> { }

export class UserService {
  private readonly userModel = User;

  async createUser(data: CreateUserDTO): Promise<IUserWithPassword> {
    return this.userModel.create(data);
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async showUserInfo(requestUserId: string, targetUserId: string): Promise<Partial<IUser>> {
    const user = await this.userModel.findById(targetUserId).lean<IUser>();
    if (!user) throw new Error('User not found');

    if (requestUserId === targetUserId) {
      return user;
    }

    const circle = await Circle.findOne({
      circleOwnerId: targetUserId,
      circleContacts: requestUserId,
    }).lean<ICircle>();

    if (!circle) { throw new Error('Error: requester does not exist in circles from target') }

    const result: Partial<IUser> = {};

    type AllowedUserField = keyof IAllowedInfo;

    const allowedEntries = Object.entries(circle.circleAllowedInfo) as [
      AllowedUserField,
      boolean
    ][];

    for (const [field, isAllowed] of allowedEntries) {
      if (isAllowed && user[field] !== undefined) {
        result[field] = user[field];
      }
    }

    return result;
  }

  async updateUser(authUserId: string, targetUserId: string, updates: UpdateUserDTO): Promise<IUser> {
    if (authUserId !== targetUserId) {
      throw new Error("Unauthorized");
    }

    const forbiddenFields = ['userEmail1'] as const;

    for (const key of forbiddenFields) {
      if (key in updates) {
        throw new Error(`Error: ${key} cannot be updated`);
      }
    }

    const user = await this.userModel.findByIdAndUpdate(
      targetUserId,
      updates,
      { new: true }
    );

    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUser(authUserId: string, targetUserId: string): Promise<void> {
    if (authUserId !== targetUserId) {
      throw new Error("Unauthorized");
    }

    const deleted = await this.userModel.findByIdAndDelete(targetUserId);
    if (!deleted) throw new Error("User not found");
  }
}
