const React = require('react');
const ReactDOM = require('react-dom');
const GlyphStore = require( '../stores/glyphStore' );
const Glyph = require('../util/glyph');

module.exports = React.createClass({
  componentWillReceiveProps(){
    let glyphCanvas = document.getElementById("glyphCanvas");
    glyphCanvas.style.width = window.innerWidth + "px";
    glyphCanvas.style.height = window.innerHeight + "px";
  },
  getInitialState(){
    return( { glyph: null } );
  },

  componentDidMount(){
    this.list = GlyphStore.addListener( this.__change );
  },

  __change(){
    let nowGlyph = GlyphStore.getCurrentlySelectedGlyph( );
    if( nowGlyph === this.state.currentGlyph ){
     let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender};
     this.props.glyphs[nowGlyph].render( "editCanvas", 600, options );
    }else{
     this.setState( { currentGlyph:nowGlyph } );
     this.updateCurrentGlyph( nowGlyph );
    }
  },

  updateCurrentGlyph( nowGlyph ){
   let id = nowGlyph;
   let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender, newGlyph:true};
   if( this.props.glyphs[id] ){
     let glyph = this.props.glyphs[nowGlyph]
     this.props.glyphs[id].render( "editCanvas", 600, options);
   }
  },

  renderEditor(){
    if( this.state.glyph && this.props.font.file ){
      let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender, newGlyph:true};
      let glyph = this.props.glyphs[this.state.glyph]
      glyph.render( "editCanvas", 600, options );
    }
  },

  render(){

    return(
      <div className = "glyphCanvas" id = "glyphCanvas">
        <div className = "buffer"></div>
        <div className="glyphContainer">
          <canvas id="editCanvas"></canvas>
        </div>
      </div>
    )
  }
})
