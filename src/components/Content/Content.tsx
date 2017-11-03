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
import RESOURCE_MAP from 'common/RESOURCE_MAP';

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

const INITIAL_STATE = {
  editing: false,
  saving: false,
  creating: false,
  disabling: false,
  confirmingDelete: false,
  deleting: false,
};

const enhance = compose(provideThing, injectState, withRouter);

class Content extends React.Component<any, any> {
  state = INITIAL_STATE;

  fetchData = async ({ id, effects: { setItem }, type }) => {
    await setItem(id, type);
    this.setState({ ...INITIAL_STATE });
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
      emptyMessage,
      effects: { saveChanges, setItem, deleteItem, stageChange },
      state: { thing: { item, valid } },
      type,
      history,
    } = this.props;

    const { creating, editing, saving, disabling, confirmingDelete, deleting } = this.state;

    const CreateButton = () => (
      <Button
        basic
        color="green"
        onClick={async () => {
          await setItem(null, type);
          this.setState({ creating: true, editing: false });
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
        onClick={() => this.setState({ editing: true, creating: false })}
        size="tiny"
        style={{ fontWeight: 'normal' }}
      >
        Edit
      </Button>
    );

    const DisableButton = () => (
      <Button
        basic
        disabled={disabling || (item || {}).status === 'Disabled'}
        loading={disabling}
        onClick={async () => {
          this.setState({ disabling: true });
          await stageChange({ status: 'Disabled' });
          await saveChanges();
          this.setState({ ...INITIAL_STATE });
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
        disabled={deleting}
        loading={deleting}
        onClick={async () => {
          this.setState({ deleting: true });
          await deleteItem();
          history.replace(`/${type}`);
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
        onClick={() => this.setState({ confirmingDelete: true })}
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
        onClick={async () => {
          await this.fetchData(this.props);
          this.setState({ ...INITIAL_STATE });
        }}
        size="tiny"
        style={{ fontWeight: 'bold' }}
      >
        Cancel
      </Button>
    );

    const SaveButton = () => (
      <Button
        color="blue"
        style={{ marginLeft: 'auto', fontWeight: 'normal' }}
        disabled={saving || !valid}
        loading={saving}
        onClick={async () => {
          this.setState({ saving: true });
          const newState = await saveChanges();
          this.setState({ ...INITIAL_STATE });
          history.replace(`/${type}/${newState.thing.item.id}`);
        }}
        size="tiny"
      >
        Save
      </Button>
    );

    return (
      <div className={`content ${css(styles.container, stylesProp)}`}>
        <ControlContainer style={styles.controls}>
          {!editing &&
            !creating && (
              <Aux>
                <div>
                  <CreateButton />
                  {id && <EditButton />}
                </div>
                {id &&
                  (RESOURCE_MAP[type].noDelete ? (
                    <DisableButton />
                  ) : confirmingDelete ? (
                    <ConfirmDeleteButton />
                  ) : (
                    <DeleteButton />
                  ))}
              </Aux>
            )}
          {(editing || creating) && (
            <Aux>
              <CancelButton />
              <SaveButton />
            </Aux>
          )}
        </ControlContainer>
        <div className={`${css(styles.content)}`}>
          {creating ? (
            <EditingContentTable rows={rows} hideImmutable />
          ) : !id ? (
            <EmptyContent message={emptyMessage} />
          ) : !item ? (
            <EmptyContent message={'loading'} />
          ) : editing ? (
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
