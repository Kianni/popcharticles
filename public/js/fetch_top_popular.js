document
  .getElementById('fetchTopArticles')
  .addEventListener('click', async () => {
    try {
      const response = await fetch('/top-popular', {
        method: 'GET',
      });
      const wordCloudProto = await response.json(); // Update the DOM with the fetched articles

      //   const topArticlesContainer = document.getElementById('topArticlesContainer');
      //   topArticlesContainer.innerHTML = wordCloudProto; // Clear previous articles

      //   console.log('Articles fetched and DOM updated:', wordCloudProto);
      console.log('Articles fetched:', wordCloudProto);
      // Verify the structure of wordCloudProto
      if (
        !Array.isArray(wordCloudProto) ||
        !wordCloudProto.every(
          (item) => Array.isArray(item) && item.length === 2
        )
      ) {
        console.error('Invalid wordCloudProto structure:', wordCloudProto);
        return;
      }
      // Generate the word cloud
      WordCloud(document.getElementById('wordCloudContainer'), {
        list: wordCloudProto,
        gridSize: 10,
        weightFactor: 5,
        fontFamily: 'Times, serif',
        color: 'random-dark',
        backgroundColor: '#f9f9f9',
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  });