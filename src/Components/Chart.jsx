import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";


const Chart = ({ data, shutdowns }) => {
  const addShutdownPoints = () => {
    const newData = [];
    let dataIndex = 0;
    let shutdownIndex = 0;
  
    while (dataIndex < data.length || shutdownIndex < shutdowns.length) {
      const dataTime = dataIndex < data.length ? data[dataIndex].time : null;
      const shutdownStart = shutdownIndex < shutdowns.length ? shutdowns[shutdownIndex].start : null;
      const shutdownEnd = shutdownIndex < shutdowns.length ? shutdowns[shutdownIndex].end : null;
  
      if (dataTime === null) {
        newData.push({ time: shutdownStart, cpuLoad: null });
        newData.push({ time: shutdownEnd, cpuLoad: null });
        shutdownIndex++;
      } else if (shutdownStart === null || dataTime < shutdownStart) {
        newData.push({ time: dataTime, cpuLoad: data[dataIndex].cpuLoad });
        dataIndex++;
      } else {
        newData.push({ time: shutdownStart, cpuLoad: null });
        newData.push({ time: shutdownEnd, cpuLoad: null });
        shutdownIndex++;
      }
    }
  
    return newData;
  };
  
  

  const newData = addShutdownPoints();

  const chartData = {
    labels: newData.map((entry) => entry.time), // Время
    datasets: [
      {
        label: "CPU usage",
        data: newData.map((entry) => entry.cpuLoad), // Загрузка процессора
        borderColor: "#3333ff",
        fill: false
      }
    ]
  };

  const options = {
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            if (newData[index]) {
              return newData[index].time;
            }
          }
        }
      },
      y: {
        title: {
          display: true,
          text: "CPU usage (%)"
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "CPU usage by time",
        fontSize: 20
      },
      legend: {
        display: true,
        position: "top"
      }
    }
  };

  return (
    <Line
      data={{
        ...chartData,
      }}
      options={options}
    />
  );
};

export default Chart;