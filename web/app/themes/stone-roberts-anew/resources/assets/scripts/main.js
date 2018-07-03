// import external dependencies
// import 'jquery';

// Import everything from autoload
import "./autoload/**/*"

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import aboutUs from './routes/about';

// fontawesome
// base package
import fontawesome from '@fortawesome/fontawesome';
import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus';
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import faShareSquare from '@fortawesome/fontawesome-free-solid/faShareSquare';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';

//TODO: these should be moved to Developer Share Buttons Plugin
import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebook";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitter";
import faEnvelope from "@fortawesome/fontawesome-free-solid/faEnvelope";
import faCopy from "@fortawesome/fontawesome-free-solid/faCopy";


fontawesome.library.add(faSearchPlus, faInfoCircle, faShareSquare, faTimesCircle, faFacebook, faTwitter, faEnvelope, faCopy);

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // About Us page, note the change from about-us to aboutUs.
  aboutUs,
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
