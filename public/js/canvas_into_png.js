window.onload = function () {
  console.log('html2canvas:', typeof html2canvas); // Check if html2canvas is loaded
  document
    .getElementById('downloadWordCloud')
    .addEventListener('click', function () {
      const wordCloudContainer = document.getElementById('wordCloudContainer');
      html2canvas(wordCloudContainer).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'wordcloud.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    });
};
