import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";


const Chart = ({ data, shutdowns }) => {
  const newData = data.map(entry => {
    const isShutdown = shutdowns.some(interval => entry.time >= interval.start && entry.time <= interval.end);
    return {
      time: entry.time,
      cpuLoad: isShutdown ? null : entry.cpuLoad
    };
  });

  const chartData = {
    labels: newData.map(entry => entry.time),
    datasets: [
      {
        label: "CPU usage",
        data: newData.map(entry => entry.cpuLoad),
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
