document.addEventListener("DOMContentLoaded", function () {
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

  function generarCarton(tamano) {
    const numerosUsados = new Set();
    let cartonHTML = `<div class="carton" data-tamano="${tamano}"><div class="grid-carton">`;

    for (let i = 0; i < tamano; i++) {
      for (let j = 0; j < tamano; j++) {
        let numero;
        do {
          numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosUsados.has(numero));
        numerosUsados.add(numero);
        cartonHTML += `<div class="celda">${numero}</div>`;
      }
    }
    cartonHTML += `</div></div>`;
    return cartonHTML;
  }

  function mostrarCarton(index) {
    if (!areaJuego) {
      console.error("El elemento con id 'juego' no existe.");
      return;
    }
    areaJuego.innerHTML = cartones[index];
    updateActiveTab(index);
  }

  function iniciarJuego(tamanoCarton, jugadores) {
    document.getElementById("configuracion").style.display = "none";
    controlesCarton.style.display = "flex";
    cartones = jugadores.map(() => generarCarton(tamanoCarton));
    attachTabEventListeners();
    mostrarCarton(0);
    updateActiveTab(0);
  }

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

  controlesCarton.style.display = "none";
});
