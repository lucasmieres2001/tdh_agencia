import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'aos/dist/aos.css';
import Cotizador from './Views/Cotizador/Cotizador';
import PantallaDeCarga from './Views/PantallaDeCarga/PantallaDeCarga';
import ResultadoDeBusqueda from './Views/ResultadoDeBusqueda/ResultadoDeBusqueda';


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cotizador/>} /> 
        <Route path="/rutaborrar" element={<ResultadoDeBusqueda/>} /> 
        {/* Puedes agregar más rutas aquí si es necesario */}
      </Routes>
    </Router>
  );
}

export default App;
