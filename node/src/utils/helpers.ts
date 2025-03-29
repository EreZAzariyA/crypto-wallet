import moment from "moment";
import bunyan, { LogLevel } from 'bunyan';
import { IUserModel } from "../models";

export const MAX_LOGIN_ATTEMPTS = 5;

export enum ThemeColors {
  DARK = "dark",
  LIGHT = "light"
};

export enum Languages {
  EN = "en",
  HE = "he"
};

export enum ErrorMessages {
  NAME_IN_USE = "Name is already in use.",
  SOME_ERROR = "Some error, please contact us.",
  SOME_ERROR_TRY_AGAIN = "Some error, please try again later.",
  INCORRECT_LOGIN_ATTEMPT = "Incorrect ID or Password.",
  BANK_ACCOUNT_NOT_FOUND = "We did not found any bank account related to this ID",
  MAX_LOGIN_ATTEMPTS = "You have pass the maximum login attempts. Please try again more 24 hours..",
  INCORRECT_PASSWORD = "Email or password are incorrect",
  COMPANY_NOT_SUPPORTED = "Company not supported",
  USER_NOT_FOUND = "User not found",
  USER_ID_MISSING = "User id is missing",
  USER_BANK_ACCOUNT_NOT_FOUND = "Some error while trying to find user with this account. Please contact us.",
  CREDENTIALS_SAVED_NOT_LOADED = "Some error while trying to load saved credentials. Please contact us.",
  DECODED_CREDENTIALS_NOT_LOADED = "Some error while trying to load decoded credentials. Please contact us.",
  TOKEN_EXPIRED = "Invalid or expired token"
};

export enum ENV_TYPE {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
};

export interface UserBankCredentials {
  companyId: string;
  id: string;
  password: string;
  username?: string;
  num: string;
  save: boolean;
};


export const getLogger = (name: string, version: string, level: LogLevel) => {
  return bunyan.createLogger({
    name: `${name}:${version}`,
    level,
    streams: [
      {
        stream: process.stdout,
        level
      }
    ]
  });
};

export const getLogLevel = (envType: ENV_TYPE): LogLevel => {
  return envType === ENV_TYPE.DEVELOPMENT ? "debug" : "info";
};

export const removeServicesFromUser = (user: IUserModel): Partial<IUserModel> => {
  const { services, ...rest } = user.toObject();
  return rest;
};

export const isArray = (arr: []): boolean => {
  return Array.isArray(arr);
};
export const isArrayAndNotEmpty = (arr: any): boolean => {
  return isArray(arr) && arr.length > 0;
};

export const getFutureDebitDate = (dateString: string | number): number => {
  if (typeof dateString === 'string') {
    const month = parseInt(dateString?.substring(0, 2)) - 1 || 0;
    const year = parseInt(dateString?.substring(2)) || 0;
    return new Date(year, month, 1).valueOf() || 0;
  }
  return moment(dateString).valueOf()
};

export const asNumString = (num: number = 0, digits: number = 2): string => {
  if (!num || typeof num !== 'number') {
    return '0'
  }
  const formattedNumber = num?.toFixed(digits);
  return parseFloat(formattedNumber || '0').toLocaleString();
};

export const USDT_ERC20_CONTRACT_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_upgradedAddress", "type": "address"}],
    "name": "deprecate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "deprecated",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_evilUser", "type": "address"}],
    "name": "addBlackList",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "upgradedAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "balances",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "maximumFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "_totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_maker", "type": "address"}],
    "name": "getBlackListStatus",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
    "name": "allowed",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "paused",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "who", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "newBasisPoints", "type": "uint256"}, {"name": "newMaxFee", "type": "uint256"}],
    "name": "setParams",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "issue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "redeem",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "remaining", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "basisPointsRate",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "isBlackListed",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_clearedUser", "type": "address"}],
    "name": "removeBlackList",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MAX_UINT",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_blackListedUser", "type": "address"}],
    "name": "destroyBlackFunds",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_initialSupply", "type": "uint256"}, {"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {"name": "_decimals", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
    "name": "Issue",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
    "name": "Redeem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "newAddress", "type": "address"}],
    "name": "Deprecate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "feeBasisPoints", "type": "uint256"}, {"indexed": false, "name": "maxFee", "type": "uint256"}],
    "name": "Params",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "_blackListedUser", "type": "address"}, {"indexed": false, "name": "_balance", "type": "uint256"}],
    "name": "DestroyedBlackFunds",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "_user", "type": "address"}],
    "name": "AddedBlackList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "_user", "type": "address"}],
    "name": "RemovedBlackList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "spender", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint"}
    ]
  }
]