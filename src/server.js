var express = require("express");
var app = express();
const PORT = process.env.PORT || 5000;
app.get("/", function(req, res) {
  res.send("Hello World! >>> heroku >>>>> cmj");
});

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
