import React, { useState, useEffect, useContext } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.scss";
import { WebPlayerContext } from "./context";
import WebPlayer from "./components/WebPlayer";
import Visualizer from "./components/visualizer";
import { getProfile } from "./functions";
function App() {
	const [windowObjRef, setWindowObjRef] = useState();
	const [profile, setProfile] = useState();
	const {
		loggedIn,
		tokens,
		player,
		setTokens,
		time,
		audioDetails,
		track,
	} = useContext(WebPlayerContext);

	const checkCookies = () => {
		let a, b;
		const cookies = document.cookie.split("; ");
		if (cookies.length > 2) {
			cookies.forEach((cookie) => {
				if (cookie.includes("a=")) {
					a = cookie.slice(2);
				} else if (cookie.includes("b=")) {
					b = cookie.slice(2);
				} else return;
			});

			setTokens([a, b]);
		} else {
			setTimeout(checkCookies, 300);
		}
	};

	let uri

	const openRequestedPopUp = (uri) => {
		setWindowObjRef(
			window.open(
				`${uri}login`,
				"Log In To Your Spotify Account",
				"height=1200,width=800,opener"
			)
		);
	};

	useEffect(() => {
		console.log(process.env.NODE_ENV);

		if ( ! '%NODE_ENV%' || process.env.NODE_ENV === 'development') {
			console.log('you are currently in development');
			uri = 'http://localhost:8888/'
		}
		else {
			console.log('you are currently in production');

			uri = window.location.href;

			// if (!uri.includes('localhost')) uri += ':8888'
		}
		console.log(uri)
	}, [])

	useEffect(() => {
		if (tokens.length > 0) {
			if (!loggedIn) {
				axios(`/refresh_token?refresh_token=${tokens[1]}`).then(
					(res) => {
						setTokens((prevState) => [res.data, prevState[1]]);
					}
				);
			} else {
				windowObjRef && !windowObjRef.closed && windowObjRef.close();
				// getProfile();

				getProfile(tokens[0]).then((res) => setProfile(res));
				// console.log(window.Spotify)
			}
		} else {
			checkCookies();
		}
	}, [tokens, loggedIn]);

	return (
		<div className="App">
			<Visualizer time={time} audioDetails={audioDetails} track={track} />
			{!loggedIn ? (
				<div className="login">
						<p className="login--text">
							Login to your Spotify Account
						</p>
						<button
							className="login--btn"
							onClick={() => openRequestedPopUp(uri)}
						>
							Login
						</button>
				</div>
			) : (
				<p style={{ display: "none" }}>you are already logged in!</p>
			)}
			{/* 
				{tokens && (
					<div className="oath">
						<p className="access-token">{tokens[0]}</p>
						<p className="refresh-token">{tokens[1]}</p>
					</div>
				)}

				{profile && (
					<div>
						<p>Email: {profile.email}</p>
						<p>Display Name: {profile.display_name}</p>
						<button onClick={e => {
							
						}}>Get currently playing song</button>
					</div>
				)} */}
			{loggedIn && player && <WebPlayer />}
		</div>
	);
}

export default App;
