window.addEventListener('load', carregarNavbar);
window.addEventListener('load', exibirEventos);

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        setTimeout(configuracaoAcessibilidadeBotoes, 500);
    });
});

function carregarNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar a navbar:', error));
}

function exibirEventos() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) {
        return;
    }

    let events = JSON.parse(localStorage.getItem('events')) || [];
    eventsList.innerHTML = '';

    events.forEach(function (event, index) {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item', 'card', 'p-3', 'mb-3', 'position-relative');

        eventItem.innerHTML = `
            <button class="btn btn-danger position-absolute top-50 end-0 translate-middle-y me-3" id="btn-delete" 
                    onclick="deletarEvento(${index})">
                <i class="bi bi-trash"></i>
            </button>

            <h3>${event.name}</h3>
            <p><strong>Data:</strong> ${event.date}</p>
            <p><strong>Descrição:</strong> ${event.description}</p>
        `;

        eventsList.appendChild(eventItem);
    });
}

function pesquisarEventos() {
    const input = document.getElementById('search-input');
    const filter = input.value.toUpperCase();
    const eventsList = document.getElementById('events-list');
    const eventItems = eventsList.getElementsByClassName('event-item');

    const existingMessage = document.getElementById('no-results');
    if (existingMessage) {
        existingMessage.remove();
    }

    let visibleCount = 0;

    for (let i = 0; i < eventItems.length; i++) {
        const title = eventItems[i].getElementsByTagName("h3")[0];
        const txtValue = title.textContent || title.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            eventItems[i].style.display = "";
            visibleCount++;
        } else {
            eventItems[i].style.display = "none";
        }
    }

    if (visibleCount === 0) {
        const message = document.createElement('p');
        message.id = 'no-results';
        message.textContent = 'Nenhum evento encontrado.';

        message.classList.add('text-center', 'fs-4', 'fw-bold');
        message.style.marginTop = '6rem';
        message.style.marginBottom = '6rem';

        eventsList.appendChild(message);
    }
}

let currentCallback = null;

function showModalConfirmacao(message, callback) {
    const modal = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    confirmMessage.textContent = message;
    modal.style.display = "flex";

    currentCallback = callback;

    confirmYes.onclick = () => {
        modal.style.display = "none";
        if (currentCallback) currentCallback(true);
    };

    confirmNo.onclick = () => {
        modal.style.display = "none";
        if (currentCallback) currentCallback(false);
    };
}

function deletarEvento(index) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const nomeEvento = events[index].name;

    showModalConfirmacao(`Tem certeza que deseja excluir o evento "${nomeEvento}"?`, (confirmado) => {
        if (confirmado) {
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            exibirEventos();
            showFeedback(`O evento "${nomeEvento}" foi deletado com sucesso!`);
        } else {
            showFeedback(`A exclusão do evento "${nomeEvento}" foi cancelada.`);
        }
    });
}

function showFeedback(message) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'alert alert-success';
    feedbackDiv.textContent = message;

    const eventsSection = document.getElementById('events');
    eventsSection.insertBefore(feedbackDiv, eventsSection.firstChild);

    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
}

function configuracaoAcessibilidadeBotoes() {
    const btnIncrease = document.getElementById("font-increase");
    const btnDecrease = document.getElementById("font-decrease");
    const btnContrast = document.getElementById("contrast-toggle");

    let currentFontSize = parseFloat(localStorage.getItem("fontSize")) || 16;
    const highContrast = localStorage.getItem("highContrast") === "true";

    document.body.style.fontSize = currentFontSize + "px";

    if (highContrast) {
        document.body.classList.add("high-contrast");
    }

    if (btnIncrease && btnDecrease && btnContrast) {
        const minFontSize = 12;
        const maxFontSize = 24;

        btnIncrease.addEventListener("click", function () {
            if (currentFontSize < maxFontSize) {
                currentFontSize += 2;
                document.body.style.fontSize = currentFontSize + "px";
                localStorage.setItem("fontSize", currentFontSize);
            }
        });

        btnDecrease.addEventListener("click", function () {
            if (currentFontSize > minFontSize) {
                currentFontSize -= 2;
                document.body.style.fontSize = currentFontSize + "px";
                localStorage.setItem("fontSize", currentFontSize);
            }
        });

        btnContrast.addEventListener("click", function () {
            document.body.classList.toggle("high-contrast");

            const isHighContrast = document.body.classList.contains("high-contrast");
            localStorage.setItem("highContrast", isHighContrast);
        });
    } else {
        console.error("Botões de acessibilidade não encontrados no DOM.");
    }
}
