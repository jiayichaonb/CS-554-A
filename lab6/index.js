const { ApolloServer, gql } = require('apollo-server');
const { default: Axios } = require('axios');
const lodash = require('lodash');
const uuid = require('uuid');
const axios = require('axios')
const { RedisCache } = require('apollo-server-cache-redis');

const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);




//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
      numBinned: Int!
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

//get the unsplashImages from api
const accessKey = 'gybQ2Aq2er6p63hdER_srU5MDEsrAlmrTyQsw8HCXT4';
async function getUnsplashImages (pageNum) {
  if (!pageNum) pageNum = 0;

  const data = await axios.get(`https://api.unsplash.com/photos/?client_id=${accessKey}&page=${pageNum.toString()}`);
  // console.log("get data here test1");
  // console.log(data);
  let imagePosts = data.data.map( (data) =>{
    let imagePost = {
      id: data.id,
      url: data.urls.regular,
      posterName: data.user.name,
      description: data.description,
      userPosted: false,
      binned: false,
      numBinned: data.likes
    }
    return imagePost;
  });

  return imagePosts; 
}

async function getBinned() {
  let binnedImgs = await client.smembersAsync('binnedImages');
  // console.log(binnedImgs);
  // for (let img of binnedImgs) {
  //   let x = JSON.parse(img);
  //   console.log("type of img: " + typeof(x));
  // }
  

  if (binnedImgs) {
    let binnedObjs = binnedImgs.map((e) => {
      return JSON.parse(e);
    });
    // console.log(binnedObjs);

    return (binnedObjs);
  }
  else {
    return null;
  }
}

async function getPosted() {
  let posted = await client.smembersAsync('uploadImages');
  // console.log("posted from cache " + typeof(posted));
  // console.log(posted);
  // for (let img of posted) {
  //   let x = JSON.parse(img);
  //   console.log("type of img: " + typeof(x));
  // }
  if (posted) {
    let postedObjs = posted.map((e) => {
      return JSON.parse(e);
    });
    // console.log(postedObjs);

    return (postedObjs);
  }
  else {
    return null;
  }
}

async function getTopTenBinnedPosts() {
  let binnedImgs = await client.smembersAsync('binnedImages');
  // console.log(binnedImgs);
  // for (let img of posted) {
  //   let x = JSON.parse(img);
  //   console.log("type of img: " + typeof(x));
  // }
  if (binnedImgs) {
    let binnedObjs = binnedImgs.map(async (e) => {
      let parseI = JSON.parse(e);
      //add binned image to cache to sort them
      await client.zaddAsync('topBinned', parseI.numBinned, e);

      return parseI;
    });

    let topBinnedImages = await client.zrevrangeAsync('topBinned', 0, 9);
    let topBinnedObjs = topBinnedImages.map(async (e) => {
      let parseI = JSON.parse(e);
      return parseI;
    });

    return (topBinnedObjs);
  }
  else {
    return null;
  }
}


const resolvers = {
  Query: {
    unsplashImages: async (_, args) => await getUnsplashImages(args.pageNum),
    binnedImages: async () => (await getBinned()),
    userPostedImages: async () => (await getPosted()),
    getTopTenBinnedPosts: async () => (await getTopTenBinnedPosts())
  },
  // Employer: {
  //   numOfEmployees: (parentValue) => {
  //     console.log(`parentValue in Employer`, parentValue);
  //     return employees.filter((e) => e.employerId === parentValue.id).length;
  //   },
  //   employees: (parentValue) => {
  //     return employees.filter((e) => e.employerId === parentValue.id);
  //   }
  // },
  // Employee: {
  //   employer: (parentValue) => {
  //     //console.log(`parentValue in Employee`, parentValue);
  //     return employers.filter((e) => e.id === parentValue.employerId)[0];
  //   }
  // },
  Mutation: {
    uploadImage: async (_, args) => {
      const uploadImage = {
        id: uuid.v4(),
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted : true,
        binned: false,
        numBinned: 0
      };
      // console.log(uploadImage);
      await client.sadd('uploadImages', JSON.stringify(uploadImage));
      return uploadImage;
    },
    deleteImage: async (_, args) => {
      const userPostedImages = await client.smembersAsync('uploadImages');

      var deletedImage;

      for (var i of userPostedImages) {
        let parseI = JSON.parse(i);
        if (parseI.id == args.id) {
          deletedImage = parseI;
          await client.sremAsync('uploadImages', i);
        } 
      }
      // console.log(deletedImage);
      return deletedImage;
    },
    updateImage: async (_, args) => {
      const newImage = {
        id: args.id,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: args.userPosted,
        binned: args.binned,
        numBinned: args.numBinned
      };
      
      let uploadImages = await client.smembersAsync('uploadImages');
      let binnedImages = await client.smembersAsync('binnedImages');
      //top 10 binned images
      let topTenImages = await client.zrevrangeAsync('topBinned', 0, -1);


      let thisUploadImage = null;
      let thisBinnedImage = null;
      let thisTopImage = null
      //check if the imagePost is in userPosted cache
      for (var i of uploadImages) {
        let parseI = JSON.parse(i);
        if (parseI.id == args.id) {
          thisUploadImage = i;
        }
      }
      //check if the imagePost is in binned cache
      for (var i of binnedImages) {
        let parseI = JSON.parse(i);
        if (parseI.id == args.id) {
          thisBinnedImage = i;
        }
      }
      //check if the imagePost is in top 10 cache
      for (var i of topTenImages) {
        let parseI = JSON.parse(i);
        if (parseI.id == args.id) {
          thisTopImage = i;
        }
      }

      if (thisUploadImage != null && thisBinnedImage == null) {
        //user upload the image but didn't add it to binned
        if (args.binned == true) {
          //if binned is true
          await client.sremAsync('uploadImages', thisUploadImage);
          await client.saddAsync('uploadImages', JSON.stringify(newImage));
          await client.saddAsync('binnedImages', JSON.stringify(newImage));
        }else {
          await client.sremAsync('uploadImages', thisUploadImage);
          await client.saddAsync('uploadImages', JSON.stringify(newImage));
        }
      }else if (thisUploadImage != null && thisBinnedImage != null) {
        //user upload the image and set it binned
        if (args.binned == true) {
          //if binned is true
          await client.sremAsync('uploadImages', thisUploadImage);
          await client.saddAsync('uploadImages', JSON.stringify(newImage));
          await client.sremAsync('binnedImages', thisBinnedImage);
          await client.saddAsync('binnedImages', JSON.stringify(newImage));
        }else {
          await client.sremAsync('uploadImages', thisUploadImage);
          await client.saddAsync('uploadImages', JSON.stringify(newImage));
          await client.sremAsync('binnedImages', thisBinnedImage);
          await client.zremAsync('topBinned', thisBinnedImage);

        }
      }
      else if (thisUploadImage == null && thisBinnedImage != null) {
        //the image from unsplash API, but the user added it to binned cache
        if (args.binned == true) {
          await client.sremAsync('binnedImages', thisBinnedImage);
          await client.saddAsync('binnedImages', JSON.stringify(newImage));
        }
        else {
          await client.sremAsync('binnedImages', thisBinnedImage);
          await client.zremAsync('topBinned', thisBinnedImage);

        }
      }
      else {
        //the image from unsplash API, not binned
        if (args.binned == true) {
          await client.saddAsync('binnedImages', JSON.stringify(newImage));
        }
        // else {
        //   await client.sremAsync('binnedImages', thisUploadImage);
        // }
      }

      // console.log("test of updata: " + JSON.stringify(newImage));
      return newImage;
    },
    
  }
};

const server = new ApolloServer({ 
  typeDefs,
  resolvers, 
  cache: new RedisCache({
    host: 'localhost',
    port: 6379
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
