import { css } from 'glamor';
import { upperCase } from 'lodash';
import React, { CSSProperties } from 'react';
import { compose } from 'recompose';
import { Button, Grid, Label } from 'semantic-ui-react';

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
  ACTIVE: LIGHT_TEAL,
  EXPIRED: DARK_GREY,
  REVOKED: LIGHT_RED,
};

const titleStyle = css({
  backgroundColor: LIGHT_TEAL,
});

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
  contentHeight: {
    height: 34,
  },
  contentRow: {
    alignItems: 'center !important',
    padding: '0.5rem 0rem !important',
  },
  fieldContent: {
    fontSize: 13,
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
  row: {
    borderBottom: `1px solid ${GREY}`,
    display: 'flex',
    flex: 1,
    padding: 10,
  },
  section: {
    borderBottom: `1px solid ${GREY}`,
    display: 'flex',
    flex: 1,
    flexBasis: 'auto',
    flexDirection: 'column',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
  },
};

const ApiKeysTable = ({ associatedItems, disabledItems, editing }) => {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <Grid style={styles.container}>
        {associatedItems.slice(0, 5).map(item => (
          <div className={`contentPanel id ${css(styles.section)}`} key={item.id}>
            <Grid.Row
              className={`${css(styles.contentRow, styles.contentHeight, {
                justifyContent: 'space-between',
              })}`}
            >
              <Grid.Column width={12}>
                <span
                  className={`contentFieldContent ${css(styles.fieldContent, { fontWeight: 600 })}`}
                >
                  {item.id}
                </span>
              </Grid.Column>
              <Grid.Column width={3}>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  {editing && item.status === 'ACTIVE' ? (
                    <Button color="red" size="tiny">
                      REVOKE
                    </Button>
                  ) : (
                    <CustomLabel bgColor={labelColours[item.status]}>
                      <span>{item.status}</span>
                    </CustomLabel>
                  )}
                </span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
              <Grid.Column width={16}>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  {'SCOPES: '}
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
            >
              <Grid.Column>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  {'ISSUED '}
                </span>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  {item.iss}
                </span>
              </Grid.Column>
              <Grid.Column>
                <span
                  className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                >
                  {'EXPIRY '}
                </span>
                <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                  {item.exp}
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
