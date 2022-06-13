/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import EmptyContent from 'components/EmptyContent';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { CreateableEntityHeader } from '../common/buttons';
import MetaSection from './MetaSection';

const ContentPanel = () => {
  const { currentId } = useEntityContext();
  return (
    <div>
      <CreateableEntityHeader />
      {currentId ? (
        <div
          css={css`
            padding: 0.5rem;
          `}
        >
          <MetaSection />
        </div>
      ) : (
        <EmptyContent message="Please select an application" />
      )}
    </div>
  );
};

export default ContentPanel;
