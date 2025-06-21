let usuario = "";
let tarea = "";
let stream;
let historial = [];

// Cargar historial desde localStorage al inicio
window.onload = () => {
  const datosGuardados = localStorage.getItem("ecoHistorial");
  if (datosGuardados) {
    historial = JSON.parse(datosGuardados);
  }
  mostrarPantalla('pantallaNombre');
};

function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');

  if (id === 'pantallaHistorial') {
    mostrarHistorial();
  }
}

function guardarNombre() {
  const nombre = document.getElementById('inputNombre').value.trim();
  if (nombre !== "") {
    usuario = nombre;
    document.getElementById('nombreUsuario').textContent = "Hola, " + usuario;
    mostrarPantalla('pantallaMenu');
  }
}

function seleccionarTarea(nombreTarea) {
  tarea = nombreTarea;
  document.getElementById('tituloTarea').textContent = `Tarea: ${tarea}`;
  mostrarPantalla('pantallaCamara');
  iniciarCamara();
}

function iniciarCamara() {
  const video = document.getElementById('video');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
    })
    .catch(err => alert('No se pudo acceder a la cámara: ' + err));
}

function capturar() {
  const canvas = document.getElementById('canvas');
  const video = document.getElementById('video');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  const dataURL = canvas.toDataURL('image/png');

  // Mostrar evidencia actual
  document.getElementById('imagenEvidencia').src = dataURL;
  document.getElementById('descTarea').textContent = `${usuario} realizó la tarea: ${tarea}`;

  // Guardar en historial y en localStorage
  historial.push({
    tarea: tarea,
    imagen: dataURL
  });
  guardarHistorial();

  mostrarPantalla('pantallaEvidencia');
  detenerCamara();
}

function guardarHistorial() {
  localStorage.setItem("ecoHistorial", JSON.stringify(historial));
}

function detenerCamara() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

function mostrarHistorial() {
  const contenedor = document.getElementById('historialFotos');
  contenedor.innerHTML = "";
  if (historial.length === 0) {
    contenedor.innerHTML = '<p>No hay tareas guardadas aún.</p>';
  } else {
    historial.forEach((item, index) => {
      const div = document.createElement('div');
      div.style.marginBottom = '20px';
      div.style.border = '1px solid #ccc';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.innerHTML = `
        <p><strong>${item.tarea}</strong></p>
        <img src="${item.imagen}" class="imagenGuardada">
        <br>
        <button onclick="borrarTarea(${index})" class="boton" style="background-color:#e74c3c; margin-top:8px;">Borrar</button>
      `;
      contenedor.appendChild(div);
    });
  }
}

function borrarTarea(indice) {
  historial.splice(indice, 1);
  guardarHistorial();
  mostrarHistorial();
}