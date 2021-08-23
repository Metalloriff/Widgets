import "./styles.scss";
import os from "os";
import sysinfo from "systeminformation";
import { useInterval } from "./hooks";

function getColor(percentage, [safe, warn, danger]) {
    if (percentage < safe) return "#8FBCBB";
    if (percentage < warn) return "#EBCB8B";
    if (percentage < danger) return "#D08770";
    return "#BF616A";
}

export default function WidgetComponent({ widget }) {
    const [stats, updateStats] = React.useState({
        usage: {
            cpu: 0,
            ram: 0,
            gpu: 0
        },
        temp: {
            gpu: 0
        },
        ping: 0
    });
    
    const [driveStats, updateDriveStats] = React.useState([]);
    
    React.useEffect(() => {
        require("electron").remote.getCurrentWindow().webContents.openDevTools();
        window.sysinfo = sysinfo;
    }, []);
    
    useInterval(async () => {
        const cpu = await sysinfo.currentLoad();
        const ram = await sysinfo.mem();
        const gpu = (await sysinfo.graphics()).controllers[0];
        
        updateStats({
            usage: {
                cpu: cpu.currentLoad,
                ram: ram.used / ram.total * 100,
                gpu: gpu.utilizationGpu
            },
            temp: {
                gpu: gpu.temperatureGpu
            },
            ping: await sysinfo.inetLatency()
        });
    }, widget.config.get("interval", 1000));
    
    useInterval(() => sysinfo.fsSize().then(updateDriveStats), widget.config.get("fsInterval", 1000 * 60), true);
    
    return (
        <div className="HwMonitorWidget">
            { stats?.usage?.cpu !== undefined && (
                <div className="Item">
                    <div className="Title">CPU Usage (Average %)</div>

                    <div className="Flex">
                        <div className="Label">{stats.usage.cpu.toFixed(1)}%</div>

                        <div className="BarContainer" style={{ color: getColor(stats.usage.cpu, [50, 75, 90]) }}>
                            <div className="Bar" style={{ width: stats.usage.cpu + "%" }}/>
                        </div>
                    </div>
                </div>
            ) }
            
            { stats?.usage?.ram !== undefined && (
                <div className="Item">
                    <div className="Title">RAM Usage</div>

                    <div className="Flex">
                        <div className="Label">{stats.usage.ram.toFixed(1)}%</div>

                        <div className="BarContainer" style={{ color: getColor(stats.usage.ram, [60, 80, 90]) }}>
                            <div className="Bar" style={{ width: stats.usage.ram + "%" }}/>
                        </div>
                    </div>
                </div>
            ) }

            { stats?.usage?.gpu !== undefined && (
                <div className="Item">
                    <div className="Flex">
                        <div className="Title">GPU Usage</div>

                        <div className="Temp" style={{ color: getColor(stats.temp.gpu, [65, 70, 79]) }}>{stats.temp.gpu}℃</div>
                    </div>

                    <div className="Flex">
                        <div className="Label">{stats.usage.gpu.toFixed(1)}%</div>

                        <div className="BarContainer" style={{ color: getColor(stats.usage.gpu, [50, 75, 90]) }}>
                            <div className="Bar" style={{ width: stats.usage.gpu + "%" }}/>
                        </div>
                    </div>
                </div>
            ) }

            { stats?.ping !== undefined && (
                <div className="Item">
                    <div className="Flex">
                        <div className="Title">Network Ping</div>

                        <div className="Temp" style={{ color: getColor(stats.ping, [25, 50, 100]) }}>{stats.ping}ms</div>
                    </div>
                </div>
            ) }
            
            { widget.config.get("displayDriveStats", true) && driveStats.length && (
                driveStats.map(drive => drive.size * 0.000000001 > 5 && (
                    <div className="Item Drive" key={drive.fs}>
                        <div className="Flex">
                            <div className="Title">{drive.fs}</div>

                            <div className="Temp" style={{ color: getColor(drive.use, [50, 75, 90]) }}>
                                {(drive.used * 0.000000001).toFixed(1)}GB / {(drive.size * 0.000000001).toFixed(1)}GB
                            </div>
                        </div>

                        <div className="Flex">
                            <div className="Label">{drive.use.toFixed(1)}%</div>

                            <div className="BarContainer" style={{ color: getColor(drive.use, [50, 75, 90]) }}>
                                <div className="Bar" style={{ width: drive.use + "%" }}/>
                            </div>
                        </div>
                    </div>
                ))
            ) }
        </div>
    );
}