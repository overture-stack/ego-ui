import RESOURCE_MAP from 'common/RESOURCE_MAP';
import React from 'react';

import { TEntity } from 'common/typedefs';
import { IResource } from 'common/typedefs/Resource';

interface IItemNameProps {
  id: string;
  type: string;
}

class ItemName extends React.Component<IItemNameProps, { name: string }> {
  state = { name: '' };
  async fetchName(props: IItemNameProps) {
    const { type, id }: IItemNameProps = props;
    const { getName = ({ name }) => name, getItem }: IResource = RESOURCE_MAP[type];
    if (id === 'create') {
      this.setState({ name: id });
    } else {
      if (getItem) {
        const item: TEntity | string = await getItem(id);
        this.setState({ name: item ? getName(item) : id });
      } else {
        return '';
      }
    }
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
