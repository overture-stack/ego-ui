import React from 'react';
import { css } from 'glamor';
import { Button } from 'semantic-ui-react';

import EmptyContent from 'components/EmptyContent';
import ContentTable from './ContentTable';
import EditingContentTable from './EditingContentTable';
import { compose } from 'recompose';
import { provideThing } from 'stateProviders';
import { injectState } from 'freactal';
import ControlContainer from 'components/ControlsContainer';
import Aux from 'components/Aux';
import { withRouter } from 'react-router';

const styles = {
  container: {
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
  controls: { paddingRight: 24, paddingLeft: 24, justifyContent: 'space-between' },
  content: {
    paddingLeft: 60,
    paddingRight: 60,
    paddingTop: 30,
  },
};

const enhance = compose(provideThing, injectState, withRouter);

enum ContentState {
  displaying,
  creating,
  editing,
  disabling,
  deleting,
  confirmDelete,
  savingEdit,
  savingCreate,
}

interface IContentState {
  contentState: ContentState;
}

class Content extends React.Component<any, IContentState> {
  state = { contentState: ContentState.displaying };

  fetchData = async ({ id, effects: { setItem }, resource }) => {
    await setItem(id, resource);
    this.setState({ contentState: ContentState.displaying });
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps: any) {
    const { id } = nextProps;
    if (id !== this.props.id) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const {
      rows,
      styles: stylesProp = {},
      id,
      effects: { saveChanges, setItem, deleteItem, stageChange, refreshList },
      state: { thing: { item, valid } },
      resource,
      history,
      parent,
    } = this.props;

    const { contentState } = this.state;

    const CreateButton = () => (
      <Button
        basic
        color="green"
        onClick={async () => {
          await setItem(null, resource);
          this.setState({ contentState: ContentState.creating });
        }}
        size="tiny"
        style={{ fontWeight: 'bold' }}
      >
        Create
      </Button>
    );

    const EditButton = () => (
      <Button
        color="blue"
        onClick={() => this.setState({ contentState: ContentState.editing })}
        size="tiny"
        style={{ fontWeight: 'normal' }}
      >
        Edit
      </Button>
    );

    const DisableButton = () => (
      <Button
        basic
        disabled={contentState === ContentState.disabling || (item || {}).status === 'Disabled'}
        loading={contentState === ContentState.disabling}
        onClick={async () => {
          this.setState({ contentState: ContentState.disabling });
          await stageChange({ status: 'Disabled' });
          await saveChanges();
          await refreshList();
          this.setState({ contentState: ContentState.displaying });
        }}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Disable
      </Button>
    );

    const ConfirmDeleteButton = () => (
      <Button
        disabled={contentState === ContentState.deleting}
        loading={contentState === ContentState.deleting}
        onClick={async () => {
          this.setState({ contentState: ContentState.deleting });
          await deleteItem();
          await refreshList();
          history.replace(`/${resource.name.plural}`);
        }}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Confirm Delete
      </Button>
    );

    const DeleteButton = () => (
      <Button
        basic
        onClick={() => this.setState({ contentState: ContentState.confirmDelete })}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Delete
      </Button>
    );

    const CancelButton = () => (
      <Button
        basic
        onClick={() => this.fetchData(this.props)}
        size="tiny"
        style={{ fontWeight: 'bold' }}
      >
        Cancel
      </Button>
    );

    const SaveButton = () => {
      const isSaving =
        contentState === ContentState.savingEdit || contentState === ContentState.savingCreate;
      return (
        <Button
          color="blue"
          style={{ marginLeft: 'auto', fontWeight: 'normal' }}
          disabled={isSaving || !valid}
          loading={isSaving}
          onClick={async () => {
            this.setState({
              contentState:
                contentState === ContentState.editing
                  ? ContentState.savingEdit
                  : ContentState.savingCreate,
            });
            const newState = await saveChanges();
            await refreshList();
            this.setState({ contentState: ContentState.displaying });
            history.replace(`/${resource.name.plural}/${newState.thing.item.id}`);
          }}
          size="tiny"
        >
          Save
        </Button>
      );
    };

    const GoToButton = () => (
      <Button
        onClick={() => history.push(`/${resource.name.plural}/${id}`)}
        size="tiny"
        color="blue"
        style={{ fontWeight: 'bold' }}
      >
        Go to {resource.name.plural} page
      </Button>
    );

    const DeleteFromParentButton = () => (
      <Button
        basic
        onClick={async () => {
          await parent.resource.remove[resource.name.plural]({
            [resource.name.singular]: item,
            item: parent,
          });
          await refreshList();
          history.replace(`/${parent.resource.name.plural}/${parent.id}/${resource.name.plural}`);
        }}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Remove from {parent.resource.name.singular}
      </Button>
    );

    return (
      <div className={`content ${css(styles.container, stylesProp)}`}>
        <ControlContainer style={styles.controls}>
          {parent ? (
            <Aux>
              <GoToButton />
              <DeleteFromParentButton />
            </Aux>
          ) : ![ContentState.editing, ContentState.creating].includes(contentState) ? (
            <Aux>
              <div>
                <CreateButton />
                {id && <EditButton />}
              </div>
              {id &&
                (resource.noDelete ? (
                  <DisableButton />
                ) : contentState === ContentState.confirmDelete ? (
                  <ConfirmDeleteButton />
                ) : (
                  <DeleteButton />
                ))}
            </Aux>
          ) : (
            <Aux>
              <CancelButton />
              <SaveButton />
            </Aux>
          )}
        </ControlContainer>
        <div className={`${css(styles.content)}`}>
          {contentState === ContentState.creating ? (
            <EditingContentTable rows={rows} hideImmutable />
          ) : !id ? (
            <EmptyContent message={resource.emptyMessage} />
          ) : !item ? (
            <EmptyContent message={'loading'} />
          ) : contentState === ContentState.editing || contentState === ContentState.savingEdit ? (
            <EditingContentTable rows={rows} />
          ) : (
            <ContentTable rows={rows} />
          )}
        </div>
      </div>
    );
  }
}

export default enhance(Content);
