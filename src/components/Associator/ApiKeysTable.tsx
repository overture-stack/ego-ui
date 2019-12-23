import { css } from 'glamor';
import { upperCase } from 'lodash';
import moment from 'moment';
import React, { CSSProperties } from 'react';
import { compose } from 'recompose';
import { Grid, Label } from 'semantic-ui-react';

import { DARK_GREY, DEFAULT_BLACK, GREY, LIGHT_RED, LIGHT_TEAL } from 'common/colors';

interface IStyles {
  container: CSSProperties;
  row: CSSProperties;
  contentHeight: CSSProperties;
  contentRow: CSSProperties;
  fieldContent: CSSProperties;
  fieldNamePadding: CSSProperties;
  section: CSSProperties;
  fieldName: CSSProperties;
}

const DATE_FORMAT = 'YYYY-MM-DD hh:mm A';
const labelColours = {
  active: LIGHT_TEAL,
  expired: DARK_GREY,
  revoked: LIGHT_RED,
};

const titleStyle = css({
  backgroundColor: LIGHT_TEAL,
});

const getExpiryDate = expiry => {
  const now = moment().unix();
  return moment((now + expiry) * 1000).format(DATE_FORMAT);
};

const getStatus = expiry => {
  return expiry > 0 ? 'active' : 'expired';
};

const CustomLabel = ({ bgColor, children }) => (
  <Label style={{ backgroundColor: bgColor, fontWeight: 100, color: DEFAULT_BLACK }}>
    {children}
  </Label>
);

const styles: IStyles = {
  container: {
    borderLeft: `1px solid ${GREY}`,
    borderRight: `1px solid ${GREY}`,
    borderTop: `1px solid ${GREY}`,
    flex: 1,
    margin: '0.5rem 0',
  },
  row: {
    borderBottom: `1px solid ${GREY}`,
    display: 'flex',
    flex: 1,
    padding: 10,
  },
  contentHeight: {
    height: 48,
  },
  contentRow: {
    alignItems: 'center !important',
    padding: '0.5rem 0rem !important',
  },
  fieldContent: {
    fontSize: 14,
  },
  fieldName: {
    alignItems: 'center !important',
    color: DARK_GREY,
    display: 'inline-flex',
    fontSize: 11,
  },
  fieldNamePadding: {
    paddingRight: '10px',
  },
  section: {
    borderBottom: `1px solid ${GREY}`,
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    display: 'flex',
    flex: 1,
    flexBasis: 'auto',
    flexDirection: 'column',
  },
};

const ApiKeysTable = ({ associatedItems, disabledItems }) => {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <Grid style={styles.container}>
        {associatedItems.map(item => (
          <div className={`contentPanel id ${css(styles.section)}`}>
            <Grid.Row
              className={`${css(styles.contentRow, styles.contentHeight, {
                justifyContent: 'space-between',
              })}`}
              key={item.apiKey}
            >
              <Grid.Column width={12}>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  {item.apiKey}
                </span>
              </Grid.Column>
              <Grid.Column width={3}>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  <CustomLabel bgColor={labelColours[getStatus(item.exp)]}>
                    <span>{upperCase(getStatus(item.exp))}</span>
                  </CustomLabel>
                </span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              className={`${css(styles.contentRow, styles.contentHeight)}`}
              key={item.apiKey}
            >
              <Grid.Column width={16}>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  SCOPES:{' '}
                </span>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  {item.scope.join(', ')}
                </span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              className={`${css(styles.contentRow, styles.contentHeight, {
                justifyContent: 'space-between',
              })}`}
              key={item.apiKey}
            >
              <Grid.Column>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  ISSUED {moment(item.iss).format(DATE_FORMAT)}
                </span>
              </Grid.Column>
              <Grid.Column>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  EXPIRY {getExpiryDate(item.exp)}
                </span>
              </Grid.Column>
            </Grid.Row>
          </div>
        ))}
      </Grid>
    </div>
  );
};

// {associatedItems.map(item => (
//   <div key={item.apiKey} style={styles.row}>
//     <Grid.Row columns={2}>
//       {/* <Grid.Column width={12}> */}
//       <span>{item.apiKey}</span>
//       {/* </Grid.Column>
//       <Grid.Column width={4} style={{ justifyContent: 'flex-end' }}> */}
//       <CustomLabel bgColor={labelColours[getStatus(item.exp)]}>
//         <span>{upperCase(getStatus(item.exp))}</span>
//       </CustomLabel>
//       {/* </Grid.Column> */}
//     </Grid.Row>
//
//     <Grid.Row>
//       SCOPES:{' '}
//       {item.scope.map(scope => (
//         <span key={scope}>{scope}</span>
//       ))}
//     </Grid.Row>
//   </div>
//         ))}
{
  /* <div>
  <Grid.Column>
    <Grid.Row>
      SCOPES:{' '}
      {item.scope.map(scope => (
        <span key={scope}>{scope}</span>
      ))}
    </Grid.Row>
  </Grid.Column>
</div>
<div>
  <Grid.Column>
    <Grid.Row>ISSUED {moment(item.iss).format(DATE_FORMAT)}</Grid.Row>
  </Grid.Column>
  <Grid.Column>
    <Grid.Row>EXPIRY {getExpiryDate(item.exp)}</Grid.Row>
  </Grid.Column>
</div> */
}
export default ApiKeysTable;
