function trueTypeWriter( original, glyphs ){
  this.original = original;
  this.newGlyphs = glyphs;
  this.data = original.file.data;
  this.tables = this.getOriginalTableData();
  this.glyf = this.generateNewGlyfables();
  this.loca = this.generateNewLocTables();
  this.buildFont( this.original.tables );
}

trueTypeWriter.prototype.buildFont = function( tables ){
  let tableNames = Object.keys( tables );
  this.glyf = this.padWithZero( this.glyf, 4 );
  tables.glyf.length = this.glyf.length;
  tables['loca'].length = this.loca.length;
  let result = Array.from(this.data.slice(0,12));
  let allOldTables = this.original.tables;
  let oldFile = this.data;
  let diffTableOffset = this.glyf.length - allOldTables.glyf.length;
  for( var i = 0; i < tableNames.length; i++ ){
    let tableName = tableNames[i];
    let oldTable = this.original.tables[tableName];
    if(tableName == 'head'){
      result = result.concat(this.encodeString( tableName ));
      result = result.concat(this.encodeU32( tables[tableName].checksum ));
      result = result.concat(this.encodeU32( oldTable.offset ));
      result = result.concat(this.encodeU32( oldTable.length + diffTableOffset));
    }else{
      result = result.concat(this.encodeString( tableName ));
      result = result.concat(this.encodeU32( tables[tableName].checksum ));
      if( oldTable.offset > allOldTables.glyf.offset ){
        result = result.concat(this.encodeU32( oldTable.offset + diffTableOffset ));
        tables[tableName].offset = oldTable.offset + diffTableOffset;
      }else{
        result = result.concat(this.encodeU32( oldTable.offset ));
        tables[tableName].offset = oldTable.offset;
      }
      if(tableName === 'glyf'){
        result = result.concat(this.encodeU32( this.glyf.length ));
      }else{
        result = result.concat(this.encodeU32( oldTable.length ));
      }
    }
  }
  this.organizedTables = this.organizeFromLowOffset();
  let glyphFirst = this.glyphFirst( this.organizedTables );
  let tableAfterGlyph = this.getTableAfterGlyph( this.organizedTables );
  let tableAfterLoca = this.getTableAfterLoca( this.organizedTables );
  let binary = this.getBinary( result, glyphFirst, this.organizedTables, tableAfterGlyph, tableAfterLoca );
  let newTables = {};
  this.generateNewTableCheckSum("allBinary", binary, newTables);
  let binaryBegin = binary.slice(0, this.original.tables.head.offset + 8 );
  let checksumAdjustment = this.encodeU32([2981146554 - newTables.allBinary.checksum]);
  let binaryEnd = binary.slice( this.original.tables.head.offset + 12 );
  this.output = binaryBegin.concat(checksumAdjustment.concat(binaryEnd));
}

trueTypeWriter.prototype.getTableAfterLoca = function( organizedTables ){
  for (var i = 0; i < organizedTables.length; i++) {
    let table = organizedTables[i];
    if( table.tableName === "loca" ){
      return( organizedTables[ i + 1 ] );
    }
  }
}

trueTypeWriter.prototype.checkAgainstOriginal = function(){
  this.mistakes = [];
  for (var i = 0; i < this.output.length; i++) {
    let mine = this.output[i];
    let orig = this.data[i];
    if( mine !== orig ){
      this.mistakes.push({ original: orig, output: mine, index: i, section: this.findSection( i ) });
    }
  }
  debugger
}

trueTypeWriter.prototype.findSection = function( index ){
  for (var i = 0; i < this.organizedTables.length; i++) {
    let table = this.organizedTables[i]
    if( table.offset < index && ( table.offset + table.length ) > index ){
      return table.tableName;
    }
  }
}

trueTypeWriter.prototype.getTableAfterGlyph = function( organizedTables ){
  for (var i = 0; i < organizedTables.length; i++) {
    let table = organizedTables[i];
    if( table.tableName === "glyf" ){
      return( organizedTables[ i + 1 ] );
    }
  }
}


trueTypeWriter.prototype.getBinary = function( result, glyphFirst, organizedTables, tableAfterGlyph, tableAfterLoca ){
  if( glyphFirst ){
    result = result.concat(
      Array.from( this.data.slice(
        result.length, this.original.tables.glyf.offset ))).concat(
          this.glyf ).concat(
            Array.from(
              this.data.slice(
                tableAfterGlyph.offset, this.original.tables.loca.offset
              )
            )
          ).concat( this.loca ).concat(
            Array.from(
              this.data.slice(
                tableAfterLoca.offset
              )
            )
         );
  }else{
    result = result.concat(
      Array.from( this.data.slice(
        result.length, this.original.tables.loca.offset ))).concat(
          this.loca ).concat(
            Array.from(
              this.data.slice(
                tableAfterLoca.offset, this.original.tables.glyf.offset
              )
            )
          ).concat( this.glyf ).concat(
            Array.from(
              this.data.slice(
                tableAfterGlyph.offset
              )
            )
         );

  }
  return result
}


trueTypeWriter.prototype.glyphFirst = function( organizedTables ){
  let glyph = false;
  for (var i = 0; i < organizedTables.length; i++) {
    let name = organizedTables[i].tableName;
    if( name === "glyf" ){
      return true;
    }
  }
  return glyph;
}

trueTypeWriter.prototype.getLocTableDataToEnd = function(){
  let nextTable = this.original.tables.glyf.offset + this.original.tables.glyf.length;

  let glyfOffset = this.original.tables.glyf.offset;
  let tableNames = Object.keys( this.original.tables );
  for (var i = 0; i < tableNames.length; i++) {
    let tableName = tableNames[i];
    let table = this.original.tables[tableName];
    let offset = table.offset;
    let length = table.length;
    let tableEnd = offset + length;
    console.log( "glyf End " + (glyfOffset + this.original.tables.glyf.length) + ", " + tableName + " " + offset );
  }
  debugger

  return( this.data.slice(  ));
}

trueTypeWriter.prototype.organizeFromLowOffset = function(){
  let result = [];
  let tableNames = Object.keys( this.original.tables );
  while( tableNames.length > 0 ){
    let j = 0;
    let name = "";
    let lowest = this.data.length;
    for (var i = 0; i < tableNames.length; i++) {
      let table = tableNames[i];
      let offset = this.original.tables[table].offset;
      if( offset < lowest ){
        j = i;
        lowest = this.original.tables[table].offset;
        name = table;
      }
    }
    result.push( { tableName: name, offset: this.original.tables[name].offset, length: this.original.tables[name].length  } );
    tableNames.splice( j, 1 );
  }
  return result;
}

trueTypeWriter.prototype.getLocTableDataToGlyf = function( result ){
  return( this.data.slice( result.length, this.original.tables.glyf.offset ));
}

trueTypeWriter.prototype.generateNewTableCheckSum = function(tableName, binary, tables){
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

trueTypeWriter.prototype.getOriginalTableData = function(){
  let tableNames = Object.keys( this.original.tables);
  let tables = {};
  for (var i = 0; i < tableNames.length; i++) {
    tables[tableNames[i]] = this.seekTable( tableNames[i] );
  }
  return tables;
}

trueTypeWriter.prototype.generateNewLocTables = function(){
  let result = [ 0, 0 ];
  let offset = 0;
  for(var i = 0; i < this.newGlyphs.length; i++){
    let glyph = this.newGlyphs[i];
    glyph.gatherBinary();
    let length = this.newGlyphs[i].createOffsetIndexItem();
    if( length % 2 !== 0 ){

    }
    offset += length ;
    result = result.concat(this.package16( offset / 2 ));
  }
  return result;
}

trueTypeWriter.prototype.generateNewGlyfables = function(){
  let result = []
  for (var i = 0; i < this.newGlyphs.length; i++) {
    let glyph = this.newGlyphs[i]
    let binary = Array.from( glyph.gatherBinary() );
    result = result.concat(binary);
  }
  return result;
}

trueTypeWriter.prototype.seekTable = function( tableName ){
  let table = this.original.tables[tableName];
  let offset = table.offset;
  let length = table.length;
  let dataChunk = this.data.slice( offset, offset + length );
  return dataChunk;
}

trueTypeWriter.prototype.generateNewGlyphFlags = function(){
  for (var i = 0; i < this.newGlyphs.length; i++) {
    let glyph = this.newGlyphs[i];
    glyph.findNewFlags();
  }
}

trueTypeWriter.prototype.encodeU32 = function( num ){
  let result = [];
  let first = Math.floor( num / ( Math.pow(256, 3) ) );
  let second = Math.floor( (num - ( first * Math.pow(256,3) ) ) / Math.pow( 256, 2 ) );
  let third = Math.floor( (num - ( first * Math.pow(256,3) ) - ( second * Math.pow(256, 2) ) ) / 256);
  let fourth = Math.floor( num%256 );
  return [ first, second, third, fourth ];
}

trueTypeWriter.prototype.encodeString = function( string ) {
    var result = [];
    for( var i = 0; i < string.length; i++ ){
      result.push(string[i].charCodeAt(0));
    }
    return result;
}

trueTypeWriter.prototype.padWithZero = function( array, target ){
  while( array.length % target !== 0 ){
    array.push(0);
  }
  return array;
}

trueTypeWriter.prototype.package16 = function(data){
  let result = []
  if( data < 0 ){
    result.push( 255-( Math.ceil( data / 255 ) ) );
    result.push( 256+( data % 255 ) );
  } else{
    result.push( Math.floor( data / 256 ) );
    result.push( ( data % 256 ) );
  }
  return result;
}

trueTypeWriter.prototype.findLong = function(array){
  let bin = ((array[0] << 24) |
        ( array[ 1 ] << 16) |
        ( array[ 2 ] << 8) |
        ( array[ 3 ] ));
        if( bin < 0 ){
          bin = bin >>> 0;
        }
  return bin;
}


module.exports = trueTypeWriter;
