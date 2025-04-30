// js/components/temporizador.js

/**
 * Inicia un temporizador de cuenta regresiva.
 *
 * @param {number} segundosIniciales - Número de segundos para el conteo regresivo.
 * @param {function} onExpirar - Callback que se ejecuta cuando el tiempo llega a cero.
 * @param {function} onTick - Callback que se ejecuta en cada decremento de segundo, recibe el tiempo restante.
 * @returns {function} - Función para detener manualmente el temporizador.
 */
export function iniciarTemporizador(segundosIniciales, onExpirar, onTick) {
    // Guardamos el tiempo restante en una variable local
    let restante = segundosIniciales;
  
    // Llamamos al callback de tick inmediatamente con el valor inicial
    onTick(restante);
  
    // Creamos un intervalo que se dispara cada 1000 ms (1 segundo)
    const intervaloId = setInterval(() => {
      restante -= 1;             // Reducimos el tiempo restante
      onTick(restante);          // Notificamos al oyente del nuevo valor
  
      // Si el tiempo se ha agotado, cancelamos el intervalo y llamamos al callback de expirar
      if (restante <= 0) {
        clearInterval(intervaloId);
        onExpirar();
      }
    }, 1000);
  
    // Devolvemos una función que permite detener el temporizador manualmente desde fuera
    return () => clearInterval(intervaloId);
  }
  