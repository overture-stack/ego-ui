import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Grid, Table } from 'semantic-ui-react';

import { DARK_GREY, GREY, HIGH_CONTRAST_TEAL } from 'common/colors';

const DATE_KEYS = ['createdAt', 'lastLogin'];
const FIELD_NAME_WIDTHS = {
  application: 5,
  group: 3,
  policy: 3,
  user: 3,
};

const getFieldContent = (row, data) => {
  return DATE_KEYS.indexOf(row.key) >= 0
    ? format(data[row.key], 'YYYY-MM-DD hh:mm A')
    : row.key === 'lastName'
    ? `${data.firstName} ${data.lastName}`
    : data[row.key];
};

const getFieldName = row => {
  return row.key === 'lastName' ? 'Name' : row.fieldName || row.key;
};

function normalizeRow(
  row: { key: string; fieldName?: any; fieldContent?: any },
  data: object[],
  associated: any,
) {
  const rowData = {
    ...row,
    fieldContent:
      row.fieldContent ||
      (data[row.key] ? (
        getFieldContent(row, data)
      ) : (
        <span style={{ opacity: 0.4, fontStyle: 'italic' }}>empty</span>
      )),
    fieldName: getFieldName(row),
  };

  return {
    ...rowData,
    fieldContent:
      typeof rowData.fieldContent === 'function'
        ? rowData.fieldContent({ associated, data })
        : rowData.fieldContent,
    fieldName:
      typeof rowData.fieldName === 'function'
        ? rowData.fieldName({ associated, data })
        : upperCase(rowData.fieldName),
  };
}

const enhance = compose(injectState);

const styles = {
  fieldContent: {
    fontSize: 14,
  },
  fieldName: {
    color: DARK_GREY,
    fontSize: 11,
  },
  fieldNamePadding: {
    paddingRight: '10px',
  },
  section: {
    borderBottom: `1px solid ${GREY}`,
    marginLeft: '1.5rem',
    marginRight: '1rem',
    marginTop: '2rem',
    paddingBottom: '1rem',
  },
};

const ContentTable = ({
  entity,
  rows,
  state: {
    thing: { item, associated },
  },
}) => {
  const panelSections = groupBy(rows, 'panelSection');

  return (
    <div>
      <div className={`contentPanel id ${css(styles.section)}`}>
        <Grid>
          {panelSections['id'].map(row => {
            const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
            if (row.key === 'firstName') {
              return null;
            }
            return (
              <Grid.Row key={`${item.id}-${key}`}>
                <Grid.Column width={FIELD_NAME_WIDTHS[entity]}>
                  <span
                    className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                  >
                    {fieldName}
                  </span>
                </Grid.Column>
                <Grid.Column width={10}>
                  <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {fieldContent}
                  </span>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </div>

      {panelSections['meta'].length > 0 && (
        <div className={`contentPanel meta ${css(styles.section)}`}>
          <Grid columns="equal">
            {entity === 'user' ? (
              <React.Fragment>
                <Grid.Row>
                  {panelSections['meta'].slice(0, 2).map(row => {
                    const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
                    return (
                      <Grid.Column key={`${item.id}-${key}`}>
                        <Grid.Row>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { display: 'inline-block', width: 80 },
                            )}`}
                          >
                            {fieldName}
                          </span>

                          <span
                            className={`contentFieldContent ${css(
                              styles.fieldContent,
                              ...(entity === 'user' &&
                              key === 'type' &&
                              fieldContent.toLowerCase() === 'admin'
                                ? [{ color: HIGH_CONTRAST_TEAL }]
                                : []),
                            )}`}
                          >
                            {fieldContent}
                          </span>
                        </Grid.Row>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>

                <Grid.Row>
                  {panelSections['meta'].slice(2, 4).map(row => {
                    const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
                    return (
                      <Grid.Column key={`${item.id}-${key}`}>
                        <Grid.Row>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { display: 'inline-block', width: 80 },
                            )}`}
                          >
                            {fieldName}
                          </span>
                          <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                            {fieldContent}
                          </span>
                        </Grid.Row>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>
              </React.Fragment>
            ) : (
              panelSections['meta'].map(row => {
                const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
                return (
                  <Grid.Row key={`${item.id}-${key}`}>
                    <Grid.Column width={FIELD_NAME_WIDTHS[entity]}>
                      <span
                        className={`contentFieldName ${css(
                          styles.fieldName,
                          styles.fieldNamePadding,
                        )}`}
                      >
                        {fieldName}
                      </span>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                        {fieldContent}
                      </span>
                    </Grid.Column>
                  </Grid.Row>
                );
              })
            )}
          </Grid>
        </div>
      )}

      <div className={`contentPanel associatedTypes ${css(styles.section)}`}>
        <Grid>
          {panelSections['associatedTypes'].map(row => {
            const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
            return (
              <Grid.Row key={`${item.id}-${key}`}>
                <Grid.Column verticalAlign={'top'}>
                  <span
                    className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                  >
                    {fieldName}
                  </span>
                  <div className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {fieldContent}
                  </div>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default enhance(ContentTable);
