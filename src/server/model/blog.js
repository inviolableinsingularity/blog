/*
  API for blog data storage.

  I am using an embedded solution for the purpose of this test
  A production-ready solution would likely be talking to an actual DBMS or NoSQL endpoint
 */
const Datastore = require('nedb');
const db = new Datastore({
  filename: './blog-data.db',
  autoload: true,
});
db.loadDatabase((error) => {
  if (error) {
    console.error(`Unable to load database: ${error}`);
    process.exit(1);
  }
  console.log('Datastore initialized in persistent mode');
});

// Index timestamp field so it's faster to sort
db.ensureIndex({fieldName: 'timestamp', unique: false}, (error) => {
  if (error) {
    console.log(`Unable to create index for timstamp: ${error}`);
  }
});

export async function createBlog(options = {}) {
  const {title, content, thumbnailUrl} = options;
  const timestamp = Date.now();
  const document = {title, content, thumbnailUrl, timestamp};

  return new Promise((resolve, reject) => {
    db.insert(document, (error, newDocument) => {
      if (error) {
        console.log(error);
        throw new Error(`Could not insert document: ${error}`);
      }
      resolve(newDocument._id);
    });
  });
}

export async function retrieveBlog(options = {}) {
  let {id} = options;
  // Anything retrieved from here would want to be cached in a production environment

  // Retrieve single document
  if (id) {
    //fixme: temp mock data
    /*
    return {
      id,
      title: "Mock Blog Article",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac ipsum et ligula cursus ullamcorper eget sed felis. Praesent faucibus ex sit amet metus aliquet euismod. Vestibulum porttitor bibendum ante id semper. Etiam quis lacus quis lectus ullamcorper dapibus. Suspendisse porta porttitor faucibus. Donec quis purus aliquet, aliquet magna et, consectetur arcu. Pellentesque semper hendrerit dignissim. Curabitur viverra tellus nunc, vitae tempus neque lacinia in.",
      thumbnailUrl: "https://picsum.photos/200",
      timestamp: 1619459280,
    };
    */

    return new Promise((resolve, reject) => {
      db
        .find({_id: id})
        .limit(1)
        .exec((error, documents) => {
          if (error) {
            throw new Error(`Could not retrieve document with id ${id}: ${error}`);
          }
          if (documents && documents.length) {
            let {title, thumbnailUrl, timestamp, content} = documents[0];
            resolve({id, title, thumbnailUrl, timestamp, content});
          } else {
            throw new Error(`Data error retrieving document with id ${id}`);
          }
        });
    });
  }

  // Retrieve most recent documents
  else {
    //fixme: temp mock data
    /*
    return [
      {
        id: 1,
        title: "Mock Blog Article",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac ipsum et ligula cursus ullamcorper eget sed felis. Praesent faucibus ex sit amet metus aliquet euismod. Vestibulum porttitor bibendum ante id semper. Etiam quis lacus quis lectus ullamcorper dapibus. Suspendisse porta porttitor faucibus. Donec quis purus aliquet, aliquet magna et, consectetur arcu. Pellentesque semper hendrerit dignissim. Curabitur viverra tellus nunc, vitae tempus neque lacinia in.",
        thumbnailUrl: "https://picsum.photos/320/240?id=1",
        timestamp: 1619459280000,
      },
      {
        id: 2,
        title: "Mock Blog 2: Electric Boogaloo",
        content: "Fusce tristique est metus, quis iaculis dui sagittis vel. Phasellus tincidunt, metus ac mollis rhoncus, magna tellus scelerisque erat, non blandit nisl nulla ut arcu. Aenean viverra dui metus, sit amet luctus urna rhoncus in. Curabitur massa velit, congue eget lacus sed, commodo aliquam neque. Donec iaculis sem tellus, at maximus diam interdum ut. Praesent non justo ultrices, euismod ante ut, laoreet erat. Vestibulum dictum id tellus eget elementum. Sed varius tellus mattis, pretium tortor in, malesuada dolor. Vestibulum consectetur finibus gravida. Vivamus porttitor ex sed augue feugiat, id semper ex ultricies.",
        thumbnailUrl: "https://picsum.photos/320/240?id=2",
        timestamp: 1619527763000,
      },
      {
        id: 3,
        title: "Return of the Mock Blog",
        content: "Pellentesque et iaculis ex. Integer eros lacus, porttitor nec facilisis sit amet, consequat non ante. Nullam at orci pharetra, sagittis lacus at, molestie sapien. Nullam consequat magna tellus, id lacinia dui semper ac. Nam rhoncus hendrerit diam, id accumsan ex ultricies nec. Morbi tellus tellus, imperdiet non mollis eu, faucibus in lorem. Donec nec nisl non orci congue hendrerit eget in nunc. Vestibulum sodales quam at placerat ullamcorper. Pellentesque feugiat eget enim id dignissim.",
        thumbnailUrl: "https://picsum.photos/320/240?id=3",
        timestamp: 1619200117000,
      },
    ];
    */

    // Hard-locked to last 10 blog posts in reverse chronological order for the
    // purpose of this exercise. Paging and filtering would occur here if we were to
    // expand its functionality.
    return new Promise((resolve, reject) => {
      db
        .find({})
        .sort({timestamp: -1})
        .limit(10)
        .exec((error, documents) => {
          if (error) {
            throw new Error(`Could not retrieve documents: ${error}`);
          }
          // Filter into just metadata so we're not sending a huge document
          resolve(documents.map((document) => {
            let {_id: id, title, thumbnailUrl, timestamp} = document;
            return {id, title, thumbnailUrl, timestamp};
          }));
        });
    });
  }
}

export const updateBlog = (options = {}) => {

};

export const deleteBlog = (options = {}) => {

};

module.exports = {
  createBlog,
  retrieveBlog,
  updateBlog,
  deleteBlog,
};
