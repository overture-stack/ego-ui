import { Application, ApplicationStatus, ApplicationType } from 'common/typedefs/Application';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { Fragment } from 'react';

import { FieldRow, Section, StyledDropdown, TextInput } from '../common/grid';
import { FieldNames } from '../types';

const ApplicationFieldRow = (props: any) => (
  <FieldRow fieldNameWidth={5} fieldContentWidth={11} {...props} />
);

const MetaSection = () => {
  const { entity } = useEntityContext();
  const application = entity?.item as Application;
  return (
    <div>
      <Section>
        <ApplicationFieldRow fieldName={FieldNames.ID}>{application?.id}</ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.NAME}>{application?.name}</ApplicationFieldRow>
      </Section>
      <Section>
        <ApplicationFieldRow fieldName={FieldNames.STATUS}>
          {application?.status}
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.APPLICATION_TYPE}>
          {application?.type}
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.CLIENT_ID}>
          {application?.clientId}
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.CLIENT_SECRET}>
          {application?.clientSecret}
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.REDIRECT_URI}>
          {application?.redirectUri}
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.ERROR_REDIRECT_URI}>
          {application?.errorRedirectUri}
        </ApplicationFieldRow>
      </Section>
    </div>
  );
};

export const ApplicationForm = ({ isEditing = false }: { isEditing?: boolean }) => {
  const { entity, stagedEntity } = useEntityContext();
  const stagedApplication = stagedEntity.item as Application;
  return (
    <Fragment>
      <Section>
        {isEditing && (
          <ApplicationFieldRow fieldName={FieldNames.ID}>{entity.item?.id}</ApplicationFieldRow>
        )}
        <ApplicationFieldRow fieldName={FieldNames.NAME}>
          <TextInput value={stagedApplication?.name} />
        </ApplicationFieldRow>
      </Section>
      <Section>
        <ApplicationFieldRow fieldName={FieldNames.STATUS}>
          <StyledDropdown
            value={stagedApplication?.status}
            selection
            options={[
              { text: ApplicationStatus.APPROVED, value: ApplicationStatus.APPROVED },
              { text: ApplicationStatus.DISABLED, value: ApplicationStatus.DISABLED },
              { text: ApplicationStatus.PENDING, value: ApplicationStatus.PENDING },
              { text: ApplicationStatus.REJECTED, value: ApplicationStatus.REJECTED },
            ]}
          />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.APPLICATION_TYPE}>
          <StyledDropdown
            value={stagedApplication?.type}
            selection
            options={[
              { text: ApplicationType.CLIENT, value: ApplicationType.CLIENT },
              { text: ApplicationType.ADMIN, value: ApplicationType.ADMIN },
            ]}
          />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.CLIENT_ID}>
          <TextInput value={stagedApplication?.clientId} />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.CLIENT_SECRET}>
          <TextInput value={stagedApplication?.clientSecret} />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.REDIRECT_URI}>
          <TextInput value={stagedApplication?.redirectUri} />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.ERROR_REDIRECT_URI}>
          <TextInput value={stagedApplication?.errorRedirectUri} />
        </ApplicationFieldRow>
      </Section>
    </Fragment>
  );
};

export default MetaSection;