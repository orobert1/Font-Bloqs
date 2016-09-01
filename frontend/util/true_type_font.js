const BinaryReader = require( './binary_reader' );
const assert = require( './assert' );
function TrueTypeFont( arrayBuffer )
{
    this.file = new BinaryReader( arrayBuffer );
    this.glyphOffsets = [];
    this.tables = this.readOffsetTables( this.file );
    this.readHeadTable( this.file );
}

TrueTypeFont.prototype = {
    readOffsetTables: function( file ) {
        var tables = {};
        this.scalarType = file.getUint32();
        var numTables = file.getUint16();
        this.searchRange = file.getUint16();
        this.entrySelector = file.getUint16();
        this.rangeShift = file.getUint16();
        for(  var i = 0 ; i < numTables; i ++  ) {
            var tag = file.getString( 4 );

            tables[tag] = {
                checksum: file.getUint32(),
                offset: file.getUint32(),
                length: file.getUint32()
            };

            if ( tag !== 'head' ) {


                assert( this.calculateTableChecksum( file, tables[tag].offset,
                            tables[tag].length ) === tables[tag].checksum );
            }
        }
        return tables;
    },

    calculateTableChecksum: function( file, offset, length )
    {
        var old = file.seek( offset );
        var sum = 0;
        var nlongs = ( ( length + 3 ) / 4 ) | 0;
        while(  nlongs--  ) {
            sum = ( sum + file.getUint32() & 0xffffffff ) >>> 0;
        }

        file.seek( old );
        return sum;
    },
    readHeadTable: function( file ) {
        assert( "head" in this.tables );
        file.seek( this.tables["head"].offset );

        this.version = file.getFixed();
        this.fontRevision = file.getFixed();
        this.checksumAdjustment = file.getUint32();
        this.magicNumber = file.getUint32();
        assert( this.magicNumber === 0x5f0f3cf5 );
        this.flags = file.getUint16();
        this.unitsPerEm = file.getUint16();
        this.created = file.getDate();
        this.modified = file.getDate();
        this.xMin = file.getFword();
        this.yMin = file.getFword();
        this.xMax = file.getFword();
        this.yMax = file.getFword();
        this.macStyle = file.getUint16();
        this.lowestRecPPEM = file.getUint16();
        this.fontDirectionHint = file.getInt16();
        this.indexToLocFormat = file.getInt16();
        this.glyphDataFormat = file.getInt16();
    },
    getGlyphOffset: function( index ) {
        assert( "loca" in this.tables );
        var table = this.tables["loca"];
        var file = this.file;
        var offset, old;
        if ( this.indexToLocFormat === 1 ) {
            old = file.seek( table.offset + index * 4 );
            offset = file.getUint32();
        } else {
            old = file.seek( table.offset + index * 2 );
            offset = file.getUint16() * 2;
            this.glyphOffsets.push( offset );
        }

        file.seek( old );

        return offset + this.tables["glyf"].offset;
    },
    readGlyph: function( index ) {
       var offset = this.getGlyphOffset( index );
       var file = this.file;

       if ( offset >= this.tables["glyf"].offset + this.tables["glyf"].length )
       {
           return null;
       }
       file.seek( offset );
       let readerBPos= file.pos;
       var glyph = {
          readerBPos: readerBPos,
           numberOfContours: file.getInt16(),
           xMin: file.getFword(),
           yMin: file.getFword(),
           xMax: file.getFword(),
           yMax: file.getFword()
       };

       if ( glyph.numberOfContours === -1 ) {
           this.readSimpleGlyph( file, glyph );
       } else {
           this.readSimpleGlyph( file, glyph );
       }

       return glyph;
   },
   readSimpleGlyph: function( file, glyph ) {
       var ON_CURVE        =  1,
           X_IS_BYTE       =  2,
           Y_IS_BYTE       =  4,
           REPEAT          =  8,
           X_DELTA         = 16,
           Y_DELTA         = 32;

       glyph.type = "simple";
       glyph.contourEnds = [];
       glyph.glyfTableStart = this.tableStart;
       glyph.glyfTableEng = this.tableEnd;

       var points = glyph.points = [];

       for(  var i = 0; i < glyph.numberOfContours; i ++  ) {
           glyph.contourEnds.push( file.getUint16() );
       }

       // skip over intructions
       glyph.instructionsBegin = ( file.pos+2 );
      file.seek( file.getUint16() + file.tell() );
      glyph.instructionsEnd = file.pos;
      if ( glyph.numberOfContours === 0 ) {
           return;
       }
       var numPoints = Math.max.apply( null, glyph.contourEnds ) + 1;
       var flags = [];
       for(  i = 0; i < numPoints; i ++  ) {
           var flag = file.getUint8();
           flags.push( flag );
           points.push( {
               onCurve: ( flag & ON_CURVE ) > 0
           } );

           if (  flag & REPEAT  ) {
              glyph.repeat = 1;
              glyph.fuck = "asks";
               var repeatCount = file.getUint8();
               assert( repeatCount > 0 );
               i += repeatCount;
               while(  repeatCount--  ) {
                   flags.push( flag );
                   points.push( {
                       onCurve: ( flag & ON_CURVE ) > 0
                   } );
               }
           }
       }

       function readCoords( name, byteFlag, deltaFlag, min, max ) {
         let flog = flags[0];
          if( ~flog ){
          }

           var value = 0;
           for(  var i = 0; i < numPoints; i ++  ) {
               var flag = flags[i];
               if( flag&8 ){
                 points[i].repeat = 1;
               }
               if (  flag & byteFlag  ) {
                   if (  flag & deltaFlag  ) {
                       value += file.getUint8();
                       points[i]["EightBitPos"+name] = flag;
                       points[i]["both"+name] = 1;
                   } else {
                       value -= file.getUint8();
                       points[i]["EightBitNeg"+name] = 1;

                   }
               } else if (  ~flag & deltaFlag  ) {
                  points[i]["Split"+name] = 1;
                   value += file.getInt16();
               } else if( flag & deltaFlag ){
                   points[i]["SixteenBit"+name] = flag&deltaFlag;
                   points[i]["Same"+name] = 1;


               } else {
                 points[i]["Same"+name] = 1;
               }
               points[i][name] = value;
               points[i].endy = file.pos;
           }
           glyph.readerEndPos = file.pos;

       }

       readCoords( "x", X_IS_BYTE, X_DELTA, glyph.xMin, glyph.xMax );
       readCoords( "y", Y_IS_BYTE, Y_DELTA, glyph.yMin, glyph.yMax );
   }




 }
   module.exports = TrueTypeFont;
