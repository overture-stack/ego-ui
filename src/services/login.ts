import ajax from 'services/ajax';

const gapi = global['gapi'];
gapi.load('auth2');

export const googleLogin = token =>
  ajax.get(`/login/google`, { headers: { id_token: token } });

export const googleLogout = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (authInstance) {
    return authInstance.signOut();
  } else {
    // already signed out
    return Promise.resolve();
  }
};
