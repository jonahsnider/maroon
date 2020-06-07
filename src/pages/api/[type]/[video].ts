import {NextApiRequest, NextApiResponse} from 'next';
import ytdl, {validateURL, validateID} from 'ytdl-core';
import pinoHttp from 'pino-http';

type Handler = (req: NextApiRequest, res: NextApiResponse) => any;

const handler: Handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {video, type} = req.query;
	console.log(req.query);

	if (video === undefined) {
		return res.status(422).send('No URL');
	} else if (typeof video !== 'string' || (!validateURL(video) && !validateID(video))) {
		return res.status(422).send('Invalid URL');
	}

	let downloadType: 'video' | 'audio' = 'video';

	if (type === 'audio') {
		downloadType = 'audio';
	}

	const stream = ytdl(video, {
		filter: downloadType === 'video' ? 'audioandvideo' : 'audioonly',
		quality: downloadType === 'video' ? 'highest' : 'highestaudio'
	});

	stream
		.once('progress', (chunkLength, totalBytesDownloaded, totalBytes) => {
			res.setHeader('Content-length', totalBytes);
			res.setHeader('Content-Disposition', `attachment; filename="${video}.${downloadType === 'video' ? 'mp4' : 'm4a'}"`);
		})
		.on('error', error => {
			console.error(error);
			res.status(500);
			res.send(['An error occurred while downloading the video:', error.message].join('\n'));
			res.end();
		})
		.once('pipe', () => {
			// Start piping video after the download has begun
			res.send(stream);
		});
};

const pino = pinoHttp();
const loggerMiddleware = (handler: Handler): Handler => (req: NextApiRequest, res: NextApiResponse) => {
	pino(req, res);
	return handler(req, res);
};

export default loggerMiddleware(handler);
