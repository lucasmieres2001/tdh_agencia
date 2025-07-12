import React, { useState, useEffect } from 'react';
import styles from './ResultadoDeBusqueda.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MapContainer from '../MapContainer/MapContainer'; // Asegúrate de que la ruta sea correcta

export default function ResultadoDeBusqueda(datosCotizacion) {
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [selectedHotelId, setSelectedHotelId] = useState(null);
    const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  


  const flightOptions = [
    { id: 'AR-08', airline: 'Aerolíneas Argentinas', type: 'Directo', salida: '08:00 AM', llegada: '10:00 AM', duracion: '2h 00m', price: 250000 },
    { id: 'FLY-11', airline: 'Flybondi', type: 'Directo', salida: '11:30 AM', llegada: '13:30 PM', duracion: '2h 00m', price: 265000 },
    { id: 'JS-14', airline: 'JetSmart', type: 'Directo', salida: '14:00 PM', llegada: '16:00 PM', duracion: '2h 00m', price: 270000 },
    { id: 'LATAM-06', airline: 'LATAM Airlines', type: '1 Escala', salida: '06:00 AM', llegada: '11:30 AM', duracion: '5h 30m', price: 210000 },
    { id: 'JS-09', airline: 'Jetsmart', type: '1 Escala', salida: '09:15 AM', llegada: '15:00 PM', duracion: '5h 45m', price: 225000 },
    { id: 'SKY-13', airline: 'Sky Airlines', type: '1 Escala', salida: '13:30 PM', llegada: '19:00 PM', duracion: '5h 30m', price: 230000 },
  ];

  const hotelOptions = [
    { id: 'Panamericano', name: 'Hotel Panamericano', category: '⭐⭐⭐⭐⭐', regime: 'Desayuno Incluido', price: 550000, location: { lat: -34.6037, lng: -58.3816 } },
    { id: 'Emperador', name: 'Hotel Emperador', category: '⭐⭐⭐⭐⭐', regime: 'Solo Alojamiento', price: 480000, location: { lat: -34.6090, lng: -58.3832 } },
    { id: 'Alvear', name: 'Alvear Palace Hotel', category: '⭐⭐⭐⭐⭐', regime: 'All Inclusive', price: 620000,  location: { lat: -34.5875, lng: -58.3935 } },
  ];

  const directFlights = flightOptions.filter(f => f.type === 'Directo');
  const stopFlights = flightOptions.filter(f => f.type.includes('Escala'));

  const selectedFlight = flightOptions.find(f => f.id === selectedFlightId);
  const selectedHotel = hotelOptions.find(h => h.id === selectedHotelId);

  const totalPrice = selectedFlight && selectedHotel ? selectedFlight.price + selectedHotel.price : null;

  return (
    <main className={styles.mainContainer}>

        {/*selectedHotel && (
        <div className={styles.mapWrapper} data-aos="fade-up">
            <h3 className={styles.mapTitle}>Ubicación del hotel seleccionado</h3>
            <MapContainer 
            apiKey="AIzaSyBXKhiKbdgi1xaAQBnH8Tiw7Qv5LliO6kw"
            location={selectedHotel.location} 
            />
        </div>
        )*/}
        <h1 data-aos="fade-down">Seleccione una combinación de Vuelo y Hotel</h1>
      
      <div className={styles.resultsGrid}>

        {/* Vuelos Directos */}
        <div className={styles.flightsColumn}>
          <h2 className={styles.columnTitle} data-aos="fade-up">✈️ Top 3 Vuelos Directos</h2>
          {directFlights.map((flight) => (
            <article
              key={flight.id}
              className={`${styles.card} ${selectedFlightId === flight.id ? styles.selected : ''}`}
              onClick={() => setSelectedFlightId(flight.id)}
              data-aos="fade-up"
            >
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{flight.airline}</h3>
                <span className={`${styles.tag} ${styles.directo}`}>{flight.type}</span>
              </header>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Salida</span>
                  <span className={styles.infoValue}>{flight.salida}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Llegada</span>
                  <span className={styles.infoValue}>{flight.llegada}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Duración</span>
                  <span className={styles.infoValue}>{flight.duracion}</span>
                </div>
              </div>
              <div className={styles.price}>💵 ${flight.price.toLocaleString('es-AR')}</div>
            </article>
          ))}

          {/* Vuelos con Escala */}
          <h2 className={styles.columnTitle} data-aos="fade-up">✈️ Top 3 Vuelos con Escala</h2>
          {stopFlights.map((flight) => (
            <article
              key={flight.id}
              className={`${styles.card} ${selectedFlightId === flight.id ? styles.selected : ''}`}
              onClick={() => setSelectedFlightId(flight.id)}
              data-aos="fade-up"
            >
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{flight.airline}</h3>
                <span className={`${styles.tag} ${styles.escala}`}>{flight.type}</span>
              </header>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Salida</span>
                  <span className={styles.infoValue}>{flight.salida}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Llegada</span>
                  <span className={styles.infoValue}>{flight.llegada}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Duración</span>
                  <span className={styles.infoValue}>{flight.duracion}</span>
                </div>
              </div>
              <div className={styles.price}>💵 ${flight.price.toLocaleString('es-AR')}</div>
            </article>
          ))}
        </div>

        {/* Hoteles */}
        <div className={styles.hotelsColumn}>
          <h2 className={styles.columnTitle} data-aos="fade-up">🏨 Top Hoteles</h2>
          {hotelOptions.map((hotel) => (
            <article
              key={hotel.id}
              className={`${styles.card} ${selectedHotelId === hotel.id ? styles.selected : ''}`}
              onClick={() => setSelectedHotelId(hotel.id)}
              data-aos="fade-up"
            >
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{hotel.name}</h3>
              </header>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Categoría</span>
                  <span className={styles.infoValue}>{hotel.category}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Régimen</span>
                  <span className={styles.infoValue}>{hotel.regime}</span>
                </div>
              </div>
              <div className={styles.price}>💵 ${hotel.price.toLocaleString('es-AR')}</div>
            </article>
          ))}

          {selectedFlight && selectedHotel && (
            <div className={styles.summaryCard} data-aos="zoom-in">
              <h3 className={styles.summaryTitle}>Propuesta Seleccionada</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>✈️ Vuelo:</span>
                <span className={styles.infoValue}>{selectedFlight.airline}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>🏨 Hotel:</span>
                <span className={styles.infoValue}>{selectedHotel.name}</span>
              </div>
              <div className={styles.summaryTotal}>Total: ${totalPrice.toLocaleString('es-AR')}</div>
              <button className={styles.copyBtn}>Copiar Propuesta para WhatsApp</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
