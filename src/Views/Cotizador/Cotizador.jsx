import React, { useState, useEffect } from 'react';
import styles from './Cotizador.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import PantallaDeCarga from '../PantallaDeCarga/PantallaDeCarga';
import Swal from 'sweetalert2';
import ResultadoDeBusqueda from '../ResultadoDeBusqueda/ResultadoDeBusqueda';


export default function Cotizador() {
  /*
  const [proveedores, setProveedores] = useState([
    { nombre: 'GitCordoba', activo: true },
    { nombre: 'FreeWay', activo: true },
    { nombre: 'Ola', activo: false },
  ]);
*/
  const [formData, setFormData] = useState({
  origen: '',
  destino: '',
  fechaIda: '',
  fechaVuelta: '',
  pasajeros: 2,
  menores2: 0,   // ✅ NUEVO: menores de 2 años
  menores18: 0,  // ✅ NUEVO: mayores de 2 y menores de 18 años
  //proveedores: [],
});

  const [loading, setLoading] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  /*
  const toggleProveedor = (index) => {
    setProveedores(prev =>
      prev.map((p, i) => i === index ? { ...p, activo: !p.activo } : p)
    );
  };
*/
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
    const endpoints = [
      { name: 'Proveedor 1', url: 'https://rutaDeLaAPI/proveedor1/cotizar' },
      { name: 'Proveedor 2', url: 'https://rutaDeLaAPI/proveedor2/cotizar' },
      { name: 'Proveedor 3', url: 'https://rutaDeLaAPI/proveedor3/cotizar' },
      { name: 'Proveedor 4', url: 'https://rutaDeLaAPI/proveedor4/cotizar' }
    ];

    // Adjunta nombre a cada promesa
    const promises = endpoints.map((ep) =>
      fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Acá va el token de autenticación',
        },
        body: JSON.stringify(formData),
      }).then(
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
          const data = await response.json();
          datos.push(data);
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

    // Si hubo errores, mostrar alerta y detener
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

    setData(datos); // Guarda datos válidos
    setResultadosBusqueda(true); // Muestra resultados
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
    {loading && !resultadosBusqueda &&<PantallaDeCarga />}
    {!loading && !resultadosBusqueda && (
      <div className={styles.container} data-aos="zoom-in">
      
      <form onSubmit={handleSubmit}>
        <h1 className={styles.title} data-aos="fade-down">✈️Cotizador de vuelo✈️</h1>

       {/* <section className={styles.proveedores} data-aos="fade-up"> 
          <p className={styles.subTitle}>Selecciona los proveedores</p>
          <div className={styles.proveedoresList}>
            {proveedores.map((p, i) => (
              <button
                type="button"
                key={p.nombre}
                className={`${styles.proveedor} ${p.activo ? styles.active : ''}`}
                onClick={() => toggleProveedor(i)}
              >
                {p.activo && <FontAwesomeIcon icon={faCircleCheck} />}
                {p.nombre}
              </button>
            ))}
          </div>
        </section>*/}

        <div className={styles.grid} data-aos="fade-up">
          <div className={styles.field}>
            <label htmlFor="origen">Origen</label>
            <input id="origen" placeholder="Ej: Córdoba" value={formData.origen} onChange={handleInputChange} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="destino">Destino</label>
            <input id="destino" placeholder="Ej: Madrid" value={formData.destino} onChange={handleInputChange} required />
          </div>
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
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          Buscar Cotización
        </button>
      </form>
    </div>
    )}
    </>
  );
}
