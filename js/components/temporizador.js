// js/components/temporizador.js

/**
 * Inicia un temporizador de cuenta regresiva.
 *
 * @param {number} segundosIniciales  - Duración en segundos para el conteo regresivo.
 * @param {function} onExpirar        - Callback que se ejecuta cuando el tiempo llega a 0.
 * @param {function} onTick           - Callback que se ejecuta en cada segundo, recibe los segundos restantes.
 * @returns {function}                - Función para detener manualmente el temporizador.
 */
export function iniciarTemporizador(segundosIniciales, onExpirar, onTick) {
  // Almacenamos el tiempo restante en una variable mutable
  let restante = segundosIniciales;

  // Llamamos inmediatamente al callback onTick con el valor inicial
  onTick(restante);

  // Creamos un intervalo que se dispara cada 1000 ms (1 segundo)
  const intervaloId = setInterval(() => {
    restante -= 1;        // Decrementamos el contador
    onTick(restante);     // Notificamos al oyente el nuevo valor

    // Cuando llega a cero o menos, limpiamos y llamamos a onExpirar
    if (restante <= 0) {
      clearInterval(intervaloId);
      onExpirar();
    }
  }, 1000);

  // Devolvemos una función para permitir detener el temporizador desde fuera
  return () => clearInterval(intervaloId);
}
