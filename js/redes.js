const quiz = document.getElementById("networkQuiz");

quiz.addEventListener("submit", function (event) {

    event.preventDefault();

    const answers = {
        q1: "b",
        q2: "a",
        q3: "a"
    };

    let score = 0;

    Object.keys(answers).forEach(function (question) {

        const selected =
            document.querySelector(
                `input[name="${question}"]:checked`
            );

        if (selected && selected.value === answers[question]) {
            score++;
        }

    });


    const result =
        document.getElementById("quizResult");


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