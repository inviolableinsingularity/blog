import React, {useState} from 'react';

// This can be improved to perform the login via async call instead of a hard POST
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <form method="post" action="/login">
        <div>
          Username:
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          Password:
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <input type="submit" value="Log In" />
        </div>
      </form>
    </div>
  );
};

export default Login;
