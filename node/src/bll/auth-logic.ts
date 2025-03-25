import { ClientError, IUserModel, UserModel } from "../models";
import CredentialsModel from "../models/credentials-model";
import { comparePassword, encryptPassword } from "../utils/bcrypt-utils";
import { removeServicesFromUser, ErrorMessages, MAX_LOGIN_ATTEMPTS } from "../utils/helpers";
import jwtService from "../utils/jwt";


class AuthenticationLogic {
  signup = async (user: IUserModel): Promise<string> => {
    const newEncryptedPassword: string = await encryptPassword(user.services.password);
    user.services.password = newEncryptedPassword;

    const errors = user.validateSync();
    if (errors) {
      throw new ClientError(500, errors.message);
    }

    const savedUser = await user.save();
    const userWithoutServices = removeServicesFromUser(savedUser);
    const token = jwtService.getNewToken(userWithoutServices);
    return token;
  };

  signin = async (credentials: CredentialsModel): Promise<{ token: string, user_id: string }> => {
    const user = await UserModel.findOne({ 'emails.email': credentials.email }).exec();
    if (!user) {
      throw new ClientError(400, ErrorMessages.INCORRECT_PASSWORD);
    }

    if (user.loginAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
      throw new ClientError(500, ErrorMessages.MAX_LOGIN_ATTEMPTS);
    }

    const passwordMatch = await comparePassword(credentials.password, user.services.password || '');
    if (!passwordMatch) {
      user.loginAttempts = {
        attempts: user.loginAttempts.attempts + 1 || 1,
        lastAttemptDate: new Date().valueOf()
      };
      await user.save({ validateBeforeSave: true });
      throw new ClientError(400, ErrorMessages.INCORRECT_PASSWORD);
    }

    user.loginAttempts = {
      attempts: 0,
      lastAttemptDate: new Date().valueOf()
    };
    await user.save({ validateBeforeSave: true });

    const userWithoutServices = removeServicesFromUser(user);
    const token = jwtService.getNewToken(userWithoutServices);

    return { token, user_id: user._id.toString() };
  };
};

const authLogic = new AuthenticationLogic();
export default authLogic;