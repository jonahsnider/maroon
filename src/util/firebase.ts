import * as firebase from 'firebase/app';
import 'firebase/performance';
import 'firebase/analytics';

export const firebaseConfig = {
	apiKey: 'AIzaSyDSVQuKbk94g-uBqksUKAuaBoaDwI7gPiM',
	authDomain: 'maroon-node.firebaseapp.com',
	databaseURL: 'https://maroon-node.firebaseio.com',
	projectId: 'maroon-node',
	storageBucket: 'maroon-node.appspot.com',
	messagingSenderId: '777436616784',
	appId: '1:777436616784:web:b61005b6d11e65c3ffd955',
	measurementId: 'G-FGVVCP54FS'
};

// Only keep a single app initialized
// This helps when the page rerenders
export const firebaseApp = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const performance = firebase.performance();

firebase.analytics
	.isSupported()
	.then(supported => {
		if (supported) {
			firebase.analytics();
		}
	})
	.catch(error => console.error("Firebase Analytics couldn't initialize", error));

export default firebaseApp;
