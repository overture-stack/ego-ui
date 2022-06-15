/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { CreateableEntityHeader } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection, { PolicyForm } from './MetaSection';

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
          <PolicyForm />
        ) : currentId ? (
          mode === ContentState.EDITING ? (
            <PolicyForm isEditing />
          ) : (
            <MetaSection />
          )
        ) : (
          <EmptyContent message="Please select a policy" />
        )}
      </div>
    </div>
  );
};

export default ContentPanel;
