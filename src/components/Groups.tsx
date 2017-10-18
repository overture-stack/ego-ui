import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import { getGroups } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
  content: {},
};

const Group = ({ item: { name }, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
      {...props}
    >
      <div style={{ fontSize: 20 }}>{name}</div>
    </div>
  );
};

const Content = ({ data }) => {
  return <div className={`${css(styles.content)}`}>{JSON.stringify(data)}</div>;
};

export default class extends React.Component {
  state = {
    currentGroup: null,
  };

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Group}
          getKey={item => item.id}
          getData={getGroups}
          onSelect={currentGroup => this.setState({ currentGroup })}
        />
        {this.state.currentGroup && <Content data={this.state.currentGroup} />}
      </div>
    );
  }
}
