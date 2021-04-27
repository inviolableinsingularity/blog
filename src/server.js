import React from 'react';
import {StaticRouter} from 'react-router-dom';
import {renderToString} from 'react-dom/server';
import express from 'express';
import session from 'express-session';

import {createStore} from 'redux';
import {getBlogs} from "./server/controller/blogs";
import {applyAuth} from './server/auth';
import apiRouter from './server/router/api';

import reducer, {login, loadBlog, loadBlogs} from './client/lib/blogs';
import App from './client/App';
import {Provider} from "react-redux";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
    assets[entrypoint].css.map(asset =>
      `<link rel="stylesheet" href="${asset}">`
    ).join('') : '' : '';
};

const injectPreloadedState = (state) => {
  return `
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')};
    </script>
  `;
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
    assets[entrypoint].js.map(asset =>
      `<script src="${asset}"${extra}></script>`
    ).join('') : '' : '';
};

const renderPage = (req, res, context, store) => {
  getBlogs().then((blogs) => {

    store.dispatch(loadBlogs(blogs.documents));
    const state = store.getState();

    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <Provider store={store}>
          <App/>
        </Provider>
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
<html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>A S[i/a]mple Blog</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${cssLinksFromAssets(assets, 'client')}
  </head>
  <body>
    <div id="root">${markup}</div>
    ${injectPreloadedState(state)}
    ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
  </body>
</html>`
      );
    }
  });
};

const app = express();
app.disable('x-powered-by');
app.use(session({
  secret: 'inviolable singularity',
  cookie: {}
}));
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR));

applyAuth(app);

// API calls
app.use(apiRouter);

app.get('/blog/:id', (req, res) => {
  const context = {};

  if (!req.params.id) {
    res.redirect('/');
  }

  // Create a dummy store and pre-populate it with Redux state data
  // so it can be sent to client as initial state
  const store = createStore(reducer);

  if (req.user) {
    store.dispatch(login(req.user.id, req.user.name));
  }

  getBlogs({id: req.params.id}).then(({blog}) => {
    store.dispatch(loadBlog(blog));

    // Server-side rendering happens here
    renderPage(req, res, context, store);
  });
});

app.get('/*', (req, res) => {
  const context = {};

  // Create a dummy store and pre-populate it with Redux state data
  // so it can be sent to client as initial state
  const store = createStore(reducer);

  if (req.user) {
    store.dispatch(login(req.user.id, req.user.name));
  }

  // Server-side rendering happens here
  renderPage(req, res, context, store);
});

export default app;
