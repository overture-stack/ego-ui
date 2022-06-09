import ControlsContainer from 'components/ControlsContainer';
import { ReactNode } from 'react';

const EntityHeader = ({ children }: { children: ReactNode }) => {
  return <ControlsContainer>{children}</ControlsContainer>;
};

// for users, if no id selected, no buttons shown
// user - edit, disable

// for these, if no id selected, just show create button
// group - create, edit, delete
// application - create, edit, delete
// policy - create, edit, delete

// edit mode is same for all entities: cancel and save
