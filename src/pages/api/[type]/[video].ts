import {NextApiRequest, NextApiResponse} from 'next';
import ytdl, {validateURL, validateID} from 'ytdl-core';
import pinoHttp from 'pino-http';

type Handler = (req: NextApiRequest, res: NextApiResponse) => any;

const handler: Handler = async (request: NextApiRequest, result: NextApiResponse) => {
	const {video, type} = request.query;
	console.log(request.query);

	if (video === undefined) {
		return result.status(422).send('No URL');
	}

	if (typeof video !== 'string' || (!validateURL(video) && !validateID(video))) {
		return result.status(422).send('Invalid URL');
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
			result.setHeader('Content-length', totalBytes);
			result.setHeader('Content-Disposition', `attachment; filename="${video}.${downloadType === 'video' ? 'mp4' : 'm4a'}"`);
		})
		.on('error', error => {
			console.error(error);
			result.status(500);
			result.send(['An error occurred while downloading the video:', error.message].join('\n'));
			result.end();
		})
		.once('pipe', () => {
			// Start piping video after the download has begun
			result.send(stream);
		});
};

const pino = pinoHttp();
const loggerMiddleware = (handler: Handler): Handler => (request: NextApiRequest, response: NextApiResponse) => {
	pino(request, response);
	return handler(request, response);
};

export default loggerMiddleware(handler);
