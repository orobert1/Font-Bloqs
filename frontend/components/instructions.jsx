const React = require('react');
const ReactDOM = require('react-dom');
const Cloud = require('./cloud');
const Grid = require('../util/grid.js');
const fontStore = require( '../stores/fontStore' );
const GlyphStore = require( '../stores/glyphStore' );
const fontActions = require('../actions/fontActions');
const Choice = require('./fontChoice');
const FontButton = require('./fontButton');



module.exports = React.createClass({
  getInitialState(){
    return({ fonts: []});
  },
  componentDidMount(){
    let quote =  document.getElementById("instructions");
    let fTitle =  document.getElementById("fontChoicesTitle");
    let buttonContainer =  document.getElementById("buttonContainer");

    instructions.style.width = window.innerWidth + "px";
    instructions.style.height = window.innerHeight + "px";
    let grid = new Grid();
    grid.alignTop( fTitle, 6 );
    grid.picWidth( fTitle, 5 );
    grid.alignLeft( fTitle, 10 );
    grid.alignTop( buttonContainer, 12 );
    grid.alignLeft( buttonContainer, 10 );
    grid.picWidth( buttonContainer, 5 );
    this.props.win.registerElement( fTitle, function( el ){
      el.style.transition = "1s";
      el.style.left = "0px";
      el.style.opacity = 1;
    });

  },
  componentWillUnmount( ){

  },
  getFonts(){
    if( this.props.fonts ){
      return this.props.fonts.map(
        function( el, index ){
          return (
            <FontButton callback = { this.props.callback } font = {el} key = {index} index = {index} />
          )
        }.bind( this )
      );
    }
  },
  render(){
    return(
      <div className = "instructions" id = "instructions">
        <div className = "buffer" ></div>
        <Cloud cloud = { {top: 4, seed: 2, index: 13, height: 14}} />
        <div className = "fontChoicesTitle" id = "fontChoicesTitle"> Choose a Typeface to edit
          {
            this.getFonts()
          }
        </div>
        <div className = "buttonContainer" id = "buttonContainer">

        </div>
      </div>
    )
  }
});
