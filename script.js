document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyCu9jU0mU4T3q2NV5m2buYL7zuXQwW3szU'; // Replace with your actual Tenor API key
    const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1300865730757136454/GAPaHG7_8usiU4GuQ3Vq5IsXI0W9ZIk9fX7oC9SybVFqHrd3mtpCDEh7rIwfIKDYoFQz'; // Replace with your Discord webhook URL
    const API_URL = 'https://tenor.googleapis.com/v2/search';

    // Hardcoded credentials for two accounts
    const accounts = [
        { username: 'Cookie', password: 'viksbestf' }, // Change to your desired username and password
        { username: 'Vikki', password: 'donttry' },  // Change to your desired username and password
        { username: 'Dummy', password: 'thisisnotforyou'}
    ];

    // Expanded base keywords for each mood
    const keywords = {
        happy: ['happy', 'joyful', 'excited', 'celebration', 'smile', 'funny happy', 'party'],
        neutral: ['okay', 'meh', 'normal', 'neutral face', 'casual', 'bored', 'expressionless'],
        sad: ['sad', 'down', 'unhappy', 'crying', 'disappointed', 'lonely', 'gloomy', 'tearful']
    };

    // Modifiers to further increase diversity in search queries
    const modifiers = ['disney character', 'cartoon', 'animation', 'kpop', 'hello kitty', 'funny'];

    // Function to fetch a random GIF for a dynamically generated search term
    function fetchGifForMood(mood, elementId) {
        const randomBaseKeyword = keywords[mood][Math.floor(Math.random() * keywords[mood].length)];
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        const searchQuery = `${randomBaseKeyword} ${randomModifier}`;

        fetch(`${API_URL}?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}&limit=1&random=true&media_filter=gif`)
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

    // Fetch random GIFs for each mood
    fetchGifForMood('happy', 'happy');
    fetchGifForMood('neutral', 'neutral');
    fetchGifForMood('sad', 'sad');

    // Function to send message to Discord via webhook
    function sendMessageToDiscord(mood, username) {
        const message = `${username} is feeling ${mood} today!`;

        fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Message sent successfully to Discord:', message);
            } else {
                console.error('Error sending message to Discord:', response.statusText);
            }
        })
        .catch(error => console.error('Error sending message to Discord:', error));
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission refresh
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        // Validate credentials
        const userAccount = accounts.find(account => 
            account.username === usernameInput && account.password === passwordInput
        );

        if (userAccount) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('moodTrackerContainer').style.display = 'block';
            // Store the current username for sending messages
            window.currentUsername = userAccount.username; 
        } else {
            document.getElementById('loginError').innerText = 'Invalid username or password!';
        }
    });

    // Handle mood selection
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = '';

    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedMood = option.getAttribute('data-value');
        });
    });

    // Handle mood log submission
    const moodForm = document.getElementById('moodForm');
    moodForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission refresh
        if (selectedMood) {
            sendMessageToDiscord(selectedMood, window.currentUsername); // Send selected mood to Discord
        } else {
            alert('Please select a mood before logging.');
        }
    });
});
