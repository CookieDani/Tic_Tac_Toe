//inicializando variables
let index = 0
let turno = 1
let turnos = 9
let alguienGano = false
let nuevoJuego = false
let encontrado = false

//trayendo variables del DOM
//son los espacios dentro del tablero se puso el nombre de 1 sin ninguna razon
let espacios = document.getElementsByName("1")

let jugador = document.getElementsByName("jugador")
//Es el span dentro de jugador para mostrarle al usuario el turno de quien le toca
let jugador1 = document.getElementById("player1")
let jugador2 = document.getElementById("player2")

//seleccion del modo de juego, solo se ejecuta una vez por recarga de pagina
//swal es una funcion de la libreria sweetalert2
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
    uno.innerHTML = "turno" //rellena los div con la palabra turno
    if (turno) {
      jugador1.innerHTML = "x" //dependiendo del turno llena el span con un "x" o con un "o"
    } else {
      jugador2.innerHTML = "o"
    }
  })
}).catch(swal.noop) //manejando errores del swal usando la forma mas facil que dice en la pagina oficial

//les añade escuchadores a todas los elementos de clase "pieza" del html
espacios.forEach(function muestrador(i) {
  i.id = index
  i.addEventListener("click", pintar)
  index += 1
})

//Funcion que se llama cuando se toca en los espacion dentro de la tabla
//llama a una funcion o a otra dependiendo del modo de juego que selecciono el usuario
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
      //prueba si alguienGano
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

function turnoMaquina() {
  //se ejecuta solo si alguien no Gano
  //este parametro es modificado dentro de las funciones
  //que comprueban si alguien gano
  if (!alguienGano) {
    if (turnos) {
      if (turnos >= 7) {
        numeroAleatorio()
      } else {
        //Comprobando para colocar un "o" cuando esten dos espacios juntos con la misma letra
        //Las O
        comprobadorDeEspacioHori1("o", 0, 2)
        comprobadorDeEspacioHori2("o", 1, 2)
        comprobadorDeEspacioVerti1("o", 0, 2)
        comprobadorDeEspacioVerti2("o", 3, 2)
        comprobadorDeEspacioHoriSalta("o", 0, 2)
        comprobadorDeEspacioVertiSalta("o", 0, 2)
        comprobadorDeEspacioCruza("o")
        comprobadorDeEspacioCruza2("o")
        comprobadorDeEspacioCruzaSalta("o")

        //Las x
        comprobadorDeEspacioHori1("x", 0, 2)
        comprobadorDeEspacioHori2("x", 1, 2)
        comprobadorDeEspacioVerti1("x", 0, 2)
        comprobadorDeEspacioVerti2("x", 3, 2)
        comprobadorDeEspacioHoriSalta("x", 0, 2)
        comprobadorDeEspacioVertiSalta("x", 0, 2)
        comprobadorDeEspacioCruza("x")
        comprobadorDeEspacioCruza2("x")
        comprobadorDeEspacioCruzaSalta("x")


        if (!encontrado) {
          numeroAleatorio()
        }
        encontrado = false
      }
      turnos -= 1
      //Comprobando si alguien gano
      if (turnos <= 5) {
        alguienGanoFilas(0, "o", 2)
        alguienGanoColumnas(0, "o", 2)
        alguienGanoCruzado("o")
        alguienGanoCruzado2("o")
      }
      if (turnos == 0) {
        setTimeout(function() {
          jugarNuevo()
        }, 750)
      }
    } else {
      setTimeout(function() {
        jugarNuevo()
      }, 750)
    }
  }
}

//Inteligencia para el programa

//comprobadorDeEspacioHori("x", 0, 2)
//comprobadorDeEspacioVerti("x", 0, 2)
function numeroAleatorio() {
  indice = Math.round(Math.random() * (8))
  if (espacios[indice].innerHTML) {
    numeroAleatorio()
  } else {
    espacios[indice].innerHTML = "o"
    espacios[indice].removeEventListener("click", pintar)
  }
}
//**NOTA: los i de cada funcion estan con el valor que deberian
//ser llamados inicialmente o sino fallarian las funciones**

//Horizontales**************************************************
function comprobadorDeEspacioHori1(es, i = 0, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 1].innerHTML == es && !(espacios[i + 2].innerHTML)) {
      espacios[i + 2].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioHori1(es, i + 3, pruebas - 1)
      }
    }
  }
}

function comprobadorDeEspacioHori2(es, i = 1, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 1].innerHTML == es && !(espacios[i - 1].innerHTML)) {
      espacios[i - 1].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioHori2(es, i + 3, pruebas - 1)
      }
    }
  }
}

//Verticales**********************************************************
function comprobadorDeEspacioVerti1(es, i = 0, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 3].innerHTML == es && !(espacios[i + 6].innerHTML)) {
      espacios[i + 6].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioVerti1(es, i + 1, pruebas - 1)
      }
    }
  }

}

function comprobadorDeEspacioVerti2(es, i = 3, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 3].innerHTML == es && !(espacios[i - 3].innerHTML)) {
      espacios[i - 3].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioVerti2(es, i + 1, pruebas - 1)
      }
    }
  }
}

//Saltados**************************************************
function comprobadorDeEspacioHoriSalta(es, i = 0, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 2].innerHTML == es && !(espacios[i + 1].innerHTML)) {
      espacios[i + 1].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioVerti2(es, i + 3, pruebas - 1)
      }
    }
  }
}

function comprobadorDeEspacioVertiSalta(es, i = 0, pruebas) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[i + 6].innerHTML == es && !(espacios[i + 3].innerHTML)) {
      espacios[i + 3].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioVertiSalta(es, i + 1, pruebas - 1)
      }
    }
  }
}
//Cruzados**************************************************
//NOTA: en estas funciones el valor de i y de b que deberian ser estan
//puestos en la funcion
function comprobadorDeEspacioCruza(es, i = 0, b = 8, pruebas = 1) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[4].innerHTML == es && !(espacios[b].innerHTML)) {
      espacios[b].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioCruza(es, 2, 6, pruebas - 1)
      }
    }
  }
}

function comprobadorDeEspacioCruza2(es, i = 8, b = 0, pruebas = 1) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[4].innerHTML == es && !(espacios[b].innerHTML)) {
      espacios[b].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioCruza2(es, 6, 2, pruebas - 1)
      }
    }
  }
}

function comprobadorDeEspacioCruzaSalta(es, i = 0, b = 8, pruebas = 1) {
  if (encontrado) {
    //do nothing
  } else {
    if (espacios[i].innerHTML == es && espacios[b].innerHTML == es && !(espacios[4].innerHTML)) {
      espacios[4].innerHTML = "o"
      encontrado = true
    } else {
      if (pruebas) {
        comprobadorDeEspacioCruzaSalta(es, 2, 6, pruebas - 1)
      }
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


//Las siguientes funciones prueban si alguien Gano
//analizan fila por fila o columna por columna si todos los innerHTML son iguales
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
    alguienGanoFilas(i + 3, es, filas) //Es una funcion recursiva vuelve a llamar a la misma funcion cambiando
    //el valor de i mientras filas sea mayor que cero
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
