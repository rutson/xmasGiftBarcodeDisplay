let data = {};

// Function to load and parse the CSV file from Google Sheets
function loadCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJc2dvgZh7jYOWDmjoTH2NSt6S1OgATNviAYbvSv09n5KETCSQZqQYOfB1TPU-9HDPl_RI_3PI15zm/pub?gid=0&single=true&output=csv';

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    results.data.forEach(row => {
                        data[row.Code.toLowerCase()] = {
                            from: row.From,
                            to: row.To
                        };
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV:', error));
}

// Call the function to load the CSV when the script is loaded
loadCSV();

let inputTimeout;

function lookupHex() {
    const hexInput = document.getElementById('hexInput');
    const hexValue = hexInput.value.toUpperCase(); // Ensure the value is uppercase
    const output = document.getElementById('output');

    if (hexValue.length === 4) {
        const result = data[hexValue.toLowerCase()]; // Use lowercase for lookup

        if (result) {
            output.innerHTML = `
                <div class="output">
                    <p><span>Gift Code:</span> <span class="gift-code">${hexValue}</span></p>
                    <p><span>From:</span> <span>${result.from}</span></p>
                    <p><span>To:</span> <span>${result.to}</span></p>
                </div>
            `;
        } else {
            output.innerHTML = `<p>No data found for hex: ${hexValue}</p>`;
        }

        // Clear the input field after lookup
        hexInput.value = '';
    } else {
        output.innerHTML = '';
    }

    // Reset the timeout
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
        hexInput.value = '';
    }, 5000);

    // Ensure focus stays in the input box
    hexInput.focus();
}

function restrictHexInput(event) {
    const hexInput = event.target;
    hexInput.value = hexInput.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
}

// Focus on the input box when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    const hexInput = document.getElementById('hexInput');
    hexInput.focus();
    hexInput.addEventListener('input', restrictHexInput);
});