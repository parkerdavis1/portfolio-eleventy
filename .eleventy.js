const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img")
const CleanCSS = require("clean-css");

const imageShortcode = async (src, alt, lazy=true) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
  
    let options = {
      widths: [500, 1000, 2000],
      formats: ["webp", "jpeg", null],
      urlPath: "/images/",
      outputDir: "./_site/images/"
    }
  
    let stats = await Image(src, options);
    let lowestSrc = stats["jpeg"][0];
  
    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset} ,`,
          ""
        ),
      }),
      {}
    );
  
    const source = `<source type="image/webp" srcset="${srcset["webp"]}">`;
    let img ='';
    if (lazy) {
      img = `<img
      loading="lazy"
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='100vw'
      srcset="${srcset["jpeg"]}">`;
    } else {
      img = `<img
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='100vw'
      srcset="${srcset["jpeg"]}">`;
    }

    
    const stringReturn = `<picture> ${source} ${img} </picture>`;
    return stringReturn;
};
const imageShortcodeMacro = (src, alt, lazy=true) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
  
    let options = {
      widths: [500, 1000, 2000],
      formats: ["webp", "jpeg", null],
      urlPath: "/images/",
      outputDir: "./_site/images/"
    }
  
    //This is the sync part
    Image(src, options); //start generating images
    let stats = Image.statsSync(src, options); //get metadata immediately

    let lowestSrc = stats["jpeg"][0];
  
    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset} ,`,
          ""
        ),
      }),
      {}
    );
  
    const source = `<source type="image/webp" srcset="${srcset["webp"]}">`;
    let img = '';
    if (lazy) {
      img = `<img
      loading="lazy"
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='100vw'
      srcset="${srcset["jpeg"]}">`;
    } else {
      img = `<img
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='100vw'
      srcset="${srcset["jpeg"]}">`;
    }

    
    const stringReturn = `<picture> ${source} ${img} </picture>`;
    return stringReturn;
};
const asyncImageCssBackground = async(src, selector) => {
  let options = {
    widths: [600, 1000, 2000],
    formats: ['jpeg', 'webp'],
    outputDir: "./_site/images",
    urlPath: "/images/",
    useCache: true,
    sharpJpegOptions: {
      quality: 99,
      progressive: true
    }
  };

  const metadata = await Image(src, options);

  let markup = [];
  Object.values(metadata).map(imageFormat => {
    markup.push(`${selector} { background-image: url(${imageFormat[0].url});} `);
    imageFormat.slice(1).forEach((image, index) => {
      markup.push(`@media (min-width: ${imageFormat[index].width}px) { ${selector} {background-image: url(${image.url});}}`);
    });
  })
  return markup.join("\n");
}


module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPassthroughCopy('assets');

    eleventyConfig.addNunjucksAsyncShortcode("asyncCssBackground", asyncImageCssBackground);
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addNunjucksShortcode("imageMacro", imageShortcodeMacro);

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("MMMM d, yyyy");
    });
    eleventyConfig.addFilter("cssmin", function(code) {
      return new CleanCSS({}).minify(code).styles;
    });

    return {
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    }
}
