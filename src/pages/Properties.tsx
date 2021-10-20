import React from "react";
import history from '../history';

class PropertiesComponent extends React.Component {

    constructor(props: any){
        super(props)
        console.log(history)
    }

    render() {
        return (
            <div>
                <h1>Properties</h1>
            </div>
        )
    }
}

export default PropertiesComponent;