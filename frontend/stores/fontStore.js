const AppDispatcher = require( '../dispatcher/dispatcher' );
const Store = require( 'flux/utils' ).Store;
const Constants = require( '../constants/constants');
const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const fontStore = new Store( AppDispatcher );

let ttfFile = { ttf: "" };

fontStore.updateCurrentFont = function(){
  return ttfFile;
}

fontStore.setCurrentFont = function( ttf ){
  ttfFile.ttf = ttf;
}

fontStore.__onDispatch = function( payload ){
  switch( payload.actionType ){
    case Constants.changeCurrentFont:
    this.setCurrentFont( payload.ttf );
    this.__emitChange();
  }
}

module.exports = fontStore;
