import { GREY } from 'common/colors';
import { css } from 'glamor';
import React from 'react';

const styles = {
  container: {
    alignItems: 'center',
    color: GREY,
    display: 'flex',
    fontSize: 20,
    fontWeight: 200,
    justifyContent: 'center',
    marginTop: '1rem',
  },
};

const EmptyContent: React.SFC<{
  message: string;
  className?: string;
  styles?: any;
}> = ({ message, className = '', styles: stylesProp }) => (
  <div className={`${className} ${css(styles.container, stylesProp)}`}>{message}</div>
);

export default EmptyContent;
