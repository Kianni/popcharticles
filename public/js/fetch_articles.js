document.getElementById('fetchDataButton').addEventListener('click', async () => {
  try {
    const response = await fetch('/articles', {
      method: 'GET',
    });
    const articles = await response.json();

    // // Send the fetched data to the server
    // await fetch('/update-dashboard', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ articles }),
    // });

    // console.log('Articles sent to server:', articles);

    // Update the DOM with the fetched articles
    const articlesContainer = document.getElementById('articlesContainer');
    articlesContainer.innerHTML = ''; // Clear previous articles

    articles.forEach((article) => {
      const articleElement = document.createElement('li');
        articleElement.innerHTML = `
        <h3>${article.webTitle}</h3>
        <p>${article.fields.trailText}</p>
        <a href="${article.webUrl}" target="_blank">Read more</a>
        `;
      articlesContainer.appendChild(articleElement);
    });

    console.log('Articles fetched and DOM updated:', articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
});