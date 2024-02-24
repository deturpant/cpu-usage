import logo from './logo.svg';
import './App.css';
import Chart from './Components/Chart'
import MainContainer from './Components/MainContainer'

const App = () => {
  // Пример данных о загрузке процессора по времени
  const data = [
    { time: "9:00", cpuLoad: 20 },
    { time: "10:00", cpuLoad: 30 },
    { time: "11:00", cpuLoad: 25 },
    { time: "12:00", cpuLoad: 35 },
    { time: "13:00", cpuLoad: 40 },
    { time: "14:00", cpuLoad: 45 },
    // Добавьте здесь свои данные или получите их из внешнего источника
  ];

  return (
    <div className="App">
      <MainContainer/>
    </div>
  );
};
export default App;