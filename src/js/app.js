Reveal = require('reveal.js/js/reveal.js');
var head = require('headjs/dist/1.0.0/head.js');

Reveal.initialize({

  // Custom property, show slide titles
  // see `custom_plugins/revealTitles.js`
  titles: true,

  // See https://github.com/hakimel/reveal.js#configuration
  controls: true,
  progress: true,
  slideNumber: false,
  history: true,
  keyboard: true,
  overview: true,
  center: true,
  touch: true,
  loop: false,
  rtl: false,
  shuffle: false,
  fragments: true,
  embedded: false,
  help: true,
  showNotes: false,
  autoSlide: 0,
  autoSlideStoppable: true,
  autoSlideMethod: Reveal.navigateNext,
  mouseWheel: false,
  hideAddressBar: true,
  previewLinks: false,
  transition: 'slide', // none/fade/slide/convex/concave/zoom
  transitionSpeed: 'default', // default/fast/slow
  backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom
  viewDistance: 3,
  parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal: null,
  parallaxBackgroundVertical: null,
  dependencies: [
    { src: 'js/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'js/reveal.js/plugin/notes/notes.js', async: true },
    { src: 'js/custom_plugins/revealTitles.js', async: true, callback: function() { RevealTitles.init(Reveal); } },
  ]
});

//RevealTitles.init(Reveal.getConfig());

//Highlightjs.initHighlightingOnLoad();
