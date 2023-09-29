
//animation du curseur

const canvas = document.getElementById('canvas');
console.log(canvas); 

const c = canvas.getContext('2d');
const img = new Image();
const clones = [];

img.src = './Logos/logohome.png';

const bat = {
    positions: [],
    draw() {
        c.drawImage(img, 0, 0, 50, 20);
    }
}

window.addEventListener("mousemove", deplacement);

function deplacement(event) {
    canvas.style.top = event.clientY + window.scrollY + 10 + "px";
    canvas.style.left = event.clientX + window.scrollX + 10 + "px";
}
img.onload = function () {
    console.log('Image chargée avec succès'); 
    bat.draw(); 
};
//fonction pour savoir si l'ID est en vue dans la partie visible de l'écran 

function isElementInViewport(elementId) {
    const element = document.getElementById(elementId);

    if (!element) {
        return false; 
    }

    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

//événement scroll zoom image

window.addEventListener("scroll", () => {
    if (isElementInViewport("Batgame_2")) {
        const element = document.getElementById("Batgame_2");
        element.classList.add("active");
    } else {
        const element = document.getElementById("Batgame_2");
        element.classList.remove("active");
    }
});


const tableauNombres = [
    "1/12",
    "2/12",
    "3/12",
    "4/12",
    "5/12",
    "6/12",
    "7/12",
    "8/12",
    "9/12",
    "10/12",
    "11/12",
    "12/12"
];

// Récupérez les éléments du DOM
const quizBox = document.querySelector('.quiz-box');
const startQuizBtn = document.querySelector('.startquiz');
const batgame2Div = document.getElementById('Batgame_2');
const quizDiv = document.querySelector('.quiz');
const footer = document.getElementById('footer');
const Chevalier = document.querySelector('.Cetext');
const fleche = document.querySelector('.fleche');

quizBox.style.display = 'none';

// Évenement "DÉMARRER LE QUIZ"
startQuizBtn.addEventListener('click', () => {
    quizDiv.style.display = 'none';
    fleche.style.display = 'none';

    quizBox.style.display = 'block';

    const numeroElement = document.querySelector('.numero');
    numeroElement.textContent = tableauNombres[0];
});


const questions = [];

// Fonction pour récupérer les données de l'API et les stocker dans le tableau questions
async function fetchQuestionsFromAPI() {
    try {
        const response = await fetch("https://batman-api.sayna.space/questions");
        const data = await response.json();

        questions.length = 0;

        data.forEach(apiQuestion => {
            const question = {
                question: apiQuestion.question,
                answers: apiQuestion.response.map(choice => ({
                    text: choice.text,
                    correct: choice.isGood,
                })),
            };
            questions.push(question);
        });

        showQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données de l'API :", error);
    }
}


fetchQuestionsFromAPI();

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers-buttons");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-display");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modal-content");
const closeButton = document.querySelector(".close"); 
const restartButton = document.getElementById("restart-button"); 

let currentQuestionIndex = 0;
let score = 0;
 
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        const scoreContainer = document.getElementById("score-display");

        if (score <= 5) {
            scoreContainer.innerHTML = `<p class="message bad"><u>${score}/12 C'EST PAS TOUT A FAIT ÇA</u><br><br> Oula ! Heureusement que le Riddler est sous les verrous... Il faut que vous vous repassiez les films, cette fois en enlevant peut-être le masque qui vous a bloqué la vue ! Aller, rien n’est perdu !</p>`;
        } else if (score >= 6 && score <= 11) {
            scoreContainer.innerHTML = `<p class="message average"><u>${score}/12 PAS MAL!</u><br><br> Encore un peu d’entraînement avec le Chevalier Noir vous serait bénéfique, mais vous pouvez marcher la tête haute vos connaissances sont là. A vous de les consolider, foncez Gotham est votre terrain de chasse !</p>`;
        } else if (score === 12) {
            scoreContainer.innerHTML = `<p class="message good"><u>${score}/12 BRAVO!</u><br><br> Vous êtes véritablement un super fan de l’univers de Batman ! Comics, films, rien ne vous échappe. Bruce Wayne a de quoi être fier, Gotham est en paix et Batman peut prendre sa retraite, vous veillez aux grains !</p>`;
        }

        modal.style.display = "block";

        
        restartButton.addEventListener("click", () => {
            modal.style.display = "none";
            location.reload();
        });
    }
});

//fonction pour faire apparaître les questions du quuiz petit à petit
function showQuestion(index) {
    const currentQuestion = questions[index];
    questionElement.innerHTML = currentQuestion.question;

    const numeroElement = document.querySelector('.numero');
    numeroElement.textContent = tableauNombres[index];

    answerButtons.innerHTML = "";
    currentQuestion.answers.forEach(answer => {
        const label = document.createElement("label");
        label.classList.add("btn");
        
        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("answer-checkbox");
        label.appendChild(input);

        const span = document.createElement("span");
        span.classList.add("answer-text");
        span.innerHTML = answer.text;
        label.appendChild(span);

        label.addEventListener("click", () => {
            if (input.checked) {
                if (answer.correct) {
                    score++;
                }
            }
        });

        answerButtons.appendChild(label);
    });

    updateImagesForQuestion(currentQuestionIndex); 
}

// Fonction pour afficher l'image correspondante à chaque question 
function updateImagesForQuestion(currentQuestionIndex) {
    // Obtentions de toutes les images liées aux questions
    const allImages = document.querySelectorAll('.quiz-img img');

    
    allImages.forEach((image, index) => {
        // Construction de l'ID de l'image en fonction de l'indice de la question actuelle
        const imageId = `image-question-${currentQuestionIndex + 1}`;

        if (image.id === imageId) {
            image.style.display = 'block'; 
        } else {
            image.style.display = 'none';
        }
    });
}







// gestionnaire d'événements pour le bouton de fermeture (×)
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

//gestionnaire d'événements pour fermer le pop-up en cliquant en dehors de celui-ci
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Appel fonction pour demarer le quiz
startQuiz();

