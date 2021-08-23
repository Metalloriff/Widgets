import { remote } from "electron";
import Component from "./component";

// Since this widget is constantly draggable, save when moved
remote.getCurrentWindow().on("moved", () => lockWidget());

// Export the widget
module.exports = new class WeatherWidget extends Widget {
    render() {
        return <Component widget={this}/>;
    }
}