import App from 'next/app';
import React from 'react';
import {MaroonTemplate} from '../template';

export default class MyApp extends App {
	componentDidMount(): void {
		// Remove the server-side injected CSS.
		document.querySelector('#jss-server-side')?.remove();

		// Initialize Firebase
		import('../util/firebase').catch(error => console.error(['An error occurred while importing the Firebase util:', error].join('\n')));
	}

	render() {
		const {Component, pageProps} = this.props;

		return (
			<MaroonTemplate>
				<Component {...pageProps} />
			</MaroonTemplate>
		);
	}
}
