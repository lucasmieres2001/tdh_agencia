import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Cotizador.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import PantallaDeCarga from '../PantallaDeCarga/PantallaDeCarga';
import Swal from 'sweetalert2';
import ResultadoDeBusqueda from '../ResultadoDeBusqueda/ResultadoDeBusqueda';
import dataBase from './AllAirPortsGitCor.json';

// Prepara las opciones para react-select
export const airportOptions = dataBase.map(a => ({
  value: a.iata_code,
  label: a.label
    ? `${a.label} (${a.iata_code})`
    : a.iata_code
}));

export default function Cotizador() {
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    fechaIda: '',
    fechaVuelta: '',
    pasajeros: 2,
    menores2: 0,
    menores18: 0,
  });

  const [loading, setLoading] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field) => (option) => {
    setFormData(prev => ({ ...prev, [field]: option ? option.value : '' }));
  };

  const handleStepper = (field, dir) => {
    setFormData(prev => {
      const min = field === 'pasajeros' ? 1 : 0;
      const val = dir === 'inc' ? prev[field] + 1 : Math.max(prev[field] - 1, min);
      return { ...prev, [field]: val };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);

    try {
      const { origen, destino, fechaIda, fechaVuelta, pasajeros } = formData;
      const baseUrl = new URL('http://127.0.0.1:5001/api/v1/gitcordoba/flights');
      baseUrl.searchParams.set('origen', origen);
      baseUrl.searchParams.set('destino', destino);
      baseUrl.searchParams.set('fecha_ida', fechaIda);
      baseUrl.searchParams.set('fecha_vuelta', fechaVuelta);
      baseUrl.searchParams.set('adultos', pasajeros);
      baseUrl.searchParams.set('is_in_usd', 'false');
      const urlString = baseUrl.toString();

      const endpoints = [
        { name: 'Proveedor 1', url: urlString },
        { name: 'Proveedor 2', url: urlString },
        { name: 'Proveedor 3', url: urlString },
        { name: 'Proveedor 4', url: urlString },
      ];

      const promises = endpoints.map((ep) =>
        fetch(ep.url, { method: 'GET' })
          .then(
            (res) => ({ name: ep.name, response: res }),
            (err) => Promise.reject({ name: ep.name, reason: err })
          )
      );

      const results = await Promise.allSettled(promises);

      console.log('Resultados de las promesas:', results);
      const datos = [];
      const errores = [];

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { name, response } = result.value;
          if (response.ok) {
            const json = await response.json();
            datos.push(json);
          } else {
            console.warn(`API ${name} devolvió error:`, response.status);
            errores.push(`No se pudo obtener datos de ${name}: ${response.statusText}`);
          }
        } else {
          const { name, reason } = result.reason;
          console.error(`Fetch ${name} falló:`, reason);
          errores.push(`No se pudo obtener datos de ${name}: ${reason.message || reason}`);
        }
      }

      if (errores.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cotizar',
          html: errores.join('<br>'),
        });
        setLoading(false);
        return;
      }

      console.log('Todos los resultados:', datos);
      setData(datos);
      setResultadosBusqueda(true);
      setLoading(false);

    } catch (error) {
      console.error('Error general:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cotizar',
        text: 'Hubo un error al intentar cotizar el vuelo.',
      });
      setLoading(false);
    }
  };

  return (
    <>
      {!loading && resultadosBusqueda && <ResultadoDeBusqueda datosCotizacion={data}/>}      
      {loading && !resultadosBusqueda && <PantallaDeCarga />}
      {!loading && !resultadosBusqueda && (
        <div className={styles.container} data-aos="zoom-in">
          <form onSubmit={handleSubmit}>
            <h1 className={styles.title} data-aos="fade-down">✈️Cotizador de vuelo✈️</h1>

            <div className={styles.grid} data-aos="fade-up">
              <div className={styles.field}>
                <label htmlFor="origen">Origen</label>
                <Select
                  inputId="origen"
                  name="origen"
                  options={airportOptions}
                  value={airportOptions.find(o => o.value === formData.origen)}
                  onChange={handleSelectChange('origen')}
                  placeholder="– Selecciona o escribe –"
                  isClearable
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="destino">Destino</label>
                <Select
                  inputId="destino"
                  name="destino"
                  options={airportOptions}
                  value={airportOptions.find(o => o.value === formData.destino)}
                  onChange={handleSelectChange('destino')}
                  placeholder="– Selecciona o escribe –"
                  isClearable
                />
              </div>
              {/* Resto de campos (fechaIda, fechaVuelta, steppers, etc.) */}
              <div className={styles.field}>
                <label htmlFor="fechaIda">Fecha de ida</label>
                <input id="fechaIda" type="date" value={formData.fechaIda} onChange={handleInputChange} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="fechaVuelta">Fecha de vuelta</label>
                <input id="fechaVuelta" type="date" value={formData.fechaVuelta} onChange={handleInputChange} required />
              </div>
              <div className={styles.field}>
                <label>Adultos</label>
                <div className={styles.stepper}>
                  <button type="button" onClick={() => handleStepper('pasajeros', 'dec')}>-</button>
                  <span>{formData.pasajeros}</span>
                  <button type="button" onClick={() => handleStepper('pasajeros', 'inc')}>+</button>
                </div>
              </div>
              <div className={styles.field}>
                <label>Menores de 2 años</label>
                <div className={styles.stepper}>
                  <button type="button" onClick={() => handleStepper('menores2', 'dec')}>-</button>
                  <span>{formData.menores2}</span>
                  <button type="button" onClick={() => handleStepper('menores2', 'inc')}>+</button>
                </div>
              </div>
              <div className={styles.field}>
                <label>Menores entre 2 y 18 años</label>
                <div className={styles.stepper}>
                  <button type="button" onClick={() => handleStepper('menores18', 'dec')}>-</button>
                  <span>{formData.menores18}</span>
                  <button type="button" onClick={() => handleStepper('menores18', 'inc')}>+</button>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submit} data-aos="fade-up">
              <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar Cotización
            </button>
          </form>
        </div>
      )}
    </>
  );
}