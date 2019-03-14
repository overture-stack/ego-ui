import React from 'react';
import { withRouter } from 'react-router';
import { css } from 'glamor';
import { UserContext } from '../Contexts';

const styles = {
  container: { cursor: 'pointer' },
};

const Component = class extends React.Component<any, any> {
  handleClick = async () => {
    this.props.setLoggedInUser(null);
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

function Logout(props: any) {
  return (
    <UserContext.Consumer>
      {({ setLoggedInUser }) => <Component {...props} setLoggedInUser={setLoggedInUser} />}
    </UserContext.Consumer>
  );
}

export default withRouter(Logout);
