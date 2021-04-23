/** @jsxImportSource @emotion/react */
import React from 'react';
import useAuthContext from './global/hooks/useAuthContext';

const Logout = ({ className }: { className?: string }) => {
  const { logout } = useAuthContext();
  return (
    <div css={{ cursor: 'pointer' }} className={className} onClick={logout}>
      Log Out
    </div>
  );
};

export default Logout;
