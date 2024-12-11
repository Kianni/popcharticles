// Function to create and insert the form
function createWordCloudForm() {
  const formHtml = `
      <form id="wordCloudForm" class="form-inline">
        <div class="form-group">
          <label for="numWords">Number of Words:</label>
          <input type="number" class="form-control" id="numWords" name="numWords" min="50" step="1">
          <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('numWords').value = '';">Clear</button>
        </div>
        <div class="form-group">
          <label for="wordFrequency">Word Frequency:</label>
          <input type="number" class="form-control" id="wordFrequency" name="wordFrequency" min="1" step="1">
          <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('wordFrequency').value = '';">Clear</button>
        </div>
      </form>
    `;
  document.getElementById('formContainer').innerHTML = formHtml;
}

// Call the function to create the form
createWordCloudForm();

document
  .getElementById('createWordCloud')
  .addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default anchor link behavior
    const searchId = event.target.getAttribute('data-search-id'); // Extract searchId from data attribute

    const form = document.getElementById('wordCloudForm');
    const formData = new FormData(form);
    const numWords = formData.get('numWords');
    const wordFrequency = formData.get('wordFrequency');

    let queryParams = `searchId=${searchId}`;
    if (numWords) {
      queryParams += `&numWords=${numWords}`;
    } else if (wordFrequency) {
      queryParams += `&wordFrequency=${wordFrequency}`;
    }

    try {
      const response = await fetch(`/prepareWordCloudData?${queryParams}`, {
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
