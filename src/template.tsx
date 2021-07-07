import {Container, createMuiTheme, CssBaseline, Fab, Grid, responsiveFontSizes, ThemeProvider, useMediaQuery, colors} from '@material-ui/core';
import {FlashOnRounded} from '@material-ui/icons';
import {useAmp} from 'next/amp';
import Link from 'next/link';
import React, {FC, useMemo} from 'react';
import Seo from './components/seo';
import {siteMetadata} from './config/site-metadata';

export const MaroonTemplate: FC = props => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const isAMP = useAmp();

	const theme = useMemo(() => {
		return responsiveFontSizes(
			createMuiTheme({
				spacing: 12,
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: {main: colors.red['900']},
				},
			}),
		);
	}, [prefersDarkMode]);

	return (
		<ThemeProvider theme={theme}>
			<Seo theme={theme} pageTitle={siteMetadata.title} />
			<CssBaseline />
			<Container>
				{props.children}
				{isAMP && (
					<Grid container direction='row' justify='flex-end' alignItems='flex-end' spacing={1}>
						<Grid item>
							<Link passHref href='/'>
								<Fab color='primary' aria-label='amp' variant='extended'>
									<FlashOnRounded />
									Disable AMP
								</Fab>
							</Link>
						</Grid>
					</Grid>
				)}
			</Container>
		</ThemeProvider>
	);
};
