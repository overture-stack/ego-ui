import { Application, APPLICATION_STATUS, APPLICATION_TYPE } from 'common/typedefs/Application';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { Fragment } from 'react';
import { Dropdown } from 'semantic-ui-react';

import { FieldRow, Section, TextInput } from '../common/grid';
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
          <Dropdown
            value={stagedApplication?.status}
            selection
            options={[
              { text: APPLICATION_STATUS.APPROVED, value: APPLICATION_STATUS.APPROVED },
              { text: APPLICATION_STATUS.DISABLED, value: APPLICATION_STATUS.DISABLED },
              { text: APPLICATION_STATUS.PENDING, value: APPLICATION_STATUS.PENDING },
              { text: APPLICATION_STATUS.REJECTED, value: APPLICATION_STATUS.REJECTED },
            ]}
          />
        </ApplicationFieldRow>
        <ApplicationFieldRow fieldName={FieldNames.APPLICATION_TYPE}>
          <Dropdown
            value={stagedApplication?.type}
            selection
            options={[
              { text: APPLICATION_TYPE.CLIENT, value: APPLICATION_TYPE.CLIENT },
              { text: APPLICATION_TYPE.ADMIN, value: APPLICATION_TYPE.ADMIN },
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
