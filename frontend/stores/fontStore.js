const AppDispatcher = require( '../dispatcher/dispatcher' );
const Store = require( 'flux/utils' ).Store;
const Constants = require( '../constants/constants');
const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const fontStore = new Store( AppDispatcher );

fontStore.ttfFile = [];

fontStore.getCurrentFonts = function(){
  return this.ttfFile;
}

fontStore.setCurrentFonts = function( ttf ){
  this.ttfFile = ttf;
}

fontStore.__onDispatch = function( payload ){
  switch( payload.actionType ){
    case Constants.changeCurrentFont:
    this.setCurrentFonts( payload.ttf );
    this.__emitChange();
  }
}

module.exports = fontStore;
