To create a CORS proxy and use it in a React.js application, follow these steps:

### Step 1: Set Up the CORS Proxy Server

1. **Set Up Node.js Project for the Proxy:**

   - Create a new directory for the CORS proxy server:
     ```bash
     mkdir cors-proxy-server
     cd cors-proxy-server
     ```
   - Initialize the Node.js project:
     ```bash
     npm init -y
     ```
   - Install required dependencies:
     ```bash
     npm install express request
     ```

2. **Create the Proxy Server:**

   - Create a file called `index.js` inside the `cors-proxy-server` directory:
     ```javascript
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
     ```

   ```
   - CORS Middleware: It allows requests from any origin by setting the appropriate headers.
   - Proxy Endpoint: It sets up an endpoint /proxy that forwards the request to the target URL specified in the query parameter.
   - User-Agent header: Adds a custom User-Agent header to the proxied requests, identifying the client making the request.
   - Server: It starts an Express server listening on port 8080 (or the port specified in the environment variable).
   ```

3. **Run the CORS Proxy Server:**
   - Start the server:
     ```bash
     node index.js
     ```
   - The server will run on `http://localhost:8080`.

### Step 2: Use the CORS Proxy in Your React Application

1.  **Set Up React Project:**

    - If you don’t already have a React project, create one using `create-react-app`:
      ```bash
      npx create-react-app my-react-app
      cd my-react-app
      ```

2.  **Fetch Data Using the CORS Proxy:**

    - In your React component, use `fetch` to get data from the MangaDex API via the CORS proxy server.
    - Example in a React component:

      ```javascript
      import React, { useEffect, useState } from "react";
      import axios from "axios";
       function ProxyDemo() {
       // State variables
       const [limit, setLimit] = useState(6);
       const [order, setOrder] = useState({ followedCount: "desc" });
       const [queryParams, setQueryParams] = useState("");
       const [selectedGern, setSelectedGern] = useState("");
       const apiUrl = "https://api.mangadex.org/manga";
       const proxyUrl = `http://localhost:8080/proxy?url=`;

        useEffect(() => {
        	// Params constructing
        	const params = new URLSearchParams();
        	params.append("limit", limit);

        	if (selectedGern) {
        		params.append("includedTags[]", selectedGern);
        	}
        	Object.keys(order).forEach((key) => {
        		params.append(`order[${key}]`, order[key]);
        	});

        	setQueryParams(params.toString());

        	const fetchData = async () => {
        		try {
        			const fullUrl = `${apiUrl}?${params.toString()}`;
        			const resp = await axios.get(
        				`${proxyUrl}${encodeURIComponent(fullUrl)}`
        			);
        			console.log(resp.data); // Handle the response data here
        		} catch (error) {
        			console.error("Error fetching data:", error);
        		}
        	};

        	fetchData();
        }, [selectedGern]);

        return (
        	<div>
        		{/* Add your JSX here */}
        	</div>
        );
       }
       export default ProxyDemo;
    ```
    - This component fetches data from the MangaDex API through your CORS proxy and displays it.
    ```

### Step 3: Run Your React App

1. **Start the React App:**

   - In the root directory of your React project, start the React app:
     ```bash
     npm start
     ```

2. **View the Data:**
   - Open your browser and navigate to `http://localhost:5173` (or the default React server URL). You should see the fetched MangaDex API data displayed in your app.

### Step 4: Deploy the CORS Proxy (Optional)

If you want to deploy your CORS proxy so it can be used in production:

- **Deploy to a Cloud Service:**

  - Platforms like Heroku, Vercel, or any cloud service that supports Node.js can host your CORS proxy server.

- **Update React App to Use Deployed Proxy:**
  - After deploying, update the `proxyUrl` in your React app to point to the deployed CORS proxy server.

By following these steps, you can effectively bypass CORS restrictions when using the MangaDex API in your React.js application.
