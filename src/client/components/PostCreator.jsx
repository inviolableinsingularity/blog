import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import Editor from 'rich-markdown-editor';

import {loadBlog, loadBlogs} from "../lib/blogs";

async function fetchBlog({title, thumbnail, content}) {
  const response = await fetch(
    '/api/post',
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title, thumbnailUrl: thumbnail, content
      })
    }
  );
  return response.json();
}

function postBlog({title, setTitle, thumbnail, setThumbnail, content, setContent, setError, history, dispatch}) {
  fetchBlog({title, thumbnail, content})
    .then((json) => {
      console.log(json);
      if (json.error) {
        setError(json.error);
      } else {
        setTitle('');
        setThumbnail('');
        setContent('');
        setError('');
        dispatch(loadBlog(json.blog));
        dispatch(loadBlogs(json.recent));
        history.push("/blog/" + json.id);
      }
    });
}

// This can be improved to perform the login via async call instead of a hard POST
const PostCreator = () => {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        postBlog({title, setTitle, thumbnail, setThumbnail, content, setContent, setError, history, dispatch})
      }}>
        {error && <div>{error}</div>}
        <div>
          <label htmlFor="title">Title:</label><br/>
          <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail URL:</label><br/>
          <input type="text" name="thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="content">Content:</label><br/>
          <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
        <div>
          <input type="submit" value="Post It!"/>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
