import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import axios from "axios";
import "./MainContainer.css";

const MainContainer = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [shutdownIntervals, setShutdownIntervals] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(10); // Интервал обновления данных в секундах

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          "https://api.cpu-load.deturpant.ru/last_hours_loads"
        );
        const formattedData1 = response1.data.cpu_loads.map(entry => ({
          time: entry.timestamp.slice(11, 19),
          cpuLoad: entry.value
        }));
        setData1(formattedData1);

        const response2 = await axios.get(
          "https://api.cpu-load.deturpant.ru/avg_loads"
        );
        const formattedData2 = Object.entries(response2.data.cpu_loads).map(
          ([time, cpuLoad]) => ({
            time: time.slice(11, 19),
            cpuLoad
          })
        );
        setData2(formattedData2);

        const responseShutdowns = await axios.get(
          "https://api.cpu-load.deturpant.ru/shutdowns"
        );
        const shutdownIntervals = responseShutdowns.data.shutdowns.map(interval => ({
          start: interval[0].slice(11, 19),
          end: interval[1].slice(11, 19)
        }));
        setShutdownIntervals(shutdownIntervals);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const timerId = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(timerId);
  }, [refreshInterval]); 

  return (
    <div>
      <div className="refresh-interval">
        <h3>Refresh after (sec):</h3>
        <select
          value={refreshInterval}
          onChange={e => setRefreshInterval(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>
      </div>
      <div className="main-container">
        <div className="chart-container">
          <h2>CPU usage in the last hour</h2>
          <Chart data={data1} shutdowns={shutdownIntervals} />
        </div>
      </div>
      <div className="main-container">
        <div className="chart-container">
          <h2>CPU usage (averaged per minute) in the last hour</h2>
          <Chart data={data2} shutdowns={shutdownIntervals} />
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
