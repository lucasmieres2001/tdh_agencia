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
  const [proveedores, setProveedores] = useState([
    { nombre: 'GitCordoba', activo: true },
    { nombre: 'FreeWay', activo: true },
    { nombre: 'Ola', activo: false },
  ]);

  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    fechaIda: '',
    noches: '',
    pasajeros: 2,
    menores: 0,
    proveedores: [],
  });
  const [loading, setLoading] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleProveedor = (index) => {
    setProveedores(prev =>
      prev.map((p, i) => i === index ? { ...p, activo: !p.activo } : p)
    );
  };

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
    const selectedProveedores = proveedores.filter(p => p.activo).map(p => p.nombre);
    formData.proveedores = selectedProveedores;
    console.log(formData);
    setLoading(true);
    try {
      const query = await fetch('https://rutaDeLaAPI/cotizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Acá va el token de autenticación',
      },   
      body: JSON.stringify(formData ),
    });
    if (query.ok) {
      setLoading(false);
      const datas = await query.json();
      console.log(datas);
      setData(datas);
      setResultadosBusqueda(true);
      return;
    }
    } catch (error) {
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

        <section className={styles.proveedores} data-aos="fade-up">
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
        </section>

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
            <label htmlFor="noches">Noches</label>
            <input id="noches" type="number" min="1" value={formData.noches} onChange={handleInputChange} required />
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
            <label>Menores (2-11)</label>
            <div className={styles.stepper}>
              <button type="button" onClick={() => handleStepper('menores', 'dec')}>-</button>
              <span>{formData.menores}</span>
              <button type="button" onClick={() => handleStepper('menores', 'inc')}>+</button>
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
