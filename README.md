# PromptWorks slide presentation framework

A slide presentation template built using [Reveal.js](https://github.com/hakimel/reveal.js) and [Gulp](http://gulpjs.com/).

## Installation

### Install this repo

`git clone https://github.com/promptworks/promptworks-slides.git --recursive your-deck-name`

The `--recursive` flag installs submodules, of which Reveal.js is one.

### Install dependencies

Go to root of this repo: `cd your-deck-name`

1. Install `node.js` (if it isn't already installed): <https://docs.npmjs.com/getting-started/installing-node>
2. Install Gulp command line interface (if it isn't already installed): `npm install --global gulp-cli`
3. Install node packages: `npm install`

## Development server

Run `npm start` to build everything, and run a local development server with [Browsersync](https://www.browsersync.io/). Changes to your slides, slide manifest, SCSS, images, and JS are watched.


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

Run `npm run slides` manually to generate an HTML file for each of these slides in the `slides/` directory, or generate automatically while `gulp` dev server is running. They filenames will automatically be slugified:

```
1-title-slide.html
2-another-slide.html
3-1-a-nested-slide.html
3-2-another-nested-slide.html
4-the-final-slide.html
```
_Note: New slides are generated from new entries in the manifest, but **old slides are not deleted**. This is to prevent accidental, catastrophic loss of work in case of file name changes, etc. If you need to change file names, or remove unused slides, you'll need to do so manually._


## Edit Your Slides

Each HTML slide file will automatically have a `<section>` element, which is required for it to function properly. The element will have a `title` attribute matching the name entered in the slide manifest.

### Changing or Removing the title

By default, the title attributes will be displayed at the bottom left corner of each slide. You can change the title to whatever you like, or remove it, on a per-slide basis.

Alternatively, you can disable the title display behavior altogether in `src/js/app.js`. In the `Reveal.initialize();` block, change the `title` option to `false`.

### Columns

A slide (or parts of a slide) can be split into columns by using the following HTML and class name structure:

```
<div class="split">
  <div class="half">Left</div>
  <div class="half">Right</div>
</div>

<div class="split">
  <div class="one-third">Left</div>
  <div class="two-thirds">Right</div>
</div>

<div class="split">
  <div class="one-third">Left</div>
  <div class="one-third">Center</div>
  <div class="one-third">Right</div>
</div>
```

### Slide Backgrounds

There are a few options for changing the default white slide background. Add one of the following to a slide's `<section>` element:

- `data-state="red-bg"` A red background with white text
- `data-state="turquoise-bg"` A pale turquoise background
- `data-background="img/filename.ext"` A full-screen image background (this is a Reveal.js built in behavior)
  - `data-state="overlay"` A transparent white background surrounding the slide contents, useful on a slide with image background.

### Colors

Class names are available to add text colors, or background colors to parts of a slide.

```
<span class="red-text">...</span>
<span class="turquoise-text">...</span>
<span class="blue-text">...</span>
<span class="purple-text">...</span>
<span class="yellow-text">...</span>
```

```
<div class="red-bg">...</div>
<div class="turquoise-bg">...</div>
<div class="blue-bg">...</div>
<div class="purple-bg">...</div>
<div class="yellow-bg">...</div>
```

### Fragments

You can add `class="fragment"` to any number of elements in a slide to make them appear progressively, one by one. This is a Reveal.js built in behavior.

You can also synchronize and alter the order that fragments appear by adding `data-fragment-index` attributes. As in:

```
<div class="fragment" data-fragment-index="2">Second</div>
<div class="fragment" data-fragment-index="2">Also second</div>
<div class="fragment" data-fragment-index="1">First</div>
<div class="fragment" data-fragment-index="3">Third</div>
```

### Syntax highlighting

[Highlight.js](https://highlightjs.org/) syntax highlighting is supported. Add the following HTML:

```
<pre><code class="your-language">
your code here
</code></pre>
```

### Other stuff

Check our [https://github.com/hakimel/reveal.js/](https://github.com/hakimel/reveal.js/) for other things Reveal.js can do.

## Build

Run `npm run build` to just build without running the server.

Run `gulp --tasks` to list all available gulp tasks.
