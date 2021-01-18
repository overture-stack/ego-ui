import { API_ROOT, EGO_CLIENT_ID } from 'common/injectGlobals';
import { injectState } from 'freactal';
import { css } from 'glamor';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import ajax from 'services/ajax';

import { TEAL } from 'common/colors';

const styles = {
  container: {
    backgroundColor: TEAL,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  logo: {
    marginLeft: 0,
    width: '20%',
  },
  title: {
    fontWeight: 400,
  },
  loginButton: {
    borderRadius: '.25rem',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '.5rem .75rem',
    backgroundColor: '#00a1d8',
    marginBottom: '1rem',
    minWidth: '200px',
    fontSize: '16px',
    transition: 'all .15s ease-in-out',
    ':hover': {
      color: '#fff',
      backgroundColor: '#53BFE5',
    },
  },
};

const enhance = compose(injectState);

/* enum LoginProvider {
 *   Google = 'GOOGLE',
 *   Facebook = 'FACEBOOK',
 *   Github = 'GITHUB',
 *   LinkedIn = 'LINKEDIN',
 * }
 *  */
const endpoints = {
  google: `${API_ROOT}/oauth/login/google?client_id=${EGO_CLIENT_ID}`,
  facebook: `${API_ROOT}/oauth/login/facebook?client_id=${EGO_CLIENT_ID}`,
  github: `${API_ROOT}/oauth/login/github?client_id=${EGO_CLIENT_ID}`,
  linkedin: `${API_ROOT}/oauth/login/linkedin?client_id=${EGO_CLIENT_ID}`,
};

class Component extends React.Component<any, any> {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
  };

  componentDidMount() {
    ajax
      .post(`/oauth/ego-token?client_id=${EGO_CLIENT_ID}`, null, { withCredentials: true })
      .then(resp => {
        if (resp.status === 200) {
          return resp.data;
        } else {
          return '';
        }
      })
      .then(async jwt => {
        if (jwt === '') {
          return;
        }
        const jwtData = jwtDecode(jwt);
        const user = {
          ...jwtData.context.user,
          id: jwtData.sub,
        };

        await this.props.effects.setUser(user);
        await this.props.effects.setToken(jwt);

        if (user.type === 'ADMIN' && user.status === 'APPROVED') {
          if (this.props.location.pathname === '/') {
            this.props.history.push('/users');
          }
        } else {
          this.props.history.push('/no-access');
        }
      })
      .catch(err => {
        console.warn('Error: ', err);
      });
  }

  render() {
    return (
      <div className={`Login ${css(styles.container)}`}>
        <img src={require('assets/brand-image.svg')} alt="" className={`${css(styles.logo)}`} />
        <h1 className={`${css(styles.title)}`}>Admin Portal</h1>
        <h3 className={`${css(styles.title)}`}>Login with one of the following</h3>
        <a href={endpoints.google} className={`${css(styles.loginButton)}`}>
          <i className="fab fa-google" /> &nbsp; Google
        </a>
        <a href={endpoints.facebook} className={`${css(styles.loginButton)}`}>
          <i className="fab fa-facebook" /> &nbsp; Facebook
        </a>
        <a href={endpoints.github} className={`${css(styles.loginButton)}`}>
          <i className="fab fa-github" /> &nbsp; GitHub
        </a>
        <a href={endpoints.linkedin} className={`${css(styles.loginButton)}`}>
          <i className="fab fa-linkedin" /> &nbsp; LinkedIn
        </a>
      </div>
    );
  }
}

export default enhance(Component);
