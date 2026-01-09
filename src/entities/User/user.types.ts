import { Document } from "mongoose";

export interface IUser {
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
  createdAt: Date;
  updatedAt: Date;
}
export interface IUserWithPassword extends IUser, Document {
  userPassword: string;
  userComparePassword(candidatePassword: string): Promise<boolean>;
}
