let Currency = []; 

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    Currency = data;
  })
  .catch(error => console.error('Error fetching data:', error));

export { Currency };

