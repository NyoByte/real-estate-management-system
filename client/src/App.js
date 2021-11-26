import React, { Component } from "react";
import RealEstateManagementContract from "./contracts/RealEstateManagement.json";
import getWeb3 from "./getWeb3";
import { Route, Router} from "react-router-dom";
import history from './history';
import TopBar from './components/TopBar';
import LeftMenu from './components/LeftMenu';
import Home from './pages/Home';
import UsersComponent from './pages/Users';
import PropertiesComponent from './pages/Properties';
import BuySellComponent from './pages/BuySell';
import RentComponent from './pages/Rent';

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, drawerOpen: false, title: "Home" };

  componentDidMount = async () => {
    try {

      this.onLeftMenuClose = this.onLeftMenuClose.bind(this)

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RealEstateManagementContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RealEstateManagementContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      var component = this;
      this.setState({ web3, accounts, contract: instance });
      window.ethereum.on('accountsChanged', function () {
        web3.eth.getAccounts(function (error, accounts) {
          console.log(accounts[0], 'current account after account change');
          component.setState({ accounts: accounts });
        });
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onLeftMenuClose(name){
    this.setState({ drawerOpen: false })
    this.setState({title: name})
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Router history={history}>
        <TopBar title={this.state.title} onMenuClick={() => this.setState({ drawerOpen: true })} />
        <LeftMenu open={this.state.drawerOpen} onClose={this.onLeftMenuClose} />
        <Route exact path="/" component={Home} />
          <Route path="/users" render={() => <UsersComponent contract={this.state.contract} accounts={this.state.accounts} web3={this.state.web3}/>} />
          <Route path="/properties" render={() => <PropertiesComponent contract={this.state.contract} accounts={this.state.accounts} web3={this.state.web3}/>} />
          <Route path="/buy" render={() => <BuySellComponent contract={this.state.contract} accounts={this.state.accounts} web3={this.state.web3}/>} />
          <Route path="/rent" render={() => <RentComponent contract={this.state.contract} accounts={this.state.accounts} web3={this.state.web3}/>} />
      </Router>
    );
  }
}

export default App;
