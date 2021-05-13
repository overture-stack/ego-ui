import React, { CSSProperties } from 'react';

import policyImg from 'assets/icons/group-3.svg';

const PolicyIcon = ({ style = {} }: { style?: CSSProperties }) => (
  <i
    className="icon"
    style={{
      background: `url("${policyImg}") no-repeat`,
      height: '1.2em',
      marginTop: '0.3em',
      ...style,
    }}
  />
);

export default PolicyIcon;
