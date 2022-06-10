/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ControlsContainer from 'components/ControlsContainer';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import React from 'react';
import { CreateButton, DeleteButton, EditButton } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection from './MetaSection';

const CreateableEntityDisplayControls = () => (
  <React.Fragment>
    <div>
      <EditButton />
      <CreateButton />
    </div>
    <DeleteButton />
  </React.Fragment>
);

const ContentPanel = ({ mode = ContentState.DISPLAYING }: { mode: ContentState }) => {
  const { currentId } = useEntityContext();
  return (
    <div>
      {currentId ? (
        <React.Fragment>
          <ControlsContainer
            css={css`
              padding: 0 24px;
              justify-content: space-between;
            `}
          >
            {mode === ContentState.DISPLAYING && <CreateableEntityDisplayControls />}
          </ControlsContainer>
          <div
            css={css`
              padding: 1rem 0.5rem;
            `}
          >
            <MetaSection />
          </div>
        </React.Fragment>
      ) : (
        <EmptyContent message="Please select a group" />
      )}
    </div>
  );
};

export default ContentPanel;
