import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserReview } from './review/userReview';
import { ReviewsStorage } from './review/ReviewsStorage';

import "./i18n";

export const Context = createContext(null)

ReactDOM.render(
    
  <Context.Provider value={{
    user: new UserReview(),
    review: new ReviewsStorage(),
  }}>
    <App/>
  </Context.Provider>,
  document.getElementById('root')
);
