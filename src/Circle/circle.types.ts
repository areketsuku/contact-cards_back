import { Document, Types } from 'mongoose';

export type CircleType = 'default' | 'custom';

export interface IAllowedInfo {
  userName: boolean;
  userSurname1: boolean;
  userSurname2: boolean;
  userEmail1: boolean;
  userEmail2: boolean;
  userPhone1: boolean;
  userPhone2: boolean;
  userCountry: boolean;
  userAddress: boolean;
  userLink1: boolean;
  userLink2: boolean;
  userAvatar: boolean;
}

export interface ICircle extends Document {
  circleOwnerId: Types.ObjectId;
  circleName: string;
  circleType: CircleType;
  circleContacts: Types.ObjectId[];
  circleAllowedInfo: IAllowedInfo;
  createdAt: Date;
  updatedAt: Date;
}
