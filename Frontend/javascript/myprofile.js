document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  let username = params.get('username');
  if (!username) {
    try {
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (stored && stored.username) {
        username = stored.username;
      }
    } catch (_) {}
  }

  async function loadProfile() {
    if (!username) {
      return;
    }

    try {
      // Fetch user profile from backend
      const res = await fetch(`http://localhost:3000/profile/${username}`);
      const user = await res.json();

      if (res.ok) {
        document.getElementById('name').value = user.username || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('department').value = user.department || '';
        document.getElementById('designation').value = user.designation || '';
        if (user.gender) {
          document.getElementById('gender').value = user.gender;
        } else {
          document.getElementById('gender').value = '';
        }
        document.getElementById('contact').value = user.contact || '';
        console.log('Profile loaded successfully:', user);
      } else {
        console.error('Profile load failed:', user);
        showError(user.message || 'Failed to load profile', 'Profile Load Error');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      showError('Error loading profile', 'Connection Error');
    }
  }

  // Load profile when page loads
  loadProfile();

  // Add navigation back to dashboard
  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Dashboard';
  backButton.style.cssText = 'margin: 20px; padding: 10px 20px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;';
  backButton.onclick = () => {
    if (username) {
      window.location.href = `dashboard.html?username=${username}`;
    } else {
      window.location.href = 'dashboard.html';
    }
  };
  document.body.insertBefore(backButton, document.getElementById('profileForm'));

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedUser = {
      // Prefer known username; otherwise fall back to typed name
      username: username || document.getElementById('name').value.trim(),
      email: document.getElementById('email').value,
      department: document.getElementById('department').value,
      designation: document.getElementById('designation').value,
      gender: document.getElementById('gender').value,
      contact: document.getElementById('contact').value,
    };

    try {
      const res = await fetch('http://localhost:3000/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      const result = await res.json();

      if (res.ok) {
        showSuccess('Profile updated successfully!', 'Profile Updated');
      } else {
        showError(result.message || 'Update failed', 'Update Error');
      }
    } catch (err) {
      console.error(err);
      showError('Error updating profile', 'Update Error');
    }
  });
});
