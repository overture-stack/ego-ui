import React from 'react';
import { Button } from 'semantic-ui-react';

const ActionButton = ({ children, onClick }) => (
  <Button basic color="red" onClick={onClick} size="mini">
    <span
      style={{
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  </Button>
);

export default ActionButton;
