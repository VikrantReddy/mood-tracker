
document.addEventListener('DOMContentLoaded', () => {
    const moodsUrl = window.location.href + 'moods.json'; // Path to your moods JSON file

    // Login credentials (hardcoded for demonstration purposes)
    const users = { 'Cookie':'viksbestf', // Change to your desired username and password
        'Vikki':'donttry' ,  // Change to your desired username and password
        'NotDummy': 'thisisnotforyou'
    }
    ;

    // Function to handle login
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (users[username] && users[username] === password) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('moodTrackerContainer').style.display = 'block';
            loadMoods();
        } else {
            document.getElementById('loginError').innerText = 'Invalid username or password.';
        }
    });

    // Load moods dynamically
    function loadMoods() {
        fetch(moodsUrl)
            .then(response => response.json())
            .then(data => {
                const moodOptionsContainer = document.getElementById('moodOptionsContainer');
                data.moods.forEach(mood => {
                    const moodOptionDiv = document.createElement('div');
                    moodOptionDiv.classList.add('mood-option');
                    moodOptionDiv.dataset.value = mood.value;

                    const img = document.createElement('img');
                    img.id = mood.value;
                    img.alt = `${mood.value.charAt(0).toUpperCase() + mood.value.slice(1)} Mood`;
                    moodOptionDiv.appendChild(img);

                    const p = document.createElement('p');
                    p.innerText = mood.value.charAt(0).toUpperCase() + mood.value.slice(1);
                    moodOptionDiv.appendChild(p);

                    moodOptionsContainer.appendChild(moodOptionDiv);
                    
                    // Fetch GIF for the mood using keywords from the JSON
                    fetchGifForMood(mood.keywords, img.id); // Pass the keywords array

                    // Add event listener for selection
                    moodOptionDiv.addEventListener('click', () => {
                        document.querySelectorAll('.mood-option').forEach(option => {
                            option.classList.remove('selected');
                        });
                        moodOptionDiv.classList.add('selected');
                    });
                });
            })
            .catch(error => console.error('Error loading moods:', error));
    }

    // Function to fetch a random GIF for a dynamically generated search term
    function fetchGifForMood(keywords, elementId) {
        const randomBaseKeyword = keywords[Math.floor(Math.random() * keywords.length)];
        const modifiers = ['reaction', 'cartoon', 'animation', 'expression', 'mood', 'funny', 'face'];
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        const API_KEY = 'AIzaSyCu9jU0mU4T3q2NV5m2buYL7zuXQwW3szU'; // Replace with your actual Tenor API key
        
        const searchQuery = `${randomBaseKeyword} ${randomModifier}`;

        const API_URL = 'https://tenor.googleapis.com/v2/search';
        
        fetch(`${API_URL}?q=${encodeURIComponent(searchQuery)}&limit=1&random=true&media_filter=gif&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const gifUrl = data.results[0].media_formats.gif.url;
                    document.getElementById(elementId).src = gifUrl;
                } else {
                    console.error(`No results found for ${searchQuery}`);
                }
            })
            .catch(error => console.error('Error fetching GIF:', error));
    }

    // Handle mood form submission
    document.getElementById('moodForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedMood = document.querySelector('.mood-option.selected');
        
        if (selectedMood) {
            const moodValue = selectedMood.dataset.value;
            const username = document.getElementById('username').value; // Get logged in username

            // Send a message to Discord
            const discordWebhookUrl = 'https://discordapp.com/api/webhooks/1300865730757136454/GAPaHG7_8usiU4GuQ3Vq5IsXI0W9ZIk9fX7oC9SybVFqHrd3mtpCDEh7rIwfIKDYoFQz'; // Replace with your Discord webhook URL
            const message = {
                content: `${username} is feeling ${moodValue} and wants you to know that 👉👈`
            };

            fetch(discordWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
            .then(response => {
                if (response.ok) {
                    alert('Mood logged successfully!');
                    document.getElementById('moodLog').innerHTML += `<p>${username} logged mood: ${moodValue}</p>`;
                } else {
                    console.error('Error logging mood:', response.statusText);
                }
            })
            .catch(error => console.error('Error sending Discord message:', error));
        } else {
            alert('Please select a mood before logging.');
        }

        alert("We've informed your bestf, but maybe you can try texting as well, kinda does help them as well :3")
    });
});
