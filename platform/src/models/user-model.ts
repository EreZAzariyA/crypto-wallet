export class EmailModel {
  email: string;
  isValidate?: boolean = false;
  isActive?: boolean = false;

  constructor(email: EmailModel) {
    this.email = email.email;
    this.isValidate = email.isValidate;
    this.isActive = email.isActive;
  }
};

class UserModel {
  _id: string;
  admin: boolean;
  profile: {
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  emails: EmailModel[];
  // config: {
  //   lang?: string,
  //   'theme-color'?: string
  // };

  // constructor(user: UserModel) {
  //   this._id = user._id;
  //   this.
  //   this.profile = user.profile;
  //   this.emails = user.emails;
  //   // this.config = user.config;
  // }
};

export default UserModel;