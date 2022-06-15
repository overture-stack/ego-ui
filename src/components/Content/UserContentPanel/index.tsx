/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ControlsContainer from 'components/ControlsContainer';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import React from 'react';
import { DisableButton, EditButton, EntityEditingControls } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection, { UserForm } from './MetaSection';

const getControls = (id: string, mode: ContentState) => {
  if (id) {
    if (mode === ContentState.DISPLAYING) {
      return (
        <React.Fragment>
          <EditButton />
          <DisableButton />
        </React.Fragment>
      );
    }
    if (mode === ContentState.EDITING) {
      return <EntityEditingControls />;
    }
  }
  return null;
};

const ContentPanel = () => {
  const { currentId, mode } = useEntityContext();
  return (
    <div>
      <ControlsContainer
        css={css`
          padding: 0 24px;
          justify-content: space-between;
        `}
      >
        {getControls(currentId, mode)}
      </ControlsContainer>
      {currentId ? (
        mode === ContentState.EDITING ? (
          <UserForm />
        ) : (
          <div
            css={css`
              padding: 0.5rem;
            `}
          >
            <MetaSection />
          </div>
        )
      ) : (
        <EmptyContent message="Please select a user" />
      )}
    </div>
  );
};

export default ContentPanel;
