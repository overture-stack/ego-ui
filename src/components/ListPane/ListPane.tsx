/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { noop } from 'lodash';
// import React, { useEffect } from 'react';
import { compose, defaultProps } from 'recompose';
import { Button, Dropdown } from 'semantic-ui-react';
// import { useParams } from 'react-router';

import ControlContainer from 'components/ControlsContainer';
import Pagination from 'components/Pagination';
// import { RippleButton } from 'components/Ripple';
// import getStyles from './ListPane.styles';

// import { isChildOfPolicy } from 'common/associatedUtils';
// import useAuthContext from 'components/global/hooks/useAuthContext';
import useListContext from 'components/global/hooks/useListContext';
import Table from './Table';
import schemas from 'common/schemas';

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
  const {
    list,
    listParams,
    // setListParams,
    currentResource,
    // updateList,
  } = useListContext();
  const theme = useTheme();
  // const routerParams: any = useParams();
  const columnWidth = 200;
  // TODO: for the moment schema setup for parent resources only
  const tableSchema = schemas[currentResource];
  // useEffect(() => {
  //   if (!(listParams.sortOrder && listParams.sortField)) {
  //     setListParams({
  //       ...listParams,
  //       sortField: resource.initialSortField(isChildOfPolicy(get(parent, 'resource'))),
  //       sortOrder: resource.initialSortOrder,
  //     });
  //   }
  // }, [listParams, setListParams, resource, parent]);

  // useEffect(() => {
  //   const debouncedSetListParams = debounce(() => setListParams(listParams), 300);
  //   debouncedSetListParams();
  // }, [resource, parent, listParams, setListParams, routerParams.subResourceType]);

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
          {/* <Input
            icon={
              listParams.query.length > 0 ? (
                <Icon name={'close'} onClick={(e) => setListParams({ query: '' })} link={true} />
              ) : (
                <Icon name={'search'} />
              )
            }
            value={listParams.query}
            placeholder="Search..."
            onChange={(event, { value }) => setListParams({ query: value })}
          /> */}
        </div>
        <div css={paneControls.sortContainer}>
          Sort by:
          <Dropdown
            selection
            style={{ minWidth: '9.1em', marginLeft: '0.5em' }}
            selectOnNavigation={false}
            options={schemas[currentResource]
              .filter((field) => field.sortable)
              .map((sortableField) => ({
                text: sortableField.fieldName,
                value: sortableField.key,
              }))}
            text={listParams.sortField.fieldName}
            // onChange={(event, { value }) =>
            //   setListParams({
            //     sortField: resource
            //       .sortableFields(isChildOfPolicy(get(parent, 'resource')))
            //       .find((field) => field.key === value),
            //   })
            // }
          />
          <Button.Group css={paneControls.sortOrderWrapper} vertical>
            <Button
              style={{
                backgroundColor: 'transparent',
                paddingBottom: 0,
                ...(listParams.sortOrder === 'ASC' && { color: theme.colors.primary_5 }),
              }}
              // onClick={() => setListParams({ ...listParams, sortOrder: 'ASC' })}
              icon="chevron up"
            />
            <Button
              style={{
                paddingTop: 0,
                backgroundColor: 'transparent',
                ...(listParams.sortOrder === 'DESC' && { color: theme.colors.primary_5 }),
              }}
              // onClick={() => setListParams({ ...listParams, sortOrder: 'DESC' })}
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
          onChange={() => null}
          // onChange={(page) => setListParams({ ...listParams, offset: page * listParams.limit })}
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
