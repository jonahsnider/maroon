import {Button, Checkbox, Grid, Link, TextField, Typography, useTheme} from '@material-ui/core';
import React, {ChangeEvent, useState} from 'react';
import Seo from '../components/seo';
import {downloadUrl} from '../config/api';
import {checkVideo} from '../util/validate';
import {getVideoID} from '../util/yt';
import woah from '../woah.module.css';

// Export const config = {amp: 'hybrid'};

const animations = false;

/**
 * Home page.
 */
const Home: React.FC = () => {
	const theme = useTheme();

	const [url, setUrl] = useState('');
	const [audioOnly, setAudioOnly] = useState(false);
	const [pendingValidation, setPendingValidation] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	let videoDownloadUrl: string | null = null;

	if (errorMessage === null) {
		try {
			videoDownloadUrl = [downloadUrl, 'dl', audioOnly ? 'audio' : 'video', getVideoID(url)].join('/');
		} catch {}
	}

	const handleVideoChange = async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const newUrl = event.target.value;
		setUrl(newUrl);

		setPendingValidation(true);
		setErrorMessage(await checkVideo(newUrl));
		setPendingValidation(false);
	};

	const handleAudioOnlyChange = (event: ChangeEvent<HTMLInputElement>) => setAudioOnly(event.target.checked);

	return (
		<>
			<Seo theme={theme} pageTitle='maroon' />

			<Grid container direction='column' justify='center' alignItems='center' spacing={1} style={{minHeight: '100vh'}}>
				<Typography variant='h1' align='center' className={animations ? woah.rotateComplex : undefined}>
					maroon
				</Typography>

				<Grid item>
					<TextField
						autoFocus
						color='primary'
						label='video'
						variant='outlined'
						error={errorMessage !== null}
						size='medium'
						helperText={errorMessage ?? ' '}
						value={url}
						className={animations ? woah.wowzors : undefined}
						onChange={handleVideoChange}
					/>
					<Typography color='textSecondary' className={animations ? woah.spin3D : undefined}>
						just the audio?
						<Checkbox checked={audioOnly} color='primary' onChange={handleAudioOnlyChange} />
					</Typography>
				</Grid>

				<Grid item>
					<Button
						download
						component='a'
						color='primary'
						type='submit'
						variant='contained'
						disabled={url === '' || pendingValidation || errorMessage !== null || videoDownloadUrl === null}
						size='large'
						href={videoDownloadUrl === null ? undefined : videoDownloadUrl}
						className={animations ? woah.blackMirror : undefined}
					>
						download
					</Button>
				</Grid>

				<Link className={animations ? woah.simpleEntrance : undefined} href='https://jonah.pw' color='textPrimary'>
					<Typography paragraph>(by jonah)</Typography>
				</Link>

				<Typography color='textSecondary' className={animations ? woah.flyIn : undefined}>
					inspect network traffic to learn how to use my (public) api (look for fetch requests to <code>/api</code>)
				</Typography>
			</Grid>
		</>
	);
};

export default Home;
