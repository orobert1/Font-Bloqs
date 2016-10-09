const Dispatcher = require( '../dispatcher/dispatcher' );
const Constants = require( '../constants/constants' );
const api = require('../util/api');
module.exports={

 changeCurrentGlyph( id ){
  Dispatcher.dispatch( {
   actionType: Constants.changeCurrentGlyph,
   id: id
  } );
 },

 updateCurrentGlyph( ){
  Dispatcher.dispatch( {
   actionType: Constants.reRenderGlyph
  } );
 }
}
