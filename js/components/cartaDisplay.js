// js/components/cartaDisplay.js

/**
 * Modulo para gestionar un mazo de cartas (4 copias de A–K) con retos asociados.
 * Usa un JSON local (data/retos.json) como fuente de los textos de reto.
 */

//////////////////////////////////////////
// 1. Mezclador Fisher–Yates (in-place) //
//////////////////////////////////////////
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

////////////////////////////////////////////////
// 2. Variables internas para el mazo y retos //
////////////////////////////////////////////////
let retosMap = {}; // { "A": "Elige quien toma", … }
let mazo = [];     // ['A','A','A','A','2','2','2','2',…]

/////////////////////////////////////////////////////////
// 3. Inicialización del mazo (solo una vez al cargar) //
/////////////////////////////////////////////////////////
async function inicializarMazo() {
  // 3.1. Cargar JSON de retos
  const resp = await fetch('data/retos.json');
  if (!resp.ok) {
    throw new Error(`Error cargando retos.json: ${resp.statusText}`);
  }
  retosMap = await resp.json();

  // 3.2. Construir mazo con 4 copias de cada clave
  const claves = Object.keys(retosMap);               // ['A','2',…,'K']
  mazo = claves.flatMap(c => Array(4).fill(c));       // ['A','A','A','A','2',…]

  // 3.3. Mezclarlo
  mezclar(mazo);
}

// Llama inmediatamente para preparar el mazo antes de cualquier uso
const initPromise = inicializarMazo();

////////////////////////////////////////////////
// 4. Función exportada: extraer una carta    //
////////////////////////////////////////////////
/**
 * Extrae la última carta del mazo mezclado y devuelve su clave y texto de reto.
 * Si el mazo está vacío, lanza un error con mensaje 'MAZO_VACIO'.
 * @returns {Promise<{ clave: string, texto: string }>}
 */
export async function voltearCarta() {
  // Espera a que la inicialización complete
  await initPromise;

  // Si no quedan cartas, informa al llamador
  if (mazo.length === 0) {
    throw new Error('MAZO_VACIO');
  }

  // Extrae sin reemplazo
  const clave = mazo.pop();
  return {
    clave,
    texto: retosMap[clave]
  };
}
