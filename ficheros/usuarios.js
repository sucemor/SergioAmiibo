async function iniciarSesion() {
  const url = "http://localhost:3000/usuarios"; // Ajusta la URL según tu configuración de json-server

  let contenedorNombre = document.getElementById("nombreSesion");
  let name = contenedorNombre.value;
  let contenedorContasena = document.getElementById("contrasenaSesion");
  let contra = contenedorContasena.value;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const datos = await response.json();
      const usuarioAutenticado = datos.find(
        (usuario) => usuario.usuario === name && usuario.contrasena === contra
      );
      if (usuarioAutenticado) {
        alert("Verificado");
        // Redirige a la página de inicio después de la autenticación exitosa
        window.location.href = "../paginas/inicio.html";
      } else {
        alert("Usuario no encontrado o contraseña incorrecta.");
      }
    } else {
        alert("Error al obtener los usuarios");
      console.error(
        "Error al obtener usuarios:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    alert("Error en la red");
    console.error("Error de red:", error);
  }
}
