import { API_ROOT, EGO_CLIENT_ID, KEYCLOAK_ENABLED } from 'common/injectGlobals';
import { injectState } from 'freactal';
import { css } from 'glamor';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { ComponentType } from 'react';
import { compose } from 'recompose';
import ajax from 'services/ajax';

import { BLUE, DEFAULT_BLACK, LIGHT_BLUE, TEAL, WHITE } from 'common/colors';
import { Orcid, Facebook, Google, GitHub, LinkedIn } from './Icons';

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
    height: '40%',
  },
  title: {
    fontWeight: 400,
  },
  loginButton: {
    borderRadius: '.25rem',
    color: WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 0.75rem',
    backgroundColor: BLUE,
    marginBottom: '1rem',
    minWidth: '200px',
    fontSize: '16px',
    transition: 'all .15s ease-in-out',
    ':hover': {
      color: WHITE,
      backgroundColor: LIGHT_BLUE,
    },
  },
};

const enhance = compose(injectState);

enum LoginProvider {
  Keycloak = 'Keycloak',
  Google = 'Google',
  // Facebook = 'Facebook',
  Github = 'GitHub',
  Linkedin = 'LinkedIn',
  Orcid = 'ORCiD',
}

enum ProviderLoginPaths {
  keycloak = 'keycloak',
  google = 'google',
  // facebook = 'facebook',
  github = 'github',
  linkedin = 'linkedin',
  orcid = 'orcid',
}

type IconComponent = ComponentType<{ width: number; height: number }>;

type ProviderType = {
  name: LoginProvider;
  path: ProviderLoginPaths;
  Icon?: IconComponent;
};

const providers: ProviderType[] = [
  { name: LoginProvider.Google, path: ProviderLoginPaths.google, Icon: Google },
  { name: LoginProvider.Orcid, path: ProviderLoginPaths.orcid, Icon: Orcid },
  { name: LoginProvider.Github, path: ProviderLoginPaths.github, Icon: GitHub },
  // { name: LoginProvider.Facebook, path: ProviderLoginPaths.facebook, Icon: Facebook },
  { name: LoginProvider.Linkedin, path: ProviderLoginPaths.linkedin, Icon: LinkedIn },
];

const KeycloakLogin = () => {
  return <a
    key={LoginProvider.Keycloak}
    href={`${API_ROOT}/oauth/login/${ProviderLoginPaths.keycloak}?client_id=${EGO_CLIENT_ID}`}
    className={`${css(styles.loginButton)}`}
  >
    <span className={`${css({ paddingLeft: 10 })}`}>Login/Register</span>
  </a>
}

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
        {
          KEYCLOAK_ENABLED && <KeycloakLogin />
        }
        {
          KEYCLOAK_ENABLED
            ? <h3 className={`${css(styles.title)}`}>Or login with one of the following services</h3>
            : <h3 className={`${css(styles.title)}`}>Login with one of the following</h3>
        }
        <ul
          className={`${css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
          })}`}
        >
          {providers
            .map(({ name, path, Icon }) => {
              return (
                <a
                  key={name}
                  href={`${API_ROOT}/oauth/login/${path}?client_id=${EGO_CLIENT_ID}`}
                  className={`${css(styles.loginButton)}`}
                >
                  {Icon !== undefined &&
                    <Icon width={15} height={15} />
                  }
                  <span className={`${css({ paddingLeft: 10 })}`}>{name}</span>
                </a>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default enhance(Component);
