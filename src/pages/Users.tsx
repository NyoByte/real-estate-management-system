import { Autocomplete, Box, Button, Checkbox, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab,Tabs, TextField, Typography } from "@mui/material";
import React from "react";
import IpfsService from "../services/ipfService";
import { TabPanelComponent, a11yProps } from '../components/TabPanel'
import CommonInfoService from '../services/commonInfoService'
const provinceList = CommonInfoService.getProvinces()

const districtList = CommonInfoService.getDistricts()

const usersAddressList = ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb3", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb4",
"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb5", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb6"]

type UsersState = {
    tab: number,
    newUser: {
        firstName: string,
        lastName: string,
        province: string,
        district: string,
        walletAddress: string,
        ipfsHash: string
    },
    userSelectedInfo:{
        dni: string,
        firstName: string,
        lastName: string,
        province: string,
        district: string,
        walletAddress: string,
    }
}


const ipfsService = new IpfsService()

class UsersComponent extends React.Component<{}, UsersState> {

    state: UsersState = {
        tab: 0,
        newUser: {
            firstName: "",
            lastName: "",
            province: "",
            district: "",
            walletAddress: "",
            ipfsHash: ""
        },
        userSelectedInfo: {
            dni: "",
            firstName: "",
            lastName: "",
            province: "",
            district: "",
            walletAddress: "",
        }
    }

    constructor(props: any) {
        super(props)

        this.handleTextInputChange = this.handleTextInputChange.bind(this)
        this.getUserInfo = this.getUserInfo.bind(this)
    }

    handleTextInputChange(event: any) {
        let newState: any = {}
        newState[event.target.id] = event.target.value
        this.setState(newState)
    }

    getUserInfo(){
        this.setState({
            userSelectedInfo: {
                ...this.state.userSelectedInfo,
                dni: "12345678",
                firstName: "John",
                lastName: "Doe",
                province: "Lima",
                district: "La Molina",
            }
        })
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
                <TabPanelComponent value={this.state.tab} index={0}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}  >
                                {usersAddressList.map((address) => {
                                    const labelId = `checkbox-list-label-${address}`;

                                    return (
                                        <ListItem
                                            key={address}
                                            disablePadding
                                        >
                                            <ListItemButton role={undefined} 
                                            //onClick={handleToggle(value)} 
                                            dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        //checked={checked.indexOf(value) !== -1}
                                                        tabIndex={-1}
                                                        //disableRipple
                                                        onChange={(event) => this.setState({ userSelectedInfo: {...this.state.userSelectedInfo, walletAddress: address} })}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={address} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Grid marginBottom={2}>
                                <Button variant="contained" onClick={this.getUserInfo} >Get info</Button>
                            </Grid>
                            <Typography variant="h6" gutterBottom component="div">
                                DNI: {this.state.userSelectedInfo.dni}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                First name: {this.state.userSelectedInfo.firstName}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Last name: {this.state.userSelectedInfo.lastName}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Province: {this.state.userSelectedInfo.province}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                District: {this.state.userSelectedInfo.district}
                            </Typography>
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={1}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={3}>
                            <TextField label="First name" id={"firstName"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField label="Last name" id={"lastName"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                disablePortal
                                options={provinceList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({ newUser: { ...this.state.newUser, province: newInputValue } })
                                }}
                                renderInput={(params) => <TextField {...params} label="Province" variant="standard" />}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                disablePortal
                                options={districtList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({ newUser: { ...this.state.newUser, district: newInputValue } })
                                }}
                                renderInput={(params) => <TextField {...params} label="District" variant="standard" />}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Wallet addres" id={"walletAddress"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={10} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={() => {
                                ipfsService.addToIpfs(JSON.stringify(this.state), (resp: any) => this.setState({ newUser: { ...this.state.newUser, ipfsHash: resp } }))
                            }}>Save</Button>
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={8} sm={4} justifyContent="center">
                            <TextField id="outlined-basic" label="IPFS HASH" variant="outlined" fullWidth disabled value={this.state.newUser.ipfsHash} />
                        </Grid>
                        <Grid item xs={4} sm={2} justifyContent="center">
                            {/* Agregar visible despues de darle click a SAVE */}
                            <Link href={'https:ipfs.io/ipfs/' + this.state.newUser.ipfsHash}>GO TO IPFS </Link>
                        </Grid>

                    </Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default UsersComponent;