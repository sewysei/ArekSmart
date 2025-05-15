import express from "express";
const app = express();

app.get("/", (req, res) => {
  const msg = "Hello World";
  res.json({
    msg,
  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
