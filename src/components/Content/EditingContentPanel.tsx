import { Application, Group, User } from 'common/typedefs';
import { IField } from 'common/typedefs/Resource';
import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Dropdown, Grid, Input } from 'semantic-ui-react';

import { DATE_FORMAT, DATE_KEYS } from 'common/injectGlobals';
import { getUserFieldName } from './ContentPanel';
import ContentPanelView from './ContentPanelView';

const getFieldContent = (row, data, immutableKeys, stageChange) => {
  if (row.key === 'lastName') {
    return `${data.firstName} ${data.lastName}`;
  } else {
    return (
      row.fieldContent ||
      (immutableKeys.includes(row.key)
        ? DATE_KEYS.indexOf(row.key) >= 0
          ? format(data[row.key], DATE_FORMAT)
          : data[row.key] || ''
        : rowInput({ row, data, stageChange }))
    );
  }
};

function rowInput({
  data,
  row,
  stageChange,
}: {
  data: User | Group | Application;
  row: IField;
  stageChange: (object) => void;
}) {
  switch (row.fieldType) {
    case 'dropdown':
      return (
        <Dropdown
          onChange={(event, { value }) => stageChange({ [row.key]: value })}
          options={(row.options || []).map(text => ({ text, value: text }))}
          selection
          style={{ minWidth: '9rem', fontSize: '12px' }}
          text={data[row.key]}
          placeholder={data[row.key] ? undefined : `Select ${(row.fieldName || '').toLowerCase()}`}
        />
      );
    default:
      return (
        <div style={{ display: 'flex', flex: '0 0 100%' }}>
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
  row: IField;
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

class EditingContentPanel extends React.Component<any, any> {
  render() {
    const {
      entityType,
      rows,
      state: {
        entity: { staged, associated, resource },
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
      <ContentPanelView
        entity={staged}
        entityType={entityType}
        hideImmutable={hideImmutable}
        resource={resource}
        rows={normalizedRows}
      />
    );
  }
}

export default enhance(EditingContentPanel);
