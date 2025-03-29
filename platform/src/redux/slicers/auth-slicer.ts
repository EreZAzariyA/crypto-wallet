import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import { logoutAction, signinAction, signupAction } from '../actions/auth-actions';
import { UserModel } from '../../models';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  user: UserModel;
  token: string;
  loading: boolean;
  error: SerializedError | null;
};

const token = Cookies.get('token');
const user = token ? jwtDecode(token) as UserModel : null;

const initialState: AuthState = {
  user,
  token,
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  // Sign-In
  builder.addCase(signinAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(signinAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(signinAction.fulfilled, (_, action) => ({
    loading: false,
    error: null,
    token: action.payload,
    user: jwtDecode(action.payload),
  }));

  // Sign-Up
  builder.addCase(signupAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(signupAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(signupAction.fulfilled, (state) => ({
    ...state,
    loading: false,
    error: null,
  }));

  // // Google Sign-In
  // builder.addCase(googleSignInAction.pending, (state) => ({
  //   ...state,
  //   loading: true,
  //   error: null
  // }))
  // .addCase(googleSignInAction.rejected, (state, action) => ({
  //   ...state,
  //   loading: false,
  //   error: action.error
  // }))
  // .addCase(googleSignInAction.fulfilled, (_, action) => {
  //   localStorage.setItem('token', action.payload);
  //   return {
  //     loading: false,
  //     error: null,
  //     user: action.payload,
  //   }
  // });

  // Logout
  builder.addCase(logoutAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(logoutAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(logoutAction.fulfilled, (state) => ({
    ...state,
    loading: false,
    error: null,
    user: null,
    token: null
  }));
};

const authSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers
});

export default authSlicer.reducer;