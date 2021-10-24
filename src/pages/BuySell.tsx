import { Box, Button, Grid, Tab, Tabs, TextField } from "@mui/material";
import React from "react";
import { a11yProps, TabPanelComponent } from "../components/TabPanel";

type BuySellState = {
    tab: number,
    newSell: {
        propertyHash: string,
        price: number,
        sellTo: string,
        sellPercentage: number,
    }
    paySellData: {
        sellHash: string,
        payAmount: number
    }
}

class BuySellComponent extends React.Component<{}, BuySellState> {

    state: BuySellState = {
        tab: 0,
        newSell: {
            propertyHash: "",
            price: 0,
            sellTo: "",
            sellPercentage: 0,
        },
        paySellData: {
            sellHash: "",
            payAmount: 0
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
                        <Tab label="Create sell"  {...a11yProps(0)} />
                        <Tab label="Pay sell" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanelComponent value={this.state.tab} index={0}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Property hash" variant="standard" id="propertyHash" fullWidth
                                onChange={(event) => this.setState({ newSell: {...this.state.newSell, propertyHash: event.target.value} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Price" variant="standard" id="sellPrice" fullWidth
                                onChange={(event) => this.setState({ newSell: {...this.state.newSell, price: parseFloat(event.target.value)} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Sell to" variant="standard" id="sellTo" fullWidth
                                onChange={(event) => this.setState({ newSell: {...this.state.newSell, sellTo: event.target.value} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Sell percentage" variant="standard" id="sellPercentage" fullWidth
                                onChange={(event) => this.setState({ newSell: {...this.state.newSell, sellPercentage: parseInt(event.target.value)} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.newSell)} >Save</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={1}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Sell hash" variant="standard" id="sellHash" fullWidth
                                onChange={(event) => this.setState({ paySellData: {...this.state.paySellData, sellHash: event.target.value} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount to pay" variant="standard" id="payAmount" fullWidth
                                onChange={(event) => this.setState({ paySellData: {...this.state.paySellData, payAmount: parseFloat(event.target.value)} } )} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => console.log(this.state.paySellData)} >Save</Button>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default BuySellComponent;