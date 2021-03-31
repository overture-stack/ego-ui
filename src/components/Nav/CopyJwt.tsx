import { injectState } from 'freactal';
import { css } from 'glamor';
import React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Icon } from 'semantic-ui-react';

// This declaration is needed for typescript to compile
// More recent versions of TS include clipboard on the navigator type
//   but the current version used here does not. When TS is updated we can
//   Remove these interface declarations
interface Clipboard {
  writeText(newClipText: string): Promise<void>;
  // Add any other methods you need here.
}
interface NavigatorClipboard extends Navigator {
  // Only available in a secure context.
  readonly clipboard?: Clipboard;
}
interface NavigatorExtended extends NavigatorClipboard {}

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
  hasClipboard = !!(navigator as NavigatorExtended).clipboard;
  handleClick = async () => {
    const nav = navigator as NavigatorExtended;
    console.log('copy click', nav.clipboard);
    nav.clipboard && nav.clipboard.writeText(this.props.state.loggedInUserToken);
    // await new Promise(resolve => setTimeout(resolve, 1600));
    this.setState({ copied: true });
  };
  render() {
    // Only render this component if the current browser has the clipboard available (HTTPS only)
    return (
      this.hasClipboard && (
        <div
          className={`${css(styles.container, this.props.styles)} ${this.props.className}`}
          onClick={this.handleClick}
        >
          Copy My JWT {this.state.copied && <Icon name="check" />}
        </div>
      )
    );
  }
};

export default enhance(CopyJwt);
