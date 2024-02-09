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
    let cartonMatriz = []; // Nueva matriz para almacenar los números

    for (let i = 0; i < tamano; i++) {
      let fila = [];
      for (let j = 0; j < tamano; j++) {
        let numero;
        do {
          numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosUsados.has(numero));
        numerosUsados.add(numero);
        fila.push({ numero: numero, marcado: false }); // Guarda el número y si está marcado
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

    areaJuego.innerHTML = cartones[index].html;
    updateActiveTab(index);
  }

  function iniciarJuego(tamanoCarton, jugadores) {
    let cartonesHTML = [];
    let matricesCartones = [];

    // Generar cartón para cada jugador con un índice único
    jugadores.forEach((jugador, index) => {
      let carton = generarCarton(tamanoCarton, index);
      cartonesHTML.push(carton.html);
      matricesCartones.push(carton.matriz);
    });

    // Construir la estructura de datos completa de los cartones que incluye el HTML y la matriz
    cartones = cartonesHTML.map((html, index) => {
      return { html: html, matriz: matricesCartones[index] };
    });

    // Ocultar la configuración inicial y mostrar los controles del cartón
    document.getElementById("configuracion").style.display = "none";
    controlesCarton.style.display = "flex";

    // Adjuntar event listeners a los tabs de los jugadores
    attachTabEventListeners();
    // Mostrar el primer cartón y establecer el tab activo
    mostrarCarton(0);
    updateActiveTab(0);
    // Mostrar la sección del número actual
    document.getElementById("numeroActual").style.display = "block";
  }

  // La función 'generarCarton' modificada para aceptar 'indexCarton'
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
        fila.push({ numero: numero, marcado: false }); // Guarda el número y si está marcado
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
    // Itera sobre cada cartón y cada número en la matriz del cartón
    cartones.forEach((carton, indexCarton) => {
      carton.matriz.forEach((fila, indexFila) => {
        fila.forEach((celda, indexCelda) => {
          // Si el número coincide y no ha sido marcado
          if (celda.numero === numero && !celda.marcado) {
            // Marca el número como marcado
            celda.marcado = true;
            // Encuentra la celda correspondiente en el HTML y actualiza su estilo
            const celdaHTML = document.querySelector(
              `.carton[data-index="${indexCarton}"] .celda[data-numero="${numero}"]`
            );
            if (celdaHTML) {
              celdaHTML.classList.add("marcado"); // Asegúrate de definir el estilo 'marcado' en tu CSS
            }
          }
        });
      });
    });
  }

  function mostrarNumeroAleatorio() {
    const numero = generarNumeroAleatorio();
    document.getElementById("numeroMostrado").textContent = numero;
    // Marcar el número en los cartones
    marcarNumeroEnCarton(numero);
  }

  console.log("hola");
  controlesCarton.style.display = "none";
};
