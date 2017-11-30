import React from 'react';
import { css } from 'glamor';
import { Button } from 'semantic-ui-react';
import { withProps } from 'recompose';

export const Ripple = ({ passStyle, as = 'div', children, className = '', style, ...props }: any) =>
  React.createElement(
    as,
    {
      ...passStyle
        ? {
            className,
            style: { position: 'relative', ...style },
          }
        : {
            className: `${className} ${css({ position: 'relative' }, style)}`,
          },
      ...props,
    },
    [
      ...React.Children.toArray(children),
      <div key="ripple" className="rippleJS" style={{ zIndex: 2 }} />,
    ],
  );

export const RippleButton = withProps(() => ({ as: Button }))(Ripple);

export default Ripple;
