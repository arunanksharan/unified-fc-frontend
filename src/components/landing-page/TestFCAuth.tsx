import React from 'react';
import { useSignIn, QRCode } from '@farcaster/auth-kit';
import LoginButtonV2 from '../atoms/farcaster/LoginButtonV2';

const TestFCAuth = () => {
  const { signIn, url, data, connect } = useSignIn({
    onSuccess: ({ fid }) => console.log('Your fid:', fid),
    onError: () => console.log('inside error'),
  });

  console.log('url', url);
  console.log('data', data);

  const onClickHandler = () => {
    connect();
    console.log('inside click');

    signIn();
  };
  return <div className="min-h-screen min-w-screen text-white"></div>;
};

export default TestFCAuth;
