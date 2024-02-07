function iniciarSesion() {
  const url = "http://localhost:3000/usuarios"; // Ajusta la URL según tu configuración de json-server

  let contenedorNombre = document.getElementById("nombreSesion");
  let name = contenedorNombre.value;
  name = name.toLowerCase();
  let contenedorContasena = document.getElementById("contrasenaSesion");
  let contra = contenedorContasena.value;
  contra = contra.toLowerCase();

  fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los usuarios");
      }
    })
    .then(function(datos) {
      const usuarioAutenticado = datos.find(
        function(usuario) {
          return usuario.usuario === name && usuario.contrasena === contra;
        }
      );
      if (usuarioAutenticado) {
        alert("Verificado");
        // Redirige a la página de inicio después de la autenticación exitosa
        window.location.href = "../paginas/inicio.html";
      } else {
        alert("Usuario o contraseña incorrecta.");
      }
    })
    .catch(function(error) {
      alert("Error en la red");
      console.error("Error de red:", error);
    });
}
