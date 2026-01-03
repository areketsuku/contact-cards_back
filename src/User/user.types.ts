import {Document} from "mongoose";

export interface IUser extends Document {
  userName: string;
  userSurname1?: string;
  userSurname2?: string;
  userEmail1: string;
  userEmail2?: string;
  userPhone1?: string;
  userPhone2?: string;
  userCountry?: string;
  userAdress?: string;
  userLink1?: string;
  userLink2?: string;
  userPassword: string;
  userAvatar?: string;
  userCreatedAt: Date;
  userComparePassword(candidatePassword: string): Promise<boolean>;
}
