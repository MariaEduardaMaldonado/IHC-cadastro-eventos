window.addEventListener('load', loadNavbar);
window.addEventListener('load', displayEvents);
window.addEventListener('load', setActiveNavItem);
window.addEventListener('load', setClickEvent);

function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar a navbar:', error));
}

function setActiveNavItem() {
    var navItems = document.querySelectorAll('.navbar-nav .nav-item');

    navItems.forEach(function (item) {
        item.classList.remove('active');
    });

    var currentPage = window.location.pathname;

    if (currentPage.includes('index.html')) {
        document.querySelector('a[href="index.html"]').parentElement.classList.add('active');
    } else if (currentPage.includes('cadastro.html')) {
        document.querySelector('a[href="cadastro.html"]').parentElement.classList.add('active');
    } else if (currentPage.includes('galeria.html')) {
        document.querySelector('a[href="galeria.html"]').parentElement.classList.add('active');
    } else if (currentPage.includes('contato.html')) {
        document.querySelector('a[href="contato.html"]').parentElement.classList.add('active');
    }
}

function setClickEvent() {
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var navItems = document.querySelectorAll('.navbar-nav .nav-item');
            navItems.forEach(function (item) {
                item.classList.remove('active');
            });

            link.parentElement.classList.add('active');
        });
    });
}

function displayEvents() {
    const eventsList = document.getElementById('events-list');
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

function deletarEvento(index) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const nomeEvento = events[index].name;

    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents();

    showFeedback(`O evento ${nomeEvento} foi deletado com sucesso!`);
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
