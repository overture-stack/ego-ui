import React from 'react';
import { css } from 'glamor';

import EmptyContent from 'components/EmptyContent';
import ContentTable from './ContentTable';
import Associator from 'components/Associator/Associator';

export class AssociatorFetchInitial extends React.Component<any, any> {
  state = { items: null };
  async componentDidMount() {
    const items = this.props.fetchInitial ? (await this.props.fetchInitial()).resultSet : [];
    this.setState({ items });
  }
  render() {
    return this.state.items ? <Associator {...this.props} initialItems={this.state.items} /> : null;
  }
}

const styles = {
  container: {
    padding: 60,
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
};

const INITIAL_STATE = { data: null };
export default class Content extends React.Component<any, any> {
  state = INITIAL_STATE;

  fetchData = async ({ getData, id }) => {
    const data = await getData(id);

    this.setState({ data });
  };

  componentDidMount() {
    if (this.props.id) {
      this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.id;
    if (id !== this.props.id) {
      if (id) {
        this.fetchData(nextProps);
      } else {
        this.setState(INITIAL_STATE);
      }
    }
  }

  render() {
    const { keys, styles: stylesProp = {}, id, emptyMessage, associators, type } = this.props;
    const data = this.state.data as any;
    return !id || !data ? (
      <EmptyContent message={!id ? emptyMessage : 'loading'} />
    ) : (
      <div className={`Content ${css(styles.container, stylesProp)}`}>
        <ContentTable
          keys={[...keys, ...associators.map(p => p.key)]}
          data={{
            ...data,
            ...associators.reduce((acc, { key, add, remove, ...opts }) => {
              return {
                ...acc,
                [key]: (
                  <AssociatorFetchInitial
                    key={`${data.id}-${key}`}
                    {...opts}
                    onAdd={selected => add({ [type]: data, [key]: selected })}
                    onRemove={selected => remove({ [type]: data, [key]: selected })}
                  />
                ),
              };
            }, {}),
          }}
        />
      </div>
    );
  }
}
