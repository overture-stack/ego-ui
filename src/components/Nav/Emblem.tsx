import styled from '@emotion/styled';

const Emblem = styled('div')`
  margin: 60px auto 0;
  .collapsed & {
    margin: 30px auto 0;
  }
  & img {
    display: block;
    margin: auto;
    &.small {
      height: 0px;
      visibility: hidden;
    }
    &.regular {
      width: 33%;
      visibility: visible;
    }
    .collapsed & {
      &.small {
        height: auto;
        width: 66%;
        visibility: visible;
      }
      &.regular {
        height: 0px;
        width: 33%;
        visibility: hidden;
      }
    }
  }
`;

export default Emblem;
