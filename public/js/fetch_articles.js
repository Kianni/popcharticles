document.getElementById('fetchDataButton').addEventListener('click', async () => {
  try {
    const response = await fetch('/articles', {
      method: 'GET',
    });
    const articles = await response.json();
    console.log('Articles:', articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
});