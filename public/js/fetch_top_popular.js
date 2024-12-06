document
  .getElementById('fetchTopArticles')
  .addEventListener('click', async () => {
    try {
      const response = await fetch('/top-popular', {
        method: 'GET',
      });
      const wordCloudProto = await response.json(); // Update the DOM with the fetched articles

      const topArticlesContainer = document.getElementById('topArticlesContainer');
      topArticlesContainer.innerHTML = wordCloudProto; // Clear previous articles

      console.log('Articles fetched and DOM updated:', wordCloudProto);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  });