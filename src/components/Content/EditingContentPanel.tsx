/** @jsxImportSource @emotion/react */
import format from 'date-fns/format/index.js';
import { upperCase } from 'lodash';
import React from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import { css } from '@emotion/react';

import { DATE_FORMAT, DATE_KEYS } from 'common/injectGlobals';
import { getUserFieldName } from './ContentPanel';
import ContentPanelView from './ContentPanelView';
import { Application, Group, User } from 'common/typedefs';
import { IField } from 'common/typedefs/Resource';
import useEntityContext from 'components/global/hooks/useEntityContext';

const getFieldContent = (row, data, immutableKeys, stageChange) => {
  return (
    row.fieldContent ||
    (immutableKeys.includes(row.key)
      ? DATE_KEYS.indexOf(row.key) >= 0
        ? format(data[row.key], DATE_FORMAT)
        : data[row.key] || ''
      : rowInput({ row, data, stageChange }))
  );
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
          className="editDropdown"
          onChange={(event, { value }) => stageChange({ [row.key]: value })}
          options={(row.options || []).map((text) => ({ text, value: text }))}
          selection
          css={css`
            &.editDropdown.ui.selection.dropdown {
              min-width: 9rem;
              font-size: 12px;
            }
          `}
          text={data[row.key]}
          placeholder={data[row.key] ? undefined : `Select ${(row.fieldName || '').toLowerCase()}`}
        />
      );
    default:
      return (
        <div css={{ display: 'flex', flex: '0 0 100%' }}>
          {row.key === 'lastName' ? (
            <Input
              className="firstName"
              css={{ marginRight: 10 }}
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
            css={{ flex: 1 }}
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

const EditingContentPanel = ({ entityType, rows, hideImmutable = false }) => {
  const {
    entity: { resource, associated, staged },
    stageChange,
  } = useEntityContext();

  const immutableKeys = resource.schema.filter((f) => f.immutable).map((f) => f.key);
  const normalizedRows = rows
    .filter((field) => !hideImmutable || !immutableKeys.includes(field.key || field))
    .map((row) =>
      normalizeRow({
        associated,
        data: staged,
        immutableKeys,
        row,
        stageChange,
      }),
    );

  return <ContentPanelView entity={staged} entityType={entityType} rows={normalizedRows} />;
};

export default EditingContentPanel;
