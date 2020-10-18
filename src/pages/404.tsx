import {Button, Grid, Typography, useTheme} from '@material-ui/core';
import Link from 'next/link';
import React, {FC} from 'react';
import Seo from '../components/seo';

// Export const config = {amp: 'hybrid'};

/**
 * 404 page not found page.
 */
const NotFoundPage: FC = () => {
	const theme = useTheme();
	return (
		<>
			<Seo theme={theme} pageTitle='not found' />
			<Typography variant='h1' align='center'>
				there is no page
			</Typography>
			<Typography variant='h2' align='center'>
				please leave
			</Typography>
			<Grid container justify='center' alignItems='center'>
				<Grid item>
					<Link passHref href='/'>
						<Button fullWidth color='primary' size='large' variant='contained'>
							ok bye
						</Button>
					</Link>
				</Grid>
			</Grid>
		</>
	);
};

export default NotFoundPage;
