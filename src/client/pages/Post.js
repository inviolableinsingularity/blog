import React from 'react';
import {useSelector} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import PostCreator from "../components/PostCreator";

const postSelector = (state = {}) => {
  let {isAuthenticated, userName} = state;
  return {isAuthenticated, userName};
};

// Page to display a single blog entry
const Blog = () => {
  const {isAuthenticated} = useSelector(postSelector);

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="Page">
      <div className="Back"><Link to={'/'}>Back to List</Link></div>
      <h1 className="Page-title">Create Blog Post</h1>
      <PostCreator />
    </div>
  );
};

export default Blog;
