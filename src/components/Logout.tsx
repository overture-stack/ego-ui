/** @jsxImportSource @emotion/react */
import { injectState } from 'freactal';
import React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

const enhance = compose(withRouter, injectState);

const Component = ({ effects, history, className }) => {
  const handleClick = async () => {
    effects.setUser(null);
    history.push('/');
  };
  return (
    <div css={{ cursor: 'pointer' }} className={className} onClick={handleClick}>
      Log Out
    </div>
  );
};

export default enhance(Component);
