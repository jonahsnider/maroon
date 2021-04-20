import {NextApiRequest, NextApiResponse} from 'next';
import {getBasicInfo} from 'ytdl-core';

/**
 * Checks if a video is valid.
 */
export default async function validateVideo(request: NextApiRequest, response: NextApiResponse): Promise<void> {
	const {video} = request.query;

	if (typeof video !== 'string') {
		response.status(422);
		response.send('Invalid video, expected string');
		response.end();
		return;
	}

	try {
		await getBasicInfo(video);
	} catch (error: unknown) {
		response.status(400);
		response.send((error instanceof Error ? error : new Error(String(error))).message);
		response.end();
		return;
	}

	response.status(204);
	response.end();
}
