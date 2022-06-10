import { css } from '@emotion/react';
import { Application } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';

import { FieldRow, Section } from '../common/grid';
import { FieldNames } from '../types';

const ApplicationFieldRow = (props: any) => (
  <FieldRow fieldNameWidth={6} fieldContentWidth={10} {...props} />
);

const MetaSection = () => {
  const { entity } = useEntityContext();
  const application = entity?.item as Application;
  return (
    <div>
      <Section
        css={css`
          &.ui.grid {
            padding-bottom: 1rem;
          }
        `}
      >
        <FieldRow fieldName={FieldNames.ID} fieldValue={application?.id} />
        <FieldRow fieldName={FieldNames.NAME} fieldValue={application?.name} />
      </Section>
      <Section
        css={css`
          &.ui.grid {
            padding-bottom: 1rem;
          }
        `}
      >
        <ApplicationFieldRow fieldName={FieldNames.STATUS} fieldValue={application?.status} />
        <ApplicationFieldRow
          fieldName={FieldNames.APPLICATION_TYPE}
          fieldValue={application?.type}
        />
        <ApplicationFieldRow fieldName={FieldNames.CLIENT_ID} fieldValue={application?.clientId} />
        <ApplicationFieldRow
          fieldName={FieldNames.CLIENT_SECRET}
          fieldValue={application?.clientSecret}
        />
        <ApplicationFieldRow
          fieldName={FieldNames.REDIRECT_URI}
          fieldValue={application?.redirectUri}
        />
        <ApplicationFieldRow
          fieldName={FieldNames.ERROR_REDIRECT_URI}
          fieldValue={application?.errorRedirectUri}
        />
      </Section>
    </div>
  );
};

export default MetaSection;
