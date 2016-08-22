const Actions = require('../actions/glyphActions');
  function Glyph (glyphNum, ttf, scale){
    this.ttf = ttf;
    this.glyphNum = glyphNum;
    this.scale = scale;
    this.Glyph = this.ttf.readGlyph(glyphNum);
    this.xMin = this.Glyph.xMin;
    this.xMax = this.Glyph.xMax;
    this.yMin = this.Glyph.yMin;
    this.yMax = this.Glyph.yMax;
    this.beginPos = this.Glyph.beginPos;
    this.readerEndPos = this.Glyph.readerEndPos;
    this.binaryChunk = this.ttf.file.data.slice(this.beginPos, this.readerEndPos);
    this.points = this.Glyph.points;
  }

  Glyph.prototype.render = function(canvasId,res,options){
    var canvas = document.getElementById(canvasId);
    canvas.height = res;
    canvas.width = res;
    var ctx = canvas.getContext("2d");
    ctx.scale(this.scale*res/25, -this.scale*res/25);
    ctx.translate(200,-900);
    ctx.lineWidth=5;
    ctx.beginPath();
    if(options.showMax){
      ctx.moveTo(0,options.yMax);
      ctx.strokeStyle="red";
      ctx.lineWidth=5;
      ctx.moveTo(-200,this.Glyph.yMax);
      ctx.lineTo(1200,this.Glyph.yMax);
      ctx.moveTo(-200,this.Glyph.yMin);
      ctx.lineTo(1200,this.Glyph.yMin);
      ctx.stroke();
      ctx.strokeStyle="blue";
      ctx.beginPath();
      ctx.moveTo(-200,options.ascender);
      ctx.lineTo(1200,options.ascender);
      ctx.moveTo(-200,options.descender);
      ctx.lineTo(1200,options.descender);
      ctx.stroke();
    }
    if(this.drawGlyph(this.glyphNum,ctx)){
      ctx.fill();
      if(options.newGlyph){
        this.drawCircs(this.glyphNum,ctx,`#glyph${this.glyphNum}`,res,this.scale,canvas);
      }

      $(`#glyph${this.glyphNum}`).append(canvas);
    }
  }

  Glyph.prototype.drawCircs = function(i,ctx,id,res,scale, canvas){
    var glyph = this.Glyph;
    var points = this.points;
    let p =0;
    $('.glyphContainer').children('.controls').remove();

    for (var i = 0; i < points.length; i++) {
      let point = points[i];
      ctx.moveTo(point.x,point.y);
      ctx.beginPath();
      ctx.ellipse(point.x,point.y,10,10,0,.1,0);
      ctx.stroke();
      let div = document.createElement("div");
      div.className = "controls";
      div.draggable = "true";
      div.style.top=((-900+point.y)*-scale*(res/25))-5+'px';
      div.style.left=((200+point.x)*scale*(res/25))-5+'px';
      div.attributes["onDrag"] = this.dragPoint.bind(this,point,canvas);
      $('.glyphContainer').append(div);
      $('.controls').on("drag", function(e){
        this.attributes["onDrag"](e, this);
      });
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  Glyph.prototype.dragPoint = function (point,canvas,evt, div){
    let mouseXY =getMousePos(canvas, evt);
    if(evt.clientX!== 0 &&evt.clientY!== 0){
      div.style.top = mouseXY.y-5+"px";
      div.style.left = mouseXY.x-5+"px";
      point.x = 3.0902255639097747*mouseXY.x-205;
      point.y = -3.0902255639097747*mouseXY.y+905;
      Actions.updateCurrentGlyph();
    }else{

    }
  }
  Glyph.prototype.convertToBinary = function(){
    let currChunk = this.binaryChunk.slice(0,this.points.length);
    let result = [];
    let j = 0;
    while(j < this.points.length){
      let point = this.points[j];
      let flag = currChunk[j];
      let total = 0;
      var ON_CURVE        =  1,
          X_IS_BYTE       =  2,
          Y_IS_BYTE       =  4,
          REPEAT          =  8,
          X_DELTA         = 16,
          Y_DELTA         = 32;
      if(j>16){
      }
      if(point.onCurve){
        total+=1;
      }
      debugger
      if(point.bothx == 1){
        total+=18
      }else if(point.EightBitNegx){
        total+=2;
      }else if(point.SixteenBitx){
        total+=16;
      }
      if(point.bothy == 1){
        total+=36
      }else if(point.EightBitNegy){
        total+=4;
      }else if(point.SixteenBity){
        total+=32;
      }

      if(point.repeat){
        debugger
        total+=8;
        result.push(total);
        let count = 0;
        let options = Object.keys(point);
        let nextOptions = Object.keys(this.points[j+1]);
        let optSwitch = 1;
        let curve = point.onCurve;
        while(optSwitch === 1 && j+1 < this.points.length && this.points[j+1].onCurve == curve){
          j+=1;
          options = Object.keys(point);
          count+=1;
          if(j+1<this.points.length){
            nextOptions = Object.keys(this.points[j+1]);
            for (var i = 0; i < options.length; i++) {
              if(nextOptions[i]!==options[i] ){
                optSwitch=0;
              }
            }
            for (var i = 0; i < nextOptions.length; i++) {
              if(nextOptions[i]!==options[i]){
                optSwitch=0;
              }
            }
          }else{
          }
        }
        total = count;
      }
      result.push(total);
      j++
    }
    currChunk = currChunk.slice(0,result.length);



     result = result.concat(this.convertPointsToBinary());
     return result
  }

  Glyph.prototype.convertPointsToBinary = function(){
    let result = [];
    let points = this.points;
    let x =[];
    let y = [];
    let bin = points[0].readerBPos;
    let binEnd = points[points.length-1].endy;
    let binaryChunk = this.ttf.file.data.slice(bin, binEnd);
    let changeY = points[0].y;
    let changeX = points[0].x;
    for (var i = 0; i < points.length; i++) {

      let point = points[i];
      if(i>0){
        if(point.Samex!==1){

          let pointX = point.x-changeX;
          if(point.Splitx !== 1){
            if(point.EightBitPosx===1){
              x.push(point.x - changeX);
            }else{
              x.push(Math.abs(changeX-point.x));
            }
            changeX = point.x;
          }else{
            if(Math.floor(pointX/256)<0){
              x.push(256+Math.floor(pointX/256));
              x.push(point.x-(changeX-(256*(256-x[x.length-1]))));
            }else{
              x.push(Math.floor(pointX/256));
              x.push(pointX-(256*x[x.length-1]));
            }
            changeX = point.x;
          }
        }
        if(point.Samey!==1){
          let pointY = point.y-changeY;
          if(point.Splity !== 1){
            if(point.EightBitPosy===1){
              y.push(point.y - changeY);
            }else{
              y.push(Math.abs(changeY-point.y));
            }
            changeY = point.y;
          }else{
            if(Math.floor(pointY/256)<0){
              y.push(256+Math.floor(pointY/256));
              y.push(point.y-(changeY-(256*(256-y[y.length-1]))));
            }else{
              y.push(Math.floor(pointY/256));
              y.push(pointY-(256*y[y.length-1]));
            }
            changeY = point.y;
          }
        }
      }else{
        if(point.Splity===1){
            y.push(Math.floor(point.y/256));
            y.push(point.y-(256*y[y.length-1]));
            changeY = point.y;
        }else{
          if(point.y!==0){
            y.push(Math.abs(point.y));
          }
        }
        if(point.Splitx===1){
            x.push(Math.floor(point.x/256));
            x.push(point.x-(256*x[x.length-1]));
            changeX = point.x;
        }else{
          if(point.x!==0){
            x.push(Math.abs(point.x));
          }
        }
      }
    }

    return x.concat(y);
  }

  Glyph.prototype.drawGlyph = function(index,ctx){
    var glyph = this.Glyph;
    if ( glyph === null || glyph.type !== "simple" ) {
        return false;
    }
    let points = glyph.points;
    var p = 0,
        c = 0,
        fourth = 0,
        first = 1;
        while (p < glyph.points.length) {
            var point = glyph.points[p];
            if ( first === 1 ) {
                ctx.moveTo(point.x, point.y);
                first = 0;
            } else {
              if(glyph.contourEnds!==p+1&&point.onCurve===false){
                if(p===glyph.contourEnds[c]){
                  first=1;
                  if(p+1 === points.length){
                    ctx.lineTo(point.x,point.y,points[0].x,points[0].y)
                  }else{
                    ctx.moveTo(point.x,point.y);
                  }
                }else{
                  let first = points[p];
                  let destinationX = (point.x+points[p+1].x)/2;
                  let destinationY =(point.y+points[p+1].y)/2;
                  if(points[p+1].onCurve===true){
                    destinationX = points[p+1].x;
                    destinationY = points[p+1].y;
                  }
                  ctx.quadraticCurveTo(point.x,point.y,destinationX,destinationY);
                }
              }else{
                ctx.lineTo(point.x,point.y,point.x,point.y);
              }
            }
            if ( p === glyph.contourEnds[c] ) {
                c += 1;
                first = 1;
            }
            p += 1;
        }
        return true;
  }

module.exports = Glyph
