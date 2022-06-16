/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { RippleButton } from 'components/Ripple';
import { Fragment } from 'react';

export const CreateButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      basic
      size="tiny"
      css={css`
        &.ui.button.basic {
          box-shadow: none;
          color: ${theme.colors.primary_7} !important;
          border: 1px solid ${theme.colors.primary_7};
        }
      `}
      // disabled={isSaving}
      // onClick={() => history.push(`/${resource.name.plural}/create`)}
    >
      Create
    </RippleButton>
  );
};

export const EditButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      css={css`
        &.ui.button {
          color: ${theme.colors.white};
          background-color: ${theme.colors.accent};
          border: 1px solid ${theme.colors.accent};
          &:hover {
            background-color: ${theme.colors.accent_dark};
            border: 1px solid ${theme.colors.accent_dark};
          }
        }
      `}
      // disabled={isSaving}
      // onClick={() => history.push(`/${resource.name.plural}/${id}/edit`)}
      size="tiny"
    >
      Edit
    </RippleButton>
  );
};

export const DisableButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      basic
      size="tiny"
      css={css`
        &.ui.button.basic {
          box-shadow: none;
          color: ${theme.colors.error_dark} !important;
          border: 1px solid ${theme.colors.error_dark};
        }
      `}
      // disabled={contentState === ContentState.DISABLING || get(item, 'status') === 'DISABLED'}
      // loading={contentState === ContentState.DISABLING}
      // onClick={async () => {
      //   // direct DISABLE option available only for entities that cannot be deleted, currently just for USERS
      //   if (resource.noDelete) {
      //     setContentState(ContentState.DISABLING);
      //     // update entity immediately, this action does not follow the stageChange/saveChange flow
      //     const updated: Entity = await resource.updateItem({
      //       item: { ...item, ...{ status: 'DISABLED' } },
      //     });
      //     await setItem(updated.id, resource);
      //     await updateList(resource, parent);
      //     setContentState(ContentState.DISPLAYING);
      //   }
      // }}
    >
      Disable
    </RippleButton>
  );
};

export const ConfirmDeleteButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      size="tiny"
      css={css`
        &.ui.button {
          color: ${theme.colors.white};
          background-color: ${theme.colors.error_dark};
          border: 1px solid ${theme.colors.error_dark};
          &:hover {
            background-color: ${theme.colors.error_3};
            border: 1px solid ${theme.colors.error_3};
          }
        }
      `}
      // disabled={contentState === ContentState.DELETING}
      // loading={contentState === ContentState.DELETING}
      // onClick={async () => {
      //   setContentState(ContentState.DELETING);
      //   await deleteItem();
      //   await updateList(resource, parent);
      //   history.replace(`/${resource.name.plural}`);
      // }}
    >
      Confirm Delete
    </RippleButton>
  );
};

export const DeleteButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      basic
      size="tiny"
      css={css`
        &.ui.button.basic {
          box-shadow: none;
          color: ${theme.colors.error_dark} !important;
          border: 1px solid ${theme.colors.error_dark};
        }
      `}
      // onClick={() => setContentState(ContentState.CONFIRM_DELETE)}
    >
      Delete
    </RippleButton>
  );
};

export const CancelButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      basic
      size="tiny"
      css={css`
        &.ui.button.basic {
          box-shadow: none;
          color: ${theme.colors.grey_6} !important;
          border: 1px solid ${theme.colors.grey_6};
        }
      `}
      // disabled={isSaving}
      onClick={async () => {
        // await undoChanges(lastValidId);
        // history.push(`/${resource.name.plural}/${lastValidId || ''}`);
      }}
    >
      Cancel
    </RippleButton>
  );
};

export const SaveButton = () => {
  const theme = useTheme();
  return (
    <RippleButton
      size="tiny"
      css={css`
        &.ui.button {
          color: ${theme.colors.white};
          background-color: ${theme.colors.accent};
          border: 1px solid ${theme.colors.accent};
          &:hover {
            background-color: ${theme.colors.accent_dark};
            border: 1px solid ${theme.colors.accent_dark};
          }
        }
      `}
      // disabled={isSaving || !valid}
      // loading={isSaving}
      // onClick={async () => {
      //   setContentState(
      //     contentState === ContentState.EDITING
      //       ? ContentState.SAVING_EDIT
      //       : ContentState.SAVING_CREATE,
      //   );
      //   const newState = ((await saveChanges()) as unknown) as EntityState;
      //   await updateList(resource, parent);
      //   await setContentState(ContentState.DISPLAYING);
      //   history.replace(`/${resource.name.plural}/${newState.item.id}`);
      // }}
    >
      Save
    </RippleButton>
  );
};

export const CreateableEntityDisplayControls = () => (
  <Fragment>
    <div>
      <EditButton />
      <CreateButton />
    </div>
    <DeleteButton />
  </Fragment>
);
