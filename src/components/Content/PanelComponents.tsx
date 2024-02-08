import { ResourceType } from 'common/enums';
import UserContentPanel from './UserContentPanel';
import GroupContentPanel from './GroupContentPanel';
import ApplicationContentPanel from './ApplicationContentPanel';
import PolicyContentPanel from './PolicyContentPanel';

// convert to ParentResource?
const PanelComponents = Object.freeze({
  [ResourceType.USERS]: UserContentPanel,
  [ResourceType.GROUPS]: GroupContentPanel,
  [ResourceType.APPLICATIONS]: ApplicationContentPanel,
  [ResourceType.POLICIES]: PolicyContentPanel,
});

export default PanelComponents;
