// ==========================================
// CYBERSHIELD ACADEMY
// SISTEMA DE AUTENTICACIÓN
// ==========================================


// ==========================================
// CAMBIAR A INICIO DE SESIÓN
// ==========================================

function showLogin() {

    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}


// ==========================================
// CAMBIAR A REGISTRO
// ==========================================

function showRegister() {

    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");

    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("registerTab").classList.add("active");
}


// ==========================================
// REGISTRO DE USUARIO
// ==========================================

document.getElementById("registerForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const fullName = document
        .getElementById("fullName")
        .value
        .trim();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const email = document
        .getElementById("registerEmail")
        .value
        .trim();

    const password = document
        .getElementById("registerPassword")
        .value;

    const message = document.getElementById("registerMessage");


    // Mensaje inicial

    message.textContent = "Creando cuenta...";
    message.style.color = "#00ff88";


    try {

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {
                        username: username,
                        full_name: fullName
                    }

                }

            });


        // Error de Supabase

        if (error) {

            console.error("Error de registro:", error);

            message.textContent =
                "Error: " + error.message;

            message.style.color = "#ff5555";

            return;
        }


        // Registro exitoso

        console.log("Usuario registrado:", data);

        message.textContent =
            "Cuenta creada correctamente.";

        message.style.color = "#00ff88";


        // Limpiar formulario

        document.getElementById("registerForm").reset();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Ocurrió un error inesperado.";

        message.style.color = "#ff5555";

    }

});


// ==========================================
// INICIO DE SESIÓN
// ==========================================

document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    const message = document.getElementById("loginMessage");


    message.textContent = "Iniciando sesión...";
    message.style.color = "#00ff88";


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        // Error

        if (error) {

            console.error("Error de inicio de sesión:", error);

            message.textContent =
                "Error: " + error.message;

            message.style.color = "#ff5555";

            return;
        }


        // Login exitoso

        console.log("Sesión iniciada:", data);

        message.textContent =
            "Inicio de sesión correcto.";

        message.style.color = "#00ff88";


        // Por ahora no redirigimos,
        // porque todavía no hemos creado dashboard.html.

        setTimeout(function() {

            window.location.href = "dashboard.html";

        }, 800);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Ocurrió un error inesperado.";

        message.style.color = "#ff5555";

    }

});