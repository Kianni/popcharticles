// console.log('Default values for keyword search form are set.'); // Debugging log
document
  .getElementById('searchForm')
  .addEventListener('submit', function (event) {
    const keywordInput = document.getElementById('keyword');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const howManyArticlesInput = document.getElementById('howManyArticles');

    if (!keywordInput.value) {
      keywordInput.value = 'cybersecurity'; // Default keyword
    }
    if (!fromDateInput.value) {
      fromDateInput.value = '2023-01-01'; // Default from date
    }
    if (!toDateInput.value) {
      toDateInput.value = '2023-12-31'; // Default to date
    }
    if (!howManyArticlesInput.value) {
      howManyArticlesInput.value = 5; // Default how many articles
    }
  });
