import React from 'react';
import { css } from 'glamor';

const styles = {
  button: {
    backgroundColor: 'inherit',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    padding: 0,
  },
};

export default ({ children, style, className = '', ...props }: any) => (
  <button {...props} className={`${className} ${css(styles.button, style)}`}>
    {children}
  </button>
);
