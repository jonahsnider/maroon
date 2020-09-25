import contentDisposition from '@lazy-http/content-disposition';
import {NextApiRequest, NextApiResponse} from 'next';
import {downloadFromInfo, getInfo, validateID, validateURL} from 'ytdl-core';
import FileType from 'file-type';

const handleError = (error: Error, response: NextApiResponse) => {
	console.error(error);
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

		return await new Promise(resolve => {
			stream
				.once(
					'progress',
					/**
					 * Emitted whenever a new chunk is received. Passes values describing the download progress.
					 * @param chunkLength Chunk length in bytes or segment number.
					 * @param totalBytesDownloaded Total bytes or segments downloaded.
					 * @param totalBytes Total bytes or segments.
					 */
					(chunkLength: number, totalBytesDownloaded: number, totalBytes: number) => {
						response.setHeader('Content-length', totalBytes);
					}
				)
				.on('error', error => {
					throw error;
				})
				.on('readable', async () => {
					const chunk = stream.read();

					if (chunk === null) {
						return resolve();
					}

					if (!response.headersSent) {
						const fileType = await FileType.fromBuffer(chunk);
						const fileExtension = fileType?.ext ?? (downloadType === 'audio' ? 'webm' : 'mp4');

						response.setHeader('Content-Disposition', contentDisposition(`${videoInfo.videoDetails.title ?? 'video'}.${fileExtension}`));
					}

					response.write(chunk);
				});
		});
	} catch (error) {
		handleError(error, response);
	}
};

export default downloadVideo;
