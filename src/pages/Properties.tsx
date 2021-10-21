import { Autocomplete, Box, Button, FormLabel, Grid, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material";
import React from "react";
import { styled } from '@mui/material/styles';
import { TabPanelComponent, a11yProps } from '../components/TabPanel'
import CommonInfoService from "../services/commonInfoService";
import AddIcon from '@mui/icons-material/Add';

const provinceList = CommonInfoService.getProvinces()

const districtList = CommonInfoService.getDistricts()

type PropertiesState = {
    tab: number,
    province: string,
    district: string,
    owners: string[]
}

const Input = styled('input')({
    display: 'none',
  });

class PropertiesComponent extends React.Component<{}, PropertiesState> {

    state: PropertiesState = {
        tab: 0,
        province: "",
        district: "",
        owners: [""]
    }

    constructor(props: any) {
        super(props)
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
                </TabPanelComponent>
                <TabPanelComponent value={this.state.tab} index={1}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={3}>
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
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                disablePortal
                                options={districtList}
                                fullWidth
                                onInputChange={(event, newInputValue) => {
                                    this.setState({ district: newInputValue });
                                }}
                                renderInput={(params) => <TextField {...params} label="District" variant="standard" />}
                            />
                        </ Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Address" variant="standard" fullWidth />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <TextField label="Area" variant="standard" fullWidth />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={6}>
                            <FormLabel> Owners</FormLabel>
                            <IconButton aria-label="delete" onClick={() => {
                                let ownersList = this.state.owners
                                ownersList.push("")
                                this.setState({ owners: ownersList })
                            }}>
                                <AddIcon />
                            </IconButton>

                        </Grid>
                        <Grid item xs={12} />
                        {
                            this.state.owners.map((owner) => {
                                return (
                                    <>
                                        <Grid item xs={12} sm={3}>
                                            <TextField label="Owner" variant="standard" fullWidth />
                                        </Grid><Grid item xs={12} sm={3}>
                                            <TextField label="Percent own" variant="standard" fullWidth />
                                        </Grid>
                                        <Grid item xs={12} />
                                    </>
                                )
                            })
                        }
                        <Grid item xs={12} sm={3} justifyContent="right">
                        <FormLabel> Upload file</FormLabel>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" multiple type="file" />
                                <Button variant="contained" component="span">
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} sm={2} justifyContent="center">
                            <Button variant="contained" fullWidth>Save</Button>
                        </Grid>
                    </ Grid>
                </TabPanelComponent>
            </Grid>
        )
    }
}

export default PropertiesComponent;