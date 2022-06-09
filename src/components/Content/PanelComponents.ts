// export { default } from './Content';

import { ResourceType } from 'common/enums';
import UserContentPanel from './UserContentPanel';

const PanelComponents = {
  [ResourceType.USERS]: UserContentPanel,
};

export default PanelComponents;
