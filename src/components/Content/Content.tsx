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

const INITIAL_STATE = { entity: null, editing: false, saving: false };

const enhance = compose(provideThing, injectState);

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
      effects: { saveChanges },
      state: { item },
    } = this.props;

    return (
      <div className={`content ${css(styles.container, stylesProp)}`}>
        <ControlContainer style={styles.controls}>
          <div>
            {!this.state.editing &&
              id && (
                <Button
                  color="blue"
                  onClick={() => this.setState({ editing: true })}
                  size="tiny"
                  style={{ fontWeight: 'normal' }}
                >
                  Edit
                </Button>
              )}
            {!this.state.editing && (
              <Button
                basic
                color="green"
                onClick={() => {}}
                size="tiny"
                style={{ fontWeight: 'bold' }}
              >
                Create
              </Button>
            )}
          </div>

          {this.state.editing && (
            <Aux>
              <Button
                basic
                onClick={() => this.setState({ editing: false, updates: null })}
                size="tiny"
                style={{ fontWeight: 'bold' }}
              >
                Cancel
              </Button>
              <Button
                color="blue"
                style={{ marginLeft: 'auto', fontWeight: 'normal' }}
                onClick={async () => {
                  if (this.state.editing) {
                    this.setState({ saving: true });
                    await saveChanges();
                    this.setState({ saving: false, editing: false, updates: null });
                  } else {
                    this.setState({ editing: true });
                  }
                }}
                size="tiny"
              >
                Save
              </Button>
            </Aux>
          )}
        </ControlContainer>
        <div className={`${css(styles.content)}`}>
          {!id ? (
            <EmptyContent message={emptyMessage} />
          ) : !item ? (
            <EmptyContent message={'loading'} />
          ) : this.state.editing ? (
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
