import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type TopBarProps = {
    onMenuClick: React.MouseEventHandler<HTMLButtonElement>
    title: string
}

class TopBarComponent extends React.Component<TopBarProps, {}> {
    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            onClick={this.props.onMenuClick}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {this.props.title}
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}

export default TopBarComponent;