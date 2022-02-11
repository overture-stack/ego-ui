/** @jsxImportSource @emotion/react */
import { API_ROOT, EGO_CLIENT_ID, EGO_JWT_KEY, KEYCLOAK_ENABLED } from 'common/injectGlobals';
import { css } from '@emotion/react';
import jwtDecode from 'jwt-decode';
import { ComponentType, useEffect } from 'react';
import styled from '@emotion/styled';

import ajax from 'services/ajax';
import { Orcid, Google, GitHub, LinkedIn } from './Icons';
import brandImage from 'assets/brand-image.svg';
import { isValidJwt } from './global/utils/egoJwt';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

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

enum LoginProvider {
  Keycloak = 'Keycloak',
  Google = 'Google',
  Github = 'GitHub',
  Linkedin = 'LinkedIn',
  Orcid = 'ORCiD',
}

enum ProviderLoginPaths {
  keycloak = 'keycloak',
  google = 'google',
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

export const adminCheck = (user, history) => {
  if (user.type === 'ADMIN' && user.status === 'APPROVED') {
    history.push('/users');
  } else {
    history.push('/no-access');
  }
};

const fetchEgoToken = (history: History<unknown>) => {
  ajax
    .post(`/oauth/ego-token?client_id=${EGO_CLIENT_ID}`, null, {
      withCredentials: true,
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`Could not login: ${res.statusText}`);
      }
      return res.data;
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
      localStorage.setItem(EGO_JWT_KEY, jwt);
      adminCheck(user, history);
    })
    .catch((err) => {
      console.warn('Error: ', err);
    });
};

const Login = () => {
  const history = useHistory();
  useEffect(() => {
    const egoJwt = localStorage.getItem(EGO_JWT_KEY);
    if (!isValidJwt(egoJwt)) {
      fetchEgoToken(history);
    }
  }, [history]);

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
};

export default Login;
