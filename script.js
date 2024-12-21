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

function lookupHex() {
    const hexInput = document.getElementById('hexInput');
    const hexValue = hexInput.value.toLowerCase();
    const output = document.getElementById('output');

    if (hexValue.length === 4) {
        const result = data[hexValue];

        if (result) {
            output.innerHTML = `
                <div class="output">
                    <p><span>Gift Code:</span> <span>${hexValue}</span></p>
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
}

// Focus on the input box when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('hexInput').focus();
});