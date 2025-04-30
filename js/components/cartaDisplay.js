// js/components/cartaDisplay.js

/**
 * Carga el JSON de retos y devuelve una carta aleatoria.
 * @returns {Promise<{clave: string, texto: string}>}
 */
export async function voltearCarta() {
    // Fetch del archivo JSON con los retos mapeados por clave de carta
    const respuesta = await fetch('data/retos.json');
    if (!respuesta.ok) {
      throw new Error(`Error al cargar los retos: ${respuesta.statusText}`);
    }
  
    // Parseamos el JSON
    const retos = await respuesta.json();
  
    // Obtenemos todas las claves (A, 2, 3, …, K)
    const claves = Object.keys(retos);
  
    // Seleccionamos una clave al azar
    const indiceAleatorio = Math.floor(Math.random() * claves.length);
    const claveSeleccionada = claves[indiceAleatorio];
  
    // Devolvemos la clave y el texto del reto correspondiente
    return {
      clave: claveSeleccionada,
      texto: retos[claveSeleccionada]
    };
  }
  