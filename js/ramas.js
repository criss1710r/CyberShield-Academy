const branches = {

    redes: {
        title: "🌐 Seguridad de Redes",
        description:
            "La seguridad de redes protege las comunicaciones, dispositivos e infraestructura de una organización frente a accesos no autorizados, ataques y otras amenazas.",
        topics: [
            "Modelo TCP/IP",
            "Direcciones IP",
            "Puertos",
            "DNS",
            "Firewalls",
            "VPN",
            "IDS e IPS"
        ]
    },

    criptografia: {
        title: "🔐 Criptografía",
        description:
            "La criptografía utiliza técnicas matemáticas para proteger la confidencialidad, integridad y autenticidad de la información.",
        topics: [
            "Cifrado simétrico",
            "Cifrado asimétrico",
            "Hashing",
            "AES",
            "RSA",
            "SHA-256",
            "Firmas digitales"
        ]
    },

    sistemas: {
        title: "💻 Seguridad de Sistemas",
        description:
            "Se centra en proteger sistemas operativos, servidores y dispositivos mediante controles de acceso, actualizaciones y configuraciones seguras.",
        topics: [
            "Linux",
            "Windows",
            "Permisos",
            "Hardening",
            "Procesos",
            "Servicios"
        ]
    },

    pentesting: {
        title: "🕵️ Hacking Ético / Pentesting",
        description:
            "El pentesting consiste en evaluar sistemas de forma autorizada para identificar vulnerabilidades y proporcionar recomendaciones de seguridad.",
        topics: [
            "Reconocimiento",
            "Enumeración",
            "Análisis de vulnerabilidades",
            "Explotación controlada",
            "Documentación",
            "Remediación"
        ]
    },

    malware: {
        title: "🦠 Análisis de Malware",
        description:
            "El análisis de malware estudia programas maliciosos para comprender su funcionamiento y desarrollar medidas defensivas.",
        topics: [
            "Virus",
            "Troyanos",
            "Ransomware",
            "Spyware",
            "Indicadores de compromiso",
            "Análisis estático"
        ]
    },

    forense: {
        title: "🔎 Informática Forense",
        description:
            "La informática forense estudia evidencias digitales para ayudar a reconstruir eventos relacionados con incidentes de seguridad.",
        topics: [
            "Evidencia digital",
            "Logs",
            "Metadatos",
            "Análisis de discos",
            "Timeline",
            "Cadena de custodia"
        ]
    },

    web: {
        title: "🌍 Seguridad Web",
        description:
            "La seguridad web busca proteger aplicaciones y APIs frente a vulnerabilidades que puedan comprometer información o funcionalidades.",
        topics: [
            "OWASP",
            "XSS",
            "SQL Injection",
            "CSRF",
            "Autenticación",
            "APIs"
        ]
    },

    incidentes: {
        title: "🚨 Respuesta a Incidentes",
        description:
            "La respuesta a incidentes comprende los procesos utilizados para detectar, analizar, contener y recuperar sistemas después de un incidente.",
        topics: [
            "Detección",
            "Análisis",
            "Contención",
            "Erradicación",
            "Recuperación",
            "Lecciones aprendidas"
        ]
    },

    cloud: {
        title: "☁️ Seguridad en la Nube",
        description:
            "La seguridad en la nube protege datos, aplicaciones, identidades e infraestructura desplegada en servicios cloud.",
        topics: [
            "AWS",
            "Azure",
            "IAM",
            "Configuraciones",
            "Almacenamiento",
            "APIs"
        ]
    },

    iam: {
        title: "👤 Gestión de Identidades y Accesos",
        description:
            "IAM administra las identidades digitales y controla qué usuarios o sistemas pueden acceder a determinados recursos.",
        topics: [
            "MFA",
            "RBAC",
            "SSO",
            "Autenticación",
            "Autorización",
            "Principio de mínimo privilegio"
        ]
    }

};


function showBranch(branch) {

    const data = branches[branch];

    if (!data) {
        return;
    }

    const modal = document.getElementById("branchModal");

    const modalContent =
        document.getElementById("modalContent");


    let topicsHTML = "";

    data.topics.forEach(topic => {

        topicsHTML += `<li>${topic}</li>`;

    });


    modalContent.innerHTML = `

        <h2>${data.title}</h2>

        <p>
            ${data.description}
        </p>

        <h3 style="margin-top:30px;">
            Conceptos que aprenderás
        </h3>

        <ul>
            ${topicsHTML}
        </ul>

        <button
            class="btn-primary"
            style="margin-top:25px;"
            onclick="closeBranch()">

            Comenzar aprendizaje →

        </button>

    `;


    modal.classList.add("active");

}


function closeBranch() {

    document
        .getElementById("branchModal")
        .classList.remove("active");

}


document
    .getElementById("branchModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeBranch();

        }

    });