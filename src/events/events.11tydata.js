module.exports = {
	"layout": "layouts/event.njk",
	eleventyComputed: {
		permalink: data => `/events/${ data.page.fileSlug }/`
	}
};