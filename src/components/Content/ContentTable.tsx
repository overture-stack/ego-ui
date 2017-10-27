import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';

const DATE_KEYS = ['createdAt', 'lastLogin'];

function normalizeRow(row: string | { fieldName: any; fieldValue: any }, data: Object[]) {
  const rowData =
    typeof row === 'string'
      ? {
          fieldName: row,
          fieldValue: data[row] ? (
            DATE_KEYS.indexOf(row) >= 0 ? (
              format(data[row], 'MMMM Do YYYY [a]t h:mmA')
            ) : (
              data[row]
            )
          ) : (
            <div style={{ opacity: 0.4, fontStyle: 'italic' }}>empty</div>
          ),
        }
      : row;

  return {
    fieldName:
      typeof rowData.fieldName === 'function'
        ? rowData.fieldName({ data })
        : _.upperCase(rowData.fieldName),
    fieldValue:
      typeof rowData.fieldValue === 'function' ? rowData.fieldValue({ data }) : rowData.fieldValue,
  };
}

export default ({ rows, data }) => {
  return (
    <Table basic="very" style={{ fontSize: 18 }}>
      <Table.Body>
        {rows.map(row => {
          const { fieldName, fieldValue } = normalizeRow(row, data);

          return (
            <Table.Row key={`${data.id}-${fieldName}`} style={{ verticalAlign: 'baseline' }}>
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
              <Table.Cell style={{ border: 'none' }}>{fieldValue}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
