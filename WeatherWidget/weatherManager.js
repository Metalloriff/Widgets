const fs = require("fs");
const path = require("path");

module.exports = new class WeatherManager {
    location = "";
    endpoint = "https://api.weatherapi.com/v1";
    apiKey = "603ce1cc395846caa7002812212308";
    
    getIcon({ condition }, day) {
        return "https://" + condition.icon.slice(2).replace("64x64", "128x128");
        
        // Too lazy to fix this
        // const dir = path.join(__dirname, "Icons");
        // const time = day === 1 ? "day" : "night";
        // const conditionSpaghetti = condition.text.toLowerCase().replace("possible", "").trim();
        //
        // return "file:///" + (fs.existsSync(path.join(dir, `${conditionSpaghetti} ${time}`))
        //     ? path.join(dir, `${conditionSpaghetti} ${time}`)
        //     : path.join(dir, conditionSpaghetti)) + ".png";
    }

    /**
     * Gets the current location of the user
     * node-widgets wants to know your location
     * @returns {Promise<string>} The location formatted as City/Town, State/Province, Country
     */
    async getLocation() {
        if (!this.location)
            this.location = await fetch("https://wttr.in?format=%l").then(r => r.text());
        return this.location;
    }

    /**
     * Get the current weather conditions and predictions
     * @returns {Promise<any>} The weather response object
     */
    async get() {
        const location = await this.getLocation();
        
        // Set the window.weather object for debugging purposes
        // Return the weather objects
        return window.weather = await fetch(`${this.endpoint}/forecast.json?key=${this.apiKey}&q=${location}&days=3&aqi=yes&alerts=yes`)
            .then(res => res.json())
            .then(data => (
                data.icon = this.getIcon(data.current, data.current.is_day),
                data.location = location, data
            ));
    }
}