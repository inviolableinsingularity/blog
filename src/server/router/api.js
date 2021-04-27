import express from 'express';
import bodyParser from 'body-parser';

import {postBlog, getBlogs} from "../controller/blogs";

const jsonParser = bodyParser.json();

const router = express.Router();

// Load a single blog article's full data
router.post('/api/blog/:id', (req, res) => {
  let blog = {};
  if (req.params.id) {
    getBlogs({id: req.params.id}).then(({blog}) => {
      res.json(blog);
    });
  } else {
    res.json(blog);
  }
});

// Create a new blog article
router.post('/api/post', jsonParser, (req, res) => {
  let {title, content, thumbnailUrl} = req.body;
  if (title && content) {
    postBlog({title, content, thumbnailUrl}).then((result) => {
      if (result.error) {
        result.json({
          error: result.message
        });
      } else {
        Promise.all([getBlogs({id: result.id}), getBlogs({})])
          .then(([{blog}, {documents: recent}]) => {
            console.log(result, blog, recent);
            res.json({
              id: result.id,
              blog,
              recent
            });
          });
      }
    });
  } else {
    res.json({
      error: "Missing title or content"
    })
  }
});

export default router;
