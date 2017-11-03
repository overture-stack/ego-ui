import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';
import { compose } from 'recompose';
import { injectState } from 'freactal';

const DATE_KEYS = ['createdAt', 'lastLogin'];

function normalizeRow(
  row: string | { key: string; fieldName: any; fieldContent: any },
  data: Object[],
  associated: any,
) {
  const rowData =
    typeof row === 'string'
      ? {
          key: row,
          fieldName: row,
          fieldContent: data[row] ? (
            DATE_KEYS.indexOf(row) >= 0 ? (
              format(data[row], 'MMMM Do YYYY [a]t h:mmA')
            ) : (
              data[row]
            )
          ) : (
            <div style={{ opacity: 0.4, fontStyle: 'italic' }}>empty</div>
          ),
        }
      : { ...row, fieldName: row.fieldName || row.key };

  return {
    ...rowData,
    fieldName:
      typeof rowData.fieldName === 'function'
        ? rowData.fieldName({ associated, data })
        : _.upperCase(rowData.fieldName),
    fieldContent:
      typeof rowData.fieldContent === 'function'
        ? rowData.fieldContent({ associated, data })
        : rowData.fieldContent,
  };
}

const enhance = compose(injectState);

const ContentTable = ({ rows, state: { thing: { item, associated } } }) => {
  return (
    <Table basic="very" style={{ fontSize: 18 }}>
      <Table.Body>
        {rows.map(row => {
          const { key, fieldName, fieldContent } = normalizeRow(row, item, associated);

          return (
            <Table.Row key={`${item.id}-${key}`} style={{ verticalAlign: 'baseline' }}>
              <Table.Cell
                style={{
                  fontSize: '0.65em',
                  border: 'none',
                  textAlign: 'right',
                  width: '6em',
                }}
              >
                {fieldName}
              </Table.Cell>
              <Table.Cell style={{ border: 'none' }}>{fieldContent}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default enhance(ContentTable);
