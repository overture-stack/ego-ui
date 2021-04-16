/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

import ControlContainer from 'components/ControlsContainer';
import EmptyContent from 'components/EmptyContent';
import { RippleButton } from 'components/Ripple';
import { provideEntity } from 'stateProviders';
import ContentPanel from './ContentPanel';
import EditingContentPanel from './EditingContentPanel';

const StyledControlContainer = styled(ControlContainer)`
  padding: 0 24px;
  justify-content: space-between;
`;

const enhance = compose(provideEntity, injectState, withRouter);

enum ContentState {
  DISPLAYING = 'displaying',
  CREATING = 'creating',
  EDITING = 'editing',
  DISABLING = 'disabling',
  DELETING = 'deleting',
  CONFIRM_DELETE = 'confirmDelete',
  SAVING_EDIT = 'savingEdit',
  SAVING_CREATE = 'savingCreate',
}

const StyledBasicButton = styled(RippleButton)`
  ${({ customcolor }) => `
    &.ui.button.basic {
      box-shadow: none;
      color: ${customcolor} !important;
      border: 1px solid ${customcolor};
    }
  `}
`;

const StyledButton = styled(RippleButton)`
  ${({ theme, customcolor, hovercolor }) => `
      &.ui.button {
        box-shadow: none;
        color: ${theme.colors.white};
        background-color: ${customcolor};
        border: 1px solid ${customcolor};
        &:hover {
          background-color: ${hovercolor};
          border: 1px solid ${hovercolor};
        }
      }
    `}
`;

const Content = ({
  id,
  resource,
  match: {
    params: { subResourceType },
  },
  rows,
  effects: { saveChanges, deleteItem, stageChange, refreshList, undoChanges, setItem },
  state: {
    entity: { item, valid },
  },
  history,
}) => {
  const [contentState, setContentState] = useState<ContentState>(ContentState.DISPLAYING);
  let lastValidId = null;

  const fetchData = async () => {
    if (id !== 'create') {
      lastValidId = id;
    }

    await setItem(id, resource);
    setContentState(
      id === 'create'
        ? ContentState.CREATING
        : subResourceType === 'edit'
        ? ContentState.EDITING
        : ContentState.DISPLAYING,
    );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setContentState(subResourceType === 'edit' ? ContentState.EDITING : ContentState.DISPLAYING);
  }, [subResourceType]);

  const theme = useTheme();

  const isSaving =
    contentState === ContentState.SAVING_EDIT || contentState === ContentState.SAVING_CREATE;

  const CreateButton = () => (
    <StyledBasicButton
      customcolor={theme.colors.primary_7}
      basic
      disabled={isSaving}
      onClick={() => history.push(`/${resource.name.plural}/create`)}
      size="tiny"
    >
      Create
    </StyledBasicButton>
  );

  const EditButton = () => (
    <StyledButton
      customcolor={theme.colors.accent}
      hovercolor={theme.colors.accent_dark}
      disabled={isSaving}
      onClick={() => history.push(`/${resource.name.plural}/${id}/edit`)}
      size="tiny"
    >
      Edit
    </StyledButton>
  );

  const DisableButton = () => (
    <StyledBasicButton
      basic
      customcolor={theme.colors.error_dark}
      hovercolor={theme.colors.error_3}
      disabled={contentState === ContentState.DISABLING || (item || {}).status === 'DISABLED'}
      loading={contentState === ContentState.DISABLING}
      onClick={async () => {
        setContentState(ContentState.DISABLING);
        await stageChange({ status: 'DISABLED' });
        await saveChanges();
        await refreshList();
        setContentState(ContentState.DISPLAYING);
      }}
      size="tiny"
    >
      Disable
    </StyledBasicButton>
  );

  const ConfirmDeleteButton = () => (
    <StyledButton
      customcolor={theme.colors.error_dark}
      hovercolor={theme.colors.error_3}
      disabled={contentState === ContentState.DELETING}
      loading={contentState === ContentState.DELETING}
      onClick={async () => {
        setContentState(ContentState.DELETING);
        await deleteItem();
        await refreshList();
        history.replace(`/${resource.name.plural}`);
      }}
      size="tiny"
    >
      Confirm Delete
    </StyledButton>
  );

  const DeleteButton = () => (
    <StyledBasicButton
      customcolor={theme.colors.error_dark}
      basic
      onClick={() => setContentState(ContentState.CONFIRM_DELETE)}
      size="tiny"
    >
      Delete
    </StyledBasicButton>
  );

  const CancelButton = () => (
    <StyledBasicButton
      customcolor={theme.colors.grey_6}
      basic
      disabled={isSaving}
      onClick={async () => {
        await undoChanges();
        history.push(`/${resource.name.plural}/${lastValidId || ''}`);
      }}
      size="tiny"
    >
      Cancel
    </StyledBasicButton>
  );

  const SaveButton = () => {
    return (
      <StyledButton
        customcolor={theme.colors.accent}
        hovercolor={theme.colors.accent_dark}
        disabled={isSaving || !valid}
        loading={isSaving}
        onClick={async () => {
          setContentState(
            contentState === ContentState.EDITING
              ? ContentState.SAVING_EDIT
              : ContentState.SAVING_CREATE,
          );
          const newState = await saveChanges();
          await refreshList();
          setContentState(ContentState.DISPLAYING);
          history.replace(`/${resource.name.plural}/${newState.entity.item.id}`);
        }}
        size="tiny"
      >
        Save
      </StyledButton>
    );
  };

  return (
    <div
      css={(theme) => ({
        boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
        minWidth: theme.dimensions.contentPanel.width,
        position: 'relative',
        width: theme.dimensions.contentPanel.width,
      })}
      className="content"
    >
      <StyledControlContainer>
        {![ContentState.EDITING, ContentState.CREATING].includes(contentState) && !isSaving ? (
          <React.Fragment>
            <div>
              {resource.createItem && <CreateButton />}
              {id && <EditButton />}
            </div>
            {id &&
              (resource.noDelete ? (
                <DisableButton />
              ) : contentState === ContentState.CONFIRM_DELETE ||
                contentState === ContentState.DELETING ? (
                <ConfirmDeleteButton />
              ) : (
                <DeleteButton />
              ))}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CancelButton />
            <SaveButton />
          </React.Fragment>
        )}
      </StyledControlContainer>
      <div
        css={{
          bottom: 0,
          left: 0,
          overflow: 'auto',
          position: 'absolute',
          right: 0,
          top: 70,
        }}
        className="content contentPanel"
      >
        {contentState === ContentState.CREATING ? (
          <EditingContentPanel entityType={resource.name.singular} rows={rows} hideImmutable />
        ) : !id ? (
          <EmptyContent message={resource.emptyMessage} />
        ) : !item ? (
          <EmptyContent message={'loading'} />
        ) : contentState === ContentState.EDITING || contentState === ContentState.SAVING_EDIT ? (
          <EditingContentPanel entityType={resource.name.singular} rows={rows} />
        ) : (
          <ContentPanel entityType={resource.name.singular} rows={rows} />
        )}
      </div>
    </div>
  );
};

export default enhance(Content);
