/** @jsxImportSource @emotion/react */
import { injectState } from 'freactal';
import React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Icon } from 'semantic-ui-react';

const styles = {
  container: { cursor: 'pointer' },
};

const enhance = compose(withRouter, injectState);

const CopyJwt = class extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }
  hasClipboard = !!navigator.clipboard;
  handleClick = async () => {
    const nav = navigator;
    nav.clipboard && nav.clipboard.writeText(this.props.state.loggedInUserToken);
    this.setState({ copied: true });
  };
  render() {
    // Only render this component if the current browser has the clipboard available (HTTPS only)
    return (
      this.hasClipboard && (
        <div
          css={[styles.container, this.props.styles]}
          className={this.props.className}
          onClick={this.handleClick}
        >
          Copy My JWT {this.state.copied && <Icon name="check" />}
        </div>
      )
    );
  }
};

export default enhance(CopyJwt);
