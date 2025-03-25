import { MenuProps, theme, ThemeConfig } from "antd";
import { ThemeColors } from "./enums";

export type MenuItem = Required<MenuProps>['items'][number];
export const getMenuItem = (
  label: React.ReactNode,
  key: React.Key | null,
  icon: React.ReactNode,
  children?: MenuItem[],
  style?: React.CSSProperties,
  type?: 'group',
  value?: string,
): MenuItem  => {
  return {
    key,
    icon,
    children,
    style,
    label,
    type,
    value,
  } as MenuItem;
};

export interface CategoryDataType {
  _id: string;
  name: string;
  editable: boolean;
};

export interface InvoiceDataType {
  _id: string;
  date: Date;
  category: string;
  description: string
  amount: number;
  editable: boolean;
};

export const getThemeConfig = (currTheme: string): ThemeConfig => {
  const isDarkTheme = currTheme === ThemeColors.DARK;
  const algorithm = isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return {
    algorithm,
    token: {
      colorBgContainer: isDarkTheme ? '#141414' : '#ffff',
      fontSizeHeading2: 28,
      fontSizeHeading3: 20,
      fontSizeHeading4: 18,
      fontWeightStrong: 500,
      fontSize: 14,
      fontFamily: 'Noto Serif Hebrew',
      fontFamilyCode: 'serif',
    },
    components: {
      Layout: {
        headerBg: isDarkTheme ? '#001529' : '#ffff',
        siderBg: isDarkTheme ? '#141414' : '#ffff',
        headerPadding: 0,
        headerHeight: 70,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
      Card: {
        headerFontSize: 20
      }
    }
  }
}