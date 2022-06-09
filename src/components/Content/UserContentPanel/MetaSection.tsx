/** @jsxImportSource @emotion/react */
import format from 'date-fns/format/index.js';

import { User } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { Grid } from 'semantic-ui-react';
import { FieldContent, FieldName, FieldRow, Section } from '../common/grid';
import { DATE_FORMAT } from 'common/constants';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';

// next steps: make some common components. it's likely you'll have to refactor existing display components cuz there's so much
// "if this resource" logic
// you need: fieldName, fieldContent, FieldRow, Section
// Action header (create/edit/delete/save)

const BasicColumn = styled(Grid.Column)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

const BasicRow = styled(Grid.Row)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

const MetaSection = () => {
  const theme = useTheme();
  const { entity } = useEntityContext();
  const user = entity?.item as User;
  return (
    <div>
      <Section
        css={css`
          &.ui.grid {
            padding-bottom: 1rem;
          }
        `}
      >
        <FieldRow fieldName="ID" fieldValue={user?.id} />
        <FieldRow fieldName="Name" fieldValue={`${user?.firstName} ${user?.lastName}`} />
        <FieldRow fieldName="Email" fieldValue={user?.email} />
      </Section>
      <Section
        css={css`
          &.ui.grid {
            padding-top: 0.5rem;
          }
        `}
      >
        <BasicColumn width={8}>
          <Grid.Row>
            <BasicColumn width={7}>
              <BasicRow>
                <FieldName>User Type</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>Created</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>Language</FieldName>
              </BasicRow>
            </BasicColumn>
            <BasicColumn width={9}>
              <BasicRow>
                <FieldContent
                  css={css`
                    color: ${user?.type === 'ADMIN' ? theme.colors.primary_7 : 'inherit'};
                  `}
                >
                  {user?.type}
                </FieldContent>
              </BasicRow>
              <BasicRow>
                <FieldContent>{format(user?.createdAt, DATE_FORMAT)}</FieldContent>
              </BasicRow>
              <BasicRow>
                <FieldContent>{user?.preferredLanguage}</FieldContent>
              </BasicRow>
            </BasicColumn>
          </Grid.Row>
        </BasicColumn>
        <BasicColumn width={8}>
          <Grid.Row>
            <BasicColumn width={7}>
              <BasicRow>
                <FieldName>Status</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>Last Login</FieldName>
              </BasicRow>
            </BasicColumn>
            <BasicColumn width={9}>
              <BasicRow>
                <FieldContent>{user?.status}</FieldContent>
              </BasicRow>
              <BasicRow>
                <FieldContent>{format(user?.lastLogin, DATE_FORMAT)}</FieldContent>
              </BasicRow>
            </BasicColumn>
          </Grid.Row>
        </BasicColumn>
      </Section>
    </div>
  );
};

export default MetaSection;

/* <StyledGrid className="customGrid">
        {.map(({ fieldContent, fieldName, key }) => {
          return (
            <StyledRow className="contentView contentRow" key={`${entity.id}-${key}`}>
              <Grid.Column
                className="fieldNameColumn"
                css={css`
                  &.fieldNameColumn.wide.column {
                    padding-left: 0px;
                  }
                `}
                width={theme.dimensions.fieldNameWidths.user}
              >
                <StyledRow className="contentRow" css={{ padding: 0 }}>
                  <span
                    css={(theme) => ({
                      alignItems: 'center',
                      color: theme.colors.grey_6,
                      display: 'inline-flex',
                      fontSize: 11,
                      paddingRight: 10,
                    })}
                    className="contentFieldName"
                  >
                    {fieldName}
                  </span>
                </StyledRow>
              </Grid.Column>
              <Grid.Column
                className="idContent"
                width={11}
                css={css`
                  &.idContent.column.wide {
                    padding-left: 5px;
                  }
                `}
              >
                <StyledRow className="contentRow">
                  <FieldContent
                    css={[
                      {
                        display: 'flex',
                        flex: '0 0 100%',
                        paddingLeft: 0,
                      },
                    ]}
                    className="contentFieldContent"
                  >
                    {fieldContent}
                  </FieldContent>
                </StyledRow>
              </Grid.Column>
            </StyledRow>
          );
        })}
      </StyledGrid> */
