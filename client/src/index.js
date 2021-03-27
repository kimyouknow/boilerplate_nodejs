import ReactDOM from "react-dom";

import App from "./App";
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import {applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from "./_reducers";

const rootElement = document.getElementById("root");
const createStoreWithMiddileware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
ReactDOM.render(
  <Provider
    store={createStoreWithMiddileware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && 
      window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
  </Provider>,
  rootElement
);
