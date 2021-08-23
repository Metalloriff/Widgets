const weatherManager = require("./weatherManager");
require("./styles.scss");

const Tooltip = require("./Tooltip").default;

function DetailedWeatherTooltip({ weather, direction = "up" }) {
    return (
        <Tooltip direction={direction}>
            <div><span>Wind Speed</span> - {weather.wind_mph ?? weather.maxwind_mph}mph/{weather.wind_kph ?? weather.maxwind_kph}kph</div>
            <div><span>Humidity</span> - {weather.humidity ?? weather.avghumidity}%</div>
            <div><span>UV Index</span> - {weather.uv}</div>
            <div><span>Visibility</span> - {weather.vis_miles ?? weather.avgvis_miles}mi/{weather.vis_km ?? weather.avgvis_km}km</div>
        </Tooltip>
    );
}

module.exports = function WeatherWidgetComponent({ widget }) {
    // Create some states
    const [weather, updateWeather] = React.useState(null);
    const [lastUpdated, setLastUpdated] = React.useState(null);
    
    // On mount
    React.useEffect(() => {
        // Create the update callback
        const update = () => weatherManager.get().then(updateWeather);
        
        // Update on start
        update();
        // Create an update interval every 10 minutes (if not config overwritten)
        const updateInterval = setInterval(update, widget.config.get("interval", 10 * 60 * 1000));
        // On unmount, remove the interval
        return () => clearInterval(updateInterval);
    }, []);
    
    return weather ? (
        <div className="WeatherWidget">
            <div className="Header">
                <div>
                    <img className="ConditionEmoji" src={weather.icon}/>
                    
                    <DetailedWeatherTooltip weather={weather.current} direction="right"/>
                </div>
                
                <div className="ConditionDesc">
                    <div className="Condition">{weather.current.condition.text}</div>
                    <div className="UpdateTime">
                        Updated at {new Date(weather.current.last_updated).toLocaleTimeString()}
                    </div>
                </div>
                
                <div className="Conditions">
                    <div className="Temperature">
                        <span className="Primary">
                            {weather.current.temp_f}°F
                            
                            <Tooltip>Feels like {weather.current.feelslike_f}°F</Tooltip>
                        </span>
                        
                        <span className="Secondary">
                            {weather.current.temp_c}°C
                            
                            <Tooltip>Feels like {weather.current.feelslike_c}°C</Tooltip>
                        </span>
                    </div>
                    <div className="Location">{weatherManager.location.split(",").slice(0, -1).join(",")}</div>
                </div>
            </div>
            
            <div className="Forecast">
                {weather.forecast.forecastday.map(({ day, date }, i) => (
                    date = new Date([...date.split("-").slice(1), new Date().getFullYear()].join("-")),
                    <div className="Item" key={i}>
                        <div>
                            <img className="Icon" src={weatherManager.getIcon(day, 1)}/>
                            
                            <DetailedWeatherTooltip weather={day}/>
                        </div>
                        
                        <div className="Entry Day">
                            {{
                                0: "Today",
                                1: "Tomorrow",
                                2: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]
                            }[i]}
                        </div>
                        <div className="Entry Condition">{day.condition.text}</div>
                        <div className="Entry Temperature"><span>{day.mintemp_f}°F</span> - <span>{day.maxtemp_f}°F</span></div>
                    </div>
                ))}
            </div>
        </div>
    ) : <div className="WeatherWidget Loading"/>;
}