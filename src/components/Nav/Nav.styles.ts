import colors from 'common/colors';

const styles = {
  container: {
    position: 'relative',
    backgroundColor: colors.purple,
    color: '#fff',
    width: 240,
    padding: '30px 50px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    width: '100%',
    margin: '30px 0 70px',
  },

  linkList: {
    flexGrow: 1,
    fontSize: 22,
    fontWeight: 'lighter',
    lineHeight: '35px',
    margin: '0 -50px',
  },

  logout: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: 'lighter',
  },
  link: {
    color: '#fff',
    position: 'relative',
    display: 'flex',
    width: '100%',
    padding: '4px 50px',
    '& span': {
      position: 'relative',
      zIndex: 2,
    },
    '&::before': {
      display: 'block',
      position: 'absolute',
      zIndex: 1,
      backgroundColor: '#6a0e65',
      content: '""',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      padding: '0.5em 0.5em',
      transition: 'opacity 0.15s, transform 0.2s 0.15s, box-shadow 0.2s 0.15s',
      transform: 'scaleX(1) scaleY(1)',
      boxShadow: '-3px 0px 1px 1px rgba(0, 0, 0, 0.1)',
      opacity: 0,
    },
    '&:hover': {
      color: '#fff',
      backgroundColor: '#771872',
    },
    '&.active': {
      '& span': {
        textShadow: '-3px 2px 2px rgba(0,0,0,0.2)',
      },
      '&::before': {
        transform: 'scaleX(1.03) scaleY(1.05)',
        boxShadow: '-3px 3px 1px 1px rgba(0, 0, 0, 0.1)',
        opacity: 1,
      },
    },
  },
};

export default styles;
