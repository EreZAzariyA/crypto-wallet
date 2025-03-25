import axios from "axios";
import { CredentialResponse } from "@react-oauth/google";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import UserModel from "../../models/user-model";
import config from "../../utils/config";
import CredentialsModel from "../../models/credentials-model";

export enum AuthActions {
  SIGN_UP = "auth/sign-up",
  SIGN_IN = "auth/sign-in",
  GOOGLE_SIGN_IN = "auth/google-sign-in",
  LOGOUT = "auth/logout"
};

export const signupAction = createAsyncThunk<string>(
  AuthActions.SIGN_UP,
  async (user, thunkApi) => {
    try {
      await axios.post<string>(config.urls.auth.signup, user);
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const signinAction = createAsyncThunk<{ user_id: string }, CredentialsModel>(
  AuthActions.SIGN_IN,
  async (credentials, thunkApi) => {
    try {
      if (!(credentials.email || credentials.password)) {
        throw new Error('Some fields are missing');
      }
      const res = await axios.post<string>(config.urls.auth.signIn, credentials);
      const user_id = res.data;
      return thunkApi.fulfillWithValue({ user_id });
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const googleSignInAction = createAsyncThunk<string, CredentialResponse>(
  AuthActions.GOOGLE_SIGN_IN,
  async (tokenResponse, thunkApi) => {
    const response = await axios.post<string>(config.urls.auth.googleSignIn, tokenResponse);
    const token = response.data;
    if (token && typeof token === 'string') {
      // const user = jwtDecode(token) as UserModel;
      // thunkApi.dispatch(setUserTheme(user.config["theme-color"]));
      // thunkApi.dispatch(setUserLang(user.config.lang));
      return token;
    }
    return thunkApi.rejectWithValue(null);
  }
);

export const logoutAction = createAsyncThunk<void>(
  AuthActions.LOGOUT,
  async (_, thunkApi) => {
    try {
      await axios.post<void>(config.urls.auth.logout);
    } catch (err) {
      thunkApi.rejectWithValue(err);
    }
  }
);