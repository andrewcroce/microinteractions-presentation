# PromptWorks slide presentation framework

A slide presentation template built using [Reveal.js](https://github.com/hakimel/reveal.js) and [Gulp](http://gulpjs.com/).

## Install everything

`npm install`

## The slide manifest
The order and nesting of slides is maintained in `src/slideManifest.json`. Enter an array of slide names, or arrays of nested slides. You can name them whatever you like, but the numbers are probably a good idea, to maintain a nice file order. Slides can only be nested one level. For example:

```
[
  "1. Title slide",
  "2. Another slide",
  [
    "3-1. A nested slide",
    "3-2. Another nested slide"
  ],
  "4. The final slide"
]
```

Run `gulp slides` to generate an HTML file for each of these slides in the `slides/` directory. They filenames will automatically be slugified:

```
1-title-slide.html
2-another-slide.html
3-1-a-nested-slide.html
3-2-another-nested-slide.html
4-the-final-slide.html
```

## Edit Your Slides

Each HTML slide file will automatically have a `<section>` element, which is required for it to function properly. The element will have a `title` attribute matching the name entered in the slide manifest.

### Changing or Removing the title

By default, the title attributes will be displayed at the bottom left corner of each slide. You can change the title to whatever you like, or remove it, on a per-slide basis.

Alternatively, you can disable the title display behavior altogether in `src/js/app.js`. In the `Reveal.initialize();` block, change the `title` option to `false`.

### Slide Backgrounds

There are a few options for changing the default white slide background. Add one of the following to a slide's `<section>` element:

- `data-state="red-bg"` A red background with white text
- `data-state="turquoise-bg"` A pale turquoise background
- `data-background="img/filename.ext"` A full-screen image background (this is a Reveal.js built in behavior)
  - `data-state="overlay"` A transparent white background surrounding the slide contents, useful on a slide with image background.

### Fragments

You can add `class="fragment"` to any number of elements in a slide to make them appear progressively, one by one. This is a Reveal.js built in behavior.

### Syntax highlighting

[Highlight.js](https://highlightjs.org/) syntax hightlighting is supported. Add the following HTML:

```
<pre><code class="your-language">
your code here
</code></pre>
```

### Other stuff

Check our [https://github.com/hakimel/reveal.js/](https://github.com/hakimel/reveal.js/) for other things Reveal.js can do.

## Development server

Run `gulp` to build everything, and run a local development server with [Browsersync](https://www.browsersync.io/). Changes to your slides, SCSS, and JS are watched.

## Build

Run `gulp build` to just build without running the server.

Look at `gulpfile.js` for other gulp tasks.
