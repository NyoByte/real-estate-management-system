import React from 'react';
import { Route, Router, Switch } from "react-router-dom";
import history from './history';
import './App.css';
import TopBar from './components/TopBar';
import LeftMenu from './components/LeftMenu';
import Home from './pages/Home';
import UsersComponent from './pages/Users';
import PropertiesComponent from './pages/Properties';
import BuySellComponent from './pages/BuySell';
import RentComponent from './pages/Rent';

type AppState = {
  drawerOpen: boolean
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    drawerOpen: false
  }
  render() {
    return (
      <Router history={history}>
        <TopBar onMenuClick={() => this.setState({ drawerOpen: true })} />
        <LeftMenu open={this.state.drawerOpen} onClose={() => this.setState({ drawerOpen: false })} />
        <Route exact path="/" component={Home} />
          <Route path="/users" component={UsersComponent} />
          <Route path="/properties" component={PropertiesComponent} />
          <Route path="/buy" component={BuySellComponent} />
          <Route path="/rent" component={RentComponent} />
      </Router>
    );
  }
}

export default App;
