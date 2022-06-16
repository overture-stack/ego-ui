/** @jsxImportSource @emotion/react */
import format from 'date-fns/format/index.js';

import { User, UserLanguage, UserStatus, UserType } from 'common/typedefs';
import useEntityContext from 'components/global/hooks/useEntityContext';
import { Grid } from 'semantic-ui-react';
import {
  BasicColumn,
  BasicRow,
  FieldContent,
  FieldName,
  FieldRow,
  Section,
  StyledDropdown,
  TextInput,
} from '../common/grid';
import { DATE_FORMAT } from 'common/constants';
import { css, useTheme } from '@emotion/react';
import { FieldNames } from '../types';

const MetaSection = () => {
  const theme = useTheme();
  const { entity } = useEntityContext();
  const user = entity?.item as User;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID}>{user?.id}</FieldRow>
        <FieldRow fieldName={FieldNames.NAME}>{`${user?.firstName || ''} ${user?.lastName ||
          ''}`}</FieldRow>
        <FieldRow fieldName={FieldNames.EMAIL}>{user?.email}</FieldRow>
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

export const UserForm = () => {
  const { entity, stagedEntity } = useEntityContext();
  const user = stagedEntity.item as User;
  return (
    <div>
      <Section>
        <FieldRow fieldName={FieldNames.ID}>{entity.item?.id}</FieldRow>
        <FieldRow
          fieldName={FieldNames.NAME}
          css={css`
            align-items: center !important;
            margin-bottom: 5px !important;
            margin-top: 0 !important;
          `}
        >
          <Grid.Row css={css``}>
            <TextInput
              css={css`
                margin-right: 0.5rem;
                max-width: 150px;
              `}
              value={user?.firstName}
            />
            <TextInput
              css={css`
                margin-left: 0.5rem;
                max-width: 150px;
              `}
              value={user?.lastName}
            />
          </Grid.Row>
        </FieldRow>
        <FieldRow fieldName={FieldNames.EMAIL}>{user?.email}</FieldRow>
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
              <Grid.Row
                css={css`
                  padding-top: 10px;
                  padding-bottom: 7px;
                `}
              >
                <StyledDropdown
                  selection
                  options={[
                    { text: UserType.USER, value: UserType.USER },
                    { text: UserType.ADMIN, value: UserType.ADMIN },
                  ]}
                  value={user?.type}
                />
              </Grid.Row>
              <BasicRow>
                <FieldContent>{format(user?.createdAt, DATE_FORMAT)}</FieldContent>
              </BasicRow>
              <Grid.Row
                css={css`
                  padding-top: 10px;
                  padding-bottom: 7px;
                `}
              >
                <StyledDropdown
                  selection
                  options={[
                    { text: UserLanguage.ENGLISH, value: UserLanguage.ENGLISH },
                    { text: UserLanguage.FRENCH, value: UserLanguage.FRENCH },
                    { text: UserLanguage.SPANISH, value: UserLanguage.SPANISH },
                  ]}
                  value={user?.preferredLanguage}
                  placeholder={FieldNames.LANGUAGE}
                />
              </Grid.Row>
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
              <Grid.Row
                css={css`
                  padding-top: 0.7rem;
                  padding-bottom: 0px;
                  margin-left: -0.5rem;
                `}
              >
                <StyledDropdown
                  value={user?.status}
                  selection
                  options={[
                    { text: UserStatus.APPROVED, value: UserStatus.APPROVED },
                    { text: UserStatus.DISABLED, value: UserStatus.DISABLED },
                    { text: UserStatus.PENDING, value: UserStatus.PENDING },
                    { text: UserStatus.REJECTED, value: UserStatus.REJECTED },
                  ]}
                />
              </Grid.Row>
              <BasicRow
                css={css`
                  padding-top: 22px;
                `}
              >
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
