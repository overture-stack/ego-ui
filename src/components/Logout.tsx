import React from 'react';
import { withRouter } from 'react-router';
import { css } from 'glamor';
import colors from 'common/colors';
import { googleLogout } from 'services';

const styles = {
  container: { cursor: 'pointer' },
};

const enhance = withRouter;

const Component = class extends React.Component<any, any> {
  handleClick = async () => {
    await googleLogout();
    this.props.history.push('/');
  };
  render() {
    return (
      <div
        className={`${css(styles.container, this.props.styles)} ${this.props
          .className}`}
        onClick={this.handleClick}
      >
        Logout
      </div>
    );
  }
};

export default enhance(Component);
