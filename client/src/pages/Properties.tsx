import { Autocomplete, Box, Button, Checkbox, FormLabel, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import React from "react";
import { TabPanelComponent, a11yProps } from '../components/TabPanel'
import CommonInfoService from "../services/commonInfoService";
import AddIcon from '@mui/icons-material/Add';
import IpfsService from "../services/ipfService";

const provinceList = CommonInfoService.getProvinces()

const districtList = CommonInfoService.getDistricts()

type PropertiesState = {
    tab: number,
    newProperty: {
        province: string,
        district: string,
        address: string,
        area: number,
        owners: string[],
        ownersPercents: number[],
        extraInfo: string,
        ipfsHash: string
    },
    selectedProperty: {
        hash: string,
        province: string,
        district: string,
        address: string,
        area: number,
        owners: string[],
        ownersPercents: number[],
        extraInfo: string,
    },
    propertyList: any[]
}

type PropertiesProps = {
    contract?: any,
    accounts?: any,
    web3?: any,
}

const ipfsService = new IpfsService()

class PropertiesComponent extends React.Component<PropertiesProps, PropertiesState> {

    state: PropertiesState = {
        tab: 0,
        newProperty: {
            province: "",
            district: "",
            owners: [""],
            ownersPercents: [0],
            address: "",
            area: 0,
            extraInfo: "",
            ipfsHash: ''
        },
        selectedProperty: {
            hash: "",
            province: "",
            district: "",
            owners: [""],
            ownersPercents: [0],
            address: "",
            area: 0,
            extraInfo: "",
        },
        propertyList: [],
    }

    constructor(props: any) {
        super(props)
        this.getPropertyInfo = this.getPropertyInfo.bind(this)
        this.createNewProperty = this.createNewProperty.bind(this)
        this.getProperties()
    }

    getProperties() {
        this.props.contract.methods.getPropertyArray().call().then((res: any) => {
            console.log(res)
            this.setState({
                propertyList: res
            })
        })
    }

    createNewProperty(){
        ipfsService.addToIpfs(JSON.stringify(this.state.newProperty.extraInfo), (resp: any) => {
            console.log(resp)
            this.setState({ newProperty: { ...this.state.newProperty, ipfsHash: resp.path } })
            this.props.contract.methods.createnNewProperty(this.state.newProperty.province, this.state.newProperty.district, 
                this.state.newProperty.address, this.state.newProperty.area, 
                this.state.newProperty.owners, this.state.newProperty.ownersPercents, 
                this.state.newProperty.ipfsHash).send({ from: this.props.accounts[0] }).then((response: any) => {
                    console.log(response)
                    this.getProperties()
                })
        })
    }

    getPropertyInfo(){
        this.props.contract.methods.getPropertyByHash(this.state.selectedProperty.hash).call().then((res: any) => {
            this.setState({
                selectedProperty: {
                    ...this.state.selectedProperty,
                    province: this.props.web3.utils.hexToUtf8(res.province),
                    district: this.props.web3.utils.hexToUtf8(res.district),
                    address: this.props.web3.utils.hexToUtf8(res.addres),
                    area: res.area,
                    owners: res.owners,
                    ownersPercents: res.percentOwn,
                    extraInfo: this.props.web3.utils.hexToUtf8(res.ipfsHash),
                }})
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
                        aria-label="Property management tabs">
                        <Tab label="Properties List"  {...a11yProps(0)} />
                        <Tab label="New property" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanelComponent value={this.state.tab} index={0}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}  >
                                {this.state.propertyList.map((address) => {
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
                                                        onChange={(event) => this.setState({ selectedProperty: { ...this.state.selectedProperty, hash: address } })}
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
                                <Button variant="contained" onClick={this.getPropertyInfo} >Get info</Button>
                            </Grid>
                            <Typography variant="h6" gutterBottom component="div">
                                Province: {this.state.selectedProperty.province}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                District: {this.state.selectedProperty.district}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Area: {this.state.selectedProperty.area}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Address: {this.state.selectedProperty.address}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Owners
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Owner</TableCell>
                                            <TableCell >Percent own</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.selectedProperty.owners.map((owner, index) => (
                                            <TableRow
                                                key={owner}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {owner}
                                                </TableCell>
                                                <TableCell>{this.state.selectedProperty.ownersPercents[index]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="h6" gutterBottom component="div">
                                Extra info:
                            </Typography>
                            {this.state.selectedProperty.extraInfo &&<Link href={'https:ipfs.io/ipfs/' + this.state.selectedProperty.extraInfo}>GO TO IPFS </Link>}
                        </Grid>
                    </Grid>
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={1}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                disablePortal
                                options={provinceList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({ newProperty: { ...this.state.newProperty, province: newInputValue } });
                                }}
                                renderInput={(params) => <TextField {...params} label="Province" variant="standard" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                disablePortal
                                options={districtList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({ newProperty: { ...this.state.newProperty, district: newInputValue } });
                                }}
                                renderInput={(params) => <TextField {...params} label="District" variant="standard" />}
                            />
                        </ Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Address" variant="standard" id="address" fullWidth
                                onChange={(event) => this.setState({ newProperty: { ...this.state.newProperty, address: event.target.value } })} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Area" variant="standard" fullWidth
                                onChange={(ev) => this.setState({ newProperty: { ...this.state.newProperty, area: parseFloat(ev.target.value) } })} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <FormLabel> Owners</FormLabel>
                            <IconButton aria-label="delete" onClick={() => {
                                let ownersList = this.state.newProperty.owners
                                ownersList.push("")
                                this.setState({ newProperty: { ...this.state.newProperty, owners: ownersList } })
                            }}>
                                <AddIcon />
                            </IconButton>

                        </Grid>
                        <Grid item xs={12} />
                        {
                            this.state.newProperty.owners.map((owner, index) => {
                                return (
                                    <>
                                        <Grid item xs={12} sm={3}>
                                            <TextField label="Owner" variant="standard" fullWidth
                                                onChange={ev => {
                                                    let ownersList = this.state.newProperty.owners
                                                    ownersList[index] = ev.target.value
                                                    this.setState({ newProperty: { ...this.state.newProperty, owners: ownersList } })
                                                }} />
                                        </Grid><Grid item xs={12} sm={3}>
                                            <TextField label="Percent own" variant="standard" fullWidth
                                                onChange={ev => {
                                                    let ownersPercentsList = this.state.newProperty.ownersPercents
                                                    ownersPercentsList[index] = parseFloat(ev.target.value)
                                                    this.setState({ newProperty: { ...this.state.newProperty, ownersPercents: ownersPercentsList } })
                                                }} />
                                        </Grid>
                                        <Grid item xs={12} />
                                    </>
                                )
                            })
                        }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Extra info"
                                fullWidth
                                multiline
                                maxRows={4}
                                value={this.state.newProperty.extraInfo}
                                onChange={ev => this.setState({ newProperty: { ...this.state.newProperty, extraInfo: ev.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6} md={3} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={ev => this.createNewProperty()} >Save</Button>
                        </Grid>
                    </ Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default PropertiesComponent;