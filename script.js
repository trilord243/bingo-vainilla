window.onload = function () {
  let cartones = [];
  let jugadores = [];
  let puntajejugador = {};
  let contador = 0;

  const formularioInicial = document.getElementById("formularioInicial");
  const tamanoCartonSelect = document.getElementById("tamanoCarton");
  const controlesCarton = document.getElementById("controlesCarton");
  const areaJuego = document.getElementById("juego");
  const jugadorInputs = [
    document.getElementById("jugador1"),
    document.getElementById("jugador2"),
    document.getElementById("jugador3"),
    document.getElementById("jugador4"),
  ];

  formularioInicial.addEventListener("submit", function (event) {
    event.preventDefault();
    const tamanoCarton = parseInt(tamanoCartonSelect.value);
    jugadores = jugadorInputs.map((input) => input.value);
    iniciarJuego(tamanoCarton, jugadores);
  });
  const botonRegresar = document.getElementById("botonRegresar");
  botonRegresar.addEventListener("click", function () {
    window.location.reload();
  });
  function generarCarton(tamano, indexCarton) {
    const numerosUsados = new Set();
    let cartonHTML = `<div class="carton" data-tamano="${tamano}" data-index="${indexCarton}"><div class="grid-carton">`;
    let cartonMatriz = [];

    for (let i = 0; i < tamano; i++) {
      let fila = [];
      for (let j = 0; j < tamano; j++) {
        let numero;
        do {
          numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosUsados.has(numero));
        numerosUsados.add(numero);
        fila.push({ numero: numero, marcado: false });
        cartonHTML += `<div class="celda" data-numero="${numero}">${numero}</div>`;
      }
      cartonMatriz.push(fila);
    }
    cartonHTML += `</div></div>`;
    return { html: cartonHTML, matriz: cartonMatriz };
  }

  function mostrarCarton(index) {
    if (!areaJuego) {
      console.error("error");
      return;
    }

    const carton = cartones[index];
    let cartonHTML = `<div class="carton" data-tamano="${carton.matriz.length}" data-index="${index}"><div class="grid-carton">`;

    carton.matriz.forEach((fila) => {
      fila.forEach((celda) => {
        cartonHTML += `<div class="celda${
          celda.marcado ? " marcado" : ""
        }" data-numero="${celda.numero}">${celda.numero}</div>`;
      });
    });

    cartonHTML += `</div></div>`;
    areaJuego.innerHTML = cartonHTML;
    updateActiveTab(index);
  }

  function iniciarJuego(tamanoCarton, jugadores) {
    let cartonesHTML = [];
    let matricesCartones = [];
    const botonRegresar = document.getElementById("botonRegresar");
    botonRegresar.classList.remove("hidden");
    jugadores.forEach((jugador, index) => {
      let carton = generarCarton(tamanoCarton, index);
      cartonesHTML.push(carton.html);
      matricesCartones.push(carton.matriz);
    });

    cartones = cartonesHTML.map((html, index) => {
      return { html: html, matriz: matricesCartones[index] };
    });

    document.getElementById("configuracion").style.display = "none";
    controlesCarton.style.display = "flex";

    attachTabEventListeners();

    mostrarCarton(0);
    updateActiveTab(0);

    document.getElementById("numeroActual").style.display = "block";
    mostrarNumeroAleatorio();
  }

  function generarCarton(tamano, indexCarton) {
    const numerosUsados = new Set();
    let cartonHTML = `<div class="carton" data-tamano="${tamano}" data-index="${indexCarton}"><div class="grid-carton">`;
    let cartonMatriz = [];

    for (let i = 0; i < tamano; i++) {
      let fila = [];
      for (let j = 0; j < tamano; j++) {
        let numero;
        do {
          numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosUsados.has(numero));
        numerosUsados.add(numero);
        fila.push({ numero: numero, marcado: false });
        cartonHTML += `<div class="celda" data-numero="${numero}">${numero}</div>`;
      }
      cartonMatriz.push(fila);
    }
    cartonHTML += `</div></div>`;
    return { html: cartonHTML, matriz: cartonMatriz };
  }

  function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 50) + 1;
  }

  function mostrarNumeroAleatorio() {
    const numero = generarNumeroAleatorio();
    document.getElementById("numeroMostrado").textContent = numero;

    marcarNumeroEnCarton(numero);
  }

  document
    .getElementById("sacarNumero")
    .addEventListener("click", mostrarNumeroAleatorio);

  document.getElementById("numeroActual").style.display = "none";
  function updateActiveTab(index) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab, idx) => {
      tab.classList.toggle("active", idx === index);
    });
  }

  function attachTabEventListeners() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab, index) => {
      tab.textContent = jugadores[index];
      tab.addEventListener("click", () => {
        mostrarCarton(index);
        updateActiveTab(index);
      });
    });
  }
  function marcarNumeroEnCarton(numero) {
    cartones.forEach((carton, indexCarton) => {
      carton.matriz.forEach((fila, indexFila) => {
        fila.forEach((celda, indexCelda) => {
          if (celda.numero === numero && !celda.marcado) {
            celda.marcado = true;
          }
        });
      });
    });

    const celdas = document.querySelectorAll(`.celda[data-numero="${numero}"]`);
    celdas.forEach((celda) => {
      celda.classList.add("marcado");
    });
  }

  function verificarPuntos() {
    let puntajesHTML = "";
    contador++;

    jugadores.forEach((jugador, index) => {
      const matriz = cartones[index].matriz;
      let puntos = 0;
      let cartonLleno = true;

      // Verificación de líneas horizontales y cartón lleno
      matriz.forEach((fila) => {
        if (fila.every((celda) => celda.marcado)) puntos++;
        cartonLleno = cartonLleno && fila.every((celda) => celda.marcado);
      });

      // Verificación de líneas verticales
      for (let i = 0; i < matriz.length; i++) {
        if (matriz.map((fila) => fila[i]).every((celda) => celda.marcado))
          puntos++;
      }

      // Verificación de diagonales
      let diagonalPrincipalCompleta = matriz.every(
        (fila, i) => fila[i].marcado
      );
      let diagonalSecundariaCompleta = matriz.every(
        (fila, i) => fila[matriz.length - 1 - i].marcado
      );

      if (diagonalPrincipalCompleta) puntos += 3;
      if (diagonalSecundariaCompleta) puntos += 3;

      if (cartonLleno) puntos += 5;

      // Acumular los puntajes en HTML
      puntajesHTML += `<p><em class='blue1'>${jugador}</em>: ${puntos} puntos</p>`;

      puntajejugador[jugador] = puntos;

      if (contador === 25) {
        const ganador = encontrarGanador(puntajejugador);
        guardarLeaderBoard(puntajejugador);
        mostrarGanador(ganador);
      }

      if (matriz.length === 3) {
        mostrarGanor(puntajejugador, 17);
      } else if (matriz.length === 4) {
        mostrarGanor(puntajejugador, 19);
      } else if (matriz.length === 5) {
        mostrarGanor(puntajejugador, 21);
      }
    });

    // Actualizar el DOM con los puntajes
    const puntajesDiv = document.getElementById("puntajes");
    puntajesDiv.innerHTML = puntajesHTML;
  }

  function mostrarGanor(puntajejugador, matrix) {
    for (const [key, value] of Object.entries(puntajejugador)) {
      if (value === matrix) {
        mostrarGanador(key);
        guardarLeaderBoard(puntajejugador);
      }
    }
  }

  function guardarLeaderBoard(objeto) {
    localStorage.clear();
    const leaderBoard = JSON.stringify(objeto);
    localStorage.setItem("leaderBoard", leaderBoard);
  }

  function mostrarNumeroAleatorio() {
    const numero = generarNumeroAleatorio();
    document.getElementById("numeroMostrado").textContent = numero;

    marcarNumeroEnCarton(numero);
    verificarPuntos();
  }

  controlesCarton.style.display = "none";
  mostrarPuntajes();
};

function mostrarPuntajes() {
  const divPuntajes = document.getElementById("puntajes");
  const puntajesGuardados = localStorage.getItem("leaderBoard");

  // Título por defecto para la tabla de puntajes
  let tituloTabla = "<h2>Tabla de Puntuaciones</h2>";

  if (puntajesGuardados) {
    // Convertir la cadena de localStorage a un objeto
    const puntajes = JSON.parse(puntajesGuardados);

    // Crear el HTML para los puntajes
    const listaPuntajes = Object.entries(puntajes)
      .map(([jugador, puntaje]) => `<p>${jugador}: ${puntaje} puntos</p>`)
      .join("");

    // Actualizar el DOM con los puntajes
    divPuntajes.innerHTML = tituloTabla + listaPuntajes;
  } else {
    // Mostrar el título y un mensaje indicando que no hay puntajes guardados
    divPuntajes.innerHTML =
      tituloTabla + "<p>No hay puntuaciones anteriores.</p>";
  }
}

function encontrarGanador(puntajes) {
  let maxPuntaje = -Infinity;
  let ganadores = [];

  Object.entries(puntajes).forEach(([jugador, puntaje]) => {
    if (puntaje > maxPuntaje) {
      maxPuntaje = puntaje;
      ganadores = [jugador];
    } else if (puntaje === maxPuntaje) {
      ganadores.push(jugador);
    }
  });

  // Si hay múltiples ganadores, devuelva el array de nombres
  return ganadores.length === 1 ? ganadores[0] : ganadores;
}
function mostrarGanador(nombreJugador) {
  // Esconder "Número Actual"
  document.getElementById("numeroActual").style.display = "none";

  // Actualizar el contenido del modal con el nombre del ganador
  const mensajeGanador = document.getElementById("mensajeGanador");
  mensajeGanador.textContent = `¡Felicidades ${nombreJugador}! ganaste`;

  // Mostrar el modal
  const modalGanador = document.getElementById("modalGanador");
  modalGanador.style.display = "block"; // or "flex" if you want to use flexbox alignment

  // Reiniciar el juego al hacer click en "Iniciar juego"
  const botonReiniciar = document.getElementById("botonReiniciar");
  botonReiniciar.onclick = function () {
    window.location.reload(); // Esto recargará la página
  };
}
document.getElementById("toggleSonido").addEventListener("click", function () {
  var audio = document.getElementById("miAudio");
  var gif = document.getElementById("gifTrompeta"); // Obtiene el GIF

  if (audio.paused) {
    audio.play();
    gif.style.display = "block";
    this.textContent = "🔇 Mute";
  } else {
    audio.pause();
    gif.style.display = "none";
    this.textContent = "🔊 Habilitar Sonido";
  }
});
