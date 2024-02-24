import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";


const Chart = ({ data, shutdowns }) => {
  const addShutdownPoints = () => {
    const newData = [];
    let dataIndex = 0;
    
    const uniqueTimes = new Set();
    
    shutdowns.forEach(({ start, end }) => {
      while (dataIndex < data.length && data[dataIndex].time < start) {
        const { time, cpuLoad } = data[dataIndex];
        if (!uniqueTimes.has(time)) {
          newData.push({ time, cpuLoad });
          uniqueTimes.add(time);
        }
        dataIndex++;
      }
      
      newData.push({ time: start, cpuLoad: null });
      newData.push({ time: end, cpuLoad: null });
  
      if (!uniqueTimes.has(start)) {
        newData.push({ time: start, cpuLoad: null });
        uniqueTimes.add(start);
      }
      if (!uniqueTimes.has(end)) {
        newData.push({ time: end, cpuLoad: null });
        uniqueTimes.add(end);
      }
  
      while (dataIndex < data.length && data[dataIndex].time <= end) {
        dataIndex++;
      }
    });
  
    while (dataIndex < data.length) {
      const { time, cpuLoad } = data[dataIndex];
      if (!uniqueTimes.has(time)) {
        newData.push({ time, cpuLoad });
        uniqueTimes.add(time);
      }
      dataIndex++;
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