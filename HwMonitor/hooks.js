export function useInterval(callback, timeout, callInstantly = false) {
    React.useEffect(() => {
        const interval = setInterval(callback, timeout);
        callInstantly && callback();
        
        return clearInterval.bind(null, interval);
    }, []);
}