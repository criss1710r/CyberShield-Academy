const quiz = document.getElementById("networkQuiz");

// ==========================================
// QUIZ
// ==========================================

quiz.addEventListener("submit", function (event) {
    event.preventDefault();

    const answers = {
        q1: "b",
        q2: "a",
        q3: "a"
    };

    let score = 0;

    Object.keys(answers).forEach(function (question) {
        const selected = document.querySelector(
            `input[name="${question}"]:checked`
        );

        if (selected && selected.value === answers[question]) {
            score++;
        }
    });

    const result = document.getElementById("quizResult");

    if (score === 3) {
        result.textContent =
            "✓ Excelente. Respondiste correctamente las 3 preguntas.";
        result.style.color = "#00ff9d";
    } else {
        result.textContent =
            `Resultado: ${score}/3. Repasa los módulos e inténtalo nuevamente.`;
        result.style.color = "#ffcc66";
    }
});


// ==========================================
// COMPLETAR MÓDULO 01
// ==========================================

const completeModule1 = document.getElementById("completeModule1");
const module1Message = document.getElementById("module1Message");

async function completeFirstModule() {

    if (!supabaseClient) {
        module1Message.textContent =
            "Error: Supabase no está disponible.";
        module1Message.style.color = "#ff5555";
        return;
    }

    module1Message.textContent = "Guardando progreso...";
    module1Message.style.color = "#00ff88";

    try {

        // Obtener usuario actualmente conectado
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            module1Message.textContent =
                "Debes iniciar sesión para guardar tu progreso.";
            module1Message.style.color = "#ff5555";
            return;
        }

        // Buscar el curso Seguridad de Redes
        const {
            data: course,
            error: courseError
        } = await supabaseClient
            .from("courses")
            .select("id")
            .eq("slug", "seguridad-de-redes")
            .single();

        if (courseError || !course) {
            console.error(courseError);

            module1Message.textContent =
                "No se encontró el curso.";
            module1Message.style.color = "#ff5555";
            return;
        }

        // Buscar el primer módulo
        const {
            data: lesson,
            error: lessonError
        } = await supabaseClient
            .from("lessons")
            .select("id")
            .eq("course_id", course.id)
            .eq("slug", "introduccion")
            .single();

        if (lessonError || !lesson) {
            console.error(lessonError);

            module1Message.textContent =
                "No se encontró el módulo 01.";
            module1Message.style.color = "#ff5555";
            return;
        }

        // Comprobar si ya existe progreso
        const {
            data: existingProgress,
            error: progressError
        } = await supabaseClient
            .from("progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", course.id)
            .maybeSingle();

        if (progressError) {
            console.error(progressError);

            module1Message.textContent =
                "No se pudo consultar tu progreso.";
            module1Message.style.color = "#ff5555";
            return;
        }

        // Si ya completó el módulo
        if (
            existingProgress &&
            existingProgress.last_lesson_id === lesson.id
        ) {
            module1Message.textContent =
                "✓ Ya completaste este módulo.";
            module1Message.style.color = "#00ff88";

            completeModule1.disabled = true;
            completeModule1.textContent = "✓ Módulo completado";

            return;
        }

        // Guardar progreso del curso
        const progressData = {
            user_id: user.id,
            course_id: course.id,
            progress_percentage: 12,
            completed: false,
            last_lesson_id: lesson.id
        };

        const {
            error: saveError
        } = await supabaseClient
            .from("progress")
            .upsert(progressData, {
                onConflict: "user_id,course_id"
            });

        if (saveError) {
            console.error(saveError);

            module1Message.textContent =
                "No se pudo guardar el progreso.";
            module1Message.style.color = "#ff5555";
            return;
        }

        // Obtener XP actual
        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("xp, level")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            console.error(profileError);

            module1Message.textContent =
                "Progreso guardado, pero no se pudo actualizar el XP.";
            module1Message.style.color = "#ffcc66";
            return;
        }

        // Sumar 50 XP
        const newXP = (profile.xp || 0) + 50;

        // Calcular nivel
        const newLevel = Math.floor(newXP / 500) + 1;

        const {
            error: xpError
        } = await supabaseClient
            .from("profiles")
            .update({
                xp: newXP,
                level: newLevel,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id);

        if (xpError) {
            console.error(xpError);

            module1Message.textContent =
                "Progreso guardado, pero no se pudo actualizar el XP.";
            module1Message.style.color = "#ffcc66";
            return;
        }

        // Éxito
        module1Message.textContent =
            "✓ Módulo completado. +50 XP";
        module1Message.style.color = "#00ff88";

        completeModule1.disabled = true;
        completeModule1.textContent = "✓ Módulo completado";

    } catch (error) {

        console.error("Error:", error);

        module1Message.textContent =
            "Ocurrió un error inesperado.";
        module1Message.style.color = "#ff5555";
    }
}


if (completeModule1) {
    completeModule1.addEventListener(
        "click",
        completeFirstModule
    );
}