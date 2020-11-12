const buildPublicUrl = (path) => {
	return `${process.env.PUBLIC_URL}/${path}`
}

const Helpers = {
	buildPublicUrl
};

export default Helpers;