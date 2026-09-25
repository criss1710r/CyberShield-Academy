// ==========================================
// CYBERSHIELD ACADEMY
// SISTEMA GLOBAL DE SESIÓN
// ==========================================

async function loadUserSession() {

    const { data: { session }, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error("Error obteniendo sesión:", error);
        return;
    }

    updateNavbar(session);
}


// ==========================================
// ACTUALIZAR NAVBAR
// ==========================================

async function updateNavbar(session) {

    const loginButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");

    if (!loginButtons || !userMenu) {
        return;
    }

    // --------------------------------------
    // USUARIO NO AUTENTICADO
    // --------------------------------------

    if (!session) {

        loginButtons.style.display = "flex";
        userMenu.style.display = "none";

        return;
    }


    // --------------------------------------
    // USUARIO AUTENTICADO
    // --------------------------------------

    loginButtons.style.display = "none";
    userMenu.style.display = "flex";


    const user = session.user;

    const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "Usuario";


    const username =
        user.user_metadata?.username ||
        fullName;


    const userNameElement =
        document.querySelector(".user-name");

    const userAvatar =
        document.querySelector(".user-avatar");


    if (userNameElement) {
        userNameElement.textContent = username;
    }


    if (userAvatar) {
        userAvatar.textContent =
            username.charAt(0).toUpperCase();
    }


    // --------------------------------------
    // OBTENER PERFIL
    // --------------------------------------

    const { data: profile, error: profileError } =
        await supabaseClient
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


    // --------------------------------------
    // DATOS DEL PERFIL
    // --------------------------------------

    if (profile.username && userNameElement) {
        userNameElement.textContent =
            profile.username;
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

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

        return;
    }

    window.location.href = "auth.html";
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

        updateNavbar(session);
    }
);


// ==========================================
// INICIAR SISTEMA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadUserSession
);