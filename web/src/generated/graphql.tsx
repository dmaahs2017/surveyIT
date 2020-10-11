import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  surveys: PaginatedSurveys;
  questions: PaginatedQuestions;
};


export type QuerySurveysArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
};


export type QueryQuestionsArgs = {
  survey_id?: Maybe<Scalars['Int']>;
  offset: Scalars['Int'];
  limit: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
  typeOfUser: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaginatedSurveys = {
  __typename?: 'PaginatedSurveys';
  surveys: Array<Survey>;
  total: Scalars['Float'];
  hasMore: Scalars['Boolean'];
};

export type Survey = {
  __typename?: 'Survey';
  id: Scalars['Float'];
  name: Scalars['String'];
  description: Scalars['String'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaginatedQuestions = {
  __typename?: 'PaginatedQuestions';
  questions: Array<Question>;
  total: Scalars['Float'];
  hasMore: Scalars['Boolean'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  question: Scalars['String'];
  survey: Survey;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  createSurvey: Survey;
  createQuestion: Question;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationCreateSurveyArgs = {
  options: SurveyInput;
};


export type MutationCreateQuestionArgs = {
  survey_id: Scalars['Int'];
  q_str: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
  typeOfUser: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type SurveyInput = {
  name: Scalars['String'];
  creator_id: Scalars['Float'];
  description: Scalars['String'];
};

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email' | 'phoneNumber' | 'typeOfUser'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
  typeOfUser: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type QuestionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  survey_id: Scalars['Int'];
}>;


export type QuestionsQuery = (
  { __typename?: 'Query' }
  & { questions: (
    { __typename?: 'PaginatedQuestions' }
    & Pick<PaginatedQuestions, 'total' | 'hasMore'>
    & { questions: Array<(
      { __typename?: 'Question' }
      & Pick<Question, 'id' | 'question'>
      & { survey: (
        { __typename?: 'Survey' }
        & Pick<Survey, 'id'>
      ) }
    )> }
  ) }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  phoneNumber
  typeOfUser
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($options: UsernamePasswordInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $phoneNumber: String!, $typeOfUser: String!, $password: String!) {
  register(options: {username: $username, email: $email, phoneNumber: $phoneNumber, typeOfUser: $typeOfUser, password: $password}) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const QuestionsDocument = gql`
    query questions($limit: Int!, $offset: Int!, $survey_id: Int!) {
  questions(limit: $limit, offset: $offset, survey_id: $survey_id) {
    total
    hasMore
    questions {
      id
      question
      survey {
        id
      }
    }
  }
}
    `;

export function useQuestionsQuery(options: Omit<Urql.UseQueryArgs<QuestionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QuestionsQuery>({ query: QuestionsDocument, ...options });
};