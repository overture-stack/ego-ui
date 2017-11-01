import React from 'react';
import { css } from 'glamor';

const paneControls = {
  container: {
    backgroundColor: 'rgba(144, 144, 144, 0.05)',
    borderBottom: '1px solid #eaeaea',
    display: 'flex',
    minHeight: 70,
    alignItems: 'center',
  },
};

export default ({ children, style, className = '', ...props }: any) => {
  return (
    <div className={`${className} pane-controls ${css(paneControls.container, style)}`} {...props}>
      {children}
    </div>
  );
};
