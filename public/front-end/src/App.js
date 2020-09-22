import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.scss";

function App() {
	const [loggedIn, handleLogin] = useState(false);
	const [windowObjRef, setWindowObjRef] = useState();
	const [tokens, setTokens] = useState();
	const [watchingInterval, setWatchingInterval] = useState();

	const checkCookies = () => {
		let a, b;
		let tokens;
		console.log(document.cookie);
		const cookies = document.cookie.split("; ");
		if (cookies.length > 2) {
			cookies.forEach((cookie, index) => {
				if (cookie.includes("a=")) {
					a = cookie.slice(2);
				} else if (cookie.includes("b=")) {
					b = cookie.slice(2);
				} else return;
			});
			console.log("ACCESS_TOKEN " + a);
			console.log("REFRESH_TOKEN " + b);

			// if (a && b) clearInterval(checkCookies)
			console.log("THERE ARE COOKIES");
			console.log([a, b]);
			tokens = [a, b];
			clearInterval(watchingInterval);
			setWatchingInterval(undefined);
			setTokens(tokens);
		} else {
			console.log("THERE ARE NO COOKIES");
		}
	};

	const watchWindow = () => {
		setWatchingInterval(setInterval(() => {
			checkCookies();
		}, 300))
	}


	const openRequestedPopUp = () => {
		setWindowObjRef(
			window.open(
				`http://localhost:8888/login`,
				"Log In To Your Spotify Account",
				"height=1200,width=800,opener"
			))

		watchWindow();
		// console.log( windowObjectRef)
	};

	// const checkIfWindowClosed = () => {
	// setTokens(() => {
	// 	const tokens = checkCookies();
	// 	console.log(tokens);
	// 	return tokens
	// });

	// checkCookies();

	// console.log(tokens);
	// if (tokens[0] !== false && tokens[1] !== false) {
	// 	clearInterval(checkIfWindowClosed);
	// 	console.log(windowObjectRef);
	// }
	// if (windowObjectRef.closed) {
	//   console.log("window closed");

	//   axios({
	//     url: "https://api.spotify.com/v1/me",
	//     headers: {
	//       Authorization: "Bearer " + tokens.access,
	//     },
	//     json: true,
	//   }).then(response => {
	//     console.log(response);
	//     // console.log(window.opener)
	//     // window.opener.location.pathname = params
	//   })
	// }
	// };

	// const watchWindow = () => {
	// 	const checkIfWindowClosed = setInterval(() => {
	// 		// const newTokens = checkCookies();
	// 		if (windowIsOpen && windowObjRef.current.closed) {
	// 			setWindowIsOpen(false);
	// 			clearInterval(checkIfWindowClosed);
	// 		}
	// 	}, 300);
	// };

	useEffect(() => {
		checkCookies();

		if (tokens) {
			console.log(tokens);
			windowObjRef.close();
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
			</header>
		</div>
	);
}

export default App;
