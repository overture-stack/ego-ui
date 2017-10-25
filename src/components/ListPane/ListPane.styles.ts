import colors from 'common/colors';

const styles = ({ columnWidth, rowHeight }) => ({
  container: {
    minWidth: columnWidth,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    overflowY: 'auto',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    '& .items-wrapper': {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 1,
      justifyContent: 'space-evenly',
      paddingLeft: 10,
      paddingRight: 10,
    },
  },

  listItem: {
    flexGrow: 1,
    cursor: 'pointer',
    padding: '0 1em',
    width: columnWidth,
    height: rowHeight,
    borderRadius: 3,
    '&:not(.selected):not(:active):hover': {
      background: 'linear-gradient(to right, #f0f0f0, #f9f9f9)',
    },
    '&:active': { backgroundColor: '#e0e0e0' },
    '&.selected': {
      backgroundColor: '#f0f0f0',
    },
  },

  filler: {
    width: columnWidth,
    height: rowHeight,
  },
});

export default styles;
