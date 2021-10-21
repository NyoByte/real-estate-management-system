import { Autocomplete, Box, Button, Grid, Link, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import React from "react";
import IpfsService from "../services/ipfService";
import { TabPanelComponent, a11yProps } from '../components/TabPanel'
import { height } from "@mui/system";
import CommonInfoService from '../services/commonInfoService'

const provinceList = CommonInfoService.getProvinces()

const districtList = CommonInfoService.getDistricts()

const tableColumns = ["ID", "Wallet", "DNI", "First name", "Last name", "Province", "District"]

const tableRows = [
    { id: 1, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", dni: "12345678", firstName: "User1", lastName: "User1", province: "Lima", district: "La Molina" },
    { id: 2, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", dni: "12345678", firstName: "User2", lastName: "User2", province: "Lima", district: "La Molina" },
    { id: 3, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", dni: "12345678", firstName: "User3", lastName: "User3", province: "Lima", district: "La Molina" },
    { id: 4, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", dni: "12345678", firstName: "User4", lastName: "User4", province: "Lima", district: "La Molina" },
    { id: 5, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", dni: "12345678", firstName: "User5", lastName: "User5", province: "Lima", district: "La Molina" },
]

type UsersState = {
    tab: number,
    firstName: string,
    lastName: string,
    province: string,
    district: string,
    walletAddress: string,
    ipfsHash: string
}


const ipfsService = new IpfsService()

class UsersComponent extends React.Component<{}, UsersState> {

    state: UsersState = {
        tab: 0,
        firstName: "",
        lastName: "",
        province: "",
        district: "",
        walletAddress: "",
        ipfsHash: ""
    }

    constructor(props: any) {
        super(props)

        this.handleTextInputChange = this.handleTextInputChange.bind(this)
    }

    handleTextInputChange(event: any) {
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
                <TabPanelComponent value={this.state.tab} index={0}>
                    <Grid minHeight={400}>
                        <TableContainer component={Paper} style={{ height: 400 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ height: 400 }}>
                                <TableHead>
                                    <TableRow>
                                        {
                                            tableColumns.map((column, index) => (
                                                <TableCell align={index == 0 ? "left" : "right"} style={{fontWeight: "bold"}}>{column}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row) => (
                                        <TableRow
                                            key={row.wallet}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="right">{row.wallet}</TableCell>
                                            <TableCell align="right">{row.dni}</TableCell>
                                            <TableCell align="right">{row.firstName}</TableCell>
                                            <TableCell align="right">{row.lastName}</TableCell>
                                            <TableCell align="right">{row.province}</TableCell>
                                            <TableCell align="right">{row.district}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                                    this.setState({ province: newInputValue });
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
                                    this.setState({ district: newInputValue });
                                }}
                                renderInput={(params) => <TextField {...params} label="District" variant="standard" />}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Wallet addres" id={"walletAddress"} variant="standard" fullWidth onChange={this.handleTextInputChange} />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth onClick={() => {
                                ipfsService.addToIpfs(JSON.stringify(this.state), (resp: any) => this.setState({ ipfsHash: resp.path }))
                            }}>Save</Button>
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={8} sm={4} justifyContent="center">
                            <TextField id="outlined-basic" label="IPFS HASH" variant="outlined" fullWidth disabled value={this.state.ipfsHash} />
                        </Grid>
                        <Grid item xs={4} sm={2} justifyContent="center">
                            {/* Agregar visible despues de darle click a SAVE */}
                            <Link href={'https:ipfs.io/ipfs/' + this.state.ipfsHash}>GO TO IPFS </Link>
                        </Grid>

                    </Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default UsersComponent;