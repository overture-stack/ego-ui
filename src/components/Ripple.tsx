import React from 'react';
import { css } from 'glamor';

export default ({ as = 'div', children, className = '', style, ...props }: any) =>
  React.createElement(
    as,
    {
      className: `hat ${className} ${css({ position: 'relative' }, style)}`,
      ...props,
    },
    [
      ...React.Children.toArray(children),
      <div key="ripple" className="rippleJS" style={{ zIndex: 2 }} />,
    ],
  );
