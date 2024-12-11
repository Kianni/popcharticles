document
  .getElementById('createWordCloud')
  .addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default anchor link behavior
    const searchId = event.target.getAttribute('data-search-id'); // Extract searchId from data attribute
    try {
      const response = await fetch(`/prepareWordCloudData?searchId=${searchId}`, {
        method: 'GET',
      });
      const wordCloudProto = await response.json(); // Update the DOM with the fetched articles

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