import { IField } from 'common/typedefs/Resource';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Grid } from 'semantic-ui-react';

import { DARK_GREY, GREY, HIGH_CONTRAST_TEAL } from 'common/colors';

const FIELD_NAME_WIDTHS = {
  application: 5,
  group: 3,
  policy: 3,
  user: 4,
};

export const styles = {
  contentHeight: {
    height: 48,
  },
  contentRow: {
    alignItems: 'center !important',
    padding: '0.5rem 0rem !important',
  },
  fieldContent: {
    fontSize: 14,
  },
  fieldName: {
    alignItems: 'center !important',
    color: DARK_GREY,
    display: 'inline-flex',
    fontSize: 11,
  },
  fieldNamePadding: {
    paddingRight: '10px',
  },
  section: {
    borderBottom: `1px solid ${GREY}`,
    marginLeft: '1.5rem',
    marginRight: '1rem',
    paddingBottom: '1.5rem',
    paddingTop: '1rem',
  },
};

const ContentView = ({
  entity,
  entityType,
  fieldNameWidths = FIELD_NAME_WIDTHS,
  hideImmutable = true,
  resource,
  rows,
  customStyles = {},
}) => {
  const immutableKeys = resource.schema.filter(f => f.immutable).map(f => f.key);
  const panelSections = groupBy(rows, 'panelSection');

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div className={`contentPanel id ${css(styles.section)}`}>
        <Grid>
          {panelSections['id'].map(({ fieldContent, fieldName, key }) => {
            return (
              <Grid.Row
                className={`${css(styles.contentRow, styles.contentHeight)}`}
                key={`${entity.id}-${key}`}
              >
                <Grid.Column width={fieldNameWidths[entityType]}>
                  <Grid.Row
                    className={`${css(styles.contentRow, styles.contentHeight, {
                      padding: '0 !important', // override semantic-ui
                    })}`}
                  >
                    <span
                      className={`contentFieldName ${css(
                        styles.fieldName,
                        styles.fieldNamePadding,
                      )}`}
                    >
                      {fieldName}
                    </span>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column width={11}>
                  <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
                    <span
                      className={`contentFieldContent ${css(styles.fieldContent, {
                        display: 'flex',
                        flex: '0 0 100%',
                      })}`}
                    >
                      {fieldContent}
                    </span>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </div>

      {panelSections['meta'].length > 0 && (
        <div className={`contentPanel meta ${css(styles.section)}`}>
          <Grid columns="equal">
            {entityType === 'user' ? (
              <React.Fragment>
                <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
                  {panelSections['meta'].slice(0, 2).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { width: 80 },
                            )}`}
                          >
                            {fieldName}
                          </span>

                          <span
                            className={`contentFieldContent ${css(
                              styles.fieldContent,
                              ...(entityType === 'user' &&
                              key === 'type' &&
                              typeof fieldContent === 'string' &&
                              (fieldContent || '').toLowerCase() === 'admin'
                                ? [{ color: HIGH_CONTRAST_TEAL }]
                                : []),
                            )}`}
                          >
                            {fieldContent}
                          </span>
                        </Grid.Row>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>

                <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
                  {panelSections['meta'].slice(2, 4).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <Grid.Row className={`${css(styles.contentRow, styles.contentHeight)}`}>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { width: 80 },
                            )}`}
                          >
                            {fieldName}
                          </span>
                          <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                            {fieldContent}
                          </span>
                        </Grid.Row>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>
              </React.Fragment>
            ) : (
              panelSections['meta'].map(({ fieldContent, fieldName, key }) => {
                return (
                  <Grid.Row
                    className={`${css(styles.contentRow, styles.contentHeight)}`}
                    key={`${entity.id}-${key}`}
                  >
                    <Grid.Column width={fieldNameWidths[entityType]}>
                      <span
                        className={`contentFieldName ${css(
                          styles.fieldName,
                          styles.fieldNamePadding,
                        )}`}
                      >
                        {fieldName}
                      </span>
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                        {fieldContent}
                      </span>
                    </Grid.Column>
                  </Grid.Row>
                );
              })
            )}
          </Grid>
        </div>
      )}

      <div className={`contentPanel associatedTypes ${css(styles.section)}`}>
        <Grid>
          {panelSections['associatedTypes'].map(({ fieldContent, fieldName, key }) => {
            return (
              <Grid.Row className={`${css(styles.contentRow)}`} key={`${entity.id}-${key}`}>
                <Grid.Column verticalAlign={'top'}>
                  <div className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {fieldContent}
                  </div>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default ContentView;
