const cryptoDataElement = document.getElementById('cryptoData');

// Function to fetch and display data
async function fetchData() {
  try {
    const response = await fetch('/get-data');
    const cryptoData = await response.json();

    // Create and populate a table with the data
    const table = document.createElement('table');
    table.classList.add('crypto-table');

    // Create table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Name</th>
      <th>Last</th>
      <th>Buy</th>
      <th>Sell</th>
      <th>Volume</th>
      <th>Base Unit</th>
    `;
    table.appendChild(headerRow);

    // Populate table rows with data
    cryptoData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.last}</td>
        <td>${item.buy}</td>
        <td>${item.sell}</td>
        <td>${item.volume}</td>
        <td>${item.base_unit}</td>
      `;
      table.appendChild(row);
    });

    // Clear existing content and append the table
    cryptoDataElement.innerHTML = '';
    cryptoDataElement.appendChild(table);
  } catch (error) {
    console.error(error);
  }
}

// Fetch and display data initially
fetchData();
