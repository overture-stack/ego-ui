import React from 'react';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

interface IItemNameProps {
  id: string;
  type: string;
}

class ItemName extends React.Component<IItemNameProps, { name: string }> {
  state = { name: '' };
  async fetchName(props: IItemNameProps) {
    const { type, id } = props;
    const { getName = ({ name }) => name, getItem } = RESOURCE_MAP[type];
    const item = await getItem(id);
    this.setState({ name: getName(item) });
  }

  componentWillMount() {
    this.fetchName(this.props);
  }

  componentWillReceiveProps(nextProps: IItemNameProps) {
    if (nextProps.id !== this.props.id || nextProps.type !== this.props.type) {
      this.fetchName(nextProps);
    }
  }
  render() {
    return this.state.name;
  }
}

export default ItemName;
