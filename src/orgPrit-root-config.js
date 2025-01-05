import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from "single-spa-layout";
import { registerApplication, start } from "single-spa";

// Fetch the layout template from the DOM
const layoutElement = document.querySelector("#single-spa-layout");

// Ensure layoutElement exists and is valid
if (!layoutElement) {
  throw new Error("Layout template not found in the DOM.");
}

// Construct routes and applications
const routes = constructRoutes(layoutElement, {
  loaders: {
    topNav: "<h1>Loading topnav</h1>",
  },
  errors: {
    topNav: "<h1>Failed to load topnav</h1>",
  },
});

const applications = constructApplications({
  routes,
  loadApp: ({ name }) => System.import(name),
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

// Register applications
applications.forEach(registerApplication);

// Activate layout engine and start Single-SPA
layoutEngine.activate();
start();
