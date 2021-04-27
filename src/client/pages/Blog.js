import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import './Blog.css';

const blogSelector = (state = {}) => {
  let {blog={}} = state;
  return {blog};
};

// Page to display a single blog entry

const Blog = () => {
  const {blog} = useSelector(blogSelector);

  return (
    <div className="Page">
      <div className="Back"><Link to={'/'}>Back to List</Link></div>
      <h1 className="Page-title">{blog.title}</h1>
      <p>ID: {blog.id}</p>
      <p>Posted <strong>{(new Date(blog.timestamp)).toLocaleString()}</strong></p>
      {blog.thumbnailUrl && <div><img src={blog.thumbnailUrl} alt="" /></div> }
      <p>{blog.content}</p>
    </div>
  );
};

export default Blog;
