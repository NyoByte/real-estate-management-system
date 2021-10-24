import { Box, Button, Grid, Tab, Tabs, TextField } from "@mui/material";
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
        propertyHash?: string,
        securityDeposit?: number,
    },
    payRent?: {
        propertyHash?: string,
        value?: number,
    },
}

class RentComponent extends React.Component<{}, RentState> {

    state: RentState = {
        tab: 0,
        newRent: {
            propertyHash: "",
            rentedTo: "",
            securityDeposit: 0,
            rentValue: 0,
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
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.newRent)} >Save</Button>
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
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.agreeRentHash)} >Save</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={2}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="rentSecDepositHash" fullWidth
                                onChange={(event) => this.setState({ paySecDeposit: {...this.state.paySecDeposit, propertyHash: event.target.value}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount" variant="standard" id="secDepositAmount" fullWidth
                                onChange={(event) => this.setState({ paySecDeposit: {...this.state.paySecDeposit, securityDeposit: parseFloat(event.target.value)}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.paySecDeposit)} >Save</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={3}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rent hash" variant="standard" id="payRentPropertyhash" fullWidth
                                onChange={(event) => this.setState({ payRent: {...this.state.payRent, propertyHash: event.target.value}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount" variant="standard" id="payRentAmount" fullWidth
                                onChange={(event) => this.setState({ payRent: {...this.state.payRent, value: parseFloat(event.target.value)}} )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.payRent)} >Save</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default RentComponent;