import { ResourceType } from 'common/enums';
import UserContentPanel from './UserContentPanel';

// convert to ParentResource?
const PanelComponents = {
  [ResourceType.USERS]: UserContentPanel,
  [ResourceType.GROUPS]: () => <div />,
  [ResourceType.APPLICATIONS]: () => <div />,
  [ResourceType.POLICIES]: () => <div />,
};

export default PanelComponents;
