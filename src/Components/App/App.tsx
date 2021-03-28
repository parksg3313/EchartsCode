import React from "react"
import dotenv from "dotenv";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SnackBar from '../../Components/SnackBar';
import TestChart from '../../Routes/TestChart';
import '../../Styles/common.scss';
dotenv.config();

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div id="echart-content" className="App">
                <Router>
                    <Switch>
                        <Route path="/" component={TestChart} />
                    </Switch>
                    <SnackBar />
                </Router>
            </div>
        );
    }
}

export default App;
