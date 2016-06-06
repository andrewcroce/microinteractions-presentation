var Reveal = require('reveal');

Reveal.initialize({
  // See https://github.com/hakimel/reveal.js#configuration
  controls: true,
  progress: true,
  slideNumber: false,
  history: false,
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
  transition: 'default', // none/fade/slide/convex/concave/zoom
  transitionSpeed: 'default', // default/fast/slow
  backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom
  viewDistance: 3,
  parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal: null,
  parallaxBackgroundVertical: null
});
