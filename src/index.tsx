import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import Store from './Stores';
import { Provider} from 'mobx-react';
import { configure } from 'mobx';

configure({
    enforceActions: 'observed'
})

ReactDOM.render(
    <Provider {...Store}>
        <App />
    </Provider>,
document.getElementById('root'));

