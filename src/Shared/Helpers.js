const buildPublicUrl = (path) => {
	return `${process.env.PUBLIC_URL}/${path}`
}

export default {
	buildPublicUrl
}