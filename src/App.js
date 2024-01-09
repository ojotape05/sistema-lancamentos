import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'

import Header from './components/layout/Header';
import Home from "./components/pages/Home";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;
