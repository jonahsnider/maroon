import contentDisposition from '@lazy-http/content-disposition';
import {NextApiRequest, NextApiResponse} from 'next';
import {downloadFromInfo, getInfo, validateID, validateURL} from 'ytdl-core';

const handleError = (error: Error, response: NextApiResponse) => {
	response.status(500);
	response.send(['An error occurred while downloading the video:', error.message].join('\n'));
	response.end();
};

const downloadVideo = async (request: NextApiRequest, response: NextApiResponse) => {
	const {video, type} = request.query;

	if (video === undefined) {
		return response.status(422).send('No URL');
	}

	if (typeof video !== 'string' || (!validateURL(video) && !validateID(video))) {
		return response.status(422).send('Invalid URL');
	}

	let downloadType: 'video' | 'audio' = 'video';

	if (type === 'audio') {
		downloadType = 'audio';
	}

	try {
		const videoInfo = await getInfo(video);

		const stream = downloadFromInfo(videoInfo, {
			filter: downloadType === 'video' ? 'audioandvideo' : 'audioonly',
			quality: downloadType === 'video' ? 'highest' : 'highestaudio'
		});

		stream
			.once('progress', (chunkLength, totalBytesDownloaded, totalBytes) => {
				if (totalBytes !== undefined) {
					response.setHeader('Content-length', totalBytes);
				}
			})
			.on('error', error => {
				handleError(error, response);
			})
			.once('pipe', () => {
				// Start piping video after the download has begun
				response.setHeader('Content-Disposition', contentDisposition(`${videoInfo.videoDetails.title ?? 'video'}.${downloadType === 'video' ? 'mp4' : 'm4a'}`));

				response.send(stream);
			});
	} catch (error) {
		handleError(error, response);
	}
};

export default downloadVideo;
