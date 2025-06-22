function iniciarCamara() {
  const video = document.getElementById('video');
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } }  // 🟢 pide la cámara trasera
  })
  .then(s => {
    stream = s;
    video.srcObject = stream;
  })
  .catch(err => {
    // 🔴 Si la trasera no está disponible, usa cualquier cámara como respaldo
    console.warn("Cámara trasera no disponible, usando la predeterminada.");
    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
      stream = s;
      video.srcObject = stream;
    }).catch(() => {
      alert("No se pudo acceder a ninguna cámara.");
    });
  });
}
