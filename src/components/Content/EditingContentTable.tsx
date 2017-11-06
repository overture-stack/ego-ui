import React from 'react';
import _ from 'lodash';
import { Table, Input, Dropdown } from 'semantic-ui-react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

function rowInput({ data, row, stageChange }) {
  switch (row.type) {
    case 'dropdown':
      return (
        <Dropdown
          selection
          options={row.options.map(text => ({ text, value: text }))}
          text={data[row.key]}
          onChange={(event, { value }) => stageChange({ [row.key]: value })}
          style={{ fontSize: 14.1429 }}
        />
      );
    default:
      return (
        <Input
          size="mini"
          onChange={(e, { value }) => stageChange({ [row.key]: value })}
          type="text"
          value={data[row.key] || ''}
        />
      );
  }
}

function normalizeRow({
  row,
  data,
  associated,
  stageChange,
  immutableKeys,
}: {
  row: { key: string; fieldName: any; fieldContent: any; type: string; options: any };
  data: Object[];
  associated: Object[];
  stageChange: Function;
  immutableKeys: string[];
}) {
  const rowData = {
    ...row,
    fieldName: row.fieldName || row.key,
    fieldContent:
      row.fieldContent ||
      (immutableKeys.includes(row.key)
        ? data[row.key] || ''
        : rowInput({ row, data, stageChange })),
  };

  return {
    ...rowData,
    fieldName:
      typeof rowData.fieldName === 'function'
        ? rowData.fieldName({ associated, data, editing: true, stageChange })
        : _.upperCase(rowData.fieldName),
    fieldContent:
      typeof rowData.fieldContent === 'function'
        ? rowData.fieldContent({ associated, data, editing: true, stageChange })
        : rowData.fieldContent,
  };
}

const enhance = compose(injectState);

class EditingContentTable extends React.Component<any, any> {
  render() {
    const {
      rows,
      state: { thing: { staged, associated, type } },
      effects: { stageChange },
      hideImmutable,
    } = this.props;

    const immutableKeys = RESOURCE_MAP[type].schema.filter(f => f.immutable).map(f => f.key);

    return (
      <Table basic="very" style={{ fontSize: 18 }}>
        <Table.Body>
          {rows
            .filter(field => !hideImmutable || !immutableKeys.includes(field.key || field))
            .map(row => {
              const { key, fieldName, fieldContent } = normalizeRow({
                row,
                data: staged,
                associated,
                stageChange,
                immutableKeys,
              });

              return (
                <Table.Row key={`${staged.id}-${key}`} style={{ verticalAlign: 'baseline' }}>
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
  }
}

export default enhance(EditingContentTable);
