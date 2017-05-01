//inicializando variables
let index = 0
let turno = 1
let turnos = 9
let alguienGano = false
let nuevoJuego = false

//trayendo variables del DOM
let espacios = document.getElementsByName("1")
let jugador = document.getElementsByName("jugador")
let jugador1 = document.getElementById("player1")
let jugador2 = document.getElementById("player2")

//seleccion del modo de juego, solo se ejecuta una vez por recarga de pagina
swal({
  title: 'Modo de Juego',
  text: 'Seleccione el modo de juego que desea',
  confirmButtonText: 'Un jugador',
  showCancelButton: true,
  cancelButtonText: "Dos jugadores",
  //Modo juego = 0 Un jugador
  //Modo juego = 1 Dos jugador
}).then(() => modoJuego = 0, () => {
  modoJuego = 1
  jugador.forEach((uno) => {
    uno.innerHTML = "turno"
    if (turno) {
      jugador1.innerHTML = "x"
    } else {
      jugador2.innerHTML = "o"
    }
  })
}).catch(swal.noop)

//les añade escuchadores a todas los elementos de clase "pieza" del html
espacios.forEach(function muestrador(i) {
  i.id = index
  i.addEventListener("click", pintar)
  index += 1
})

function pintar(ev) {
  let elemento = ev.srcElement
  let puesto = ev.srcElement.id //se obtiene el id del elemento al que se dio click
  if (modoJuego) {
    dosJugadores(puesto, elemento)
  } else {
    unJugador(puesto, elemento)
  }
}

//Dos jugadores----------------------------------------------------------
function dosJugadores(puesto, elemento) {
  if (turno) {
    jugador1.innerHTML = ""
    jugador2.innerHTML = "o"
    espacios[puesto].innerHTML = "x"
    turno = !turno
    elemento.removeEventListener("click", pintar)
    if (turnos <= 5) {
      alguienGanoFilas(0, "x", 2)
      alguienGanoColumnas(0, "x", 2)
      alguienGanoCruzado("x")
      alguienGanoCruzado2("x")
    }
    turnos -= 1
    if (turnos == 0) {
      setTimeout(function() {
        jugarNuevo()
      }, 750)
    }
  } else {
    jugador1.innerHTML = "x"
    jugador2.innerHTML = ""
    espacios[puesto].innerHTML = "o"
    turno = !turno
    elemento.removeEventListener("click", pintar)
    if (turnos <= 5) {
      alguienGanoFilas(0, "o", 2)
      alguienGanoColumnas(0, "o", 2)
      alguienGanoCruzado("o")
      alguienGanoCruzado2("o")
    }
    turnos -= 1
    if (turnos == 0) {
      setTimeout(function() {
        jugarNuevo()
      }, 750)
    }
  }
}
//--------------------------------------------------------------------------

//Un jugador---------------------------------------------------------------
function unJugador(puesto, elemento) {
  if (turnos) {
    if (espacios[puesto].innerHTML) { //comprueba si el puesto esta ocupado
      elemento.removeEventListener("click", pintar)
      turnos -= 1
    } else {
      espacios[puesto].innerHTML = "x"
      elemento.removeEventListener("click", pintar)
      if (turnos <= 5) {
        alguienGanoFilas(0, "x", 2)
        alguienGanoColumnas(0, "x", 2)
        alguienGanoCruzado("x")
        alguienGanoCruzado2("x")
      }
      turnos -= 1
      setTimeout(() => turnoMaquina(elemento), 250)
    }
  } else {
    setTimeout(function() {
      jugarNuevo()
    }, 750)
  }
}

function turnoMaquina(elemento) {
  if (!alguienGano) {
    if (turnos) {
      const puesto = () => Math.round(Math.random() * (8))
      indice = puesto()
      if (espacios[indice].innerHTML) {
        turnoMaquina(elemento)
      } else {
        espacios[indice].innerHTML = "o"
        elemento.removeEventListener("clic", pintar)
        if (turnos <= 5) {
          alguienGanoFilas(0, "o", 2)
          alguienGanoColumnas(0, "o", 2)
          alguienGanoCruzado("o")
          alguienGanoCruzado2("o")
        }
        turnos -= 1
      }
    } else {
      setTimeout(function() {
        jugarNuevo()
      }, 750)
    }
  }
}
//----------------------------------------------------------

//Funciones para cambiar o comprobar estados
function jugarNuevo() {
  swal({
    title: 'Fin del Juego',
    text: '¿Desea jugar de nuevo?',
    confirmButtonText: 'Si!!',
    showCancelButton: true,
    cancelButtonText: "No"
  }).then(function restaurador() {
    espacios.forEach(function muestrador(i) {
      i.addEventListener("click", pintar)
      i.innerHTML = ""
    })
    turnos = 9
    if (!modoJuego) {
      alguienGano = false
      nuevoJuego = !nuevoJuego
      if (nuevoJuego) {
        setTimeout(() => turnoMaquina(), 250)
      }

    }
  }, function(dismiss) {
    if (dismiss == 'cancel') {
      swal({
        title: "Adios!",
        text: "Gracias por jugar",
        timer: 1500,
        showConfirmButton: false
      }).catch(swal.noop)
    }
  })
}

function alguienGanoFilas(i, es, filas) {
  if (espacios[i].innerHTML == es && espacios[i + 1].innerHTML == es && espacios[i + 2].innerHTML == es) {
    alguienGano = true
    swal({
      title: "Gano " + es + " !!",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {}, function(dismiss) {
      if (dismiss === "timer" || dismiss === "overlay") {
        jugarNuevo()
      }
    }).catch(swal.noop)
  } else if (filas > 0) {
    filas--
    alguienGanoFilas(i + 3, es, filas)
  }
}

function alguienGanoColumnas(i, es, columnas) {
  if (espacios[i].innerHTML == es && espacios[i + 3].innerHTML == es && espacios[i + 6].innerHTML == es) {
    alguienGano = true
    swal({
      title: "Gano " + es + " !!",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {}, function(dismiss) {
      if (dismiss === "timer" || dismiss === "overlay") {
        jugarNuevo()
      }
    }).catch(swal.noop)
  } else if (columnas > 0) {
    columnas--
    alguienGanoColumnas(i + 1, es, columnas)
  }
}

function alguienGanoCruzado(es) {
  if (espacios[0].innerHTML == es && espacios[4].innerHTML == es && espacios[8].innerHTML == es) {
    alguienGano = true
    swal({
      title: "Gano " + es + " !!",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {}, function(dismiss) {
      if (dismiss === "timer" || dismiss === "overlay") {
        jugarNuevo()
      }
    }).catch(swal.noop)
  }
}

function alguienGanoCruzado2(es) {
  if (espacios[2].innerHTML == es && espacios[4].innerHTML == es && espacios[6].innerHTML == es) {
    alguienGano = true
    swal({
      title: "Gano " + es + " !!",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {}, function(dismiss) {
      if (dismiss === "timer" || dismiss === "overlay") {
        jugarNuevo()
      }
    }).catch(swal.noop)
  }
}
