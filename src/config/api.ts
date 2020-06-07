/** Base URL for downloading videos. */
export const downloadUrl = `http${process.env.NODE_ENV === 'development' ? '://localhost:3000' : 's://maroon.glitch.me'}/api`;
