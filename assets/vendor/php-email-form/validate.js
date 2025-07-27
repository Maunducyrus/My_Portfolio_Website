(function () {
  "use strict";

  // Initialize popup elements
  const popup = document.getElementById('formPopup');
  const popupMessage = document.getElementById('popupMessage');
  const closePopup = document.querySelector('.close-popup');
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  document.body.appendChild(overlay);

  // Close popup handler
  closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  });

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      let thisForm = this;

      // Show loading state
      showPopup('Sending your message...', false, true);

      let action = thisForm.getAttribute('action');
      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Parse JSON response
        }
        throw new Error('Network response was not ok');
      })
      .then(data => {
        if (data.ok) {
          showPopup('Your message has been sent successfully! Thank you!');
          thisForm.reset();
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      })
      .catch((error) => {
        showPopup('Error: ' + error.message, true);
      });
    });
  });

  function showPopup(message, isError = false, isLoading = false) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
    overlay.style.display = 'block';
    
    if (isLoading) {
      popupMessage.innerHTML = `<div class="spinner"></div> ${message}`;
      return;
    }

    // Auto-close after 3 seconds for success, stay open for errors
    if (!isError) {
      setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
      }, 3000);
    }
  }
})();