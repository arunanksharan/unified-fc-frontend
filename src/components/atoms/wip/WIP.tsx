import React, { ReactNode } from 'react';

interface OverlayProps {
  children: ReactNode;
  isWip: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ children, isWip }) => {
  return (
    <div className={`relative ${isWip ? 'pointer-events-none' : ''}`}>
      {children}
      {isWip && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-10">
          <p className="text-white text-xl bg-showcastNavbar px-12 py-2 absolute top-20 left-0 transform -rotate-12 origin-top-left ">
            This app is under development!
          </p>
        </div>
      )}
    </div>
  );
};

export default Overlay;
