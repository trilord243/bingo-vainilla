document.addEventListener(
  "DOMContentLoaded",
  function () {
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
      const areaJuego = document.getElementById("juego");
      if (!areaJuego) {
        console.error("El elemento con id 'juego' no existe.");
        return;
      }

      // Activa la pestaña correspondiente al cartón mostrado
      const tabs = document.querySelectorAll(".tab");
      tabs.forEach((tab) => tab.classList.remove("active"));
      tabs[index].classList.add("active");

      // Muestra el cartón correspondiente
      areaJuego.innerHTML = cartones[index];
    }

    function iniciarJuego(tamanoCarton, jugadores) {
      document.getElementById("configuracion").style.display = "none";
      document.getElementById("controlesCarton").style.display = "flex"; // Asegúrate de que el estilo flex esté en el CSS para controlesCarton

      // Genera el HTML para cada cartón y almacénalo en la matriz cartones
      cartones = jugadores.map(() => generarCarton(tamanoCarton));

      // Configura los botones de las pestañas con los nombres de los jugadores
      const tabs = document.querySelectorAll(".tab");
      tabs.forEach((tab, index) => {
        tab.textContent = jugadores[index];
        tab.onclick = () => mostrarCarton(index);
      });

      // Muestra el primer cartón al iniciar el juego
      mostrarCarton(0);
    }

    // Inicialmente, oculta los controles del cartón hasta que el juego comience
    document.getElementById("controlesCarton").style.display = "none";
  } // Add a closing curly brace here
);
