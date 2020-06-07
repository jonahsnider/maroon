import {NextApiRequest, NextApiResponse} from 'next';
import {getBasicInfo} from 'ytdl-core';

/**
 * Checks if a video is valid.
 */
export default async (request: NextApiRequest, response: NextApiResponse) => {
	const {video} = request.query;

	if (typeof video !== 'string') {
		response.status(422);
		response.send('Invalid video, expected string');
		return response.end();
	}

	return getBasicInfo(video)
		.then(() => {
			response.status(204);
			return response.end();
		})
		.catch((error: Error) => {
			response.status(400);
			response.send(error.message);
			return response.end();
		});
};
