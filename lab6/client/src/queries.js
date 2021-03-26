import { gql } from '@apollo/client';

const GET_IMAGES = gql`
  query($pageNum: Int!) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_POSTED_IMAGES = gql`
  query {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_TOP_TEN = gql`
  query {
    getTopTenBinnedPosts {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadImage($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation updateImage($id: ID!, $url: String!, $description: String, $posterName: String, $userPosted: Boolean, $binned: Boolean, $numBinned: Int!) {
    updateImage(
      id: $id
      url: $url
      description: $description
      posterName: $posterName
      userPosted: $userPosted
      binned: $binned
      numBinned: $numBinned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

export default {
  GET_IMAGES,
  GET_BINNED_IMAGES,
  GET_POSTED_IMAGES,
  GET_TOP_TEN,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMAGE
};
