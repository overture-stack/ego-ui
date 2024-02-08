/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ControlsContainer from 'components/ControlsContainer';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import React from 'react';
import { CreateableEntityDisplayControls } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection from './MetaSection';

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
              padding: 0.5rem;
            `}
          >
            <MetaSection />
          </div>
        </React.Fragment>
      ) : (
        <EmptyContent message="Please select an application" />
      )}
    </div>
  );
};

export default ContentPanel;
