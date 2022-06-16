import { Group, GroupStatus } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';

import { FieldRow, Section, StyledDropdown, TextInput } from '../common/grid';
import { isEditing } from '../common/utils';
import { FieldNames } from '../types';

const MetaSection = () => {
  const { entity, stagedEntity, mode } = useEntityContext();
  const group = (isEditing(mode) ? stagedEntity?.item : entity?.item) as Group;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID}>{group?.id}</FieldRow>
        <FieldRow fieldName={FieldNames.NAME}>{group?.name}</FieldRow>
      </Section>
      <Section>
        <FieldRow fieldName={FieldNames.STATUS}>{group?.status}</FieldRow>
        <FieldRow fieldName={FieldNames.DESCRIPTION}>{group?.description}</FieldRow>
      </Section>
    </div>
  );
};

export const GroupForm = ({ isEditing = false }: { isEditing?: boolean }) => {
  const { entity, stagedEntity } = useEntityContext();
  const stagedGroup = stagedEntity.item as Group;
  return (
    <div>
      <Section>
        {isEditing && <FieldRow fieldName={FieldNames.ID}>{entity.item?.id}</FieldRow>}
        <FieldRow fieldName={FieldNames.NAME}>
          <TextInput value={stagedGroup?.name} />
        </FieldRow>
      </Section>
      <Section>
        <FieldRow fieldName={FieldNames.STATUS}>
          <StyledDropdown
            placeholder={FieldNames.STATUS}
            value={stagedGroup?.status}
            selection
            options={[
              { text: GroupStatus.APPROVED, value: GroupStatus.APPROVED },
              { text: GroupStatus.DISABLED, value: GroupStatus.DISABLED },
              { text: GroupStatus.PENDING, value: GroupStatus.PENDING },
              { text: GroupStatus.REJECTED, value: GroupStatus.REJECTED },
            ]}
          />
        </FieldRow>
        <FieldRow fieldName={FieldNames.DESCRIPTION}>
          <TextInput value={stagedGroup?.description} />
        </FieldRow>
      </Section>
    </div>
  );
};

export default MetaSection;
