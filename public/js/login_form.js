document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
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
    alert(result.message); // Display an alert message
    console.log(result.message); // Log the message to the console
    // Store the token in localStorage
    localStorage.setItem('token', result.token);
    window.location.href = '/';
  } else {
    alert(result.message); // Display an alert message for errors
    console.log(result.message); // Log the error message to the console
  }
});