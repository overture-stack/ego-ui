import { Policy } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';

import { FieldRow, Section } from '../common/grid';
import { FieldNames } from '../types';

const MetaSection = () => {
  const { entity } = useEntityContext();
  const policy = entity?.item as Policy;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID} fieldValue={policy?.id} />
        <FieldRow fieldName={FieldNames.NAME} fieldValue={policy?.name} />
      </Section>
    </div>
  );
};

export default MetaSection;
