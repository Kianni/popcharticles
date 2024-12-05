document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (response.ok) {
    alert(result.message);
    // Store the token in localStorage
    localStorage.setItem('token', result.token);
    window.location.href = '/';
  } else {
    alert(result.message);
  }
});