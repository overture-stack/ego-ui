import React, { useEffect, useState } from 'react';

import { ListProvider } from './global/hooks/useListContext';
import { EntityProvider } from './global/hooks/useEntityContext';

const ContentProviders = ({ children, match }: { children: React.ReactElement; match: any }) => {
  const {
    params: { id, resourceName },
  } = match;
  const [initialResourceName, setInitialResourceName] = useState<string>(resourceName);
  const [initialResourceId, setInitialResourceId] = useState<string>(id);
  // const [initialSubResourceName, setInitialSubResourceName] = useState<string>(undefined);
  // app does not respond to route change on login when useLocation() is not called (???)

  useEffect(() => {
    setInitialResourceName(resourceName);
    setInitialResourceId(undefined);
  }, [resourceName]);

  useEffect(() => {
    setInitialResourceId(id);
  }, [id]);

  return (
    <ListProvider resourceName={initialResourceName}>
      <EntityProvider id={initialResourceId}>{children}</EntityProvider>
    </ListProvider>
  );
};

export default ContentProviders;
