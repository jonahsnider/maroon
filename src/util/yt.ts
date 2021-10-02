const validQueryDomains = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'gaming.youtube.com']);

const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube.com\/(embed|v)\/)/;

const idRegex = /^[\w-]{11}$/i;

/**
 * Returns true if given id satifies YouTube's id format.
 *
 * @param id
 * @return
 */
export function validateId(id: string): boolean {
	return idRegex.test(id);
}

export function getUrlVideoId(link: string): string {
	const parsed = new URL(link);
	let id = parsed.searchParams.get('v');
	if (validPathDomains.test(link) && id === null) {
		const paths = parsed.pathname.split('/');
		id = paths[paths.length - 1];
	} else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
		throw new Error('Not a YouTube domain');
	}

	if (!id) {
		throw new Error(`No video id found: ${link}`);
	}

	id = id.slice(0, 11);
	if (!validateId(id)) {
		throw new TypeError(`Video id (${id}) does not match expected format (${idRegex.toString()})`);
	}

	return id;
}

/**
 * @param link The link to use
 * @returns `true` if the link was valid
 */
export function validateUrl(link: string): boolean {
	let parsed;
	try {
		parsed = new URL(link);
	} catch {
		return false;
	}

	let id = parsed.searchParams.get('v');
	if (validPathDomains.test(link) && !id) {
		const paths = parsed.pathname.split('/');
		id = paths[paths.length - 1];
	} else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
		return false;
	}

	if (!id) {
		return false;
	}

	id = id.slice(0, 11);

	return idRegex.test(id);
}

/**
 * Get a video ID from a string.
 * @param string String to get the video ID from
 */
export function getVideoId(string: string): string {
	if (validateId(string)) {
		return string;
	}

	return getUrlVideoId(string);
}
