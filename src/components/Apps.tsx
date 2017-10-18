import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import { getApps } from 'services';
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

const App = () => {
  const { item: { name }, style, ...props } = this.props;

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
    currentApp: null,
  };

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={App}
          getKey={item => item.id}
          getData={getApps}
          onSelect={currentApp => this.setState({ currentApp })}
        />
        {this.state.currentApp && <Content data={this.state.currentApp} />}
      </div>
    );
  }
}
