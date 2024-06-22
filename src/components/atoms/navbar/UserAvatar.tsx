import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from '@headlessui/react';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { FaAngleDown, FaSignOutAlt } from 'react-icons/fa';

// Define the valid keys for the class dictionaries.
type ValidBgColors = 'showcastNavbar' | 'gsElectricBlue' | 'default';
type ValidBgHoverColors =
  | 'showcastNavbarHover'
  | 'gsElectricBlueHover'
  | 'default';

const bgColorClasses: Record<ValidBgColors, string> = {
  showcastNavbar: 'bg-showcastNavbar',
  gsElectricBlue: 'bg-gsElectricBlue',
  default: 'bg-default',
};

const bgColorHoverClasses: Record<ValidBgHoverColors, string> = {
  showcastNavbarHover: 'hover:bg-showcastNavbarHover',
  gsElectricBlueHover: 'hover:bg-gsElectricBlueHover',
  default: 'bg-defaultHover',
};

interface UserAvatarStylePropsInterface {
  bgColor?: string;
  bgColorHover?: string;
}

const UserAvatar: React.FC<UserAvatarStylePropsInterface> = ({
  bgColor = '#00ffff',
  bgColorHover = '#ffeedd',
}) => {
  const router = useRouter();
  // console.log('bgColor', bgColor);
  // console.log('bgColorHover', bgColorHover);
  const bgClass =
    bgColorClasses[bgColor as ValidBgColors] || bgColorClasses.default;

  // console.log('bgClass', bgClass);
  const bgHoverClass =
    bgColorHoverClasses[bgColorHover as ValidBgHoverColors] ||
    bgColorHoverClasses.default;
  // console.log('bgHoverClass', bgHoverClass);

  // const {
  //     isAuthenticated, profile: { displayName, pfpUrl },
  // } = useProfile();
  const session = useSession();
  const user = session.data?.user;
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div
        className={`flex flex-row justify-between items-center rounded-lg  ${bgClass} ${bgHoverClass} w-full mt-6`}
      >
        <MenuButton className="text-white font-manrope flex space-x-2 items-center px-12 mr-2 bg-opacity-20 h-full rounded-lg cursor-pointer text-sm outline-none border-none py-2">
          <img
            src={user.image || ''}
            alt=""
            className="h-9 w-9 my-1 rounded-full mr-6"
          />
          <span className="text-sm">{user.name}</span>
          <FaAngleDown />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={`absolute mt-1 right-0 z-10  w-56 origin-top-right rounded-md  ${bgClass} shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="">
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleSignOut}
                  className={classNames(
                    focus ? ' text-white' : 'text-white',
                    'block w-full px-4 py-2 text-left text-sm border-none rounded-md outline-none cursor-pointer ',
                    bgHoverClass
                  )}
                >
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <span className="text-sm">Sign Out</span>
                    <FaSignOutAlt />
                  </div>
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default UserAvatar;
