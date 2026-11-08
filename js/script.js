function esEmailValido(email) {
    // Expresión regular para validar el formato de un email
    const validacion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return validacion.test(email);
}

function esTelefonoValido(telefono){
    //Expresión regular para validar el formato de un telefono
    const validacion = /^\d{3}[- ]?\d{3}[- ]?\d{3}$/;
    const soloDigitos = telefono.replace(/[- ]/g, '');

    return validacion.test(telefono) && soloDigitos.length === 9;
}

function contarPalabras(texto){
    if (typeof texto !== 'string') return 0;

    const textoLimpio = texto.trim();

    if(textoLimpio === '') return 0;

    return textoLimpio.split(/\s+/).length;
}

document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-contacto");

    if(!formulario) return;

    const botonEnviar = formulario.querySelector("button[type='submit']");

    const campos = {
        asunto: formulario.querySelector("#asunto"),
        nombre: formulario.querySelector("#remitente"),
        apellidos: formulario.querySelector("#apellidos"),
        email: formulario.querySelector("#email"),
        telefono: formulario.querySelector("#telefono"),
    };

    const mensajesError = {
        asunto: document.getElementById("error-asunto"),
        nombre: document.getElementById("error-nombre"),
        apellidos: document.getElementById("error-apellidos"),
        email: document.getElementById("error-email"),
        telefono: document.getElementById("error-telefono"),
    };

    const validadores = {
        asunto: valor => contarPalabras(valor) > 0 && contarPalabras(valor) <= 15,
        nombre: valor => contarPalabras(valor) > 0 && contarPalabras(valor) <= 2,
        apellidos: valor => contarPalabras(valor) > 0 && contarPalabras(valor) <= 5,
        email: valor => valor.trim() !== "" && esEmailValido(valor),
        telefono: valor => valor.trim() !== "" && esTelefonoValido(valor),
    };

    const mensajes = {
        asunto: valor => {
            const palabras = contarPalabras(valor);
            if (palabras === 0) return "❌ El asunto no puede estar vacío.";
            if (palabras > 15) return `❌ El asunto tiene ${palabras} palabras. Máximo 15 permitidas.`;
            return "";
        },
        nombre: valor => {
            const palabras = contarPalabras(valor);
            if (palabras === 0) return "❌ El nombre no puede estar vacío.";
            if (palabras > 2) return `❌ El nombre tiene ${palabras} palabras. Máximo 2 permitidas.`;
            return "";
        },
        apellidos: valor => {
            const palabras = contarPalabras(valor);
            if (palabras === 0) return "❌ El apellido no puede estar vacío.";
            if (palabras > 5) return `❌ El apellido tiene ${palabras} palabras. Máximo 5 permitidas.`;
            return "";
        },
        email: valor => {
            if (valor.trim() === "") return "❌ El email no puede estar vacío.";
            if (!esEmailValido(valor)) return "❌ El email debe tener un formato válido (ej. usuario@dominio.com).";
            return "";
        },
        telefono: valor => {
            if (valor.trim() === "") return "❌ El telefono no puede estar vacío.";
            if (!esTelefonoValido(valor)) return "❌ El teléfono debe tener 9 dígitos (ej. 123456789 o 123 456 789).";
            return "";
        },
    };

    function validarCampo(nombreCampo){
        const campo = campos[nombreCampo];
        const mensaje = mensajesError[nombreCampo];
        const formGroup = campo?.closest('.form-group');

        if (!campo) return false;

        const valido = validadores[nombreCampo](campo.value);
        const textoError = mensajes[nombreCampo](campo.value);

        console.log(`Validando ${nombreCampo}: valor="${campo.value}", válido=${valido}`);

        //Forzar eliminación de clases anteriores
        campo.classList.remove("has-error", "valid");
        campo.style.border = "";
        campo.style.backgroundColor = "";
        campo.style.boxShadow = "";
        
        if (formGroup){
            formGroup.classList.remove("has-error");
        }

        if(!valido){
            console.log(`Campo ${nombreCampo} INVÁLIDO - aplicando estilos rojos`);

            //Forzar estilos de error con !important via JavaScript
            campo.classList.add("has-error");
            campo.style.setProperty("border", "3px solid #dc3545", "important");
            campo.style.setProperty("background-color", "#ffebee", "important");
            campo.style.setProperty("box-shadow", "0 0 0 0.2rem rgba(220, 53, 69, 0.25)", "important");

            if(formGroup){
                formGroup.classList.add("has-error");
            }

            //Mostrar mensaje de error
            if (mensaje){
                mensaje.textContent = textoError;
                mensaje.style.display = "block";
                mensaje.style.color = "#dc3545";
                mensaje.style.backgroundColor = "#f8d7da";
                mensaje.style.padding = "5px 8px";
                mensaje.style.borderRadius = "4px";
                mensaje.style.marginTop = "5px";
            }
        }
        else{
            console.log(`Campo ${nombreCampo} VÁLIDO - aplicando estilos verdes`);
        
            // Campo válido - estilos verdes
            campo.classList.add("valid");
            campo.style.setProperty("border", "2px solid #28a745", "important");
            campo.style.setProperty("background-color", "#f8fff9", "important");
            campo.style.setProperty("box-shadow", "0 0 0 0.1rem rgba(40, 167, 69, 0.15)", "important");
            
            if (mensaje) {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }
        }

        return valido;
    }

    function validarFormulario(){
        let todosValidos = true;

        //Validar cada campo individualmente
        for (let nombreCampo in campos){
            const campoValido = validarCampo(nombreCampo);

            if(!campoValido){
                todosValidos = false;
            }
        }

        //Actualizar estado del botón
        if (botonEnviar){
            botonEnviar.disabled = !todosValidos;

            if (todosValidos){
                botonEnviar.style.opacity = "1";
                botonEnviar.style.backgroundColor = "#007bff";
                botonEnviar.style.borderColor = "#007bff";
                botonEnviar.style.cursor = "pointer";
                botonEnviar.innerHTML = '<span id="btn-text">✅ Enviar Formulario</span>';
            }
            else{
                botonEnviar.style.opacity = "0.6";
                botonEnviar.style.backgroundColor = "#6c757d";
                botonEnviar.style.borderColor = "#6c757d";
                botonEnviar.style.cursor = "not-allowed";
                botonEnviar.innerHTML = '<span id="btn-text">❌ Corrige los errores</span>';
            }
        }

        return todosValidos;
    }

    //Validación inicial al cargar la página
    setTimeout(() => {
        validarFormulario();
    }, 100);

    //Añadir event listeners a cada campo
    for(let campo in campos){
        if (campos[campo]){
            //Validar mientras el usuario escribe
            campos[campo].addEventListener("input", function(){
                setTimeout(() => validarFormulario(), 50);
            });

            //Validar cuando el campo pierde el foco
            campos[campo].addEventListener("blur", function(){
                validarFormulario();
            });

            //Validar cuando el campo recibe el foco
            campos[campo].addEventListener("focus", function(){
                //Limpiar las animaciones anteriores
                this.style.animation = "none";
            });
        }
    }

    //Prevenir el envío si el formulario no es válido
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        //Forzar validación completa antes del envío
        const formularioValido = validarFormulario();

        if (formularioValido){
            //Mostrar mensaje de éxito
            const mensajeExito = document.createElement('div');

            mensajeExito.innerHTML = `
                <div style="background-color: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;">
                    <strong>✅ ¡Formulario válido!</strong><br>
                    Los datos se enviarían correctamente al servidor.
                </div>
            `;

            formulario.parentNode.insertBefore(mensajeExito, formulario);

            //Scroll al mensaje de éxito
            mensajeExito.scrollIntoView({behavior: 'smooth', block: 'center'});

            //Limpiar el formulario después de 3 segundos
            setTimeout(() => {
                formulario.reset();
                mensajeExito.remove();
                validarFormulario();
            }, 3000);
        }
        else{
            //Mostrar mensaje de error general
            const mensajeError = document.createElement('div');

            mensajeError.innerHTML = `
                <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;">
                    <strong>❌ Hay errores en el formulario</strong><br>
                    Por favor, revisa los campos marcados en rojo antes de continuar.
                </div>
            `;

            formulario.parentNode.insertBefore(mensajeError, formulario);

            //Hacer scroll al primer campo con error
            for(let nombreCampo in campos){
                if (!validarCampo(nombreCampo)){
                    campos[nombreCampo].focus();
                    campos[nombreCampo].scrollIntoView({behavior: 'smooth', block: 'center'});
                    break;
                }
            }

            //Quitar el mensaje de error después de 5 segundos
            setTimeout(() => {
                if(mensajeError.parentNode){
                    mensajeError.remove();
                }
            }, 5000);

        }
    });
});

// Filtro dinamico en la galería de imágenes usando jQuery
$(document).ready(function() {
    $('#buscador-figcaption').on('input', function(){
        const texto = $(this).val().toLowerCase().trim();

        $('figure').each(function(){
            const figcaption = $(this).find('figcaption');
            const original = figcaption.text();
            const originalLower = original.toLowerCase();

            // Restaurar el texto original
            figcaption.html(original);

            if(texto === ''){
                $(this).show();
            } else if (originalLower.includes(texto)){
                $(this).show();

                // Crear regex correcta con template literal
                const regex = new RegExp(`(${texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                const nuevoHTML = original.replace(regex, '<span class="resaltado">$1</span>');
                figcaption.html(nuevoHTML);
            } else {
                $(this).hide();
            }
        });
    });
});

//Función para mostrar/ocultar mensajes de error debajo de la tabla
function mostrarMensaje(mensaje){
    let div = document.getElementById("mensaje-error-entidades");
    if (!div){
        div = document.createElement("div");
        div.id = "mensaje-error-entidades";
        div.className = "alert alert-danger text-center";
        div.style.display = "none";
        const tabla = document.getElementById("tabla-entidades");
        tabla.parentNode.insertBefore(div, tabla.nextSibling);
    }
    if (mensaje){
        div.textContent = mensaje;
        div.style.display = "block";
    } else {
        div.style.display = "none";
        div.textContent = "";
    }
}

// Función para formatear el ID como 0x
function formatearId(id) {
    // Si id ya es string con formato 0x, devolverlo tal cual
    if (typeof id === 'string' && id.match(/^\d{2}$/)) return id;
    // Convertir número a string con 0 a la izquierda
    return id.toString().padStart(2, '0');
}

// Función para crear una fila de la tabla
function crearFilaTabla(entidad) {
    const fila = document.createElement("tr");

    const celdaId = document.createElement("td");
    celdaId.textContent = entidad.id || "";

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = entidad.nombre || "";

    const celdaGenero = document.createElement("td");
    celdaGenero.textContent = entidad.genero || "";

    const celdaPuntuacion = document.createElement("td");
    celdaPuntuacion.textContent = entidad.puntuacion || "";

    const celdaBorrar = document.createElement("td");
    const botonBorrar = document.createElement("button");
    botonBorrar.className = "btn btn-danger btn-sm";
    botonBorrar.textContent = "Eliminar";
    botonBorrar.onclick = function() {
        $.ajax({
            url: `api/entidades/${entidad.id}`,
            type: "DELETE",
            success: function() {
                fila.remove();
                mostrarMensaje("✅ Entidad eliminada correctamente.");
                setTimeout(() => mostrarMensaje(""), 3000);
            },
            error: function(jqXHR, textStatus) {
                mostrarMensaje(`Error al eliminar entidad con id ${entidad.id}: ${textStatus}`);
            }
        });
    };
    celdaBorrar.appendChild(botonBorrar);

    fila.appendChild(celdaId);
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaGenero);
    fila.appendChild(celdaPuntuacion);
    fila.appendChild(celdaBorrar);

    return fila;
}

// Función principal para actualizar la tabla (CORREGIDA)
function actualizarTabla() {
    const tabla = document.getElementById("tabla-entidades");
    if (!tabla) {
        console.error("Tabla de entidades no encontrada.");
        return;
    }

    const tbody = tabla.getElementsByTagName("tbody")[0];
    if (!tbody) {
        console.error("Tbody no encontrado en la tabla.");
        return;
    }

    // Datos simulados para fallback
    const datosSimulados = [
        { id: "01", nombre: "Stranger Things", genero: "Ciencia Ficción", puntuacion: "8.7" },
        { id: "02", nombre: "The Witcher", genero: "Fantasía", puntuacion: "8.2" }
    ];

    // Intentar cargar desde la API
    fetch("api/entidades")
        .then(response => {
            if (!response.ok) {
                console.warn("API no disponible, usando datos simulados");
                return datosSimulados;
            }
            return response.json();
        })
        .then(datos => {
            // ORDENAR LOS DATOS POR ID NUMÉRICAMENTE
            datos.sort((a, b) => {
                const idA = parseInt(a.id) || 0;
                const idB = parseInt(b.id) || 0;
                return idA - idB;
            });

            // Limpiar la tabla
            tbody.innerHTML = "";
            
            // Llenar la tabla con datos ordenados
            datos.forEach(entidad => {
                const fila = crearFilaTabla(entidad);
                tbody.appendChild(fila);
            });
            
            mostrarMensaje("");
            console.log("Tabla actualizada y ordenada correctamente");
        })
        .catch(error => {
            console.error("Error al cargar entidades:", error);
            
            // Usar datos simulados si falla la API
            datosSimulados.sort((a, b) => {
                const idA = parseInt(a.id) || 0;
                const idB = parseInt(b.id) || 0;
                return idA - idB;
            });

            tbody.innerHTML = "";
            datosSimulados.forEach(entidad => {
                const fila = crearFilaTabla(entidad);
                tbody.appendChild(fila);
            });
        });
}

// Añadir una nueva entidad desde el formulario (CORREGIDO)
document.addEventListener('DOMContentLoaded', function(){
    const formularioEntidades = document.getElementById("formulario-entidades");

    if (!formularioEntidades) {
        console.error("Formulario de entidades no encontrado.");
        return;
    }

    formularioEntidades.addEventListener("submit", function(event){
        event.preventDefault();

        const form = event.target;
        const id = form.querySelector('[name="id"]')?.value.trim() || "";
        const nombre = form.querySelector('[name="nombre"]')?.value.trim() || "";
        const genero = form.querySelector('[name="genero"]')?.value.trim() || "";
        const puntuacion = form.querySelector('[name="puntuacion"]')?.value.trim() || "";

        // Validaciones
        if (!id || !nombre || !genero || !puntuacion) {
            mostrarMensaje("Todos los campos son obligatorios.");
            return;
        }

        if (!/^\d+$/.test(id)) {
            mostrarMensaje("El ID debe ser un número.");
            return;
        }

        const puntuacionNum = parseFloat(puntuacion);
        if (isNaN(puntuacionNum) || puntuacionNum < 0 || puntuacionNum > 10) {
            mostrarMensaje("La puntuación debe ser un número entre 0 y 10.");
            return;
        }

        const idNum = parseInt(id);
        if (idNum <= 0) {
            mostrarMensaje("El ID debe ser un número natural (mayor que 0).");
            return;
        }

        const idFormateado = formatearId(idNum);

        const tabla = document.getElementById("tabla-entidades");
        if (tabla) {
            const tbody = tabla.getElementsByTagName("tbody")[0];
            if (tbody) {
                const filas = tbody.getElementsByTagName("tr");
                for (let fila of filas) {
                    if (fila.cells[0].textContent === idFormateado) {
                        mostrarMensaje("El ID ya existe. Usa un ID único.");
                        return;
                    }
                }
            }
        }

        const nuevaEntidad = {
            id: idFormateado,
            nombre: nombre,
            genero: genero,
            puntuacion: puntuacion
        };

        fetch("api/entidades", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaEntidad)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error al añadir la entidad: ${response.status} ${response.statusText} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Entidad añadida:", data);
            
            // Recargar toda la tabla para mantener el orden correcto
            actualizarTabla();
            
            mostrarMensaje("✅ Entidad añadida correctamente.");
            setTimeout(() => mostrarMensaje(""), 3000);
            form.reset();
        })
        .catch(error => {
            console.error("Error en POST:", error);
            mostrarMensaje(`No se puede añadir la entidad: ${error.message}`);
        });
    });
});

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function(){
    // Solo llamar a actualizarTabla una vez
    actualizarTabla();
    
    //Obtener el input de búsqueda
    const buscador = document.getElementById('buscador-figcaption');

    if(buscador){
        //Escuchar lo que el usuario escribe
        buscador.addEventListener('input', function(){
            const texto = this.value.toLowerCase().trim();
            const contenedores = document.querySelectorAll('.col-lg-3.col-md-3.col-sm-6.col-xs-12');

            //Recorrer cada div y filtrar según el figcaption
            contenedores.forEach(function(contenedor){
                const figcaption = contenedor.querySelector('figcaption');
                if(!figcaption) return;

                const textoFigura = figcaption.textContent.toLowerCase();
                if (textoFigura.includes(texto)){
                    contenedor.style.display = '';
                }
                else{
                    contenedor.style.display = 'none';
                }
            });
        });
    }
});

//Ordenador json
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');
const fs = require('fs').promises;

// Habilitar CORS
server.use(cors());

// Middleware para validar el cuerpo de la solicitud POST
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/entidades') {
        const { id, nombre } = req.body;
        // Validar que id sea string con formato 0x (dos dígitos)
        if (!id || typeof id !== 'string' || !id.match(/^\d{2}$/)) {
            return res.status(400).json({ error: "La entidad debe tener un 'id' como string con formato 0x (ej. '01', '06')." });
        }
        // Validar que id sea numéricamente positivo
        const idNum = parseInt(id);
        if (isNaN(idNum) || idNum <= 0) {
            return res.status(400).json({ error: "El 'id' debe ser un número positivo." });
        }
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ error: "La entidad debe tener un campo 'nombre' válido." });
        }
        next();
    } else {
        next();
    }
});

// Middleware para ordenar db.json por id después de POST o DELETE
server.use(async (req, res, next) => {
    if ((req.method === 'POST' && req.path === '/entidades') || 
        (req.method === 'DELETE' && req.path.startsWith('/entidades/'))) {
        // Guardar la respuesta original
        const originalRender = router.db.getState();

        // Continuar con la solicitud
        await next();

        // Leer db.json
        try {
            const data = await fs.readFile('db.json', 'utf8');
            const json = JSON.parse(data);

            // Ordenar entidades por id (interpretando como número)
            json.entidades.sort((a, b) => parseInt(a.id) - parseInt(b.id));

            // Escribir db.json ordenado
            await fs.writeFile('db.json', JSON.stringify(json, null, 2));
            console.log('db.json ordenado por id');
        } catch (error) {
            console.error('Error al ordenar db.json:', error);
        }

        // Restaurar el estado original para evitar conflictos
        router.db.setState(originalRender);
    } else {
        await next();
    }
});

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
