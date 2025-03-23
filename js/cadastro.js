document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#event-date", {
        dateFormat: "d/m/Y",
        allowInput: false,
        locale: "pt"
    });
});

document.getElementById('event-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('event-name').value;
    const data = document.getElementById('event-date').value;
    const descricao = document.getElementById('event-description').value;

    const novoEvento = {
        name: nome,
        date: data,
        description: descricao
    };

    let events = JSON.parse(localStorage.getItem('events')) || [];

    events.push(novoEvento);

    localStorage.setItem('events', JSON.stringify(events));

    const confirmationDiv = document.getElementById('confirmation-message');
    confirmationDiv.innerHTML = '<div class="alert alert-success">Cadastro realizado com sucesso! Redirecionando para a página principal...</div>';

    setTimeout(function () {
        window.location.href = 'index.html';
    }, 2000);
});