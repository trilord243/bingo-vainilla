window.onload = function () {
  let cartones = [];
  let jugadores = [];

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
    jugadores.forEach((jugador, index) => {
      const matriz = cartones[index].matriz;
      let puntos = 0;
      let cartonLleno = true;

      matriz.forEach((fila) => {
        const lineaCompleta = fila.every((celda) => celda.marcado);
        if (lineaCompleta) puntos += 1;
        cartonLleno = cartonLleno && lineaCompleta;
      });

      for (let columna = 0; columna < matriz[0].length; columna++) {
        let columnaCompleta = true;
        for (let fila = 0; fila < matriz.length; fila++) {
          if (!matriz[fila][columna].marcado) {
            columnaCompleta = false;
            break;
          }
        }
        if (columnaCompleta) puntos += 1;
      }

      let diagonalPrincipalCompleta = true;
      let diagonalSecundariaCompleta = true;
      for (let i = 0; i < matriz.length; i++) {
        if (!matriz[i][i].marcado) diagonalPrincipalCompleta = false;
        if (!matriz[i][matriz.length - 1 - i].marcado)
          diagonalSecundariaCompleta = false;
      }
      if (diagonalPrincipalCompleta) puntos += 3;
      if (diagonalSecundariaCompleta) puntos += 3;

      if (cartonLleno) puntos += 5;

      console.log(`Jugador ${index + 1} (${jugador}): ${puntos} puntos`);
    });
  }

  function mostrarNumeroAleatorio() {
    const numero = generarNumeroAleatorio();
    document.getElementById("numeroMostrado").textContent = numero;

    marcarNumeroEnCarton(numero);
    verificarPuntos();
  }

  controlesCarton.style.display = "none";
};
