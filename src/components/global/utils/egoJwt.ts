import jwtDecode from 'jwt-decode';
import { memoize } from 'lodash';
import jwt from 'jsonwebtoken';

// import { EgoJwtData, UserWithId } from '../types';
import { EGO_PUBLIC_KEY } from 'common/injectGlobals';

const verifyJwt: (egoPublicKey: string) => (egoJwt?: string) => boolean = (egoPublicKey) => (
  egoJwt,
) => {
  try {
    if (!egoJwt || !egoPublicKey) {
      console.log('no jwt or no public key', egoJwt, 'public key: ', egoPublicKey);
      return false;
    } else {
      console.log('verifying');
      return jwt.verify(egoJwt, egoPublicKey, { algorithms: ['RS256'] }) && true;
    }
  } catch (err) {
    console.log('error!', err);
    return false;
  }
};

export const isValidJwt = verifyJwt(EGO_PUBLIC_KEY);

export const decodeToken: (egoJwt?: string) => any | null = memoize((egoJwt) =>
  egoJwt && isValidJwt(egoJwt) ? jwtDecode(egoJwt) : null,
);

export const extractUser: (decodedToken: any) => any | undefined = (decodedToken) => {
  if (decodedToken) {
    return {
      ...decodedToken?.context.user,
      scope: decodedToken?.context.scope || [],
      id: decodedToken?.sub,
    };
  }
  return undefined;
};
