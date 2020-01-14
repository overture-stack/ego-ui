import React from 'react';

import { RED } from 'common/colors';

const styles = {
  color: RED,
  fontWeight: 500,
  textDecoration: 'underline',
};

export default ({ children, onClick }) => (
  <span onClick={onClick} style={styles}>
    {children}
  </span>
);
