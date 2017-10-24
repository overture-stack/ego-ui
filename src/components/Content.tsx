import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';

const styles = {
  container: {
    padding: 60,
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
};

const DATE_KEYS = ['createdAt', 'lastLogin'];
export default ({ data, keys, styles: stylesProp = {} }) => {
  return (
    <div className={`Content ${css(styles.container, stylesProp)}`}>
      <Table basic="very" style={{ fontSize: 18 }}>
        <Table.Body>
          {keys.map(key => {
            return (
              <Table.Row key={key} style={{ verticalAlign: 'baseline' }}>
                <Table.Cell
                  style={{
                    fontSize: '0.65em',
                    border: 'none',
                    textAlign: 'right',
                    width: '6em',
                  }}
                >
                  {_.upperCase(key)}
                </Table.Cell>
                <Table.Cell style={{ border: 'none' }}>
                  {data[key] ? (
                    DATE_KEYS.indexOf(key) >= 0 ? (
                      format(data[key], 'MMMM Do YYYY [a]t h:mmA')
                    ) : (
                      data[key]
                    )
                  ) : (
                    <div style={{ opacity: 0.4, fontStyle: 'italic' }}>
                      empty
                    </div>
                  )}
                  {}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
