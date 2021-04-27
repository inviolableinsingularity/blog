# A S[i/a]mple Blog App

This was created using Razzle, a simple framework for isometric javascript applications using Express and React.

This allows both the server and persistent model and the React frontend to operate out of the same webapp, though in
a more sophisticated application there would be a good reason to separate those concerns into separate repos or create
a mono-repo with separate modules for server and frontend, especially if server-side rendering is not necessary. 

To run this app, simply use:
```
npm install
npm run start 
```

Notes:

* This app uses neDB, a simple MongoDB-like datastore. In a production environment, a more robust DBMS or NoSQL
would obviously be more desirable.
* I had intended to include a WYSIWYG Markdown editor, but none of the ones I tried would work in an isometric
environment, and I did not have enough time to find one that would. Whoops. :(
* The user credentials are hardcoded to ``admin`` and ``password`` for demo purposes. Obviously, there should be
a proper datastore backing up the authentication system in a production-ready app.
