/** @jsxImportSource @emotion/react */
import { API_ROOT, EGO_CLIENT_ID, KEYCLOAK_ENABLED } from 'common/injectGlobals';
import { injectState } from 'freactal';
import { css } from '@emotion/react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { ComponentType } from 'react';
import { compose } from 'recompose';
import styled from '@emotion/styled';

import ajax from 'services/ajax';
import { Orcid, Google, GitHub, LinkedIn } from './Icons';
import brandImage from 'assets/brand-image.svg';

const styles = {
  logo: {
    marginLeft: 0,
    width: '20%',
    height: '40%',
  },
  title: {
    fontWeight: 400,
  },
};

const LoginButton = styled('a')`
  ${({ theme }) => `
  border-radius: .25rem;
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  background-color: ${theme.colors.secondary_dark};
  margin-bottom: 1rem;
  min-width: 200px;
  font-size: 16px;
  transition: all .15s ease-in-out;
  :hover {
    color: ${theme.colors.white};
    background-color: ${theme.colors.secondary};
  }
  `}
`;

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
  return (
    <LoginButton
      key={LoginProvider.Keycloak}
      href={`${API_ROOT}/oauth/login/${ProviderLoginPaths.keycloak}?client_id=${EGO_CLIENT_ID}`}
    >
      <span css={{ paddingLeft: 10 }}>Login/Register</span>
    </LoginButton>
  );
};

class Component extends React.Component<any, any> {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
  };

  componentDidMount() {
    ajax
      .post(`/oauth/ego-token?client_id=${EGO_CLIENT_ID}`, null, { withCredentials: true })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.data;
        } else {
          return '';
        }
      })
      .then(async (jwt) => {
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
      .catch((err) => {
        console.warn('Error: ', err);
      });
  }

  render() {
    return (
      <div
        className="Login"
        css={(theme) => ({
          backgroundColor: theme.colors.primary_5,
          color: theme.colors.white,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        })}
      >
        <img src={brandImage} alt="" css={styles.logo} />
        <h1 css={styles.title}>Admin Portal</h1>

        <ul
          // object style did not work here: typescript complained about property 'flexDirection',
          // instead was looking for FlexDirection or FlexDirection[]', which did not apply the correctly rendered style
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin-top: 0.5rem;
          `}
        >
          {KEYCLOAK_ENABLED && (
            <div
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <KeycloakLogin />
            </div>
          )}
          <h3 css={styles.title}>
            {KEYCLOAK_ENABLED
              ? 'Or login with one of the following services'
              : 'Login with one of the following'}
          </h3>
          {providers.map(({ name, path, Icon }) => {
            return (
              <LoginButton
                key={name}
                href={`${API_ROOT}/oauth/login/${path}?client_id=${EGO_CLIENT_ID}`}
              >
                {Icon !== undefined && <Icon width={15} height={15} />}
                <span css={{ paddingLeft: 10 }}>{name}</span>
              </LoginButton>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default enhance(Component);
