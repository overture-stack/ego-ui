import * as React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import colors from 'common/colors';
import { googleLogin } from 'services/login';

const GOOGLE_CLIENT_ID =
  '814606937527-kk7ooglk6pj2tvpn7ldip6g3b74f8o72.apps.googleusercontent.com';

const styles = {
  container: {
    backgroundColor: colors.purple,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    marginLeft: 80,
  },
  loginIcon: {
    width: 20,
  },
  googleSignin: {
    marginTop: 20,
  },
  title: {
    fontWeight: 400,
  },
};

const gapi = global['gapi'];

const enhance = compose(injectState);

class Component extends React.Component {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
  };

  componentDidMount() {
    try {
      gapi.load('auth2', () => {
        /**
       * Retrieve the singleton for the GoogleAuth library and set up the
       * client.
       */
        gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
        });

        gapi.signin2.render('googleSignin', {
          scope: 'profile email',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const { id_token } = googleUser.getAuthResponse();
            this.handleGoogleToken(id_token);
          },
          onfailure: error => console.log('login fail', error),
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleGoogleToken = async token => {
    const response = await googleLogin(token);
    const props = this.props as any;
    if (response.status === 200) {
      const user = response.data[0];
      await props.effects.setUser(user);
      if (user.role === 'ADMIN') {
        props.history.push('/users');
      } else {
        props.history.push('/no-access');
      }
    } else {
      console.warn('response error');
    }
  };

  render() {
    return (
      <div className={`Login ${css(styles.container)}`}>
        <img
          src={require('assets/emblem-white.svg')}
          alt=""
          className={`${css(styles.logo)}`}
        />
        <h1 className={`${css(styles.title)}`}>DRP User Admin</h1>
        <div className={`${css(styles.googleSignin)}`} id="googleSignin" />
      </div>
    );
  }
}

export default enhance(Component);
