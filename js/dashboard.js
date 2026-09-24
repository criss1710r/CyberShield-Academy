// ==========================================
// CYBERSHIELD ACADEMY
// DASHBOARD
// ==========================================


// ==========================================
// CARGAR DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        // ----------------------------------
        // Comprobar sesión
        // ----------------------------------

        const {
            data: {
                session
            },
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError) {

            console.error(sessionError);

            window.location.href = "auth.html";

            return;
        }


        // ----------------------------------
        // No hay sesión
        // ----------------------------------

        if (!session) {

            window.location.href = "auth.html";

            return;
        }


        const user = session.user;


        // ----------------------------------
        // Obtener perfil
        // ----------------------------------

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();


        if (profileError) {

            console.error(
                "Error obteniendo perfil:",
                profileError
            );

            return;
        }


        // ----------------------------------
        // Datos del usuario
        // ----------------------------------

        const username =
            profile.username ||
            user.email.split("@")[0];

        const fullName =
            profile.full_name ||
            username;

        const level =
            profile.level || 1;

        const xp =
            profile.xp || 0;


        // ----------------------------------
        // Mostrar usuario
        // ----------------------------------

        document.getElementById(
            "navUsername"
        ).textContent = username;


        document.getElementById(
            "userName"
        ).textContent = fullName;


        document.getElementById(
            "userLevel"
        ).textContent = level;


        document.getElementById(
            "levelNumber"
        ).textContent = level;


        document.getElementById(
            "userXP"
        ).textContent = xp;


        document.getElementById(
            "levelXP"
        ).textContent = xp;


        // ----------------------------------
        // Barra XP
        // ----------------------------------

        const xpForNextLevel = 100;

        const xpPercentage =
            Math.min(
                (xp / xpForNextLevel) * 100,
                100
            );


        document.getElementById(
            "xpProgress"
        ).style.width =
            xpPercentage + "%";


        document.getElementById(
            "xpText"
        ).textContent =
            `${xp} / ${xpForNextLevel} XP para el siguiente nivel`;


        // ----------------------------------
        // Cargar cursos
        // ----------------------------------

        await loadCourses(user.id);


    } catch (error) {

        console.error(
            "Error cargando dashboard:",
            error
        );

    }

}


// ==========================================
// CARGAR CURSOS
// ==========================================

async function loadCourses(userId) {

    const container =
        document.getElementById(
            "coursesContainer"
        );


    // ----------------------------------
    // Obtener cursos
    // ----------------------------------

    const {
        data: courses,
        error: coursesError
    } = await supabaseClient
        .from("courses")
        .select("*")
        .order("id");


    if (coursesError) {

        console.error(
            "Error obteniendo cursos:",
            coursesError
        );

        container.innerHTML = `
            <div class="loading-card">
                No se pudieron cargar los cursos.
            </div>
        `;

        return;
    }


    // ----------------------------------
    // Obtener progreso
    // ----------------------------------

    const {
        data: progress,
        error: progressError
    } = await supabaseClient
        .from("progress")
        .select("*")
        .eq("user_id", userId);


    if (progressError) {

        console.error(
            "Error obteniendo progreso:",
            progressError
        );

    }


    const userProgress =
        progress || [];


    // ----------------------------------
    // Contador
    // ----------------------------------

    document.getElementById(
        "courseCount"
    ).textContent =
        courses.length;


    // ----------------------------------
    // Calcular progreso
    // ----------------------------------

    let totalProgress = 0;


    courses.forEach(course => {

        const courseProgress =
            userProgress.find(
                item =>
                    item.course_id === course.id
            );


        if (courseProgress) {

            totalProgress +=
                courseProgress.progress_percentage || 0;

        }

    });


    const averageProgress =
        courses.length > 0
            ? Math.round(
                totalProgress / courses.length
            )
            : 0;


    document.getElementById(
        "averageProgress"
    ).textContent =
        averageProgress + "%";


    // ----------------------------------
    // Sin cursos
    // ----------------------------------

    if (!courses.length) {

        container.innerHTML = `
            <div class="loading-card">
                Todavía no hay cursos disponibles.
            </div>
        `;

        return;
    }


    // ----------------------------------
    // Crear tarjetas
    // ----------------------------------

    container.innerHTML = "";


    courses.forEach(course => {

        const courseProgress =
            userProgress.find(
                item =>
                    item.course_id === course.id
            );


        const percentage =
            courseProgress
                ? courseProgress.progress_percentage || 0
                : 0;


        const icon =
            course.icon || "🛡️";


        const card =
            document.createElement("article");

        card.className = "course-card";


        card.innerHTML = `

            <div class="course-icon">
                ${icon}
            </div>

            <h3>
                ${course.title}
            </h3>

            <p>
                ${course.description || "Curso de ciberseguridad."}
            </p>

            <div class="course-meta">

                <span>
                    ${course.difficulty || "Principiante"}
                </span>

                <span>
                    ${percentage}%
                </span>

            </div>

            <div class="course-progress">

                <div
                    class="course-progress-bar"
                    style="width: ${percentage}%">
                </div>

            </div>

            <a
                href="ramas.html"
                class="course-link">

                Ver curso →

            </a>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        async function() {

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
                "auth.html";

        }
    );


// ==========================================
// INICIAR
// ==========================================

loadDashboard();