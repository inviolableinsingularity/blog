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
