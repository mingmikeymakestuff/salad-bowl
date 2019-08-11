import * as React from "react";
import { startRound } from "../../../socket";
import { ROUND_NUM } from 'types/types';

class StartRoundButton extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick() {
        startRound(this.props.currentRound)
    }

    public render() {
        if(this.props.currentRound !== ROUND_NUM.END) {
            return (
                <button type="button" className="btn btn-primary" onClick={this.handleClick}>Start {this.props.currentRoundWord}</button>
            );
        }
    }
}

export default StartRoundButton;