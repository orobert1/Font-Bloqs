const AppDispatcher = require( '../dispatcher/dispatcher' );
const Store = require( 'flux/utils' ).Store;
const Constants = require( '../constants/constants' );
const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const GlyphStore = new Store( AppDispatcher );
let currentlySelectedGlyphId = "";
GlyphStore.getCurrentlySelectedGlyph = function(){
  return currentlySelectedGlyphId;
}
GlyphStore.setCurrentlySelectedGlyph = function( id ){
  currentlySelectedGlyphId = id;
}
GlyphStore.__onDispatch = function( payload ){
  switch( payload.actionType ){
    case Constants.changeCurrentGlyph:
    this.setCurrentlySelectedGlyph( payload.id );
    this.__emitChange();
    break;
    case Constants.reRenderGlyph:
    this.__emitChange();
    break
  }
}


module.exports = GlyphStore;
