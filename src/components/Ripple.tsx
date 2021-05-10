/** @jsxImportSource @emotion/react */
import React from 'react';
import { jsx } from '@emotion/react';
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
    const { passStyle, as = 'div', children, className = '', style, ...props } = this.props;

    return jsx(
      as,
      {
        ...(typeof as === 'string' ? { ref: this.elRef } : null),
        ...{
          className,
          css: [{ position: 'relative' }, style],
        },
        ...props,
      },
      [
        ...React.Children.toArray(children),
        <div key="ripple" className="rippleJS" css={{ zIndex: 2 }} />,
      ],
    );
  }
}

export function RippleButton(props: any) {
  return <Ripple {...{ ...props, as: Button }} />;
}

export default Ripple;
