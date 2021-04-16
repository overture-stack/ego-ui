const base = {
  white: '#fff', // WHITE
  black: '#282a35', // replace previous DEFAULT_BLACK
};

const grey = {
  grey_0: '#f9f9f9',
  grey_1: '#f2f5f8',
  grey_2: '#f2f3f5', // #eaeaea, LIGHT_GREY
  grey_3: '#dfdfe1', // GREY
  grey_4: '#cecfd3',
  grey_5: '#aeafb3',
  grey_6: '#5e6068', // DARK_GREY
  grey_highlight: '#eceff2',
};

// teals
const primary = {
  primary_1: '#e5fbf8', // LIGHT_TEAL
  primary_2: '#ccf8f2',
  primary_3: '#99f1e5',
  primary_4: '#40e6cf',
  primary_5: '#00ddbe', // TEAL, VERY_LIGHT_TEAL
  primary_6: '#00c4a7',
  primary_7: '#00a88f', // HIGH_CONTRAST_TEAL
};

// dark blues
const accent = {
  accent: '#04518c',
  accent_light: '#4f85ae',
  accent_dark: '#003055', // DARK_BLUE
  accent_1: '#e5edf3',
};

// light blues
const secondary = {
  secondary: '#4bc6f0', // LIGHT_BLUE
  secondary_light: '#edf9fd',
  secondary_dark: '#109ed9', // BLUE
  secondary_accessible: '#0c7cac', // MEDIUM_BLUE
  secondary_1: '#d2f1fb',
  secondary_2: '#aee5f8',
};

const accent2 = {
  accent2_dark: '#9e005d',
  accent2: '#b74a89',
  accent2_light: '#f7ecf3',
};

const error = {
  error: '#c86370',
  error_dark: '#ad404e', // RED
  error_1: '#f9eff0',
  error_2: '#e9c1c6',
  error_3: '#842c37',
};

const warning = {
  warning: '#f2d021',
  warning_dark: '#e6c104',
};

const colors = {
  ...base,
  ...grey,
  ...accent,
  ...accent2,
  ...primary,
  ...secondary,
  ...error,
  ...warning,
};

export default colors;
