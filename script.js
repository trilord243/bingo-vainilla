document.addEventListener("DOMContentLoaded", function () {
  let cartones = [];
  let jugadores = [];

  document
    .getElementById("formularioInicial")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const tamanoCarton = parseInt(
        document.getElementById("tamanoCarton").value
      );
      jugadores = [
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
  function mostrarCarton(index) {
    const areaJuego = document.getElementById("juego");
    if (!areaJuego) {
      console.error("El elemento con id 'juego' no existe.");
      return;
    }
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabs[index].classList.add("active");
    let htmlCarton = `<div class="grid-carton">`;
    cartones[index].forEach((fila) => {
      fila.forEach((numero) => {
        htmlCarton += `<div class="celda">${numero}</div>`;
      });
    });
    htmlCarton += `</div>`;
    areaJuego.innerHTML = htmlCarton;
  }

  function iniciarJuego(tamanoCarton, jugadores) {
    document.getElementById("configuracion").style.display = "none";
    document.getElementById("controlesCarton").style.display = "block";
    cartones = jugadores.map(() => generarCarton(tamanoCarton));
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab, index) => {
      tab.textContent = jugadores[index];
      tab.onclick = () => mostrarCarton(index);
    });
    mostrarCarton(0);
  }

  document.getElementById("controlesCarton").style.display = "none";
});
