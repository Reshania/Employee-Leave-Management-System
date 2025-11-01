document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('Please enter both username and password', 'Validation Error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Store user information including role and gender
      const userInfo = {
        username: username,
        role: result.role || 'employee',
        department: result.department,
        designation: result.designation,
        gender: result.gender || ''
      };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      showSuccess('Login successful!', 'Welcome');
      
      // Redirect based on user role
      if (result.role === 'admin' || result.role === 'manager') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = `dashboard.html?username=${encodeURIComponent(username)}`;
      }
    } else {
      showError(result.message || 'Login failed. Please check your credentials.', 'Login Failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please check if the server is running and try again.', 'Connection Error');
  }
});
