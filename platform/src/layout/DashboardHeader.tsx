import "dayjs/locale/he";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import { MenuItem } from "../utils/antd";
import { useResize } from "../utils/helpers";
import { Dropdown, Flex, Layout, MenuProps } from "antd";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import MenuOutlined from "@ant-design/icons/MenuOutlined";

interface DashboardHeaderProps {
  collapsedHandler?: () => void;
  items: MenuItem[];
};

const { Header } = Layout;

const DashboardHeader = (props: DashboardHeaderProps) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { isMobile } = useResize();
  const [current, setCurrent] = useState<string>('1');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[locationArray.length - 1];
    setCurrent(currentLocation);
  }, [pathname]);

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      await dispatch(logoutAction()).unwrap();
    } else {
      setCurrent(e.key);
    }
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