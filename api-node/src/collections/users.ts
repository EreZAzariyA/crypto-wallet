import { mongoose } from "../dal";

type GoogleUserType = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

type EmailType = {
  email: string,
  isValidate: boolean,
  isActive: boolean
};

export interface UserModel {
  _id: string;
  admin: boolean;
  profile: {
    first_name: string;
    last_name: string;
    image_url?: string
  };
  services: {
    password: string,
    google: GoogleUserType
  };
  emails: [EmailType];
  loginAttempts: {
    lastAttemptDate: number,
    attempts: number
  };
  createdAt: Date;
  updatedAt: Date;
};


export const Users = mongoose.db?.collection<UserModel>('users');