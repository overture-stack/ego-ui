import { css } from 'glamor';
import moment from 'moment';
import React, { CSSProperties } from 'react';
import { compose, withHandlers, withPropsOnChange, withState } from 'recompose';
import { Button, Grid, Label } from 'semantic-ui-react';

import { DARK_GREY, DEFAULT_BLACK, GREY, LIGHT_TEAL } from 'common/colors';
import { DATE_FORMAT } from 'common/injectGlobals';
import { getApiKeyStatus } from './apiKeysUtils';

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

const labelColours = {
  ACTIVE: LIGHT_TEAL,
  EXPIRED: GREY,
  REVOKED: GREY,
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
  contentHeight: {
    height: 34,
  },
  contentRow: {
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

const enhance = compose(
  // setting items in state to show revoking changes immediately
  withState('items', 'setItems', ({ associatedItems }) => associatedItems),
  withHandlers({
    handleAction: ({ onRemove, fetchItems, setItems, parentId }) => async (item) => {
      await onRemove(item);
      const response = await fetchItems({ userId: parentId, limit: 5 });
      setItems(response.resultSet);
    },
  }),
  withPropsOnChange(['associatedItems'], ({ associatedItems, setItems }) =>
    setItems(associatedItems),
  ),
);

const ApiKeysTable = ({ disabledItems, editing, handleAction, items }) => {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <Grid style={styles.container}>
        {items.map((item) => {
          const status = getApiKeyStatus(item);
          return (
            <div className={`contentPanel id ${css(styles.section)}`} key={item.name}>
              <Grid.Row
                className={`${css(styles.contentRow, styles.contentHeight, {
                  justifyContent: 'space-between',
                })}`}
              >
                <Grid.Column width={12}>
                  <span
                    className={`contentFieldContent ${css(styles.fieldContent, {
                      fontWeight: 600,
                    })}`}
                  >
                    {item.name}
                  </span>
                </Grid.Column>
                <Grid.Column width={3}>
                  <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {editing && status === 'ACTIVE' ? (
                      <Button color="red" onClick={() => handleAction(item)} size="tiny">
                        REVOKE
                      </Button>
                    ) : (
                      <CustomLabel bgColor={labelColours[status]}>
                        <span>{status}</span>
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
                    {moment(item.issueDate).format(DATE_FORMAT)}
                  </span>
                </Grid.Column>
                <Grid.Column>
                  <span
                    className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                  >
                    {'EXPIRY '}
                  </span>
                  <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {moment(item.expiryDate).format(DATE_FORMAT)}
                  </span>
                </Grid.Column>
              </Grid.Row>
            </div>
          );
        })}
      </Grid>
    </div>
  );
};

export default enhance(ApiKeysTable);
