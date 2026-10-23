/* ==========================================================================
   Asad Ullah | Web Developer — Contact Form Handler (contact.js)

   Handles the contact form submission via Web3Forms.
   Web3Forms is FREE with UNLIMITED submissions — no account required.
   Messages are delivered directly to asadokz18@gmail.com.

   HOW TO ACTIVATE (one-time setup — takes 1 minute):
   1. Go to https://web3forms.com
   2. Enter your email: asadokz18@gmail.com  →  click "Create Access Key"
   3. Check your inbox and copy the Access Key they send you
   4. Paste it into the WEB3FORMS_ACCESS_KEY variable below and save this file.
   5. Done! Every form submission lands directly in your Gmail inbox.
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     CONFIGURATION — replace the placeholder with your real Web3Forms key.
     Get a free key at: https://web3forms.com
     Example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
     ----------------------------------------------------------------------- */
  var WEB3FORMS_ACCESS_KEY = '94f07a60-704b-4140-be06-db9c2825fee8';

  /* -----------------------------------------------------------------------
     Override the contact form's default mailto: behaviour.
     Uses useCapture=true so this listener fires BEFORE the mailto handler
     in script.js. stopImmediatePropagation() prevents that one from running.
     ----------------------------------------------------------------------- */
  function initWeb3Forms() {
    var form      = document.getElementById('contact-form');
    var status    = document.getElementById('form-status');
    var note      = document.querySelector('.form-note');
    var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!form || !status) return;

    /* Update the small helper note below the button */
    if (note) {
      note.textContent = 'Your message is sent directly to my inbox. I\u2019ll get back to you as soon as possible.';
    }

    form.addEventListener('submit', function (event) {
      /* Stop the old mailto: listener in script.js from also firing */
      event.stopImmediatePropagation();
      event.preventDefault();

      /* Read field values */
      var name    = form.name    ? form.name.value.trim()    : '';
      var email   = form.email   ? form.email.value.trim()   : '';
      var subject = form.subject ? form.subject.value.trim() : '';
      var message = form.message ? form.message.value.trim() : '';

      /* Basic guard — script.js already validates, but keep this as a safety net */
      if (!name || !email || !subject || !message) {
        setStatus('error', 'Please fill in all required fields.');
        return;
      }

      /* Disable button and show loading spinner */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending\u2026';
      }
      setStatus('', '');

      /* POST form data to Web3Forms */
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name:       name,
          email:      email,
          subject:    subject,
          message:    message,
          /* Optional: customize the email subject line in your inbox */
          from_name:  'Portfolio Contact Form'
        })
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            setStatus(
              'success',
              '\u2713 Message sent! Thank you, ' + name + '. I\u2019ll reply to ' + email + ' soon.'
            );
            form.reset();
          } else {
            var errMsg = (result.data && result.data.message)
              ? result.data.message
              : 'Something went wrong. Please try again or email me directly at asadokz18@gmail.com.';
            setStatus('error', errMsg);
          }
        })
        .catch(function () {
          setStatus(
            'error',
            'Network error. Please check your connection and try again, or email me directly at asadokz18@gmail.com.'
          );
        })
        .finally(function () {
          /* Re-enable the submit button */
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i>Send Message';
          }
        });

    }, true /* useCapture = true: runs before the script.js listener */);
  }

  /* -----------------------------------------------------------------------
     Helper: apply a success / error / empty state to #form-status.
     ----------------------------------------------------------------------- */
  function setStatus(type, text) {
    var status = document.getElementById('form-status');
    if (!status) return;
    status.textContent = text;
    status.className = 'form-status' + (type ? ' form-status--' + type : '');
  }

  /* -----------------------------------------------------------------------
     Wait for the DOM to be ready before wiring up the form.
     ----------------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeb3Forms);
  } else {
    initWeb3Forms();
  }

})();

