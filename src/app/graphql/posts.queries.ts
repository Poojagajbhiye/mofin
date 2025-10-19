import { gql } from 'apollo-angular';
import { GetPosts, GetPost, GetPostVariables, GetPostsVariables, DeletePost, DeletePostVariables, UpdatePost, UpdatePostVariables, CreatePost, CreatePostVariables } from './posts.types';
import { POST_TABLE_FIELDS_FRAGMENT } from './posts.fragments';

const GET_POSTS = gql<GetPosts, GetPostsVariables> `
    query MyQuery($perPage: Int, $page: Int) {
        allPosts(perPage: $perPage, page: $page) {
            ...PostTableFields
        }
        _allPostsMeta {
            count
        }
    }
    ${POST_TABLE_FIELDS_FRAGMENT}
`;

const GET_POST = gql<GetPost, GetPostVariables> `
    query MyQuery($id: ID!) {
        Post(id: $id) {
            ...PostTableFields
            comment
        }
    }
    ${POST_TABLE_FIELDS_FRAGMENT}
`;

const DELETE_POST = gql<DeletePost, DeletePostVariables> `
    mutation MyMutation($id: ID!) {
        deletePost(id: $id) {
            ...PostTableFields
        }
    }
    ${POST_TABLE_FIELDS_FRAGMENT}
`

const UPDATE_POST = gql <UpdatePost, UpdatePostVariables>`
    mutation MyMutation(
        $id: ID!
        $title: String,
        $views: Int,
        $comment: String
    ) {
        updatePost(id: $id, comment: $comment, title: $title, views: $views) {
            ...PostTableFields
            comment
        }
    }
    ${POST_TABLE_FIELDS_FRAGMENT}
`

const CREATE_POST = gql <CreatePost, CreatePostVariables>`
    mutation MyMutation(
        $title: String!,
        $views: Int!,
        $comment: String!
    ) {
        createPost(comment: $comment, title: $title, views: $views) {
            ...PostTableFields
            comment
        }
    }
    ${POST_TABLE_FIELDS_FRAGMENT}
`

export { GET_POSTS, GET_POST, DELETE_POST, UPDATE_POST, CREATE_POST };