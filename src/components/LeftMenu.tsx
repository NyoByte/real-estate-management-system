import React from "react";
import history from '../history'
import Box from '@mui/material/Box';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HouseIcon from '@mui/icons-material/House';
import RepeatIcon from '@mui/icons-material/Repeat';


type LeftMenuProps = {
    open: boolean
    onClose: Function,
}

type LeftMenuState = {
    open: boolean
}

const optionsList = [
    {
        name: "Home",
        icon: <HomeIcon />,
        onClick: () => history.push('/')
    },
    {
        name: "Users",
        icon: <PersonIcon />,
        onClick: () => history.push('/users')
    },
    {
        name: "Properties",
        icon: <HouseIcon />,
        onClick: () => history.push('/properties')
    },
    {
        name: "Buy/Sell",
        icon: <RepeatIcon />,
        onClick: () => history.push('/buy')
    },
    {
        name: "Rent",
        icon: <RepeatIcon />,
        onClick: () => history.push('/rent')
    }
]

class LeftMenuComponent extends React.Component<LeftMenuProps, LeftMenuState> {

    state: LeftMenuState = {
        open: this.props.open
    }

    constructor(props: any){
        super(props)
        this.setState({open: this.props.open})
    }

    list = (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onKeyDown={() => this.setState({open: false})}
        >
          <List>
            {optionsList.map((option) => (
              <ListItem button key={option.name}
              onClick={() => {
                  option.onClick()
                  if(this.props.onClose) this.props.onClose(option.name)
                }}
              >
                <ListItemIcon>
                    {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      );

    render() {
        return (
            <Drawer
                anchor="left"
                open={this.props.open}
                onClose={() => this.props.onClose()}
            >
                {this.list}
            </Drawer>
        )
    }
}

export default LeftMenuComponent;