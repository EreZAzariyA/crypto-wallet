import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import DashboardHeader from "./DashboardHeader";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { MenuItem } from "../utils/antd";
import { ThemeColors } from "../utils/enums";
import { Layout, Menu, MenuProps } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import { BsReceipt } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { VscAccount } from "react-icons/vsc";
import { PiUsersThreeLight } from "react-icons/pi";
import { LiaWalletSolid } from "react-icons/lia";
import { useIdleTimer } from "react-idle-timer";
import socketServices from "../services/socketServices";
import { getUserWalletsAction } from "../redux/actions/wallets-actions";
import { AdminRoutes, UserRoutes } from "../routes";

const { Sider, Content } = Layout;

const DashboardView = (props: { admin?: boolean }) => {
  const { admin } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isMobile } = useResize();
  const { _id: user_id } = useAppSelector((state) => state.auth.user);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);
  const [current, setCurrent] = useState<string>('dashboard');

  const isDarkTheme = false;
  const themeToSet = isDarkTheme ? ThemeColors.DARK : ThemeColors.LIGHT;

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: () => dispatch(logoutAction()),
  });

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[locationArray.length - 1];
    setCurrent(currentLocation);
  }, [pathname]);

  useEffect(() => {
    socketServices.connect(user_id);

    return () => {
      socketServices.disconnect(user_id);
    }
  }, []);

  useEffect(() => {
    if (!admin && user_id) {
      dispatch(getUserWalletsAction(user_id));
    }
  }, [dispatch, user_id, admin]);

  const icons: any = {
    dashboard: <RxDashboard size={Sizes.MENU_ICON} />,
    wallets: <LiaWalletSolid size={Sizes.MENU_ICON} />,
    transactions: <BsReceipt size={Sizes.MENU_ICON} />,
    account: <VscAccount size={Sizes.MENU_ICON} />,
    users: <PiUsersThreeLight size={Sizes.MENU_ICON} />,
    "sign-out": <AiOutlineLogout color={Colors.DANGER} size={Sizes.SUB_MENU_ICON} />,
  };

  const routes = admin ? AdminRoutes : UserRoutes;
  const menuItems: MenuItem[] = routes.children.map((route) => {
    const routeName = route.path.split('/')[route.path.split('/').length - 1];

    return {
      label: <Link to={route.path}>{t(`menu.${routeName}`)}</Link>,
      key: routeName,
      icon: icons[routeName],
    }
  });

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      await dispatch(logoutAction()).unwrap();
    } else {
      setCurrent(e.key);
    }
  };

  return (
    <Layout className="main-layout">
      <DashboardHeader
        collapsedHandler={() => setIsCollapsed(!isCollapsed)}
        items={menuItems}
      />
      <Layout hasSider>
        {!isMobile && (
          <Sider
            collapsed={isCollapsed}
            collapsedWidth={80}
            theme={themeToSet}
            collapsible
            onCollapse={(e) => setIsCollapsed(e)}
          >
            <Menu
              mode="inline"
              theme={themeToSet}
              items={menuItems}
              onClick={onClick}
              selectedKeys={[current]}
            />
          </Sider>
        )}
        <Content className="site-layout">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardView;