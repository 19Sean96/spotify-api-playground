import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import AuthenticateModal from './components/AuthenticateModal'
import './App.scss';


function App() {
  const [loggingIn, handleLogin] = useState(false)
  useEffect(() => {
    loggingIn && console.log('a login event was triggered')
  }, [loggingIn])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        This is an example of the Authorization Code flow
        </p>
        <a href="#" className="App-link" onClick={e => handleLogin(true)}>Log in with Spotify</a>
        {
          !loggingIn && (
            <p>you are now logged in</p>
          )
        }

      </header>
    </div>
  );
}

export default App;
