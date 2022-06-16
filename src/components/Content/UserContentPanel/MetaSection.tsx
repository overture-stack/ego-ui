/** @jsxImportSource @emotion/react */
import format from 'date-fns/format/index.js';

import { User } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { Grid } from 'semantic-ui-react';
import { BasicColumn, BasicRow, FieldContent, FieldName, FieldRow, Section } from '../common/grid';
import { DATE_FORMAT } from 'common/constants';
import { css, useTheme } from '@emotion/react';
import { FieldNames } from '../types';

// next steps: make some common components. it's likely you'll have to refactor existing display components cuz there's so much
// "if this resource" logic
// you need: fieldName, fieldContent, FieldRow, Section
// Action header (create/edit/delete/save)

const MetaSection = () => {
  const theme = useTheme();
  const { entity } = useEntityContext();
  const user = entity?.item as User;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID} fieldValue={user?.id} />
        <FieldRow fieldName={FieldNames.NAME} fieldValue={`${user?.firstName} ${user?.lastName}`} />
        <FieldRow fieldName={FieldNames.EMAIL} fieldValue={user?.email} />
      </Section>
      <Section>
        <BasicColumn width={8}>
          <Grid.Row>
            <BasicColumn width={8}>
              <BasicRow>
                <FieldName>{FieldNames.USER_TYPE}</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>{FieldNames.CREATED}</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>{FieldNames.LANGUAGE}</FieldName>
              </BasicRow>
            </BasicColumn>
            <BasicColumn width={8}>
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
            <BasicColumn width={8}>
              <BasicRow>
                <FieldName>{FieldNames.STATUS}</FieldName>
              </BasicRow>
              <BasicRow>
                <FieldName>{FieldNames.LAST_LOGIN}</FieldName>
              </BasicRow>
            </BasicColumn>
            <BasicColumn width={8}>
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
