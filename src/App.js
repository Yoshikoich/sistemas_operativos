import './App.css';
import React, { useState } from 'react';


// Configuración inicial de los procesos con sus recursos asignados
const initialProcesses = [
  { id: 'A', assigned: 2 },
  { id: 'B', assigned: 2 },
  { id: 'C', assigned: 1 },
];

// Genera un conjunto de valores aleatorios únicos en un rango dado
const generateUniqueRandomValues = (count, min, max) => {
  const uniqueValues = new Set();
  while (uniqueValues.size < count) {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueValues.add(randomValue); // Añade solo valores únicos
  }
  return Array.from(uniqueValues); // Retorna como array para facilitar el acceso por índice
};

const App = () => {
  const [processes, setProcesses] = useState(initialProcesses);
  const [availableResources, setAvailableResources] = useState(2);
  const [log, setLog] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // Función para generar datos aleatorios cumpliendo las condiciones y evitando repetición en maxNeed
  const generateData = () => {
    // Genera tres valores únicos de necesidad máxima entre 3 y 7 (ajusta el rango según necesidades)
    const uniqueMaxNeeds = generateUniqueRandomValues(3, 3, 7);

    // Asigna a cada proceso un valor único de necesidad máxima de forma aleatoria
    const newProcesses = initialProcesses.map((proc, index) => {
      const maxNeed = uniqueMaxNeeds[index]; // Asigna un valor único de maxNeed
      const assigned = Math.floor(Math.random() * maxNeed); // Asigna recursos < maxNeed
      return { 
        ...proc, 
        maxNeed, 
        assigned, 
        difference: maxNeed - assigned // Calcula la diferencia
      };
    });

    // Actualiza el estado de los procesos con los nuevos valores generados
    setProcesses(newProcesses);
    setAvailableResources(2); // Reinicia recursos disponibles a 2
    setLog(["✅ Datos generados y condiciones cumplidas"]); // Log inicial confirmando que cumple condiciones
  };

  // Función para simular el algoritmo de prevención de bloqueos
  const startSimulation = () => {
    let currentResources = availableResources; // Inicia con los recursos disponibles
    let newLog = [...log]; // Copia del log para ir registrando los pasos
    setSimulationRunning(true); // Cambia el estado a simulación en curso

    // Ordena los procesos por "necesidad máxima" (maxNeed) para determinar el orden de entrada
    const sortedProcesses = [...processes].sort((a, b) => a.maxNeed - b.maxNeed);

    // Inicia el proceso de simulación para cada proceso en el orden de maxNeed
    sortedProcesses.forEach(proc => {
      const { id, assigned, difference, maxNeed } = proc;

      // Verificación de la condición para entrar: diferencia <= recursos disponibles
      if (difference <= currentResources) {
        newLog.push(`🔷 Proceso ${id} - Otorgando recursos`); // Log para la entrada del proceso
        currentResources -= difference; // Resta la diferencia de los recursos disponibles

        newLog.push(`🟢 Proceso ${id} - READY`); // Log cuando el proceso está "READY"
        newLog.push(`🔄 Proceso ${id} - Devolviendo recursos`); // Log para la salida del proceso

        // Devuelve recursos después de "Salir", incrementando con maxNeed del proceso
        currentResources += maxNeed;
        newLog.push(`Recursos disponibles: ${currentResources}`); // Log para los recursos disponibles actualizados
      } else {
        newLog.push(`🟡 Proceso ${id} - Esperando`); // Log si el proceso no puede entrar
      }
    });

    // Finaliza la simulación y actualiza el log
    newLog.push("✅ Todos los procesos han sido procesados.");
    setLog(newLog); // Actualiza el estado del log
    setAvailableResources(currentResources); // Actualiza los recursos disponibles al final
    setSimulationRunning(false); // Cambia el estado a simulación finalizada
  };

  return (
    <div className="App">
      <header>
        <h1>Algoritmo del Banquero - Prevención de Bloqueos</h1>
      </header>
      <main>
        {/* Botones para generar datos y empezar la simulación */}
        <div className="controls">
          <button onClick={generateData} disabled={simulationRunning}>
            Generar Datos
          </button>
          <button onClick={startSimulation} disabled={simulationRunning}>
            Empezar Prevención de Bloqueos
          </button>
        </div>

        {/* Tabla que muestra los procesos, recursos asignados, necesidad máxima y diferencia */}
        <h2>Tabla de Procesos</h2>
        <table>
          <thead>
            <tr>
              <th>Proceso</th>
              <th>Recursos Asignados</th>
              <th>Necesidad Máxima</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(proc => (
              <tr key={proc.id}>
                <td>{proc.id}</td>
                <td>{proc.assigned}</td>
                <td>{proc.maxNeed}</td>
                <td>{proc.maxNeed - proc.assigned}</td> {/* Diferencia calculada */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Log que muestra los estados de cada proceso durante la simulación */}
        <h2>Estado de Simulación</h2>
        <div className="log">
          {log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
