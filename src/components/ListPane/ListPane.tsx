/** @jsxImportSource @emotion/react */
import { SyntheticEvent, useEffect, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { noop } from 'lodash';
import { compose, defaultProps } from 'recompose';
import { Button, Dropdown, Icon, Input } from 'semantic-ui-react';

import ControlContainer from 'components/ControlsContainer';
import Pagination from 'components/Pagination';
// import getStyles from './ListPane.styles';

// import { isChildOfPolicy } from 'common/associatedUtils';
import useListContext, { SortOrder } from 'components/global/hooks/useListContext';
import Table from './Table';
import schemas from 'common/schemas';
import useDebounce from 'components/global/hooks/useDebounce';

const enhance = compose(
  defaultProps({ columnWidth: 200, rowHeight: 60, onSelect: noop }),
  // withProps(({ columnWidth, resource, styles: stylesProp }) => ({
  //   styles: merge(getStyles({ columnWidth, rowHeight: resource.rowHeight }), [stylesProp]),
  // })),
);

const paneControls = {
  sortContainer: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    marginLeft: 24,
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  sortOrderWrapper: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  displayModeContainer: {
    marginRight: '10px',
  },
};

const List = () => {
  // const List = ({ onSelect, getKey, styles, selectedItemId, columnWidth, parent, resource }: any) => {
  const { list, listParams, setListParams, currentResource } = useListContext();
  const theme = useTheme();
  const columnWidth = 200;
  // TODO: for the moment schema setup for parent resources only
  const tableSchema = schemas[currentResource];
  const [query, setQuery] = useState<string>('');

  const debouncedQuery = useDebounce(query, 200);
  useEffect(() => {
    setListParams({ query: debouncedQuery });
  }, [debouncedQuery, setListParams]);

  return (
    <div
      css={css`
        min-width: ${columnWidth}px;
        background: ${theme.colors.grey_2};
        border-right: 1px solid ${theme.colors.grey_3};
        overflow-y: auto;
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        flex-direction: column;
        & .items-wrapper: {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          flex-grow: 1;
          justify-content: space-evenly;
          margin: 10px 10px 0px;
        }
      `}
    >
      <ControlContainer>
        <div css={paneControls.searchContainer}>
          <Input
            icon={
              listParams.query.length > 0 ? (
                <Icon name={'close'} onClick={() => setQuery('')} link={true} />
              ) : (
                <Icon name={'search'} />
              )
            }
            value={query}
            placeholder="Search..."
            onChange={(event, { value }) => setQuery(value)}
          />
        </div>
        <div css={paneControls.sortContainer}>
          Sort by:
          <Dropdown
            button
            style={{
              minWidth: '9.1em',
              marginLeft: '0.5em',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.grey_3}`,
              paddingLeft: '15px',
              paddingRight: '12px',
              fontWeight: 'normal',
              color: theme.colors.black,
            }}
            selectOnNavigation={false}
            text={listParams.sortField.fieldName}
          >
            <Dropdown.Menu>
              {schemas[currentResource]
                .filter((field) => field.sortable)
                .map((sortableField) => {
                  return (
                    <Dropdown.Item
                      key={sortableField.key}
                      text={sortableField.fieldName}
                      value={sortableField.key}
                      onClick={(
                        event: SyntheticEvent,
                        { value, text }: { value: string; text: string },
                      ) => {
                        setListParams({ sortField: { key: value, fieldName: text } });
                      }}
                    />
                  );
                })}
            </Dropdown.Menu>
          </Dropdown>
          <Button.Group css={paneControls.sortOrderWrapper} vertical>
            <Button
              style={{
                backgroundColor: 'transparent',
                paddingBottom: 0,
                ...(listParams.sortOrder === SortOrder.ASC && { color: theme.colors.primary_5 }),
              }}
              onClick={() =>
                setListParams({
                  sortOrder:
                    listParams.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
                })
              }
              icon="chevron up"
            />
            <Button
              style={{
                paddingTop: 0,
                backgroundColor: 'transparent',
                ...(listParams.sortOrder === 'DESC' && { color: theme.colors.primary_5 }),
              }}
              onClick={() =>
                setListParams({
                  sortOrder:
                    listParams.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
                })
              }
              icon="chevron down"
            />
          </Button.Group>
        </div>
      </ControlContainer>
      <Table schema={tableSchema} />
      {/* <ItemTable
        resultSet={list.resultSet}
        parent={parent}
        resource={resource}
        getKey={getKey}
        currentSort={{ sortField: listParams.sortField, sortOrder: listParams.sortOrder }}
        selectedItemId={selectedItemId}
        onSelect={onSelect}
        onSortChange={(newSortField, newSortOrder) => {
          setListParams({
            sortOrder: newSortOrder,
            sortField: resource
              .sortableFields(isChildOfPolicy(get(parent, 'resource')))
              .find((field) => field.key === newSortField),
          });
        }}
        handleListUpdate={updateList}
        onRemove={
          // only for child tables
          parent &&
          (async (item) => {
            const removeFunction =
              parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
            await removeFunction({
              [resource.name.plural]: item,
              item: parent,
            });
            updateList(resource, parent);
          })
        }
      /> */}
      {(listParams.limit < list.count || listParams.offset > 0) && (
        <Pagination
          onChange={(page) => setListParams({ offset: page * listParams.limit })}
          offset={listParams.offset}
          limit={listParams.limit}
          total={list.count}
          range={3}
        />
      )}
    </div>
  );
};

export default enhance(List);
