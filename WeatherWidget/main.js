const electronWindow = require("electron").remote.getCurrentWindow();
const weatherManager = require("./weatherManager");
const WeatherWidgetComponent = require("./component");

// Since this widget is constantly draggable, save when moved
electronWindow.on("moved", () => lockWidget());

// Export the widget
module.exports = new class WeatherWidget extends Widget {
    render() {
        return <WeatherWidgetComponent widget={this}/>;
    }
}