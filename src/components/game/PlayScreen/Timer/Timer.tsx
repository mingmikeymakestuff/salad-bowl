import * as React from "react";

class Timer extends React.Component<any, any> {
    public render() {
        return (
            <h4 className="ScreenSpacing">{this.props.timer} Second(s) Remaining</h4>
        );
    }
}

export default Timer;