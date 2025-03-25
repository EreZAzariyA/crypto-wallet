import "dayjs/locale/he";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import { MenuItem } from "../utils/antd";
import { useResize } from "../utils/helpers";
import { Dropdown, Flex, Layout, MenuProps } from "antd";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import { getUserWalletsAction } from "../redux/actions/wallets-actions";
import socketIo from "../services/socketServices";

interface DashboardHeaderProps {
  collapsedHandler?: () => void;
  items: MenuItem[];
};

const { Header } = Layout;

const DashboardHeader = (props: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [current, setCurrent] = useState<string>('1');
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResize();

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[1];
    setCurrent(currentLocation);
  }, [pathname]);

  useEffect(() => {
  }, []);
  
  useEffect(() => {
    if (user._id) {
      socketIo.sendHandshake(user._id);
      dispatch(getUserWalletsAction({ user_id: user._id.toString() }));
    }
  }, [dispatch, user]);

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      await dispatch(logoutAction()).unwrap();
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

  return (
    <Header>
      <Flex align="center" justify="space-between">
        <Flex>
          {isMobile && (
            <Dropdown
              menu={{
                items: props.items,
                selectable: true,
                selectedKeys: [current],
                onClick: onClick,
                className: "dropdown-menu",
              }}
              arrow
              overlayClassName="dropdown-container"
              trigger={['click']}
              open={isOpen}
              onOpenChange={setIsOpen}
              className="dropdown-area"
            >
              <div className="menu-btn">
                {isOpen ? <CloseOutlined /> : <MenuOutlined />}
              </div>
            </Dropdown>
          )}
        </Flex>
 
      </Flex>
    </Header>
  );
};

export default DashboardHeader;