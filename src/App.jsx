import './App.css';
import Header from '../components/Header';
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import AnimatedRoutes from '../components/AnimatedRoutes';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`wrp ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Suspense fallback='...loading'>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Header />
            <AnimatedRoutes />
            </Router>
          </PersistGate>
        </Provider>
      </Suspense>
    </div>
  );
}

export default App;
