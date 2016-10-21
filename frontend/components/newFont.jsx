const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const BinaryReader = require( '../util/binary_reader' );
const TrueTypeFont = require( '../util/true_type_font' );
const Glyph = require( '../util/glyph' );
const ReactGlyph = require( './glyph' );
const Download = require('../util/download');
const fontActions = require('../actions/fontActions');
const GlyphStore = require( '../stores/glyphStore' );
const actions = require('../actions/glyphActions');
const Choice = require('./fontChoice');
const fontStore = require( '../stores/fontStore' );
Array.prototype.getInt16 = function( array ){
 let first = array.shift( )*256;
 let second = array.shift( );
 return( first+second );
}
module.exports = React.createClass( {
  componentDidMount( ){
    let func = function(data){
      this.setState({ fonts: data });
    }.bind(this);
    fontActions.getFonts(func);
    this.currentFont = fontStore.addListener( this.setTTf );
    this.list = GlyphStore.addListener( this.change );
  },
  componentWillUnmount( ){
   GlyphStore.removeListener( this.list );
  },
  setTTf( ttf ){
    ttf = fontStore.updateCurrentFont().ttf;
    this.setState({ ttf: ttf, width:( ttf.xMax - ttf.xMin, ttf.yMax- ttf.yMin ), scale:20/ttf.unitsPerEm });
    window.setTimeout( function(){
      this.findTotalGlyphs();
      $('.chooseFontShelf').css({ left: "-50%"});
      $('.scrollable').css({ opacity: 1});

    }.bind(this), 100 );
  },
  change( ){
   let nowGlyph = GlyphStore.getCurrentlySelectedGlyph( );
   if( nowGlyph === this.state.currentGlyph ){
    let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender};
    this.state.glyphs[nowGlyph.substring( 5 )].render( "editCanvas", 600, options );
   }else{
    this.setState( { currentGlyph:nowGlyph } );
    this.updateCurrentGlyph( nowGlyph );
   }
  },
  updateCurrentGlyph( nowGlyph ){
   let id = Number( nowGlyph.substring( 5 ) )
   let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender, newGlyph:true};
   this.state.glyphs[id].render( "editCanvas", 600, options );
  },
  dragEvent( e ){
   e.preventDefault( );
   $( "#dragTarget" ).addClass( "drag-target-dragged" );
   $( ".inner-center-text" ).addClass( "inner-text-drag-target-dragged" );

  },
  getInitialState( ){
   return( {ttf:"",width:"",height:"", link:"",
    scale:2,glyphs:[],currentGlyph:"asd"} );
  },



  findTotalGlyphs( ){
   let loca = this.seekTable( 'loca' );
   debugger
   let totalGlyphs = ( loca.length / 2 ) - 1;
   this.setState( {length:totalGlyphs} );
   this.createCanvas( );
  },

  populate( ){
    let result = [];
    for ( var i = 0; i < this.state.glyphs.length; i++ ) {
      result.push( <ReactGlyph key={i} glyph={this.state.glyphs[i]} glyphId={"Glyph"+i} ></ReactGlyph> );
    }
    return result;
  },

  createCanvas( ){
   let all = [];
   let ascender = -100;
   let descender = 1000;
   for ( var i = 0; i < this.state.length; i++ ) {
    let glyph = new Glyph( i,this.state.ttf,this.state.scale,this.state.length );
    all.push( glyph );
    if( glyph.yMin < descender ){
     descender = glyph.yMin;
    }
    if( glyph.yMax > ascender ){
     ascender = glyph.yMax;
    }

   }
   this.setState( {glyphs:all, ascender: ascender, descender:descender} );
  },


  ShowTtfFile( binary ){
   let ttf = new TrueTypeFont( binary );
   this.setState( {ttf: ttf, width:( ttf.xMax - ttf.xMin, ttf.yMax- ttf.yMin ), scale:20/ttf.unitsPerEm} );
   window.setTimeout( function(){
     this.findTotalGlyphs( );
     $('.chooseFontShelf').fadeOut();
   }.bind(this), 10)

  },


  dragExit( e ){
   e.preventDefault( );
   $( "#dragTarget" ).removeClass( "drag-target-dragged" );
  },

  drop( e ){
    e.preventDefault( );
    let reader = new FileReader( );
    reader.readAsArrayBuffer( e.dataTransfer.files[0] );
    const readerLoadFunc = function( e ) {
      this.ShowTtfFile( reader.result );
    };
    $( "#dragTarget" ).removeClass( "drag-target-dragged" );
    reader.onload = readerLoadFunc.bind( this );
  },



  submit( ){
   this.generateNewGlyphFlags();
   let tableNames = Object.keys(this.state.ttf.tables);
   let binary = this.generateNewBinary();
   let locTable = this.generateNewLocTables();
   let tables = {};
   for(var i = 0; i < tableNames.length; i++){
     let tableName = tableNames[i];
     let glyphChecksum = this.generateNewTableCheckSum(tableName, this.seekTable(tableName), tables);
   }
   let font = this.buildFont(tableNames,binary,locTable,tables);
  },

  generateNewGlyphFlags(){
    for (var i = 0; i < this.state.glyphs.length; i++) {
      let glyph = this.state.glyphs[i];
      glyph.findNewFlags();
    }
  },

  generateNewBinary(){
    let result = []
    for (var i = 0; i < this.state.glyphs.length; i++) {
      let glyph = this.state.glyphs[i]
      let binary = glyph.gatherBinary();
      result = result.concat(binary);
    }
    return result;
  },


  buildFont(tableNames, binary, locTable, newTables){
    binary = this.padWithZero(binary);
    newTables.glyf.length === binary.length;
    let result = Array.from(this.state.ttf.file.data.slice(0,12));
    let allOldTables = this.state.ttf.tables;
    let oldFile = this.state.ttf.file.data;
    let diffTableOffset = binary.length - allOldTables.glyf.length;
    for( var i = 0; i < tableNames.length; i++ ){
      let tableName = tableNames[i];
      let oldTable = this.state.ttf.tables[tableName];
      if(tableName == 'head'){
        result = result.concat(this.encodeString( tableName ));
        result = result.concat(this.encodeU32( newTables[tableName].checksum ));
        result = result.concat(this.encodeU32( oldTable.offset ));
        result = result.concat(this.encodeU32( oldTable.length + diffTableOffset));
      }else{
          result = result.concat(this.encodeString( tableName ));
          result = result.concat(this.encodeU32( newTables[tableName].checksum ));
        if( oldTable.offset > allOldTables.glyf.offset ){
          result = result.concat(this.encodeU32( oldTable.offset + diffTableOffset ));
          newTables[tableName].offset = oldTable.offset + diffTableOffset;
        }else{
          result = result.concat(this.encodeU32( oldTable.offset ));
          newTables[tableName].offset = oldTable.offset;
        }
        if(tableName === 'glyf'){
          result = result.concat(this.encodeU32( binary.length ));
        }else{
          result = result.concat(this.encodeU32( oldTable.length ));
        }
      }
    }
    let locTableDataToGlyf = Array.from(
                      oldFile.slice(result.length,
                      allOldTables.glyf.offset));

    let locTableDataToEnd = Array.from(
                      oldFile.slice(allOldTables.kern.offset));
    result = result.concat(locTableDataToGlyf);
    result = result.concat(binary);
    locTable = this.padWithZero(locTable);
    result = result.concat(locTable);
    result = result.concat(locTableDataToEnd);
    this.generateNewTableCheckSum("allBinary", result, newTables);
    let binaryBegin = result.slice(0, allOldTables.head.offset + 8 );
    let checksumAdjustment = this.encodeU32([2981146554 - newTables.allBinary.checksum]);
    let binaryEnd = result.slice( allOldTables.head.offset + 12 );
    let output = binaryBegin.concat(checksumAdjustment.concat(binaryEnd));
    this.displayLink(output);
  },

  displayLink(output){
    let buffer = new ArrayBuffer(output.length);
    let data = new DataView(buffer);
    for( var i = 0; i < output.length; i++ ){
      data.setUint8(i, output[i]);
    }
    var a = document.getElementById('myNewFont');
    let dat = new Blob([data], {type: 'application/x-font-ttf'});
    Download(dat, "myFont.ttf");
    a.href = "data:application/x-font-ttf;base64,"+btoa(dat)
    a.style.display = "block";
  },








  padWithZero( array ){
    while( array.length % 4 !== 0 ){
      array.push(0);
    }
    return array;
  },
  encodeU32( num ){
    let result = [];
    let first = Math.floor( num / ( Math.pow(256, 3) ) );
    let second = Math.floor( (num - ( first * Math.pow(256,3) ) ) / Math.pow( 256, 2 ) );
    let third = Math.floor( (num - ( first * Math.pow(256,3) ) - ( second * Math.pow(256, 2) ) ) / 256);
    let fourth = Math.floor( num%256 );
    return [ first, second, third, fourth ];
  },
  encodeString( string ) {
      var result = [];
      for( var i = 0; i < string.length; i++ ){
        result.push(string[i].charCodeAt(0));
      }
      return result;
  },
  generateNewLocTables(){
    let result = [ 0, 0 ];
    let offset = 0;
    for(var i = 0; i < this.state.glyphs.length; i++){
      let length = this.state.glyphs[i].createOffsetIndexItem();
      offset += length;
      result = result.concat(this.package16( offset / 2 ));
    }
    return result;
  },
  generateNewTableCheckSum(tableName, binary, tables){
    let sum = 0;
    let binaryChunk = Array.from(binary);
    while(binaryChunk.length % 4 !== 0){
      binaryChunk = this.padWithZero(binaryChunk);
    }
    if(tableName === 'head'){
      binaryChunk[8] = 0;
      binaryChunk[9] = 0;
      binaryChunk[10] = 0;
      binaryChunk[11] = 0;
    }
    for(var i = 0; i < binaryChunk.length; i += 4 ){
      sum += this.findLong(binaryChunk.slice( i,i + 4 ));
    }

    sum = sum >> 32 >>> 0
    tables[tableName] = {checksum: sum};
    return sum;
  },

  findLong(array){
    let bin = ((array[0] << 24) |
          ( array[ 1 ] << 16) |
          ( array[ 2 ] << 8) |
          ( array[ 3 ] ));
          if( bin < 0 ){
            bin = bin >>> 0;
          }
    return bin;
  },



  package16(data){
    let result = []
    if( data < 0 ){
      result.push( 255-( Math.ceil( data / 255 ) ) );
      result.push( 256+( data % 255 ) );
    } else{
      result.push( Math.floor( data / 255 ) );
      result.push( ( data % 256 ) );
    }
    return result;
  },



  seekTable( tableName ){
   let table = this.state.ttf.tables[tableName];
   let offset = table.offset;
   let length = table.length;
   let data = this.state.ttf.file.data;
   let dataChunk = data.slice( offset, offset + length );
   return dataChunk;
  },

  setLink(){
      return(
        <div className = "overlay">
          <a id="myNewFont" download="myNewFont.ttf" type="application/x-font-ttf">Download</a>
        </div>
      );
  },

  getFonts(){
    let pop = <div></div>;
    if( this.state.fonts ){
      let font = this.state.fonts;
      return(
        <Choice font = {font} callback = {this.ShowTtfFile} ></Choice>
      )
    }
    return pop;
  },

  render( ){
   return(
    <div className="content">

      <div className = "chooseFontShelf">
        <div className = "shelfTitle">
          Choose a Font
        </div>
        {
          this.getFonts()
        }
      </div>
      <div className="container">
        <div className="scrollable">
          {
           this.populate( )
          }
        </div>
      </div>
      <div className="glyphContainer">
        <canvas id="editCanvas"></canvas>
      </div>
      <div className="rightcont" >
      <div id="dragTarget" className = "dropTarget" onDragOver = {this.dragEvent} onDrop = {this.drop} onDragLeave={this.dragExit}>
         <div className= "inner-center-text">
          Drop a .ttf file here
         </div>
        </div>
        <div className="convert" onClick={this.submit}>submit</div>
      </div>
       {
         this.setLink()
       }
   </div>
    )
  }
} )
