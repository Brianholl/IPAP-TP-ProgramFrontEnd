// ==========================================================
// Calculadora de Gastos Personales - Mis Gastos
// Integrantes: Yanina Elizabeth Ovejero y Brian Iván Hollweg
// Materia: Programación Frontend - IPAP (2026)
// Archivo: js/app.js
// ==========================================================

// Arreglo principal donde guardamos todos los objetos de gastos
let gastos = [];

// 1. Selección de elementos del DOM con getElementById
const formGasto = document.getElementById('form-gasto');
const inputConcepto = document.getElementById('concepto');
const selectCategoria = document.getElementById('categoria');
const inputMonto = document.getElementById('monto');
const mensajeError = document.getElementById('mensaje-error');
const listaGastos = document.getElementById('lista-gastos');
const sinGastos = document.getElementById('sin-gastos');
const totalElemento = document.getElementById('total');
const btnBorrarTodo = document.getElementById('borrar-todo');

// Funciones para almacenamiento local (localStorage)

// Guarda el arreglo de gastos convertido en texto JSON
function guardarGastos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

// Lee los datos guardados al iniciar y los pasa de JSON a arreglo
function cargarGastos() {
  try {
    const datos = localStorage.getItem('gastos');
    if (datos !== null) {
      gastos = JSON.parse(datos);
      // Verificamos que lo que recuperamos sea efectivamente un arreglo
      if (!Array.isArray(gastos)) {
        gastos = [];
      }
    } else {
      gastos = [];
    }
  } catch (error) {
    console.error('Error al leer datos desde localStorage:', error);
    gastos = [];
  }
}

//Función para calcular el total acumulado
function calcularTotal() {
  let suma = 0;
  for (let i = 0; i < gastos.length; i++) {
    suma = suma + gastos[i].monto;
  }
  return suma;
}

// Función para renderizar / mostrar los gastos en la tabla
function mostrarGastos() {
  // Vaciamos las filas actuales del tbody
  listaGastos.innerHTML = '';

  // Mostramos u ocultamos el mensaje de "sin gastos"
  if (gastos.length === 0) {
    sinGastos.style.display = 'block';
  } else {
    sinGastos.style.display = 'none';
  }

  // Recorremos el arreglo de gastos con un bucle for tradicional
  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];

    // Creamos la fila (tr)
    const fila = document.createElement('tr');

    // Celda de Concepto (usamos textContent por seguridad)
    const celdaConcepto = document.createElement('td');
    celdaConcepto.textContent = gasto.concepto;

    // Celda de Categoría
    const celdaCategoria = document.createElement('td');
    celdaCategoria.textContent = gasto.categoria;

    // Celda de Monto
    const celdaMonto = document.createElement('td');
    celdaMonto.textContent = '$' + gasto.monto.toFixed(2);

    // Celda de Acción con el botón de eliminar
    const celdaAccion = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.type = 'button';

    // Evento de clic para eliminar este gasto puntual
    btnEliminar.addEventListener('click', function() {
      eliminarGasto(gasto.id);
    });

    celdaAccion.appendChild(btnEliminar);

    // Agregamos todas las celdas a la fila
    fila.appendChild(celdaConcepto);
    fila.appendChild(celdaCategoria);
    fila.appendChild(celdaMonto);
    fila.appendChild(celdaAccion);

    // Insertamos la fila en el tbody
    listaGastos.appendChild(fila);
  }

  // Actualizamos el monto total en la pantalla
  const total = calcularTotal();
  totalElemento.textContent = '$' + total.toFixed(2);
}

// Función para eliminar un gasto individual por su ID
function eliminarGasto(idAEliminar) {
  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].id === idAEliminar) {
      gastos.splice(i, 1);
      break;
    }
  }
  guardarGastos();
  mostrarGastos();
}

//Evento submit del formulario para agregar un gasto
formGasto.addEventListener('submit', function(evento) {
  // Evitamos que la página se recargue
  evento.preventDefault();

  const concepto = inputConcepto.value.trim();
  const categoria = selectCategoria.value;
  const montoTexto = inputMonto.value;
  const monto = parseFloat(montoTexto);

  // Validación: concepto no vacío y al menos 3 letras
  if (concepto === '' || concepto.length < 3) {
    mensajeError.textContent = 'El concepto debe tener al menos 3 caracteres.';
    inputConcepto.focus();
    return;
  }

  // Validación: categoría elegida
  if (categoria === '') {
    mensajeError.textContent = 'Por favor, seleccioná una categoría.';
    selectCategoria.focus();
    return;
  }

  // Validación: monto numérico mayor a 0
  if (isNaN(monto) || monto <= 0) {
    mensajeError.textContent = 'El monto debe ser un número mayor a 0.';
    inputMonto.focus();
    return;
  }

  // Si todas las validaciones pasan, borramos el mensaje de error
  mensajeError.textContent = '';

  // Creamos el nuevo objeto con identificador único basado en tiempo
  const nuevoGasto = {
    id: Date.now(),
    concepto: concepto,
    categoria: categoria,
    monto: monto
  };

  // Agregamos el gasto al arreglo
  gastos.push(nuevoGasto);

  // Guardamos en localStorage y refrescamos la tabla
  guardarGastos();
  mostrarGastos();

  // Limpiamos los campos del formulario
  formGasto.reset();
});

// eventos input para borrar el mensaje de error mientras el usuario corrige
inputConcepto.addEventListener('input', function() {
  mensajeError.textContent = '';
});

inputMonto.addEventListener('input', function() {
  mensajeError.textContent = '';
});

selectCategoria.addEventListener('change', function() {
  mensajeError.textContent = '';
});

// Evento del botón para borrar todos los gastos
btnBorrarTodo.addEventListener('click', function() {
  // Si no hay gastos cargados, no hace falta preguntar
  if (gastos.length === 0) {
    return;
  }

  const confirmacion = confirm('¿Seguro que querés borrar todos los gastos?');
  if (confirmacion) {
    gastos = [];
    guardarGastos();
    mostrarGastos();
  }
});

//Inicialización de la aplicación al cargar el script
cargarGastos();
mostrarGastos();
