import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: colors.mediumGrey,
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
