const express = require("express");
const request = require("request");
const app = express();

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Proxy endpoint
app.get("/proxy", (req, res) => {
  const apiUrl = req.query.url;
  if (!apiUrl) {
    return res.status(400).send("URL is required");
  }

  // Set the User-Agent header in the proxied request
  const options = {
    url: apiUrl,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    },
  };

  request(options).pipe(res);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`CORS proxy server running on port ${PORT}`);
});
