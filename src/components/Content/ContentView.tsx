import { TField } from 'common/typedefs/Resource';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { groupBy, upperCase } from 'lodash';
import React from 'react';
import { compose } from 'recompose';
import { Grid } from 'semantic-ui-react';

import { DARK_GREY, GREY, HIGH_CONTRAST_TEAL } from 'common/colors';

const styles = {
  fieldContent: {
    fontSize: 14,
  },
  fieldName: {
    color: DARK_GREY,
    fontSize: 11,
  },
  fieldNamePadding: {
    paddingRight: '10px',
  },
  section: {
    borderBottom: `1px solid ${GREY}`,
    marginLeft: '1.5rem',
    marginRight: '1rem',
    marginTop: '2rem',
    paddingBottom: '1rem',
  },
};

const ContentView = ({
  entity,
  entityType,
  fieldNameWidths,
  hideImmutable = true,
  resource,
  rows,
  customStyles = {},
}) => {
  const immutableKeys = resource.schema.filter(f => f.immutable).map(f => f.key);
  const panelSections = groupBy(rows, 'panelSection');

  return (
    <div>
      <div className={`contentPanel id ${css(styles.section)}`}>
        <Grid>
          {panelSections['id'].map(({ fieldContent, fieldName, key }) => {
            return (
              <Grid.Row key={`${entity.id}-${key}`}>
                <Grid.Column width={fieldNameWidths[entityType]}>
                  <span
                    className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                  >
                    {fieldName}
                  </span>
                </Grid.Column>
                <Grid.Column width={12}>
                  <span className={`contentFieldContent ${css(styles.fieldContent)}`}>
                    {fieldContent}
                  </span>
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
                <Grid.Row>
                  {panelSections['meta'].slice(0, 2).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <Grid.Row>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { display: 'inline-block', width: 80 },
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

                <Grid.Row>
                  {panelSections['meta'].slice(2, 4).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <Grid.Row>
                          <span
                            className={`contentFieldName ${css(
                              styles.fieldName,
                              styles.fieldNamePadding,
                              { display: 'inline-block', width: 80 },
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
                  <Grid.Row key={`${entity.id}-${key}`}>
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
                    <Grid.Column width={12}>
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
              <Grid.Row key={`${entity.id}-${key}`}>
                <Grid.Column verticalAlign={'top'}>
                  <span
                    className={`contentFieldName ${css(styles.fieldName, styles.fieldNamePadding)}`}
                  >
                    {fieldName}
                  </span>
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
