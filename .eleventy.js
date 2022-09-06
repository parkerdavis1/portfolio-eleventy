const { DateTime } = require("luxon");


module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPassthroughCopy('assets');

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("MMMM d, yyyy");
    })
    return {
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    }
}
