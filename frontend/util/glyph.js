
  function Glyph (glyphNum, ttf){
    this.ttf = ttf;
    this.glyphNum = glyphNum;
    this.Glyph = this.ttf.readGlyph(glyphNum);
    this.points = this.Glyph.points;
  }

  Glyph.prototype.render = function(){
    var canvas = document.createElement("canvas");
    canvas.style.border = "1px solid gray";
    canvas.height = 50;
    var ctx = canvas.getContext("2d");
    ctx.scale(this.state.scale*2, -this.state.scale*2);
    ctx.translate(10,-800);
    ctx.strokeStyle="red";
    ctx.lineWidth=2;
  }

module.exports = Glyph
