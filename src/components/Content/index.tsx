/** @jsxImportSource @emotion/react */
// import styled from '@emotion/styled';
import { css } from '@emotion/react';
// import { useTheme } from '@emotion/react';
// import React, { useEffect } from 'react';
// import { withRouter } from 'react-router';
// import { compose } from 'recompose';
// import { get } from 'lodash';

// import useEntityContext from 'components/global/hooks/useEntityContext';
import useListContext from 'components/global/hooks/useListContext';
import ContentComponents from './PanelComponents';
// import ControlContainer from 'components/ControlsContainer';

const Content = () => {
  const { currentResource } = useListContext();
  const Component = ContentComponents[currentResource];
  // TODO: investigate: when selecting a new id, Content with the previous id is rendered 2 times
  return (
    <div
      css={css`
        width: 510px;
        min-width: 510px;
      `}
    >
      <Component />
    </div>
  );
};

export default Content;

// import EmptyContent from 'components/EmptyContent';
// import ContentPanel from './ContentPanel';
// import EditingContentPanel from './EditingContentPanel';

// import useEntityContext, {
//   ContentState,
//   EntityState,
// } from 'components/global/hooks/useEntityContext';
// import useListContext from 'components/global/hooks/useListContext';
// import { Entity } from 'common/typedefs';

// const StyledControlContainer = styled(ControlContainer)`
//   padding: 0 24px;
//   justify-content: space-between;
// `;

// const enhance = compose(withRouter);

// const Content = ({
//   id,
//   resource,
//   parent,
//   match: {
//     params: { subResourceType },
//   },
//   rows,
//   history,
// }) => {
//   const theme = useTheme();
//   const {
//     entity: { item, valid },
//     undoChanges,
//     deleteItem,
//     saveChanges,
//     lastValidId,
//     contentState,
//     setContentState,
//     setItem,
//   } = useEntityContext();
//   const { updateList } = useListContext();

//   useEffect(() => {
//     setContentState(subResourceType === 'edit' ? ContentState.EDITING : ContentState.DISPLAYING);
//   }, [subResourceType, setContentState]);

//   const isSaving =
//     contentState === ContentState.SAVING_EDIT || contentState === ContentState.SAVING_CREATE;

//   return (
//     <div
//       css={(theme) => ({
//         boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
//         minWidth: theme.dimensions.contentPanel.width,
//         position: 'relative',
//         width: theme.dimensions.contentPanel.width,
//       })}
//       className="content"
//     >
//       <StyledControlContainer>
//         {![ContentState.EDITING, ContentState.CREATING].includes(contentState) && !isSaving ? (
//           <React.Fragment>
//             <div>
//               {resource.createItem && <CreateButton />}
//               {id && <EditButton />}
//             </div>
//             {id &&
//               (resource.noDelete ? (
//                 <DisableButton />
//               ) : contentState === ContentState.CONFIRM_DELETE ||
//                 contentState === ContentState.DELETING ? (
//                 <ConfirmDeleteButton />
//               ) : (
//                 <DeleteButton />
//               ))}
//           </React.Fragment>
//         ) : (
//           <React.Fragment>
//             <CancelButton />
//             <SaveButton />
//           </React.Fragment>
//         )}
//       </StyledControlContainer>
//       <div
//         css={{
//           bottom: 0,
//           left: 0,
//           overflow: 'auto',
//           position: 'absolute',
//           right: 0,
//           top: 70,
//         }}
//         className="content contentPanel"
//       >
//         {contentState === ContentState.CREATING ? (
//           <EditingContentPanel entityType={resource.name.singular} rows={rows} hideImmutable />
//         ) : !id ? (
//           <EmptyContent message={resource.emptyMessage} />
//         ) : !item ? (
//           <EmptyContent message={'loading'} />
//         ) : contentState === ContentState.EDITING || contentState === ContentState.SAVING_EDIT ? (
//           <EditingContentPanel entityType={resource.name.singular} rows={rows} />
//         ) : (
//           <ContentPanel entityType={resource.name.singular} rows={rows} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default enhance(Content);
