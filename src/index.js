import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserReview } from './review/userReview';

export const Context = createContext(null)

ReactDOM.render(
  <Context.Provider value={{
    user: new UserReview()
  }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);
