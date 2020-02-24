import { DEFAULT_BLACK, LIGHT_TEAL } from 'common/colors';
import React from 'react';
import { Label, Table } from 'semantic-ui-react';

const styles = {
  label: {
    backgroundColor: LIGHT_TEAL,
    color: DEFAULT_BLACK,
    fontWeight: 100,
  },
};

export default ({ associatedItems }) => (
  <div style={{ flex: 1 }}>
    <Table singleLine>
      <Table.Body>
        {associatedItems.map(item => (
          <Table.Row key={item.policy.id}>
            <Table.Cell>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  width: 280,
                  display: 'inline-block',
                  overflow: 'hidden',
                }}
              >
                {item.policy.name}
              </span>
            </Table.Cell>
            <Table.Cell collapsing>
              <Label style={styles.label}>
                <span>{item.accessLevel}</span>
              </Label>
            </Table.Cell>
            <Table.Cell collapsing>
              <Label style={styles.label}>
                <span>{item.ownerType}</span>
              </Label>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
