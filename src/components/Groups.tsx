import React from 'react';
import { css } from 'glamor';
import { getGroups, getGroup } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
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

export default class extends React.Component<any, any> {
  state = {
    currentGroup: null,
  };

  fetchGroup = async id => {
    const currentGroup = await getGroup(id);
    this.setState({ currentGroup });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchGroup(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchGroup(id);
    }
  }

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Group}
          getKey={item => item.id}
          getData={getGroups}
          onSelect={currentGroup =>
            this.props.history.push(`/groups/${currentGroup.id}`)}
        />
        {this.state.currentGroup && (
          <Content
            data={this.state.currentGroup}
            keys={['name', 'description', 'id', 'status', 'applications']}
          />
        )}
      </div>
    );
  }
}
