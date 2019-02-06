import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withRouter } from 'react-router';
import { css } from 'glamor';

const styles = {
  container: { cursor: 'pointer' },
};

const enhance = compose(
  withRouter,
  injectState,
);

const Component = class extends React.Component<any, any> {
  handleClick = async () => {
    this.props.effects.setUser(null);
    this.props.history.push('/');
  };
  render() {
    return (
      <div
        className={`${css(styles.container, this.props.styles)} ${this.props.className}`}
        onClick={this.handleClick}
      >
        Log Out
      </div>
    );
  }
};

export default enhance(Component);
