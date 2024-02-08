/** @jsxImportSource @emotion/react */
import useAuthContext from 'components/global/hooks/useAuthContext';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Icon } from 'semantic-ui-react';

const styles = {
  container: { cursor: 'pointer' },
};

const enhance = compose(withRouter);

const CopyJwt = (props: any) => {
  const [copied, setCopied] = useState(false);
  const { token } = useAuthContext();
  const hasClipboard = !!navigator.clipboard;
  const handleClick = async () => {
    const nav = navigator;
    nav.clipboard && nav.clipboard.writeText(token);
    setCopied(true);
  };
  // Only render this component if the current browser has the clipboard available (HTTPS only)
  return (
    hasClipboard && (
      <div css={[styles.container, props.styles]} className={props.className} onClick={handleClick}>
        Copy My JWT {copied && <Icon name="check" />}
      </div>
    )
  );
};

export default enhance(CopyJwt);
