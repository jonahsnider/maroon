import {Button, Checkbox, Grid, Link, TextField, Typography, useTheme} from '@material-ui/core';
import React, {ChangeEvent, useState} from 'react';
import Seo from '../components/seo';
import {downloadUrl} from '../config/api';
import {getVideoID, validateURL} from '../util/yt';
import woah from '../woah.module.css';

// Export const config = {amp: 'hybrid'};

/**
 * Home page.
 */
const Home: React.FC = () => {
	const theme = useTheme();
	const [url, setUrl] = useState('');
	const [valid, setValidity] = useState(true);
	const [audioOnly, setAudioOnly] = useState(false);

	const handleVideoChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		setUrl(event.target.value);
		setValidity(validateURL(event.target.value));
	};

	const handleAudioOnlyChange = (event: ChangeEvent<HTMLInputElement>) => {
		setAudioOnly(event.target.checked);
	};

	let videoDownloadUrl: string | null = null;

	if (valid && url !== '') {
		videoDownloadUrl = [downloadUrl, audioOnly ? 'audio' : 'video', getVideoID(url)].join('/');
	}

	return (
		<>
			<Seo theme={theme} pageTitle='maroon' />

			<Grid container direction='column' justify='center' alignItems='center' spacing={1} style={{minHeight: '100vh'}}>
				<Typography variant='h1' align='center' className={woah.rotateComplex}>
					maroon
				</Typography>

				<Grid item>
					<TextField
						autoFocus
						color='primary'
						label='video'
						variant='outlined'
						error={!valid}
						size='medium'
						helperText={valid ? ' ' : 'invalid url'}
						value={url}
						className={woah.wowzors}
						onChange={handleVideoChange}
					/>
					<Typography color='textSecondary' className={woah.spin3D}>
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
						disabled={!valid || url === ''}
						size='large'
						href={videoDownloadUrl === null ? undefined : videoDownloadUrl}
						className={woah.blackMirror}
					>
						download
					</Button>
				</Grid>
				<Link className={woah.simpleEntrance} href='https://jonah.pw' color='textPrimary'>
					<Typography>(by jonah)</Typography>
				</Link>
				<Typography color='textSecondary' className={woah.flyIn}>
					inspect network traffic for api instructions
				</Typography>
			</Grid>
		</>
	);
};

export default Home;
