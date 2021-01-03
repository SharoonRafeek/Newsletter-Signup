const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { Http2ServerRequest } = require("http2");
const dotenv = require("dotenv");

dotenv.config();

app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.URL;
    const api = process.env.API_KEY;

    const options = {
        method: "POST",
        auth: api
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});

