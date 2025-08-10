import SpotifyOpenAPI from "features/spotify/spotify.openapi.js";

/** @typedef {import('types/OpenApi.class').OpenApiSpec} OpenApiSpec */

class OpenAPI {
  /** @type {OpenApiSpec} */ #spec;

  constructor() {
    this.openapi = "3.0.0";
    this.info = {
      title: "Todo API",
      version: "1.0.0",
      description: "API for managing todos"
    };
  }

  get spec() {
    if (!this.#spec) {
      this.initSpec();
      this.#spec = JSON.stringify(this, null, 2);
    }
    return this.#spec;
  }

  initSpec() {
    this.setPaths();
    this.setComponents();
  }

  setPaths() {
    const spotifyPaths = new SpotifyOpenAPI().paths;

    this.paths = {
      ...spotifyPaths,
    }
  }

  setComponents() {
    const spotifyComponents = new SpotifyOpenAPI().components;

    this.components = {
      ...spotifyComponents
    }
  }
}

export default OpenAPI;
