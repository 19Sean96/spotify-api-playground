import React, { useState, useEffect, useContext } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.scss";
import {WebPlayer} from './context';

function App() {
	const [windowObjRef, setWindowObjRef] = useState();
	const [profile, setProfile] = useState();
    const {loggedIn, tokens, player, setTokens} = useContext(WebPlayer);

	const checkCookies = () => {
		let a, b;
		const cookies = document.cookie.split("; ");
		if (cookies.length > 2) {
			cookies.forEach(cookie => {
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
			});
	}

	useEffect(() => {
        if (tokens.length > 0) {
            if(!loggedIn){
                axios(`/refresh_token?refresh_token=${tokens[1]}`)
                .then(res => {
                    setTokens(prevState => [res.data, prevState[1]])
                })
            } else {
                windowObjRef && !windowObjRef.closed && windowObjRef.close();
                getProfile();
                console.log(window.Spotify)
            }
        } 
        else {
            checkCookies();
        }
	}, [tokens, loggedIn]);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>This is an example of the Authorization Code flow</p>

				{!loggedIn ? (
					<button
						className="login-btn"
						onClick={openRequestedPopUp}
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
							
						}}>Get currently playing song</button>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
