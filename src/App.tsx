import styles from "./App.module.css";
import Form from "./components/Form/Form";
import useWeather from "./hooks/useWeather";

function App() {
  const { fetchWeather } = useWeather();
  return (
    <>
      <h1 className={styles.title}>acosta</h1>
      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
      </div>
    </>
  );
}

export default App;
