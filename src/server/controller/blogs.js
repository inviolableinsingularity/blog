/*
  Here there be business logic.

  This is separate from the model object so that whatever we want to backend it can be easily swapped out.
 */
import Data from '../model/blog';

/**
 * Retrieve latest blog posts.
 *
 * @param options Currently unused, could be used to provide context for pagination or filtering
 */
export async function getBlogs(options={}) {
  try {
    const val = await Data.retrieveBlog(options);

    return options.id
      ? {blog: val, error: false, message: null}
      : {documents: val, error: false, message: null};
  } catch (error) {
    return {documents: [], error: true, message: error};
  }
}

/**
 * Post a new blog.
 *
 * @param options
 */
export async function postBlog(options) {
  try {
    const id = await Data.createBlog(options);

    return {error: false, message: null, id};
  } catch (error) {
    return {error: true, message: error};
  }
}

export default {
  getBlogs
};
