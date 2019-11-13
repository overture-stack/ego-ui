import { Application, Group, User } from 'common/typedefs';
import { TField } from 'common/typedefs/Resource';
import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Dropdown, Grid, Input } from 'semantic-ui-react';

import { getUserFieldName } from './ContentTable';
import ContentView from './ContentView';

const FIELD_NAME_WIDTHS = {
  application: 5,
  group: 3,
  policy: 3,
  user: 4,
};

const DATE_KEYS = ['createdAt', 'lastLogin'];

const getFieldContent = (row, data, immutableKeys, stageChange) =>
  row.fieldContent || // fieldContent is for associatedTypes
  (immutableKeys.includes(row.key)
    ? DATE_KEYS.indexOf(row.key) >= 0
      ? format(data[row.key], 'YYYY-MM-DD hh:mm A')
      : data[row.key] || ''
    : rowInput({ row, data, stageChange })); // for all mutable fields

function rowInput({
  data,
  row,
  stageChange,
}: {
  data: User | Group | Application;
  row: TField;
  stageChange: (object) => void;
}) {
  switch (row.fieldType) {
    case 'dropdown':
      return (
        <Dropdown
          onChange={(event, { value }) => stageChange({ [row.key]: value })}
          options={(row.options || []).map(text => ({ text, value: text }))}
          placeholder={'Select'}
          selection
          style={{ minWidth: '9rem', fontSize: '12px' }}
          text={data[row.key]}
        />
      );
    default:
      return (
        <div style={{ display: 'flex', flex: '0 0 100%' }}>
          {row.key === 'lastName' ? (
            <Input
              className={`firstName ${css({ marginRight: 10 })}`}
              size="mini"
              onChange={(e, { value }) => stageChange({ firstName: value })}
              type="text"
              value={data['firstName'] || ''}
            />
          ) : null}
          <Input
            size="mini"
            onChange={(e, { value }) => stageChange({ [row.key]: value })}
            type="text"
            value={data[row.key] || ''}
            style={{ flex: 1 }}
          />
        </div>
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
  row: TField;
  data: object[];
  associated: object[];
  stageChange: () => void;
  immutableKeys: string[];
}) {
  const rowData = {
    ...row,
    fieldContent: getFieldContent(row, data, immutableKeys, stageChange),
    fieldName: getUserFieldName(row),
  };

  return {
    ...rowData,
    fieldContent:
      typeof rowData.fieldContent === 'function'
        ? rowData.fieldContent({ associated, data, editing: true, stageChange })
        : rowData.fieldContent,
    fieldName:
      typeof rowData.fieldName === 'function'
        ? (rowData.fieldName as any)({ associated, data, editing: true, stageChange })
        : upperCase(rowData.fieldName),
  };
}

const enhance = compose(injectState);

class EditingContentTable extends React.Component<any, any> {
  render() {
    const {
      entityType,
      rows,
      state: {
        thing: { staged, associated, resource },
      },
      effects: { stageChange },
      hideImmutable,
    } = this.props;

    const immutableKeys = resource.schema.filter(f => f.immutable).map(f => f.key);
    const normalizedRows = rows
      .filter(field => !hideImmutable || !immutableKeys.includes(field.key || field))
      .map(row =>
        normalizeRow({
          associated,
          data: staged,
          immutableKeys,
          row,
          stageChange,
        }),
      );

    return (
      <ContentView
        entity={staged}
        entityType={entityType}
        fieldNameWidths={FIELD_NAME_WIDTHS}
        hideImmutable={hideImmutable}
        resource={resource}
        rows={normalizedRows}
      />
    );
  }
}

export default enhance(EditingContentTable);
