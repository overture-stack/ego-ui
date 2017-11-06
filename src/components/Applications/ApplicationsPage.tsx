import React from 'react';
import { css } from 'glamor';

import ListItem from './ListItem';

import ResourceExplorer from 'components/ResourceExplorer';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

export default class extends React.Component<any, any> {
  render() {
    const id = this.props.match.params.id;
    return (
      <div className={`row ${css(styles.container)}`}>
        <ResourceExplorer id={id} ListItem={ListItem} type="apps" />
      </div>
    );
  }
}
