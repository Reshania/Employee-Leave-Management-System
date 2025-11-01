
 document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value.trim();
  const designation = document.getElementById('designation').value.trim();
  const gender = document.getElementById('gender').value.trim();
  const contact = document.getElementById('contact').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    showError('Passwords do not match.', 'Validation Error');
    return;
  }

  if (!department) {
    showError('Please select your department.', 'Validation Error');
    return;
  }
  if (!designation) {
    showError('Please select your designation.', 'Validation Error');
    return;
  }
  if (!gender) {
    showError('Please select your gender.', 'Validation Error');
    return;
  }
  if (!contact || isNaN(contact) || contact.length !== 10) {
    showError('Please enter a valid 10-digit contact number.', 'Validation Error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, department, designation, gender, contact }),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess('Registration successful!', 'Welcome');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      showError(result.message || 'Registration failed.', 'Registration Error');
    }
  } catch (err) {
    console.error(err);
    showError('Error connecting to server.', 'Connection Error');
  }
});

