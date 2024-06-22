import React, { CSSProperties } from 'react';
import { SignInButton } from '@farcaster/auth-kit';
import classNames from 'classnames';

interface CustomStyle extends CSSProperties {
  '--button-background-color'?: string;
  '--button-background-color-hover'?: string;
  '--button-text-font'?: string;
}
const FarcasterLoginBtn: React.FC<any> = ({
  fullWidth,
  className,
  buttonBgColor = '#855dcd', // default
  buttonBgColorHover = '#9578da', // default
  ...props
}) => {
  const style: CustomStyle = {
    '--button-background-color': buttonBgColor || '#855dcd',
    '--button-background-color-hover': buttonBgColorHover || '#9578da',
    '--button-text-font': 'Urbanist',
  };
  return (
    <span style={style} className={classNames('farcaster-login-btn', 'w-full')}>
      <SignInButton {...props} />
    </span>
  );
};

export default FarcasterLoginBtn;
