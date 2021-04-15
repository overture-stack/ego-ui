import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';

import { DATE_FORMAT, DATE_KEYS } from 'common/injectGlobals';
import ContentPanelView from './ContentPanelView';

const EmptyField = () => <span style={{ opacity: 0.4, fontStyle: 'italic' }}>empty</span>;

export const getFieldContent = (row, data) => {
  if (row.fieldContent) {
    return row.fieldContent;
  }
  if (DATE_KEYS.indexOf(row.key) >= 0) {
    return format(data[row.key], DATE_FORMAT);
  }
  if (row.key === 'lastName') {
    if (!data.firstName.length && !data.lastName.length) {
      return <EmptyField />;
    }
    return [data.firstName, data.lastName].join(' ');
  }
  return data[row.key] || <EmptyField />;
};

export const getUserFieldName = (row) => {
  return row.key === 'lastName' ? 'Name' : row.fieldName || row.key;
};

function normalizeRow(
  row: { key: string; fieldName?: any; fieldContent?: any },
  data: object[],
  associated: any,
) {
  const rowData = {
    ...row,
    fieldContent: getFieldContent(row, data),
    fieldName: getUserFieldName(row),
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

const ContentPanel = ({
  entityType,
  rows,
  state: {
    entity: { item, associated, resource },
  },
}) => {
  const normalizedRows = rows.map((row) => normalizeRow(row, item, associated));
  return <ContentPanelView entity={item} entityType={entityType} rows={normalizedRows} />;
};

export default enhance(ContentPanel);
