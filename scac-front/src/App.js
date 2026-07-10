import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './routes';

function App() {
  console.log('router', router);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
