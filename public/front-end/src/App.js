import React, { useState, useEffect, useContext } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.scss";
import {WebPlayer} from './context';

function App() {
	// const Spotify = window.spotify-player.js
	const [loggedIn, handleLogin] = useState(false);
	const [windowObjRef, setWindowObjRef] = useState();
	// const [tokens, setTokens] = useState([]);
	const [tokensWereSet, setTokensWereSet] = useState(false);
	const [profile, setProfile] = useState();
    const [currentlyPlaying, setCurrentlyPlaying] = useState();
    const {tokens, setTokens, setPlayer} = useContext(WebPlayer);

	const checkCookies = () => {
		let a, b;
		const cookies = document.cookie.split("; ");
		if (cookies.length > 2) {
			cookies.forEach((cookie, index) => {
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

	const openRequestedPopUp = () => {
		setWindowObjRef(
			window.open(
				`http://localhost:8888/login`,
				"Log In To Your Spotify Account",
				"height=1200,width=800,opener"
			)
		);
	};

	const getProfile = () => {
		axios({
			url: "https://api.spotify.com/v1/me",
			headers: {
				Authorization: `Bearer ${tokens[0]}`,
			},
			json: true,
		})
			.then((response) => {
                console.log(response.data);
                setProfile(response.data)
			})
			.catch((error) => {
				console.log(error);
				// res.redirect(
				// 	`/#${querystring.stringify({
				// 		error: "invalid_token",
				// 	})}`
				// );
			});
	}
	
	const getCurrentlyPlaying = () => {
		axios({
			url: "https://api.spotify.com/v1/me/player/currently-playing",
			headers: {
				Authorization: `Bearer ${tokens[0]}`,
			},
			json: true,
		})
			.then((response) => {
                console.log(response.data);
                setCurrentlyPlaying(response.data)
			})
			.catch((error) => {
				console.log(error);
				// res.redirect(
				// 	`/#${querystring.stringify({
				// 		error: "invalid_token",
				// 	})}`
				// );
			});
	}

	useEffect(() => {
		if (!tokensWereSet) {
			checkCookies();

			if (tokens.length > 0) {
				setTokensWereSet(true);
                windowObjRef && !windowObjRef.closed && windowObjRef.close();
                getProfile();
                // setPlayer(new Spotify.Player({
                //     name: 'Web Playback SDK Quick Start Player',
                //     getOAuthToken: cb => cb(token)
                // }))
			}
		}
	}, [tokens]);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>This is an example of the Authorization Code flow</p>

				{!loggedIn ? (
					<button
						className="login-btn"
						onClick={
							openRequestedPopUp
							// axios({
							//   url: 'http://localhost:8888/test',
							//   method: 'get'
							// }).then(response => {
							//   console.log(response)
							// })
						}
					>
						Login With Spotify
					</button>
				) : (
					<p>you are already logged in!</p>
				)}

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
							getCurrentlyPlaying()
						}}>Get currently playing song</button>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
