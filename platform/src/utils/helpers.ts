import { useEffect, useState } from "react";
import dayjs from "dayjs";
import UserModel from "../models/user-model";
import { ThemeColors } from "./enums";

export type ColorType = {
  ICON: string;
  DANGER: string;
};

export const Colors: ColorType  = {
  ICON: '#08c',
  DANGER: 'red'
};

export type SizeType = {
  ICON: number;
  TOP_MENU_ICON: number;
  MENU_ICON: number;
  SUB_MENU_ICON: number;
}
export const Sizes: SizeType = {
  ICON: 25,
  TOP_MENU_ICON: 20,
  MENU_ICON: 25,
  SUB_MENU_ICON: 20
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals",
  Last_Transactions = "Transactions"
};

const getStyle = (theme: string): string => {
  if (theme === ThemeColors.LIGHT) {
    return 'black';
  } else if (theme === ThemeColors.DARK) {
    return Colors.ICON;
  }
  return '';
};

export const getStyleForTheme = (component: string, themeColor: string): string => {
  let color = '';
  switch (component) {
    case 'icon':
      color = getStyle(themeColor);
    break;

  }

  return color;
}

export const useResize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 501,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth <= 992,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        isPhone: window.innerWidth <= 500,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth <= 992
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

export const asNumber = (num: number, digits: number = 2) => (
  parseFloat(num?.toFixed(digits)) || 0
);

export const asNumString = (num: number = 0, digits: number = 2): string => {
  if (!num || typeof num !== 'number') {
    return '0'
  }
  const formattedNumber = num?.toFixed(digits);
  return parseFloat(formattedNumber || '0').toLocaleString();
};


export const getUserfName = (user: UserModel) => {
  if (!user) return '';
  return user.profile.first_name;
};

export const getDataFromStringDate = (stringDate: string): string => {
  const month = parseInt(stringDate.substring(0, 2)) - 1;
  const year = parseInt(stringDate.substring(2));
  return dayjs().set('year', year).set('month', month).format('MM-YYYY');
};

export const getError = (err: any) => {
  if(typeof err === "string") return err;
  if(typeof err.response?.data === "string") return err.response.data; // axios: 401, 403, 500
  if(Array.isArray(err.response?.data)) return err.response.data[0]; // axios: 400 - array of errors
  if(typeof err.message === "string") return err.message;
  return "Some error, please try again.";
};

// export const getMenuItems = (isAdmin: boolean) => {
//   const routes = isAdmin ? AdminRoutes : UserRoutes;

//   const menuItems: MenuItem[] = routes.children.map(({ path }) => {
//     const pathname = path.split('/')[path.split('/').length - 1];
//     return {
//       label: t(`menu.${pathname}`),
//       key: pathname,
//     }
//   });

//   return menuItems;
// };