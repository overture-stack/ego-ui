import colors from './colors';
import dimensions from './dimensions';

const theme = {
  colors,
  dimensions,
};

export type GlobalTheme = typeof theme;

export default theme as GlobalTheme;
