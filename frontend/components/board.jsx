const React = require('react');
const ReactDOM = require('react-dom');
const GlyphStore = require( '../stores/glyphStore' );
const Glyph = require('../util/glyph');
const Grid = require('../util/grid.js');
const trueTypeWriter = require('../util/trueTypeWriter');
const Download = require('../util/download');


module.exports = React.createClass({
  componentWillReceiveProps(){
    let glyphCanvas = document.getElementById("glyphCanvas");
    let download = document.getElementById("download");
    let check = document.getElementById("check");

    let grid = new Grid();

    grid.alignTop( download, 14 );
    grid.alignLeft( download, 25 );

    grid.alignTop( check, 12 );
    grid.alignLeft( check, 25 );

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

  download(){
    let download = new trueTypeWriter( this.props.font, this.props.glyphs );

    let buffer = new ArrayBuffer(download.output.length);
    let data = new DataView(buffer);
    for( var i = 0; i < download.output.length; i++ ){
      data.setUint8(i, download.output[i]);
    }

    let dat = new Blob([data], {type: 'application/x-font-ttf'});
    Download(dat, "myFont.ttf");


  },

  check(){
    let download = new trueTypeWriter( this.props.font, this.props.glyphs );
    download.checkAgainstOriginal();

  },

  render(){

    return(
      <div className = "glyphCanvas" id = "glyphCanvas">
        <div className = "buffer"></div>
        <div id = "download" onClick = {this.download} >Download</div>
        <div id = "check" onClick = {this.check} >check</div>
        <div className="glyphContainer">
          <canvas id="editCanvas"></canvas>
        </div>
      </div>
    )
  }
})
