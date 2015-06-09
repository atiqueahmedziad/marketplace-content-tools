import {Flummox} from 'flummox';
import req from 'superagent-bluebird-promise';


global.assert = require('chai').assert;
global.jsdom = require('mocha-jsdom');
global.React = require('react/addons');
global.sinon = require('sinon');
global.TestUtils = React.addons.TestUtils;


let store = {};
global.localStorage = {
  getItem: (k) => {
    return store[k];
  },
  setItem: (k, v) => {
    store[k] = v;
  },
  removeItem: (k) => {
    delete store(k);
  },
  clear: () => {
    store = {};
  },
  length: () => {
    return Object.keys(store).length;
  }
};


global.fluxFactory = () => new Flummox();


sinon.stub(req, 'get', () => {});
sinon.stub(req, 'post', () => {});


afterEach(() => {
  localStorage.clear();
});
