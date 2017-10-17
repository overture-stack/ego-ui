import React from 'react';
import { storiesOf } from '@storybook/react';
import Users from './Users';
import Pagination from './Pagination';

class PaginationTest extends React.Component {
  state = {
    offset: 0,
    limit: 10,
    total: 100,
  };
  render() {
    return (
      <Pagination
        onChange={page => {
          this.setState({ offset: this.state.limit * page });
        }}
        {...this.state}
      />
    );
  }
}
storiesOf('Screens', module)
  .add('Users', () => <Users />)
  .add('Pagination', () => <PaginationTest />);
