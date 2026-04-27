/* =====================================================
   CONTACT.JS — Form submission handler
   ===================================================== */

const form = document.getElementById('contactForm');
const btn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const formMsg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('inputName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const message = document.getElementById('inputMessage').value.trim();

    if (!name || !email || !message) {
      showMsg('Please fill in your name, email, and message.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btn.querySelector('i').className = 'bi bi-arrow-repeat spin';

    setTimeout(() => {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      btn.querySelector('i').className = 'bi bi-send-fill';
      form.reset();
      showMsg('✅ Message sent! I\'ll get back to you within 24 hours.', 'success');
    }, 1800);
  });
}

function showMsg(text, type) {
  formMsg.style.display = 'block';
  formMsg.textContent = text;
  formMsg.className = `form-msg ${type}`;
  setTimeout(() => {
    formMsg.style.display = 'none';
  }, 6000);
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { display: inline-block; animation: spin 0.8s linear infinite; }
`;
document.head.appendChild(style);
