// Function to create and insert the form
function createWordCloudForm() {
  const formHtml = `
      <form id="wordCloudForm" class="form">
        <fieldset class="border p-3 mb-3">
          <legend class="w-auto" style="font-size: 14px; font-style: italic;">Choose either of the two options</legend>
          <div class="form-group row align-items-center">
            <label for="numWords" class="col-12 col-md-3 col-form-label"><strong>Number</strong> of Top Words:</label>
            <div class="col-12 col-md-2">
              <input type="number" class="form-control" id="numWords" name="numWords" min="0" step="1" value="50">
            </div>
            <div class="col-12 col-md-2 mt-2 mt-md-0">
              <button type="button" class="btn btn-sm btn-secondary w-100" onclick="document.getElementById('numWords').value = '';">Clear</button>
            </div>
          </div>
          <p class="text-left my-3">----------------OR---------------</p>
          <div class="form-group row align-items-center">
            <label for="wordFrequency" class="col-12 col-md-3 col-form-label">Minimum Word <strong>Frequency</strong>:</label>
            <div class="col-12 col-md-2">
              <input type="number" class="form-control" id="wordFrequency" name="wordFrequency" min="1" step="1" value="undefined">
            </div>
            <div class="col-12 col-md-2 mt-2 mt-md-0">
              <button type="button" class="btn btn-sm btn-secondary w-100" onclick="document.getElementById('wordFrequency').value = '';">Clear</button>
            </div>
          </div>
        </fieldset>
        <div class="form-group row align-items-center mx-2">
          <label for="wordSize" class="col-12 col-md-3 col-form-label">Word Size:</label>
          <div class="col-12 col-md-2">
            <input type="number" class="form-control" id="wordSize" name="wordSize" min="1" step="1" value="10">
          </div>
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
    const wordSize = formData.get('wordSize');

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
        weightFactor: wordSize ? wordSize : 10,
        fontFamily: 'Times, serif',
        color: 'random-dark',
        backgroundColor: '#f9f9f9',
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  });
