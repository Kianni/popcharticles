document.getElementById('logoutButton').addEventListener('click', async () => {
  console.log('Logout button clicked');
  const response = await fetch('http://127.0.0.1:3000/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        alert('You have been logged out.');
        window.location.href = '/'; // Redirect to login page
      } else {
        alert('Logout failed.');
      }
    })
    .catch((error) => {
      console.error('Error during logout:', error);
      alert('An error occurred during logout.');
    });
});
