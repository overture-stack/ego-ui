import format from 'date-fns/format/index.js';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Grid } from 'semantic-ui-react';

import { DATE_KEYS } from 'common/injectGlobals';
import ContentPanelView from './ContentPanelView';

export const getFieldContent = (row, data) => {
  return DATE_KEYS.indexOf(row.key) >= 0
    ? format(data[row.key], 'YYYY-MM-DD hh:mm A')
    : row.key === 'lastName'
    ? `${data.firstName} ${data.lastName}`
    : data[row.key];
};

export const getUserFieldName = row => {
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
    thing: { item, associated, resource },
  },
}) => {
  const panelSections = groupBy(rows, 'panelSection');
  const normalizedRows = rows.map(row => normalizeRow(row, item, associated));
  return (
    <ContentPanelView
      entity={item}
      entityType={entityType}
      resource={resource}
      rows={normalizedRows}
    />
  );
};

export default enhance(ContentPanel);
