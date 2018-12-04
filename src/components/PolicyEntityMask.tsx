import React from 'react';
import { getPolicyGroups, getPolicyUsers } from 'services/getPolicy';

class PolicyEntityMask extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: props.id,
      mask: props.mask,
      entity: props.entity,
      entries: [],
    };
  }

  async componentDidMount() {
    const collection =
      this.state.entity === 'users'
        ? await getPolicyUsers(this.state.id)
        : await getPolicyGroups(this.state.id);
    const filtered = collection.filter(e => e.mask === this.state.mask.toUpperCase());

    if (filtered.length > 0) {
      filtered.forEach(element => {
        this.setState({ entries: [...this.state.entries, element] });
      });
    }
  }

  render() {
    const spans = this.state.entries.map(e => (
      <span className="ui label" key={e.id}>
        {e.name}
      </span>
    ));

    return <div>{spans}</div>;
  }
}

export default PolicyEntityMask;
