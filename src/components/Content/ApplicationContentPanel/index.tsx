/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { CreateableEntityHeader } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection, { ApplicationForm } from './MetaSection';

const ContentPanel = () => {
  const { currentId, mode } = useEntityContext();
  return (
    <div>
      <CreateableEntityHeader />
      <div
        css={css`
          padding: 0.5rem;
        `}
      >
        {mode === ContentState.CREATING ? (
          <ApplicationForm />
        ) : currentId ? (
          mode === ContentState.EDITING ? (
            <ApplicationForm isEditing />
          ) : (
            <MetaSection />
          )
        ) : (
          <EmptyContent message="Please select an application" />
        )}
      </div>
    </div>
  );
};

export default ContentPanel;
