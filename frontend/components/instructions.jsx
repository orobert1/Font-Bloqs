const React = require('react');
const ReactDOM = require('react-dom');
const Cloud = require('./cloud');
const Grid = require('../util/grid.js');
const fontStore = require( '../stores/fontStore' );
const GlyphStore = require( '../stores/glyphStore' );
const fontActions = require('../actions/fontActions');
const Choice = require('./fontChoice');
const FontButton = require('./fontButton');
const $ = require('jquery');



module.exports = React.createClass({
  getInitialState(){
    return({ fonts: [], font: "", quickBrown: ""});
  },
  componentWillReceiveProps(){
    let quote =  document.getElementById("instructions");
    let fTitle =  document.getElementById("fontChoicesTitle");
    let currentFont = document.getElementById("currentFont");
    let quickBrown = document.getElementById("quickBrown");

    instructions.style.width = window.innerWidth + "px";
    instructions.style.height = window.innerHeight + "px";
    let grid = new Grid();
    grid.alignTop( fTitle, 2 );
    grid.picWidth( fTitle, 10 );

    grid.picWidth( currentFont, 6 );
    grid.alignTop( currentFont, 2 );
    grid.alignLeft( currentFont, 22 );

    grid.picWidth( quickBrown, 6 );
    grid.alignLeft( quickBrown, 22 );
    grid.alignTop( quickBrown, 12 );


    this.props.win.registerElement( fTitle, function( el ){
      el.style.transition = "1s";
      el.style.left = "0px";
      el.style.opacity = 1;
      let children = $(el).children();
      for (var i = 0; i < children.length; i++) {
        let child = children[i];
        window.setTimeout( function(){
          child.style.transition = "4s";
          child.style.opacity = 1;
          window.setTimeout( function(){

            child.style.transition = ".4s";
          }, 200);

        }, i*200 );
      }
    });

  },
  componentWillUnmount( ){

  },
  getFonts(){
    if( this.props.fonts ){
      return this.props.fonts.map(
        function( el, index ){
          return (
            <FontButton callback = { this.props.callback }
            changeCurrentFont = { this.changeCurrentFont }
            font = {el} key = {index} index = {index} />
          )
        }.bind( this )
      );
    }
  },

  changeCurrentFont( fontName, arrayBuffer ){
    var newFont = new FontFace( fontName, arrayBuffer );
    newFont.load().then(function (loadedFace) {
      document.fonts.add(loadedFace);
      let currentFont = document.getElementById( "currentFont" );
      let quickBrown = document.getElementById( "quickBrown" );

      currentFont.style.fontFamily = fontName;
      quickBrown.style.fontFamily = fontName;
      quickBrown.style.opacity = 1;
      currentFont.style.opacity = 1;



    });
    this.setState({ font: fontName })
    this.setState({ quickBrown: "The Quick Brown Fox Jumped Over The Lazy Dog" })


  },

  render(){
    return(
      <div className = "instructions" id = "instructions">
        <div className = "buffer"/>
        <div className = "fontChoicesTitle" id = "fontChoicesTitle"> Choose a Typeface
          {
            this.getFonts()
          }
        </div>
        <div id = "currentFont">
          {
            this.state.font
          }
        </div>
        <div id = "quickBrown">
          {
            this.state.quickBrown
          }
        </div>
      </div>
    )
  }
});
