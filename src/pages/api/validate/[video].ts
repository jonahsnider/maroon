import {NextApiRequest, NextApiResponse} from 'next';
import {getBasicInfo} from 'ytdl-core';

/**
 * Checks if a video is valid.
 */
const validateVideo = async (request: NextApiRequest, response: NextApiResponse) => {
	const {video} = request.query;

	if (typeof video !== 'string') {
		response.status(422);
		response.send('Invalid video, expected string');
		response.end();
		return;
	}

	return getBasicInfo(video)
		.then(() => {
			response.status(204);
			response.end();
		})
		.catch((error: Error) => {
			response.status(400);
			response.send(error.message);
			response.end();
		});
};

export default validateVideo;
