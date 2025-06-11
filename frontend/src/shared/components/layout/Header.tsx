import { useGetMe } from '@/shared/hooks/useGetMe';
import { useToaster } from '@/shared/hooks/useToaster';
import { BellOutlined, DownOutlined, LogoutOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, type MenuProps } from 'antd';
const items: MenuProps['items'] = [
    {
        key: '1',
        label: 'My Account',
        disabled: true,
    },
    {
        type: 'divider',
    },
    {
        key: '2',
        label: 'Profile',
        icon: <ProfileOutlined />
    },
    {
        key: '3',
        label: 'Settings',
        icon: <SettingOutlined />,
    },
    {
        key: '4',
        label: 'Log Out',
        icon: <LogoutOutlined />,
    },
];

const Header = () => {
    const { user, isPending } = useGetMe();
    const toaster = useToaster();
    if (isPending) {
        return null;
    }

    return (
        <div className="w-full flex items-center justify-end bg-white px-4 py-2 shadow-sm border-b gap-4">
            <div className="relative cursor-pointer">
                <BellOutlined className="text-xl text-gray-600" onClick={() => {
                    toaster.success("clicked notification");
                }} />
            </div>

            <Dropdown menu={{ items }} trigger={['click']}>
                <div className="cursor-pointer flex items-center gap-2">
                    <Avatar icon={<UserOutlined />} />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name ?? "Unknown"}</span>
                    <DownOutlined />
                </div>
            </Dropdown>
        </div>
    );
};

export default Header;
