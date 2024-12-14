// Function to create and insert the form
function createWordCloudForm() {
  const formHtml = `
      <form id="wordCloudForm" class="form">
        <div class="form-group d-flex align-items-center">
          <label for="numWords" class="me-2 mr-2">Number of Words:</label>
          <input type="number" class="form-control mr-2" id="numWords" name="numWords" min="0" step="1" value="50" style="width: 200px;">
          <button type="button" class="btn btn-sm btn-secondary ms-2" onclick="document.getElementById('numWords').value = '';">Clear</button>
        </div>
        <div class="form-group d-flex align-items-center mt-3">
          <label for="wordFrequency" class="me-2 mr-2">Word Frequency:</label>
          <input type="number" class="form-control mr-2" id="wordFrequency" name="wordFrequency" min="1" step="1" value="undefined" style="width: 200px;">
          <button type="button" class="btn btn-sm btn-secondary ms-2" onclick="document.getElementById('wordFrequency').value = '';">Clear</button>
        </div>
      </form>
    `;
  document.getElementById('formContainer').innerHTML = formHtml;
}

// Call the function to create the form
createWordCloudForm();

// Add an event listener to set value of wordFrequency to 'undefined' when numWords is changed
document.getElementById('numWords').addEventListener('change', (event) => {
  document.getElementById('wordFrequency').value = 'undefined';
});

// Add an event listener to set value of numWords to 'undefined' when wordFrequency is changed
document.getElementById('wordFrequency').addEventListener('change', (event) => {
  document.getElementById('numWords').value = 'undefined';
});

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

      // Set the style for the wordCloudContainer
      const wordCloudContainer = document.getElementById('wordCloudContainer');
      wordCloudContainer.style.width = '1000px';
      wordCloudContainer.style.height = '800px';

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
