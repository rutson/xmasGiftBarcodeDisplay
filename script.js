let data = {};

let encryptedURLs = [
    // Encrypted URLs
    "PnuiLi/SJGr0K+BvkVvCBUvKKD2dSiq6XNEGfCNbQbIroOfHl1kEe1wH/l5OPvpVaiGkYMJ5KgFSlt62h3ekSG8qUxVCqLDNbmLS7IqH3oZcu7NqjhQei5Kg+TqbUM3AUR5wCSDV8h5pedIV1fDdM6TLpxBZ+y4pjba4iXKwtEBUjLHOvMGgJqMldePV2P9rTEb6duvE2rIfP42epj/ccHie8t2rfjVpSRo/09fYvsg=",
    "pTX9yQv+8qI6ZTkUO0f0i2zibOiH22FHT5Q8ADf5/ZbUyBgclV/NNSnqs9N22yfBxKICnl0bvqS0vC0IrWQW8HUjOQ5F9df4U4zQ7PQlJy4YKT2HKGRKj2MoO7GcyBIeFq21m3KAiJNxdGhv1Fk3NP8TPx1BpTpKClUQh0S2o7igDtJnWF84CJhBScFVc5ascNSng2GfXC4saUFFK4fCuhttjEIgs4P1CuQPvGZ2VQ8="
];

// Function to decrypt the URL using the secret key
function decryptURL(secretKey) {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(secretKey); // Using the same key as IV for simplicity

    for (let i = 0; i < encryptedURLs.length; i++) {
        const encryptedURL = encryptedURLs[i];
        const decrypted = CryptoJS.AES.decrypt(encryptedURL, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        try {
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.log("not this one!");
        }
    }
}

// Function to load and parse the CSV file from the decrypted URL
function loadCSV(secretKey) {
    const csvUrl = decryptURL(secretKey);

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
                    document.getElementById('hexInput').style.display = 'inline-block'; // Show hexInput
                    document.getElementById('secretKeyInput').style.display = 'none'; // Hide secretKeyInput
                    document.getElementById('hexInput').focus(); // Focus on hexInput
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the CSV:', error);
            document.getElementById('hexInput').style.display = 'none'; // Hide hexInput on error
        });
}

let inputTimeout;

// Function to lookup the hex code in the data
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

// Function to restrict hex input to valid characters
function restrictHexInput(event) {
    const hexInput = event.target;
    hexInput.value = hexInput.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
}

// Function to setup the secret key input
function setupSecretKeyInput() {
    const secretKeyInput = document.getElementById('secretKeyInput');
    secretKeyInput.focus();
    secretKeyInput.addEventListener('input', () => {
        const secretKey = secretKeyInput.value;
        if (secretKey.length === 16) {
            loadCSV(secretKey);
        }
    });
}

// Focus on the input box when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('hexInput').style.display = 'none'; // Hide hexInput initially
    setupSecretKeyInput();
    const hexInput = document.getElementById('hexInput');
    hexInput.addEventListener('input', restrictHexInput);
});