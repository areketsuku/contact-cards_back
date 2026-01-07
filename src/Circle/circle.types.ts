import { Document, Types } from "mongoose";

export interface IAllowedInfo {
  name: boolean;
  surname1: boolean;
  surname2: boolean;
  email1: boolean;
  email2: boolean;
  phone1: boolean;
  phone2: boolean;
  country: boolean;
  adress: boolean;
  link1: boolean;
  link2: boolean;
  avatar: boolean;
}

export interface ICircle extends Document {
  circleOwnerId: Types.ObjectId;
  circleName: string;
  circleContacts: Types.ObjectId[];
  circleAllowedInfo: IAllowedInfo;
  createdAt: Date;
  updatedAt: Date;
}
