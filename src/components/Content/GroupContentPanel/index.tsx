/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { CreateableEntityHeader } from '../common/buttons';
import { ContentState } from '../types';
import MetaSection, { GroupForm } from './MetaSection';

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
          <GroupForm />
        ) : currentId ? (
          mode === ContentState.EDITING ? (
            <GroupForm isEditing />
          ) : (
            <MetaSection />
          )
        ) : (
          <EmptyContent message="Please select a group" />
        )}
      </div>
    </div>
  );
};

export default ContentPanel;
