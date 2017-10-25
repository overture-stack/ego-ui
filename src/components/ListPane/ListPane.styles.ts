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
    minWidth: columnWidth,
    height: rowHeight,
    '&:hover': { backgroundColor: '#f0f0f0' },
  },

  filler: {
    minWidth: columnWidth,
    height: rowHeight,
  },
});

export default styles;
