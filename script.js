//Captura loos nombres qlq del formularop
document
  .getElementById("formularioInicial")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capturar el tamaño del cartón y los nombres de los jugadores
    const tamanoCarton = parseInt(
      document.getElementById("tamanoCarton").value
    );
    const jugadores = [
      document.getElementById("jugador1").value,
      document.getElementById("jugador2").value,
      document.getElementById("jugador3").value,
      document.getElementById("jugador4").value,
    ];

    iniciarJuego(tamanoCarton, jugadores);
  });

//generar los cartones

function generarCarton(tamano) {
  const numerosUsados = new Set();
  const carton = [];
  for (let i = 0; i < tamano; i++) {
    const fila = [];
    for (let j = 0; j < tamano; j++) {
      let numero;
      do {
        numero = Math.floor(Math.random() * 50) + 1;
      } while (numerosUsados.has(numero));
      numerosUsados.add(numero);
      fila.push(numero);
    }
    carton.push(fila);
  }
  return carton;
}

//Mostrarlo en el juego

function iniciarJuego(tamanoCarton, jugadores) {
  document.getElementById("configuracion").style.display = "none";
  const areaJuego = document.getElementById("juego");
  areaJuego.innerHTML = ""; // Limpiar el área de juego
  areaJuego.style.display = "flex";

  jugadores.forEach((jugador) => {
    const carton = generarCarton(tamanoCarton);
    const contenedorCarton = document.createElement("div");
    contenedorCarton.classList.add("carton");
    contenedorCarton.setAttribute("data-tamano", tamanoCarton);
    let htmlCarton = `<h3>${jugador}</h3><div class="grid-carton">`;

    carton.forEach((fila) => {
      fila.forEach((numero) => {
        htmlCarton += `<div class="celda">${numero}</div>`;
      });
    });

    htmlCarton += `</div>`;
    contenedorCarton.innerHTML = htmlCarton;
    areaJuego.appendChild(contenedorCarton);
  });
}
