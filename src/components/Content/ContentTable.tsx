import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Grid, Table } from 'semantic-ui-react';

import { DARK_GREY, GREY, HIGH_CONTRAST_TEAL } from 'common/colors';

const DATE_KEYS = ['createdAt', 'lastLogin'];

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
  rows,
  state: {
    thing: { item, associated },
  },
}) => {
  const section1 = rows.filter(row => row.panelSection === 1);
  const section2 = rows
    .filter(row => row.panelSection === 2)
    .map(row => normalizeRow(row, item, associated));
  return (
    <div>
      <div className={`contentPanel one ${css(styles.section)}`}>
        <Grid>
          {section1.map(row => {
            const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
            if (row.key === 'firstName') {
              return null;
            }
            return (
              <Grid.Row key={key}>
                <Grid.Column width={3}>
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
      <div className={`contentPanel two ${css(styles.section)}`}>
        <Grid columns="equal">
          <Grid.Row centered>
            {/* need to do with map to retain custom field order */}
            {section2
              .filter(rowItem => !DATE_KEYS.includes(rowItem.key))
              .map(({ key, fieldName, fieldContent }) => {
                return (
                  <Grid.Column key={key}>
                    <Grid.Row>
                      <Grid.Column>
                        <span
                          className={`contentFieldName ${css(
                            styles.fieldName,
                            styles.fieldNamePadding,
                          )}`}
                        >
                          {fieldName}
                        </span>

                        <span
                          className={`contentFieldContent ${css(
                            styles.fieldContent,
                            ...(key === 'type' ? [{ color: HIGH_CONTRAST_TEAL }] : []),
                          )}`}
                        >
                          {fieldContent}
                        </span>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid.Column>
                );
              })}
          </Grid.Row>
          <Grid.Row centered>
            {section2
              .filter(rowItem => DATE_KEYS.includes(rowItem.key))
              .map(({ key, fieldName, fieldContent }) => {
                return (
                  <Grid.Column key={key}>
                    <Grid.Row>
                      <Grid.Column verticalAlign={'top'}>
                        <span
                          className={`contentFieldName ${css(
                            styles.fieldName,
                            styles.fieldNamePadding,
                          )}`}
                        >
                          {fieldName}
                        </span>
                        <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                          {fieldContent}
                        </span>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid.Column>
                );
              })}
          </Grid.Row>
        </Grid>
      </div>
    </div>
    // {/* // <Table basic="very" style={{ fontSize: 18 }}>
    // //   <Table.Body>
    // //     {rows.map(row => {
    // //       const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);
    // //       if (row.key === 'firstName') {
    // //         return null;
    // //       }
    // //       return (
    // //         <div>
    // //           <Table.Row key={`${item.id}-${key}`} style={{ verticalAlign: 'baseline' }}>
    // //             <Table.Cell
    // //               style={{
    // //                 border: 'none',
    // //                 fontSize: '0.65em',
    // //                 textAlign: 'right',
    // //                 width: '6em',
    // //               }}
    // //             >
    // //               {fieldName}
    // //             </Table.Cell>
    // //             <Table.Cell style={{ border: 'none' }}>{fieldContent}</Table.Cell>
    // //           </Table.Row>
    // //         </div>
    // //
    // //       );
    // //     })}
    // //   </Table.Body>
    // // </Table> */}
  );
};

export default enhance(ContentTable);
