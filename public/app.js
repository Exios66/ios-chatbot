if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Browser-specific code here
    // ... existing code that uses document ...
} else {
    // Node.js specific code or alternatives here
    console.log('Running in a Node.js environment');
}

const BASE_URL = `http://${window.location.hostname}:${window.SERVER_PORT}`;

// Use BASE_URL for all your API calls, e.g.:
fetch(`${BASE_URL}/api/someEndpoint`)
  .then(response => response.json())
  .then(data => {
    // Handle the data
  });

// ... rest of your JavaScript ...
