const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const Link = require( 'react-router' ).Link;
const NewFont = require( './newFont' );
const Cover = require( './cover' );
const Grid = require('../util/grid.js');
const Head = require('./head');
const GlyphStore = require( '../stores/glyphStore' );
const fontStore = require( '../stores/fontStore' );
const fontActions = require('../actions/fontActions');
const Board = require('./board');
const Quote = require('./quote');
const checkWindow = require('../util/checkWindow');
const Instructions = require('./instructions');
const Glyph = require('../util/glyph');

module.exports = React.createClass( {
 contextTypes: {
   router: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return({ window: new checkWindow(), selectedFont: {}, glyphs: [] });
  },

  componentDidMount(){
    window.addEventListener( "scroll", this.state.window.run.bind( this.state.window ) );
    this.list = fontStore.addListener( this.__change );
    fontActions.getFonts();
    let space = document.getElementById("space");
    space.style.height = window.innerHeight + "px";
    space.style.width = window.innerWidth + "px";

  },
  __change(){
    this.setState({ fonts: fontStore.getCurrentFonts() });
  },

  componentWillUnmount( ){
    GlyphStore.removeListener( this.list );
  },

  __changeSelectedFont(ttf){
    if( ttf.unitsPerEm ){

      ttf.scale = 20 / ttf.unitsPerEm;

    }

    this.setState({ selectedFont: ttf });
    this.generateGlyphs( ttf );
  },

  generateGlyphs( ttf ){
    let result = [];
    for (var i = 0; i < ttf.totalGlyphs; i++) {
      let glyph = new Glyph( i, ttf, .02, ttf.totaltGlyphs );
      result.push( glyph );
    }
    this.setState({ glyphs: result });
  },

 render( ){
  return(
    <div>
      <Head font = {this.state.selectedFont} />
      <div className = "inside" id = "space"/>
      <Cover win = {this.state.window} grid = {new Grid}></Cover>
      <Quote win = {this.state.window} />
      <Instructions callback = { this.__changeSelectedFont } fonts = {this.state.fonts} win = {this.state.window} />
      <Board glyphs = { this.state.glyphs } font = {this.state.selectedFont} />
    </div>
   )
 }
} )
