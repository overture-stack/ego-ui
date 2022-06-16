import { Policy } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';

import { FieldRow, Section, TextInput } from '../common/grid';
import { FieldNames } from '../types';

const MetaSection = () => {
  const { entity } = useEntityContext();
  const policy = entity?.item as Policy;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID}>{policy?.id}</FieldRow>
        <FieldRow fieldName={FieldNames.NAME}>{policy?.name}</FieldRow>
      </Section>
    </div>
  );
};

export const PolicyForm = ({ isEditing = false }: { isEditing?: boolean }) => {
  const { entity, stagedEntity } = useEntityContext();
  const policy = stagedEntity.item as Policy;
  return (
    <Section>
      {isEditing && <FieldRow fieldName={FieldNames.ID}>{entity.item?.id}</FieldRow>}
      <FieldRow fieldName={FieldNames.NAME}>
        <TextInput value={policy?.name} />
      </FieldRow>
    </Section>
  );
};

export default MetaSection;
