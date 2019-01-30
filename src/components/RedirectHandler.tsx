import React from 'react';
import PropTypes from 'prop-types';

import jwtDecode from 'jwt-decode';
import queryString from 'querystring';

import { compose } from 'recompose';
import { injectState } from 'freactal';
import urlJoin from 'url-join';

import Login from 'components/Login';

const enhance = compose(injectState);

import ajax from 'services/ajax';

const RedirectHandler = props => {
  ajax
    .post(
      `/oauth/ego-token?client_id=ego`,
      {},
      {
        withCredentials: true,
      },
    )
    .then(async ({ data: jwt }) => {
      const jwtData = jwtDecode(jwt);
      const user = {
        ...jwtData.context.user,
        id: jwtData.sub,
      };
      await props.effects.setUser(user);
      await props.effects.setToken(jwt);

      if (user.role === 'ADMIN') {
        props.history.push('/users');
      } else {
        props.history.push('/no-access');
      }
    });

  return null;
};

export default enhance(RedirectHandler);
