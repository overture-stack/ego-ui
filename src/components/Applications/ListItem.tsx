import React from 'react';
import { css } from 'glamor';

export default ({ item: { name }, style, className = '', ...props }) => {
  return (
    <div
      className={`${className} ${css(
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px 0',
          fontSize: 20,
        },
        style,
      )}`}
      {...props}
    >
      {name}
    </div>
  );
};
