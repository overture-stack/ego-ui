import React from 'react';
import { Button } from 'semantic-ui-react';

const styles = {
  fontWeight: 500,
};

export default ({ children, onClick }) => (
  <Button basic color="red" onClick={onClick} size="mini">
    <span style={styles}>{children}</span>
  </Button>
);
