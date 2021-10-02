import {downloadUrl} from '../config/api';
import {getVideoId, validateUrl} from './yt';

/**
 * Check if a video URL is good to download.
 * @param video Video to check
 * @returns The human-readable error message, or `null` if everything is fine
 */
export async function checkVideo(video: string): Promise<string | null> {
	if (!validateUrl(video)) {
		return 'invalid video url';
	}

	try {
		const response = await fetch(`${downloadUrl}/validate/${getVideoId(video)}`);
		if (!response.ok) {
			return 'the server says that video is maybe not exist???';
		}
	} catch {
		return 'an error occurred while trying to check if your video ok';
	}

	return null;
}
