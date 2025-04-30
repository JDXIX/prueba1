// js/app.js

// Importamos la función para voltear cartas y el temporizador
import { voltearCarta } from './components/cartaDisplay.js';
import { iniciarTemporizador } from './components/temporizador.js';

////////////////////////////////////////////////////////////////////////////////
// 1. Referencias a elementos del DOM
////////////////////////////////////////////////////////////////////////////////

// Sección de registro
const registroSeccion = document.getElementById('registro-section');
const registroForm = document.getElementById('registro-form');
const inputNombre = document.getElementById('nombre-jugador');
const btnAgregar = document.getElementById('agregar-jugador');
const jugadoresUL = document.getElementById('jugadores-ul');
const btnComenzar = document.getElementById('comenzar-juego');

// Sección del juego
const juegoSeccion = document.getElementById('juego-section');
const badgeTurno = document.getElementById('turno-badge');
const spanJugadorActual = document.getElementById('jugador-actual');
const btnMostrarCarta = document.getElementById('mostrar-carta');
const tituloCarta = document.getElementById('titulo-carta');
const textoCarta = document.getElementById('texto-carta');
const btnVolver = document.getElementById('volver-registro');
const textoTemporizador = document.getElementById('texto-temporizador');
const barraTemporizador = document.getElementById('barra-temporizador');

// Sonidos
const sonidoVoltear = document.getElementById('sonido-voltear');
const sonidoTemporizador = document.getElementById('sonido-temporizador');

////////////////////////////////////////////////////////////////////////////////
// 2. Variables de estado
////////////////////////////////////////////////////////////////////////////////

let listaJugadores = [];   // Array para almacenar los nombres de los jugadores
let turnoIndex = 0;        // Índice del jugador cuyo turno está activo

////////////////////////////////////////////////////////////////////////////////
// 3. Funciones auxiliares
////////////////////////////////////////////////////////////////////////////////

/**
 * Actualiza la interfaz para mostrar el jugador actual y habilitar el botón de mostrar carta.
 */
function actualizarTurno() {
  const nombre = listaJugadores[turnoIndex];
  spanJugadorActual.textContent = nombre;
  btnMostrarCarta.disabled = false;         // Habilita el botón para que el jugador pueda voltear
  badgeTurno.setAttribute('aria-label', `Turno de: ${nombre}`);
}

/**
 * Reinicia el juego al estado inicial de registro.
 */
function reiniciarJuego() {
  // Oculta la sección de juego y muestra el registro
  juegoSeccion.classList.add('oculto');
  registroSeccion.classList.remove('oculto');

  // Limpia la lista y reset de variables
  listaJugadores = [];
  turnoIndex = 0;
  jugadoresUL.innerHTML = '';
  inputNombre.value = '';
}

////////////////////////////////////////////////////////////////////////////////
// 4. Manejadores de eventos
////////////////////////////////////////////////////////////////////////////////

// Agregar jugador a la lista
btnAgregar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  if (!nombre) return;                      // No agregar nombres vacíos

  // Añade el nombre al array y a la lista en pantalla
  listaJugadores.push(nombre);
  const li = document.createElement('li');
  li.textContent = nombre;
  jugadoresUL.appendChild(li);

  // Limpia el campo de texto
  inputNombre.value = '';
});

// Iniciar el juego
btnComenzar.addEventListener('click', () => {
  if (listaJugadores.length < 2) {
    alert('Se necesitan al menos 2 jugadores para comenzar.');
    return;
  }
  // Oculta registro y muestra juego
  registroSeccion.classList.add('oculto');
  juegoSeccion.classList.remove('oculto');
  actualizarTurno();                        // Muestra el primer turno
});

// Volver al registro desde el juego
btnVolver.addEventListener('click', reiniciarJuego);

// Mostrar carta y disparar temporizador
btnMostrarCarta.addEventListener('click', async () => {
  btnMostrarCarta.disabled = true;          // Evita múltiples clics durante el turno

  // Obtenemos clave y texto del reto
  const { clave, texto } = await voltearCarta();

  // Actualizamos la carta en la interfaz
  tituloCarta.textContent = clave;
  textoCarta.textContent = texto;
  sonidoVoltear.play();                     // Reproducir efecto de volteo

  // Animación de flip accesible
  const cartaEl = document.getElementById('carta');
  cartaEl.setAttribute('aria-expanded', 'true');

  // Iniciar temporizador de 30 segundos
  iniciarTemporizador(10,
    () => {
      // Al expirar: reproducir sonido, avanzar turno y actualizar UI
      sonidoTemporizador.play();
      turnoIndex = (turnoIndex + 1) % listaJugadores.length;
      cartaEl.setAttribute('aria-expanded', 'false');
      actualizarTurno();
    },
    (segundosRestantes) => {
      // En cada tick: actualizar texto y barra de progreso
      textoTemporizador.textContent = segundosRestantes;
      barraTemporizador.style.width = `${(segundosRestantes / 10) * 100}%`;
    }
  );
});
