require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const querystring = require("querystring");

const cookieParser = require("cookie-parser");
const { access } = require("fs");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const generateRandomString = function (length) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = "spotify_auth_state";
const app = express();

app.use(express.static(__dirname + "/public"))
	.use(cors())
	.use(cookieParser());

app.get("/test", function (req, res) {
	res.send("it worked!");
});

app.get("/login", function (req, res) {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	const scope =
		"user-read-private user-read-email user-read-currently-playing user-read-playback-state";
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: client_id,
				scope: scope,
				redirect_uri: redirect_uri,
				state: state,
			})
	);
});

let access_token;

app.get("/callback", function (req, res) {
	// your application requests refresh and access tokens
	// after checking the state parameter

	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect(
			`/#${querystring.stringify({
				error: "state_mismatch",
			})}`
		);
	} else {
		// res.clearCookie(stateKey);

		axios({
			url: "https://accounts.spotify.com/api/token",
			method: "post",
			params: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: "authorization_code",
			},
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			auth: {
				username: client_id,
				password: client_secret,
			},
		})
			.then((response) => {
				const { access_token, refresh_token } = response.data;
				res.cookie("a", access_token);
				res.cookie("b", refresh_token);
				res.send(
					"/#" +
						querystring.stringify({
							access_token: access_token,
							refresh_token: refresh_token,
						})
				);
				console.log("ACCESS TOKEN: " + access_token);
				console.log("REFRESH TOKEN: " + refresh_token);

			})
			.catch((error) => {
				console.log(error);
				res.redirect(
					`/#${querystring.stringify({
						error: "invalid_token",
					})}`
				);
			});
	}
});

app.get("/refresh_token", function (req, res) {
	const refresh_token = req.query.refresh_token;
	axios({
		url: "https://accounts.spotify.com/api/token",
		method: "post",
		params: {
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		},
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		auth: {
			username: client_id,
			password: client_secret,
		},
	})
		.then((response) => {
			console.log(response.data);
			access_token = response.data.access_token;
			res.send({
				access_token: access_token,
			});
		})
		.catch((error) => {
			console.log(error);
			res.redirect(
				`/#${querystring.stringify({
					error: "invalid_token",
				})}`
			);
		});
});

// app.get('/currentsong', function(req,res) {
// 	axios({
// 		url: 'https://api.spotify.com/v1/me/player/currently-playing',
// 		method: 'get',

// 	})
// })
console.log("Listening on 8888");
app.listen(8888);
