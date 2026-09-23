/**
 * ARJUN DOMBARA - PERSONAL PORTFOLIO
 * Contact Form Logic: Validation, anti-spam, timestamping, and secure email submission
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const formTimestamp = document.getElementById('form-timestamp');

  if (!form) return;

  // Set current submission timestamp
  function updateTimestamp() {
    if (formTimestamp) {
      const now = new Date();
      formTimestamp.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
    }
  }
  updateTimestamp();

  // Email regex validation
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase().trim());
  }

  // Clear errors on user input
  nameInput.addEventListener('input', () => {
    nameError.classList.remove('active');
    nameInput.classList.remove('invalid');
  });

  emailInput.addEventListener('input', () => {
    emailError.classList.remove('active');
    emailInput.classList.remove('invalid');
  });

  messageInput.addEventListener('input', () => {
    messageError.classList.remove('active');
    messageInput.classList.remove('invalid');
  });

  function validateForm() {
    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!nameVal || nameVal.length < 2) {
      nameError.textContent = 'Please enter your name (at least 2 characters).';
      nameError.classList.add('active');
      nameInput.classList.add('invalid');
      isValid = false;
    } else {
      nameError.classList.remove('active');
      nameInput.classList.remove('invalid');
    }

    if (!emailVal || !isValidEmail(emailVal)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('active');
      emailInput.classList.add('invalid');
      isValid = false;
    } else {
      emailError.classList.remove('active');
      emailInput.classList.remove('invalid');
    }

    if (!messageVal || messageVal.length < 10) {
      messageError.textContent = 'Please enter your message (at least 10 characters).';
      messageError.classList.add('active');
      messageInput.classList.add('invalid');
      isValid = false;
    } else {
      messageError.classList.remove('active');
      messageInput.classList.remove('invalid');
    }

    return isValid;
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending...';
      if (btnIcon) btnIcon.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
    } else {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.style.display = 'inline-block';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }

  function showMessage(type) {
    if (type === 'success') {
      if (formSuccess) formSuccess.style.display = 'flex';
      if (formError) formError.style.display = 'none';
      setTimeout(() => {
        if (formSuccess) formSuccess.style.display = 'none';
      }, 8000);
    } else {
      if (formError) formError.style.display = 'flex';
      if (formSuccess) formSuccess.style.display = 'none';
      setTimeout(() => {
        if (formError) formError.style.display = 'none';
      }, 8000);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous status alerts
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    // Anti-spam Honeypot Check
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value !== '') {
      console.warn('Spam bot detected');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    updateTimestamp();

    const formData = {
      recipient_email: 'arjundombara@gmail.com',
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      submission_time: formTimestamp ? formTimestamp.value : new Date().toISOString(),
      source: 'Arjun Dombara Portfolio Website'
    };

    try {
      // Primary gateway: Web3Forms secure dispatch to arjundombara@gmail.com
      // Using public access key mechanism with fallback endpoint
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '5ca2a188-f2b7-4dc5-8f6a-04ec671d1796',
          from_name: `${formData.name} (Portfolio Contact)`,
          subject: `Portfolio Message from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          submission_date_time: formData.submission_time,
          to_email: 'arjundombara@gmail.com'
        })
      });

      const result = await response.json();

      if (response.ok && (result.success || result.status === 'success' || response.status === 200)) {
        showMessage('success');
        form.reset();
      } else {
        // If external gateway failed, try secondary FormSubmit/Formspree gateway
        const backupResponse = await fetch('https://formsubmit.co/ajax/arjundombara@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            submitted_at: formData.submission_time,
            _subject: `New Portfolio Message from ${formData.name}`
          })
        });

        if (backupResponse.ok) {
          showMessage('success');
          form.reset();
        } else {
          throw new Error('All submission gateways unreachable');
        }
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      showMessage('error');
    } finally {
      setLoading(false);
    }
  });
}
