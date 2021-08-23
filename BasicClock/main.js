// Import and inject the style sheet
require("./styles.scss");

// The clock widget component
function ClockWidget({ color }) {
    // Create a time state
    const [time, setTime] = React.useState(new Date().toLocaleTimeString());
    // And a mounted ref, so we don't update the component while it's not mounted
    // Which doesn't really matter anyways, considering it's a single component
    const isMounted = React.createRef(false);

    // On mount
    React.useEffect(() => {
        // Set the mounted state to true
        isMounted.current = true;

        // Create the update interval, updating the time very second
        const interval = setInterval(() =>
            isMounted.current && setTime(new Date().toLocaleTimeString()), 1000);

        // On unmount
        return () => {
            // Set the mounted state to false
            isMounted.current = false;

            // Clear the interval
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="ClockWidget" style={{ color }}>
            { time }
        </div>
    );
}

module.exports = new class BasicClock extends Widget {
    render() {
        return <ClockWidget color={this.config.get("color", "white")}/>;
    }
}