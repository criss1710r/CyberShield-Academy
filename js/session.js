// ==========================================
// CYBERSHIELD ACADEMY
// SISTEMA GLOBAL DE SESIÓN
// ==========================================


// ==========================================
// RUTAS DEL PROYECTO
// ==========================================

function getPagePath(file) {

    const inPages =
        window.location.pathname.includes("/pages/");

    return inPages
        ? file
        : `pages/${file}`;
}


// ==========================================
// CARGAR SESIÓN
// ==========================================

async function loadUserSession() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Error obteniendo sesión:",
            error
        );

        return;
    }

    await updateNavbar(session);
}


// ==========================================
// ACTUALIZAR NAVBAR
// ==========================================

async function updateNavbar(session) {

    const loginButtons =
        document.querySelector(".auth-buttons");

    const userMenu =
        document.querySelector(".user-menu");


    // Si la página todavía no tiene sistema
    // de usuario, no hacemos nada.

    if (!loginButtons || !userMenu) {
        return;
    }


    // ======================================
    // USUARIO NO AUTENTICADO
    // ======================================

    if (!session) {

        loginButtons.style.display = "flex";
        userMenu.style.display = "none";

        return;
    }


    // ======================================
    // USUARIO AUTENTICADO
    // ======================================

    loginButtons.style.display = "none";
    userMenu.style.display = "flex";


    const user = session.user;


    // ======================================
    // DATOS DEL USUARIO
    // ======================================

    let username =
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Usuario";


    const userNameElement =
        document.querySelector(".user-name");

    const userAvatar =
        document.querySelector(".user-avatar");


    if (userNameElement) {

        userNameElement.textContent =
            username;
    }


    if (userAvatar) {

        userAvatar.textContent =
            username.charAt(0).toUpperCase();
    }


    // ======================================
    // OBTENER PERFIL
    // ======================================

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("username, full_name, level, xp")
        .eq("id", user.id)
        .single();


    if (profileError) {

        console.warn(
            "No se pudo cargar el perfil:",
            profileError.message
        );

        return;
    }


    // ======================================
    // ACTUALIZAR DATOS DEL PERFIL
    // ======================================

    if (profile.username) {

        username =
            profile.username;

        if (userNameElement) {

            userNameElement.textContent =
                username;
        }

        if (userAvatar) {

            userAvatar.textContent =
                username.charAt(0).toUpperCase();
        }
    }


    const levelElement =
        document.querySelector(".user-level");

    const xpElement =
        document.querySelector(".user-xp");


    if (levelElement) {

        levelElement.textContent =
            `Nivel ${profile.level || 1}`;
    }


    if (xpElement) {

        xpElement.textContent =
            `${profile.xp || 0} XP`;
    }
}


// ==========================================
// CERRAR SESIÓN
// ==========================================

async function logoutUser() {

    const {
        error
    } = await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

        return;
    }


    window.location.href =
        getPagePath("auth.html");
}


// ==========================================
// ESCUCHAR CAMBIOS DE AUTENTICACIÓN
// ==========================================

supabaseClient.auth.onAuthStateChange(
    function(event, session) {

        console.log(
            "Cambio de autenticación:",
            event
        );


        setTimeout(function() {

            updateNavbar(session);

        }, 0);
    }
);


// ==========================================
// INICIAR SISTEMA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadUserSession
);