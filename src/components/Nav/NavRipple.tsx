import styled from '@emotion/styled';
import Ripple from 'components/Ripple';

export const CollapsedRipple = styled(Ripple)`
  ${({ theme }) => `
    text-align: right;
    background-color: ${theme.colors.secondary_dark};
    color: ${theme.colors.white};
    font-size: 22px;
    padding: 10px;
  `}
`;

const LinkRipple = styled(Ripple)`
  ${({ theme }) => `
    font-weight: lighter; 
    line-height: 35px;
    font-size: 22px;
    color: ${theme.colors.white};
    position: relative;
    display: flex;
    width: 100%;
    padding: 4px;
    & .content {
      width: 60%;
      margin: auto;
      position: relative;
      z-index: 2;
      display: flex;
    }
    & i {
      flex: none;
    }
    &::before {
      display: block;
      position: absolute;
      z-index: 1;
      background-color: ${theme.colors.secondary_dark};
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding: 0.5em 0.5em;
      transform: scaleX(1) scaleY(1);
      boxShadow: -3px 0px 1px 1px rgba(0, 0, 0, 0.1);
      opacity: 0;
    }
    &:hover {
      color: ${theme.colors.white};
      background-color: ${theme.colors.secondary};
    }
    &.active {
      & div {
        text-shadow: -3px 2px 2px rgba(0,0,0,0.2);
      }
      &::before {
        box-shadow: -3px 3px 1px 1px rgba(0, 0, 0, 0.1);
        opacity: 1;
      }
      &::before, & .rippleJS {
        transform: scaleX(1.03) scaleY(1.05);
      }
    }
    & .text {
      margin-left: 5px;
      .collapsed & {
        opacity: 0;
      }
    }
  `}
`;

export default LinkRipple;
