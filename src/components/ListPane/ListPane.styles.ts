import defaultTheme from 'theme';

const styles = ({ columnWidth, rowHeight }) => ({
  container: {
    minWidth: columnWidth,
    background: defaultTheme.colors.grey_2,
    borderRight: `1px solid ${defaultTheme.colors.grey_3}`,
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
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    },
  },

  listItemWrapper: {
    width: columnWidth,
    height: rowHeight,
    flexGrow: 1,
    position: 'relative',
    '& .remove': {
      opacity: 0,
    },
    '&:hover .remove': {
      opacity: 0.4,

      '&:hover': {
        opacity: 1,
      },
    },
  },
  listItem: {
    cursor: 'pointer',
    padding: '0 14px',
    borderRadius: 3,
    height: '100%',
    '&:not(.selected):not(:active):hover': {
      background: `linear-gradient(to right, ${defaultTheme.colors.grey_2}, ${defaultTheme.colors.grey_0})`,
    },
    '&:active': { backgroundColor: defaultTheme.colors.grey_0 },
    '&.selected': {
      backgroundColor: defaultTheme.colors.grey_0,
      boxShadow: `-1px 2px 1px 0px rgba(199, 194, 199, 0.4), 0px 0px 2px 0px rgba(195, 184, 195, 0.3)`,
    },
  },

  filler: {
    flexGrow: 1,
    padding: '0 14px',
    width: columnWidth,
    height: rowHeight,
  },
});

export default styles;
