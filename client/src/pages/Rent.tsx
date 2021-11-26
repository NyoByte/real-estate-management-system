import { Box, Button, Grid, Snackbar, Tab, Tabs, TextField } from "@mui/material";
import React from "react";
import { TabPanelComponent, a11yProps } from "../components/TabPanel";

type RentState = {
    tab: number
    newRent: {
        propertyHash: string,
        rentedTo: string,
        securityDeposit: number,
        rentValue: number,
    },
    agreeRentHash?: string,
    paySecDeposit?: {
        rentHash?: string,
        securityDeposit?: number,
    },
    payRent?: {
        rentHash?: string,
        value?: number,
    },
    terminateRent?: {
        rentHash?: string,
        value?: number,
    },
    snackbarOpen: boolean,
    snackbarMessage: string,
}

type RentProps = {
    contract?: any,
    accounts?: any,
    web3?: any,
}

class RentComponent extends React.Component<RentProps, RentState> {

    state: RentState = {
        tab: 0,
        newRent: {
            propertyHash: "",
            rentedTo: "",
            securityDeposit: 0,
            rentValue: 0,
        },
        snackbarOpen: false,
        snackbarMessage: "",
    }

    constructor(props: any){
        super(props);
        this.createRent = this.createRent.bind(this);
        this.agreeRent = this.agreeRent.bind(this);
        this.paySecDeposit = this.paySecDeposit.bind(this);
        this.payRent = this.payRent.bind(this);
        this.terminateRent = this.terminateRent.bind(this);
    }

    createRent(){
        this.props.contract.methods.createRent(this.state.newRent.propertyHash, this.state.newRent.rentedTo, this.state.newRent.securityDeposit, this.state.newRent.rentValue).send({ from: this.props.accounts[0] }).then((response: any) => {
            this.setState({ snackbarOpen: true, snackbarMessage: `Rent  ${ response.events.creationOfRent.returnValues.id } created with hash ${ response.events.creationOfRent.returnValues.rentHash }` });
            console.log(response);
        }, (error: any) => {
            console.log(error);
        })
    }

    agreeRent(){
        this.props.contract.methods.agreeRent(this.state.agreeRentHash).send({ from: this.props.accounts[0] }).then((response: any) => {
            console.log(response);
        }, (error: any) => {
            console.log(error);
        })
    }

    paySecDeposit(){
        if(this.state.paySecDeposit && this.state.paySecDeposit.securityDeposit){
            this.props.contract.methods.paySecurityDeposit(this.state.paySecDeposit.rentHash).send({ from: this.props.accounts[0], value: this.props.web3.utils.toWei(this.state.paySecDeposit.securityDeposit.toString()) }).then((response: any) => {
                console.log(response);
            }, (error: any) => {
                console.log(error);
            })
        }else{
            this.setState({ snackbarOpen: true, snackbarMessage: "No rent hash or amount provided" });
        }
    }

    payRent(){
        if(this.state.payRent && this.state.payRent.value){
            this.props.contract.methods.payRent(this.state.payRent.rentHash).send({ from: this.props.accounts[0], value: this.props.web3.utils.toWei(this.state.payRent.value.toString()) }).then((response: any) => {
                console.log(response);
            }, (error: any) => {
                console.log(error);
            })
        }else{
            this.setState({ snackbarOpen: true, snackbarMessage: "No rent hash or amount provided" });
        }
    }

    terminateRent(){
        if(this.state.terminateRent && this.state.terminateRent.value){
            this.props.contract.methods.terminateRent(this.state.terminateRent.rentHash).send({ from: this.props.accounts[0], value: this.props.web3.utils.toWei(this.state.terminateRent.value.toString()) }).then((response: any) => {
                console.log(response);
            }, (error: any) => {
                console.log(error);
            })
        }else{
            this.setState({ snackbarOpen: true, snackbarMessage: "No rent hash or amount provided" });
        }
    }

    render() {
        return (
            <Grid container>
                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={this.state.tab}
                        onChange={(ev, newValue) => this.setState({ tab: newValue })}
                        centered
                        aria-label="Buy/Sell Platform Tabs">
                        <Tab label="Create rent"  {...a11yProps(0)} />
                        <Tab label="Agree rent" {...a11yProps(1)} />
                        <Tab label="Pay security deposit" {...a11yProps(2)} />
                        <Tab label="Pay rent" {...a11yProps(3)} />
                        <Tab label="Terminate rent" {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <TabPanelComponent value={this.state.tab} index={0}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Property hash" variant="standard" id="propertyHash" fullWidth
                                onChange={(event) => this.setState({ newRent: {...this.state.newRent, propertyHash: event.target.value} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rented to" variant="standard" id="rentedTO" fullWidth
                                onChange={(event) => this.setState({ newRent: {...this.state.newRent, rentedTo: event.target.value} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Security deposit amount" variant="standard" id="securityDeposit" fullWidth
                                onChange={(event) => this.setState({ newRent: {...this.state.newRent, securityDeposit: parseFloat(event.target.value)} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent value" variant="standard" id="sellPercentage" fullWidth
                                onChange={(event) => this.setState({ newRent: {...this.state.newRent, rentValue: parseInt(event.target.value)} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.createRent()} >Create</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={1}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="rentAgreeHash" fullWidth
                                onChange={(event) => this.setState({ agreeRentHash: event.target.value} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.agreeRent()} >Agree</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={2}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="rentSecDepositHash" fullWidth
                                onChange={(event) => this.setState({ paySecDeposit: {...this.state.paySecDeposit, rentHash: event.target.value}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount" variant="standard" id="secDepositAmount" fullWidth
                                onChange={(event) => this.setState({ paySecDeposit: {...this.state.paySecDeposit, securityDeposit: parseFloat(event.target.value)}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.paySecDeposit()} >Pay</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={3}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="payRentPropertyhash" fullWidth
                                onChange={(event) => this.setState({ payRent: {...this.state.payRent, rentHash: event.target.value}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount" variant="standard" id="payRentAmount" fullWidth
                                onChange={(event) => this.setState({ payRent: {...this.state.payRent, value: parseFloat(event.target.value)}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.payRent()} >Pay</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={4}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="terminateRentRentHash" fullWidth
                                onChange={(event) => this.setState({ terminateRent: {...this.state.terminateRent, rentHash: event.target.value}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Return value" variant="standard" id="terminateRentReturnValue" fullWidth
                                onChange={(event) => this.setState({ terminateRent: {...this.state.terminateRent, value: parseFloat(event.target.value)}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.terminateRent()} >Terminate</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={this.state.snackbarOpen}
                    onClose={() => this.setState({snackbarOpen: false})}
                    message={this.state.snackbarMessage}
                />
            </Grid>
        )
    }
}

export default RentComponent;