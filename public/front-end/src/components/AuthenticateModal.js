import React, { useState, useEffect } from "react";
import querystring from "querystring";
export default (props) => {
    const scope = "user-read-private user-read-email user-read-currently-playing user-read-playback-state";
	return (
		<div className="auth__wrapper">
			{/* <iframe
				src={
					"https://accounts.spotify.com/authorize?" +
					querystring.stringify({
						response_type: "code",
						client_id: process.env.REACT_APP_CLIENT_ID,
						scope: scope,
						redirect_uri: "http://localhost:8888/callback",
						state: generateRandomString(16),
					})
				}
				frameborder="0"
			></iframe> */}
		</div>
	);
};

const generateRandomString = function (length) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
