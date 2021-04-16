import React from 'react';

import { TEntity } from 'common/typedefs';
import { IResource } from 'common/typedefs/Resource';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

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

  componentDidMount() {
    this.fetchName(this.props);
  }

  componentDidUpdate(prevProps: IItemNameProps) {
    if (prevProps.id !== this.props.id || prevProps.type !== this.props.type) {
      this.fetchName(this.props);
    }
  }

  render() {
    return <span>{this.state.name}</span>;
  }
}

export default ItemName;
