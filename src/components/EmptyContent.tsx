import { MEDIUM_GREY } from 'common/colors';
import { css } from 'glamor';
import React from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: MEDIUM_GREY,
    fontWeight: 200,
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
