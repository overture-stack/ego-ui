import { css } from 'glamor';
import React from 'react';
import { compose, withState } from 'recompose';
import { Checkbox, Form, Label, Radio, Table } from 'semantic-ui-react';

import { DEFAULT_BLACK, LIGHT_TEAL } from 'common/colors';

const ACCESS_LEVELS = ['READ', 'WRITE', 'DENY'];

const styles = {
  label: {
    backgroundColor: LIGHT_TEAL,
  },
};

const EditAccessLevel = compose(
  withState('checkedLevel', 'setCheckedLevel', props => props.accessLevel),
)(({ accessLevel, checkedLevel, permission, setCheckedLevel }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      {ACCESS_LEVELS.map(level => (
        <Checkbox
          key={level}
          radio
          label={level}
          checked={level === checkedLevel}
          onChange={() => setCheckedLevel(level)}
        />
      ))}
    </div>
  );
});

export default ({ editing, items }) => {
  return (
    <Table singleLine>
      <Table.Body>
        {items.map(({ id, policy, accessLevel, owner }) => (
          <Table.Row key={id}>
            <Table.Cell colSpan="3">{policy.name}</Table.Cell>
            <Table.Cell textAlign="right">
              {editing ? (
                <EditAccessLevel accessLevel={accessLevel} permission={id} />
              ) : (
                <Label style={styles.label}>
                  <span style={{ color: DEFAULT_BLACK, fontWeight: 100 }}>{accessLevel}</span>
                </Label>
              )}
            </Table.Cell>
            <Table.Cell textAlign="right">
              <Label style={styles.label}>inheritance</Label>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
