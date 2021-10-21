import { Box } from "@mui/system";
import React from "react";

type TabPanelProps = {
    children: any,
    value: number,
    index: number,
    other?: any[]
}

export function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export class TabPanelComponent extends React.Component<TabPanelProps, {}>{

    render(){
        return (
            <div
                role="tabpanel"
                hidden={this.props.value !== this.props.index}
                id={`full-width-tabpanel-${this.props.index}`}
                aria-labelledby={`full-width-tab-${this.props.index}`}
                style={{ width: '100%' }}
                {...this.props.other}
            >
                {this.props.value === this.props.index && (
                    <Box sx={{ p: 3 }}>
                        {this.props.children}
                    </Box>
                )}
            </div>
        );
    }
}