import { css } from '@emotion/react';
import { Group } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';

import { FieldRow, Section } from '../common/grid';
import { FieldNames } from '../types';

const MetaSection = () => {
  const { entity } = useEntityContext();
  const group = entity?.item as Group;
  return (
    <div>
      <Section
        css={css`
          &.ui.grid {
            padding-bottom: 1rem;
          }
        `}
      >
        <FieldRow fieldName={FieldNames.ID} fieldValue={group?.id} />
        <FieldRow fieldName={FieldNames.NAME} fieldValue={group?.name} />
      </Section>
      <Section
        css={css`
          &.ui.grid {
            padding-bottom: 1rem;
          }
        `}
      >
        <FieldRow fieldName={FieldNames.STATUS} fieldValue={group?.status} />
        <FieldRow fieldName={FieldNames.DESCRIPTION} fieldValue={group?.description} />
      </Section>
    </div>
  );
};

export default MetaSection;
