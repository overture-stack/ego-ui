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
  displaying,
  creating,
  editing,
  disabling,
  deleting,
  confirmDelete,
  savingEdit,
  savingCreate,
}

interface IContentState {
  contentState: ContentState;
}

const StyledBasicButton = styled(RippleButton)`
  ${({ customcolor }) => `
    &.ui.button.basic.tiny {
      box-shadow: none;
      color: ${customcolor} !important;
      border: 1px solid ${customcolor};
    }
  `}
`;

const StyledButton = styled(RippleButton)`
  ${({ theme, customcolor, hovercolor }) => `
      &.ui.button.tiny {
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
  const [contentState, setContentState] = useState<any>(ContentState.displaying);
  let lastValidId = null;

  const fetchData = async () => {
    if (id !== 'create') {
      lastValidId = id;
    }

    await setItem(id, resource);
    setContentState(
      id === 'create'
        ? ContentState.creating
        : subResourceType === 'edit'
        ? ContentState.editing
        : ContentState.displaying,
    );
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    setContentState(subResourceType === 'edit' ? ContentState.editing : ContentState.displaying);
  }, [subResourceType]);

  const theme = useTheme();

  const isSaving =
    contentState === ContentState.savingEdit || contentState === ContentState.savingCreate;

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
      style={{ fontWeight: 'normal' }}
    >
      Edit
    </StyledButton>
  );

  const DisableButton = () => (
    <StyledBasicButton
      basic
      disabled={contentState === ContentState.disabling || (item || {}).status === 'DISABLED'}
      loading={contentState === ContentState.disabling}
      onClick={async () => {
        setContentState(ContentState.disabling);
        await stageChange({ status: 'DISABLED' });
        await saveChanges();
        await refreshList();
        setContentState(ContentState.displaying);
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
      disabled={contentState === ContentState.deleting}
      loading={contentState === ContentState.deleting}
      onClick={async () => {
        setContentState(ContentState.deleting);
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
      onClick={() => setContentState(ContentState.confirmDelete)}
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
            contentState === ContentState.editing
              ? ContentState.savingEdit
              : ContentState.savingCreate,
          );
          const newState = await saveChanges();
          await refreshList();
          setContentState(ContentState.displaying);
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
        {![ContentState.editing, ContentState.creating].includes(contentState) && !isSaving ? (
          <React.Fragment>
            <div>
              {resource.createItem && <CreateButton />}
              {id && <EditButton />}
            </div>
            {id &&
              (resource.noDelete ? (
                <DisableButton />
              ) : contentState === ContentState.confirmDelete ||
                contentState === ContentState.deleting ? (
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
        {contentState === ContentState.creating ? (
          <EditingContentPanel entityType={resource.name.singular} rows={rows} hideImmutable />
        ) : !id ? (
          <EmptyContent message={resource.emptyMessage} />
        ) : !item ? (
          <EmptyContent message={'loading'} />
        ) : contentState === ContentState.editing || contentState === ContentState.savingEdit ? (
          <EditingContentPanel entityType={resource.name.singular} rows={rows} />
        ) : (
          <ContentPanel entityType={resource.name.singular} rows={rows} />
        )}
      </div>
    </div>
  );
};

export default enhance(Content);
