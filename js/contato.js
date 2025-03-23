function showConfirmation(event) {
    event.preventDefault();

    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.style.display = 'block';

    const contactForm = document.getElementById('contact-form');
    contactForm.style.display = 'none';

    setTimeout(function () {
        window.location.href = 'index.html';
    }, 3000);
}

function closeConfirmation() {
    window.location.href = 'index.html';
}