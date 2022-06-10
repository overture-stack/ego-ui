import { ResourceType } from 'common/enums';
import UserContentPanel from './UserContentPanel';
import GroupContentPanel from './GroupContentPanel';

// convert to ParentResource?
const PanelComponents = {
  [ResourceType.USERS]: UserContentPanel,
  [ResourceType.GROUPS]: GroupContentPanel,
  [ResourceType.APPLICATIONS]: () => <div />,
  [ResourceType.POLICIES]: () => <div />,
};

export default PanelComponents;
