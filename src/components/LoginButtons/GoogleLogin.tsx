import React from 'react';
import { googleAppId } from 'common/injectGlobals';
import { css } from 'glamor';

const gapi = global.gapi;

const styles = {
  googleSignin: {
    marginTop: 20,
    marginBottom: 20,
  },
};

export default class extends React.Component<any, any> {
  async componentDidMount() {
    try {
      gapi.load('auth2', () => {
        /**
         * Retrieve the singleton for the GoogleAuth library and set up the
         * client.
         */
        gapi.auth2.init({
          client_id: googleAppId,
        });

        gapi.signin2.render('googleSignin', {
          scope: 'profile email',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const { id_token } = googleUser.getAuthResponse();
            this.props.onLogin(id_token);
          },
          onfailure: error => global.log('login fail', error),
        });
      });
    } catch (e) {
      global.log(e);
    }
  }
  componentWillUnmount() {
    global.FB.Event.unsubscribe('auth.login', this.props.onLogin);
  }
  render() {
    const { style, className = '' } = this.props;
    return <div className={`${className} ${css(styles.googleSignin, style)}`} id="googleSignin" />;
  }
}
