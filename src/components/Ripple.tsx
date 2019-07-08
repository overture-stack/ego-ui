import React from 'react';
import { css } from 'glamor';
import { Button } from 'semantic-ui-react';

export class Ripple extends React.Component<any, any> {
  elRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.elRef = React.createRef();
  }

  contains(target: any) {
    return this.elRef.current && this.elRef.current.contains(target);
  }

  render() {
    const { passStyle, as = 'div', children, className = '', style, ...props } = this.props as any;
    return React.createElement(
      as,
      {
        ...(typeof as === 'string' ? { ref: this.elRef } : null),
        ...(passStyle
          ? {
              className,
              style: { position: 'relative', ...style },
            }
          : {
              className: `${className} ${css({ position: 'relative' }, style)}`,
            }),
        ...props,
      },
      [
        ...React.Children.toArray(children),
        <div key="ripple" className="rippleJS" style={{ zIndex: 2 }} />,
      ],
    );
  }
}

export function RippleButton(props: any) {
  return <Ripple {...{ ...props, as: Button }} />;
}

export default Ripple;
