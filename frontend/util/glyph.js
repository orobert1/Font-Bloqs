const Actions = require( '../actions/glyphActions' );
  function Glyph ( glyphNum, ttf, scale, numGlyphs ){
    this.numGlyphs = numGlyphs;
    this.ttf = ttf;
    this.glyphNum = glyphNum;
    this.scale = scale;
    this.Glyph = this.ttf.readGlyph( glyphNum );
    this.xMin = this.Glyph.xMin;
    this.xMax = this.Glyph.xMax;
    this.yMin = this.Glyph.yMin;
    this.yMax = this.Glyph.yMax;
    this.pos = 0;
    this.instructions = this.ttf.file.
    data.slice(this.Glyph.instructionsBegin,
    this.Glyph.instructionsEnd);
    this.data = ttf.file.data;
    this.points = this.Glyph.points;
    this.counter = 0
    this.update = false;
    this.count();
    this.seekTable( 'loca' );
    this.findPointOffset();
    this.seekTable( 'glyf' );
    this.seekPointOffset();
  }

  Glyph.prototype.count = function(){
    this.counter++;
    if(this.counter > 10){
      this.update = true;
      this.counter = 0;
    }else{
      this.update = false;
    }
    window.setTimeout(this.count.bind(this), 10);
  }

  Glyph.prototype.findNewFlags = function(){
    for (var i = 0; i < this.points.length; i++) {
      if( i >= 1 ){
        let currPoint = this.points[i];
        let prevPoint = this.points[i-1];
        currPoint.bothx = 0;
        currPoint.Samex = 0;
        currPoint.SixteenBitx = 0;
        currPoint.EightBitNegx = 0;
        currPoint.bothy = 0;
        currPoint.Samey = 0;
        currPoint.SixteenBity = 0;
        currPoint.EightBitNegy = 0;


        if( currPoint.x > prevPoint.x ){
          if( currPoint.x - 256 >= prevPoint.x ){
            currPoint.Splitx = 1;
          }else{
            currPoint.bothx = 1
          }
        }else if( currPoint.x === prevPoint.x ){
          currPoint.Samex = 1;
          currPoint.SixteenBitx = 1
        }else{
          if(prevPoint.x > 256+currPoint.x){
            currPoint.Splitx = 1;
          }else{
            currPoint.EightBitNegx = 1;
          }
        }
        if( currPoint.y > prevPoint.y ){
          if( currPoint.y - 256 >= prevPoint.y ){
            currPoint.Splity = 1;
          }else{
            currPoint.bothy = 1
          }
        }else if( currPoint.y === prevPoint.y ){
          currPoint.Samey = 1;
          currPoint.SixteenBity = 1
        }else{
          if(prevPoint.y > 256+currPoint.y){
            currPoint.Splity = 1;
          }else{
            currPoint.EightBitNegy = 1;
          }
        }
      }else{

      }
    }
  }

  Glyph.prototype.render = function( canvasId,res,options ){
    this.res = res;
    var canvas = document.getElementById( canvasId );
    canvas.height = res;
    canvas.width = res;
    var ctx = canvas.getContext( "2d" );
    ctx.scale( this.scale*res/25, -this.scale*res/25 );
    ctx.translate( 200,-900 );
    ctx.lineWidth=5;
    ctx.beginPath();
    if( options.showMax ){
      ctx.moveTo( 0,options.yMax );
      ctx.lineWidth = 5;
      ctx.shadowColor = '#999';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = "black";
      ctx.fill();
    }
    if( this.drawGlyph( this.glyphNum,ctx ) ){
      ctx.fill();
      if( options.newGlyph ){
        this.drawCircs( this.glyphNum,ctx,`#glyph${this.glyphNum}`,res,this.scale,canvas );
      }

      $( `#glyph${this.glyphNum}` ).append( canvas );
    }
  }

  Glyph.prototype.drawCircs = function( i,ctx,id,res,scale, canvas ){
    var glyph = this.Glyph;
    var points = this.points;
    let p =0;
    $( '.glyphContainer' ).children( '.controls' ).remove();
    for ( var i = 0; i < points.length; i ++ ) {
      let point = points[i];
      ctx.moveTo( point.x,point.y );
      ctx.beginPath();
      ctx.ellipse( point.x,point.y,10,10,0,.1,0 );
      ctx.stroke();
      let div = document.createElement( "div" );
      div.className = "controls";
      div.draggable = "true";
      div.style.top=( ( -902+point.y ) * -scale * ( res/25 ) )-5+'px';
      div.style.left=( ( 615+point.x ) * scale * ( res/25 ) )-5+'px';
      div.attributes["onDrag"] = this.dragPoint.bind( this, point, canvas );
      $( '.glyphContainer' ).append( div );
      $( '.controls' ).on( "drag", function( e ){
        this.attributes["onDrag"]( e, this );
      } );
    }
  }

  function getMousePos( canvas, evt ) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left + 200,
      y: evt.clientY - rect.top
    };
  }
  Glyph.prototype.dragPoint = function ( point, canvas, evt, div ){
    let mouseXY = getMousePos( canvas, evt );
    if( this.update === true ){
      if( evt.clientX!== 0 && evt.clientY!== 0 ){
      div.style.top = mouseXY.y-5+"px";
      div.style.left = mouseXY.x-5+"px";
      point.x = ( this.scale * ( this.res / 5.7 ) ) * ( mouseXY.x )-615;
      point.y = - ( this.res / 285 ) * ( mouseXY.y ) + 902;
      Actions.updateCurrentGlyph();
    }
  }
  }
  Glyph.prototype.convertToBinary = function(){
    let result = [];
    let j = 0;
    while( j < this.points.length ){

      let point = this.points[j];
      let total = 0;
      var ON_CURVE        =  1,
          X_IS_BYTE       =  2,
          Y_IS_BYTE       =  4,
          REPEAT          =  8,
          X_DELTA         = 16,
          Y_DELTA         = 32;
      if( j>16 ){
      }
      if( point.onCurve ){
        total+=1;
      }

      if( point.bothx == 1 ){
        total+=18
      } else if( point.EightBitNegx === 1 ){
        total+=2;
      } else if( point.SixteenBitx === 1 ){
        total+=16;
      }
      if( point.bothy == 1 ){
        total+=36
      } else if( point.EightBitNegy ){
        total+=4;
      } else if( point.SixteenBity ){
        total+=32;
      }
      if(point.repeat === 1){

        total+=8;
        result.push( total );
        let count = 0;
        let options = Object.keys( point );
        let nextOptions = Object.keys( this.points[j+1] );
        let optSwitch = 1;
        let curve = point.onCurve;
        while( optSwitch === 1 && j+1 < this.points.length && this.points[j+1].onCurve == curve ){
          j+=1;
          options = Object.keys( point );
          count+=1;
          if( j+1<this.points.length ){
            nextOptions = Object.keys( this.points[j+1] );
            for ( var i = 0; i < options.length; i ++ ) {
              if( nextOptions[i]!==options[i]  ){
                optSwitch=0;
              }
            }
            for ( var i = 0; i < nextOptions.length; i ++ ) {
              if( nextOptions[i]!==options[i] ){
                optSwitch=0;
              }
            }
          }
        }
        total = count;
      }
      j++
      result.push( total );
    }

     result = result.concat( this.convertPointsToBinary() );

     return result
  }
  Glyph.prototype.convertGlyphMaxMintoBinary = function(){
    let result = [];
    let xMin = this.Glyph.xMin;
    let yMin = this.Glyph.yMin;
    let xMax = this.Glyph.xMax;
    let yMax = this.Glyph.yMax;
    result.push( Math.floor( this.Glyph.numberOfContours/255 ) );
    result.push( this.Glyph.numberOfContours%255 );
    result = result.concat( this.package16( xMin ) )
    result = result.concat( this.package16( yMin ) )
    result = result.concat( this.package16( xMax ) )
    result = result.concat( this.package16( yMax ) )
    for( var i = 0; i < this.Glyph.contourEnds.length; i ++ ){
      if( this.Glyph.contourEnds[i]<1 ){
        result.push( 255-( Math.ceil( this.Glyph.contourEnds[i]/255 ) ) );
        result.push( 256+( this.Glyph.contourEnds[i]%255 ) );
      } else{
        result.push( Math.floor( this.Glyph.contourEnds[i]/255 ) );
        result.push( ( this.Glyph.contourEnds[i]%255 ) );
      }
    }
    this.maxMins = result;
    return result
  }

  Glyph.prototype.convertPointsToBinary = function(){
    let result = [];
    let points = this.points;
    let x =[];
    let y = [];
    if( this.points.length === 0 ){
      points = [{x:1,y:1}]
    }
    let changeY = points[0].y;
    let changeX = points[0].x;

    for ( var i = 0; i < points.length; i ++ ) {
      let point = points[i];

      if( i>0 ){
        if( point.Samex!==1 ){
          let pointX = point.x-changeX;
          if( point.Splitx !== 1 ){
            if( point.EightBitPosx===1 ){
              x.push( point.x - changeX );
            } else{
              x.push( Math.abs( changeX-point.x ) );
            }
            changeX = point.x;
          } else{
            if( Math.floor( pointX/256 )<0 ){
              x.push( 256+Math.floor( pointX/256 ) );
              x.push( point.x-( changeX-( 256*( 256-x[x.length-1] ) ) ) );
            } else{
              x.push( Math.floor( pointX/256 ) );
              x.push( pointX-( 256*x[x.length-1] ) );
            }
            changeX = point.x;
          }
        }
        if( point.Samey!==1 ){
          let pointY = point.y-changeY;
          if( point.Splity !== 1 ){
            if( point.EightBitPosy===1 ){
              y.push( point.y - changeY );
            } else{
              y.push( Math.abs( changeY-point.y ) );
            }
            changeY = point.y;
          } else{
            if( Math.floor( pointY/256 )<0 ){
              y.push( 256+Math.floor( pointY/256 ) );
              y.push( point.y-( changeY-( 256*( 256-y[y.length-1] ) ) ) );
            } else{
              y.push( Math.floor( pointY/256 ) );
              y.push( pointY-( 256*y[y.length-1] ) );
            }
            changeY = point.y;
          }
        }
      } else{
        if( point.Splity===1 ){
            y.push( Math.floor( point.y/256 ) );
            y.push( point.y-( 256*y[y.length-1] ) );
            changeY = point.y;
        } else{
          if( point.y!==0 ){
            y.push( Math.abs( point.y ) );
          }
        }
        if( point.Splitx===1 ){
            x.push( Math.floor( point.x/256 ) );
            x.push( point.x-( 256*x[x.length-1] ) );
            changeX = point.x;
        } else{
          if( point.x!==0 ){
            x.push( Math.abs( point.x ) );
          }
        }
      }
    }
    return x.concat( y );
  }


  Glyph.prototype.findPointOffset = function(){
    this.seekOffset(  this.glyphNum * 2  );
    this.pointOffset = this.getInt16();
    if(  this.glyphNum <  this.numGlyphs  ){
      this.nextGlyphStart = this.getInt16();
      this.undoInt16();
    } else{
      this.nextGlyphStart = this.ttf.tables['glyf'].length;
    }
    let glyfOffset = this.ttf.tables['glyf'].offset;
    this.oldPointData = this.ttf.file
    .data.slice( glyfOffset+( this.pointOffset*2 ),
    glyfOffset+this.nextGlyphStart*2 );
  }

  Glyph.prototype.seekPointOffset = function(){
    this.seekTable( 'glyf' );
    this.seekOffset(  this.glyphOffset  );
  }

  Glyph.prototype.seek = function( pos ){
    this.pos = pos;
  }

  Glyph.prototype.seekOffset = function (  offset  ){
    this.pos += offset;
  }

  Glyph.prototype.seekTable = function(  tableName  ){
    let table = this.ttf.tables[tableName];
    this.pos = table.offset;
  }

  Glyph.prototype.getInt16 = function(){
    let first = this.data[this.pos]*256;
    this.pos++;
    let second = this.data[this.pos];
    this.pos++;
    return( first + second );
  }

  Glyph.prototype.undoInt16 = function (){
    this.pos = this.pos-2;
  }

  Glyph.prototype.package16 = function( data ){
    let result = []
    if( data<0 ){
      result.push( 255-( Math.ceil( data/255 ) ) );
      result.push( 256+( data%255 ) );
    } else{
      result.push( Math.floor( data/255 ) );
      result.push( ( data%255 ) );
    }
    return result;
  }

  Glyph.prototype.gatherBinary = function(){
    let result = [];
    result = result.concat(this.convertGlyphMaxMintoBinary());
    result = result.concat(this.package16(this.instructions.length));
    result = result.concat(Array.from(this.instructions));
    result = result.concat(this.convertToBinary());
    while(result.length%4 !== 0){
      result.push(0);
    }
    while(result.length%4 !== 0){
      result.push(0);
    }
    this.binary = result;
    return result;
  }

  Glyph.prototype.createOffsetIndexItem = function(){

    return this.binary.length;
  }


  Glyph.prototype.drawGlyph = function( index,ctx ){
    var glyph = this.Glyph;
    if (  glyph === null || glyph.type !== "simple"  ) {
        return false;
    }
    let points = glyph.points;
    var p = 0,
        c = 0,
        fourth = 0,
        first = 1;
        while ( p < glyph.points.length ) {
            var point = glyph.points[p];
            if (  first === 1  ) {
                ctx.moveTo( point.x, point.y );
                first = 0;
            } else {
              if( glyph.contourEnds!==p+1&&point.onCurve===false ){
                if( p===glyph.contourEnds[c] ){
                  first=1;
                  if( p+1 === points.length ){
                    ctx.lineTo( point.x,point.y,points[0].x,points[0].y )
                  } else{
                    ctx.moveTo( point.x,point.y );
                  }
                } else{
                  let first = points[p];
                  let destinationX = ( point.x+points[p+1].x )/2;
                  let destinationY =( point.y+points[p+1].y )/2;
                  if( points[p+1].onCurve===true ){
                    destinationX = points[p+1].x;
                    destinationY = points[p+1].y;
                  }
                  ctx.quadraticCurveTo( point.x,point.y,destinationX,destinationY );
                }
              } else{
                ctx.lineTo( point.x,point.y,point.x,point.y );
              }
            }
            if (  p === glyph.contourEnds[c]  ) {
                c += 1;
                first = 1;
            }
            p += 1;
        }
        return true;
  }

module.exports = Glyph
