import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';

import {loadBlog} from "../lib/blogs";

import Login from '../components/Login'
import './Home.css';

const homeSelector = (state = {}) => {
  let {isAuthenticated, userName, blogs} = state;
  return {isAuthenticated, userName, blogs};
};

const loadBlogData = (dispatch, id) => {
  fetch(`/api/blog/${id}`, {method:'POST'})
    .then(res => res.json())
    .then(data => {
      dispatch(loadBlog(data));
    });
};

const Home = () => {
  const {isAuthenticated, userName, blogs} = useSelector(homeSelector);
  const dispatch = useDispatch();
  return (
    <div className="Page Home">
      <h1>A S[i/a]mple Blog</h1>
      <p>
        This is a basic blog application!
      </p>
      {
        (blogs && blogs.length) ? (
          <div className="BlogList">
            {
              blogs.map((blog) => {
                let {id, title, timestamp, thumbnailUrl} = blog;
                let date = new Date(timestamp); // Could fancy this up with natural language times like "2 days ago", etc
                return (
                  <React.Fragment key={id}>
                    <hr className="BlogListDivider" />
                    <div className="BlogListEntry">
                      {thumbnailUrl && <img className="BlogListEntry-thumbnail" src={thumbnailUrl} alt="" />}
                      <div className="BlogListEntry-content">
                        <Link to={`/blog/${id}`} onClick={() => {loadBlogData(dispatch, id)}}>
                          <h2 className="BlogListEntry-title">{title}</h2>
                        </Link>
                        <div className="BlogListEntry-posted">Posted {date.toLocaleString()}</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            }
          </div>
        ) : (
          <React.Fragment>
            <hr className="BlogListDivider" />
            <p>There are no blog posts yet!</p>
          </React.Fragment>
        )
      }
      <hr className="BlogListDivider" />
      <div className="Authentication">
        {isAuthenticated ? (
          <React.Fragment>
            <div>You are currently logged in as: {userName}</div>
            <div>
              <Link to="/post">Create Post</Link>
              &middot;
              <a href="/logout">Log Out</a>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>You are not logged in.</div>
            <Login />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Home;
