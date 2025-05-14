// js/app.js

/**
 * Orquesta la lógica principal del juego:
 * - Registro de jugadores
 * - Turnos con temporizador de atención
 * - Extracción de cartas y penalizaciones
 * - Reinicio y vuelta al registro
 */

import { voltearCarta } from './components/cartaDisplay.js';

////////////////////////////////////////////////
// 1. Referencias a elementos del DOM         //
////////////////////////////////////////////////
// Registro
const registroSeccion   = document.getElementById('registro-section');
const inputNombre       = document.getElementById('nombre-jugador');
const btnAgregar        = document.getElementById('agregar-jugador');
const jugadoresUL       = document.getElementById('jugadores-ul');
const btnComenzar       = document.getElementById('comenzar-juego');

// Juego
const juegoSeccion        = document.getElementById('juego-section');
const spanJugadorActual   = document.getElementById('jugador-actual');
const badgeTurno          = document.getElementById('turno-badge');
const textoTemporizador   = document.getElementById('texto-temporizador');
const barraTemporizador   = document.getElementById('barra-temporizador');
const btnMostrarCarta     = document.getElementById('mostrar-carta');
const btnSiguienteTurno   = document.getElementById('siguiente-turno');
const tituloCarta         = document.getElementById('titulo-carta');
const textoCarta          = document.getElementById('texto-carta');
const mensajePenalizacion = document.getElementById('mensaje-penalizacion');
const finMazo             = document.getElementById('fin-mazo');
const btnReiniciarMazo    = document.getElementById('reiniciar-mazo');
const btnVolverRegistro   = document.getElementById('volver-registro');

// Sonidos
const sonidoVoltear      = document.getElementById('sonido-voltear');
const sonidoTemporizador = document.getElementById('sonido-temporizador');

////////////////////////////////////////////////
// 2. Estado interno del juego                //
////////////////////////////////////////////////
let listaJugadores = []; // nombres en orden de registro
let turnoIndex     = 0;  // índice del jugador actual
let ultimaCarta    = null; // clave de la última carta vista

////////////////////////////////////////////////
// 3. Funciones auxiliares                    //
////////////////////////////////////////////////

/**
 * Prepara la UI para un nuevo turno:
 * - Muestra badge con jugador
 * - Oculta botones y mensajes previos
 * - Inicia temporizador de 15s para presionar "Mostrar Carta"
 */
function iniciarNuevoTurno() {
  // Reset UI de turno anterior
  mensajePenalizacion.classList.add('oculto');
  btnMostrarCarta.classList.remove('oculto');
  btnMostrarCarta.disabled = false;
  btnSiguienteTurno.classList.add('oculto');
  finMazo.classList.add('oculto');
  document.getElementById('carta').setAttribute('aria-expanded', 'false');
  
  // Badge de turno
  const nombre = listaJugadores[turnoIndex];
  spanJugadorActual.textContent = nombre;
  badgeTurno.setAttribute('aria-label', `Turno de: ${nombre}`);

  // Temporizador de atención: 15 segundos
  iniciarTemporizador(15,
    // On expirar → penalizar
    () => {
      btnMostrarCarta.disabled = true;
      mensajePenalizacion.textContent = 'Toma 1 shot por no estar atento';
      mensajePenalizacion.classList.remove('oculto');
      btnSiguienteTurno.classList.remove('oculto');
    },
    // On tick → actualizar barra y texto
    segundosRestantes => {
      textoTemporizador.textContent = segundosRestantes;
      barraTemporizador.style.width = `${(segundosRestantes / 15) * 100}%`;
    }
  );
}

/**
 * Vuelve al estado inicial de registro:
 * - Muestra sección de registro y limpia lista
 * - Oculta sección de juego
 */
function reiniciarJuego() {
  registroSeccion.classList.remove('oculto');
  juegoSeccion.classList.add('oculto');
  listaJugadores = [];
  turnoIndex = 0;
  ultimaCarta = null;
  jugadoresUL.innerHTML = '';
}

////////////////////////////////////////////////
// 4. Manejadores de eventos                  //
////////////////////////////////////////////////

// Agregar jugador a la lista
btnAgregar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  if (!nombre) return; // no admitimos vacíos

  listaJugadores.push(nombre);
  const li = document.createElement('li');
  li.textContent = nombre;
  jugadoresUL.appendChild(li);
  inputNombre.value = '';
});

// Comenzar el juego (mínimo 2 jugadores)
btnComenzar.addEventListener('click', () => {
  if (listaJugadores.length < 2) {
    alert('Se necesitan al menos 2 jugadores.');
    return;
  }
  registroSeccion.classList.add('oculto');
  juegoSeccion.classList.remove('oculto');
  iniciarNuevoTurno();
});

// Mostrar carta al hacer clic
btnMostrarCarta.addEventListener('click', async () => {
  btnMostrarCarta.disabled = true;
  try {
    const { clave, texto } = await voltearCarta();

    // Detectar carta repetida
    if (clave === ultimaCarta) {
      mensajePenalizacion.textContent = 'Carta repetida: anula el reto y toma 2 SHOTS por COPIÓN';
      mensajePenalizacion.classList.remove('oculto');
    } else {
      // Mostrar reto
      tituloCarta.textContent = clave;
      textoCarta.textContent = texto;
      sonidoVoltear.play();
      document.getElementById('carta').setAttribute('aria-expanded', 'true');
    }

    ultimaCarta = clave;             // actualizar última carta
    btnMostrarCarta.classList.add('oculto');
    btnSiguienteTurno.classList.remove('oculto');
  } catch (err) {
    // Si se agotó el mazo, mostrar mensaje final
    if (err.message === 'MAZO_VACIO') {
      finMazo.classList.remove('oculto');
    } else {
      console.error(err);
    }
  }
});

// Pasar al siguiente turno
btnSiguienteTurno.addEventListener('click', () => {
  turnoIndex = (turnoIndex + 1) % listaJugadores.length;
  iniciarNuevoTurno();
});

// Reiniciar mazo (recarga completa de la página)
btnReiniciarMazo.addEventListener('click', () => {
  window.location.reload();
});

// Volver al registro
btnVolverRegistro.addEventListener('click', reiniciarJuego);
