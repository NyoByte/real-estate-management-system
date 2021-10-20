import { Autocomplete, Box, Button, Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import { width } from "@mui/system";
import React from "react";


function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            style={{ width: '100%' }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const provinceList = [
    {
        label: "Lima"
    },
    {
        label: "Arequipa"
    }
]

const districtList = [
    {
        label: "Surco"
    },
    {
        label: "Ate"
    },
    {
        label: "La Molina"
    },
    {
        label: "Miraflores"
    }
]

type UsersState = {
    tab: number,
    firstName: string,
    lastName: string,
    province: string,
    district: string,
    walletAddress: string
}


class UsersComponent extends React.Component<{}, UsersState> {

    state: UsersState = {
        tab: 0,
        firstName: "",
        lastName: "",
        province: "",
        district: "",
        walletAddress: ""
    }

    constructor(props: any){
        super(props)

        this.handleTextInputChange = this.handleTextInputChange.bind(this)
    }

    handleTextInputChange(event: any){
        let newState: any = {}
        newState[event.target.id] = event.target.value
        this.setState(newState)
    }

    render() {
        return (
            <Grid container>
                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={this.state.tab}
                        onChange={(ev, newValue) => this.setState({ tab: newValue })}
                        centered
                        aria-label="User management tabs">
                        <Tab label="User List"  {...a11yProps(0)} />
                        <Tab label="New user" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={this.state.tab} index={0}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={3}>
                            <TextField label="First name" id={"firstName"} variant="standard" fullWidth onChange={this.handleTextInputChange}/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField label="Last name"  id={"lastName"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                disablePortal
                                options={provinceList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({province: newInputValue});
                                  }}
                                renderInput={(params) => <TextField {...params} label="Province" variant="standard"/>}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                    disablePortal
                                    options={districtList}
                                    fullWidth
                                    onInputChange={(event, newInputValue) => {
                                        this.setState({district: newInputValue});
                                      }}
                                    renderInput={(params) => <TextField {...params} label="District" variant="standard"/>}
                                />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Wallet addres"  id={"walletAddress"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={() => console.log(this.state)}>Save</Button>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={this.state.tab} index={1}>
                    <h1>New user</h1>
                </TabPanel>
            </Grid>
        )
    }
}

export default UsersComponent;