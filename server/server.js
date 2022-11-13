const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("respond");
});

app.listen(PORT, () => {
    console.log(`Server Activate: http://localhost:${PORT}/`);
});