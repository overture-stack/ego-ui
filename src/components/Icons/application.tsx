import React, { CSSProperties } from 'react';

import applicationImg from 'assets/icons/layers-icon.svg';

const ApplicationIcon = ({ style = {} }: { style?: CSSProperties }) => (
  <i
    className="icon"
    style={{
      background: `url("${applicationImg}") no-repeat`,
      height: '1.2em',
      marginTop: '0.2em',
      ...style,
    }}
  />
);

export default ApplicationIcon;
