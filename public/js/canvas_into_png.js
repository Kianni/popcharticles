window.onload = function () {
  // console.log('html2canvas:', typeof html2canvas); // Check if html2canvas is loaded

  const createWordCloudButton = document.getElementById('createWordCloud');
  const searchId = createWordCloudButton.getAttribute('data-search-id');

  let searchObject = {};
  let details = ''; 
  // Fetch the search object
  fetch(`/search/${searchId}`)
    .then((response) => response.json())
    .then((data) => {
      searchObject = data;
      if (searchObject.popularityPeriod == null) {
        details = `${searchObject.keyword}_guardian`;
      } else {
        details = `${searchObject.popularityPeriod}days_nytimes`;
      }
    })
    .catch((error) => console.error('Error fetching search object:', error));


  document
    .getElementById('downloadWordCloud')
    .addEventListener('click', function () {
      const wordCloudContainer = document.getElementById('wordCloudContainer');
      html2canvas(wordCloudContainer).then((canvas) => {
        const link = document.createElement('a');
        const currentDate = new Date().toLocaleDateString('fi-FI');

        link.download = `${details}_wordcloud_${currentDate}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
};
