const React = require('react');
const ReactDOM = require('react-dom');
const BinaryReader = require('../util/binary_reader');
const TrueTypeFont = require('../util/true_type_font');
const Glyph = require('../util/glyph');
module.exports = React.createClass({
    dragEvent(e){
      e.preventDefault();
      $("#dragTarget").addClass("drag-target-dragged");
    },
    getInitialState(){
      return({ttf:"",width:"",height:"",scale:64});
    },
    drop(e){
      e.preventDefault();
      let reader = new FileReader();
      reader.readAsArrayBuffer(e.dataTransfer.files[0]);
      const readerLoadFunc = function(e) {
        this.ShowTtfFile(reader.result);
        console.log("nicenice");
      };
      reader.onload = readerLoadFunc.bind(this);
    },
    findTotalGlyphs(){
      let i = 0;
      while(this.state.ttf.readGlyph(i).xMin){
        i+=1;
      }
      this.setState({length:i});
      this.createCanvas();
    },
    createCanvas(){

      for (var i = 11; i < this.state.length; i++) {
        let glyph = new Glyph(i,this.state.ttf);
        let font = this.state.ttf.readGlyph(i);
        var canvas = document.createElement("canvas");
        canvas.style.border = "1px solid gray";
        canvas.height = 50;
        var ctx = canvas.getContext("2d");
        ctx.scale(this.state.scale*2, -this.state.scale*2);
        ctx.translate(10,-800);
        ctx.strokeStyle="red";
        ctx.lineWidth=2;
        ctx.beginPath();
        if(this.state.ttf.drawGlyph(i,ctx)){
          ctx.fill();
          this.state.ttf.drawCircs(i,ctx);
          document.body.appendChild(canvas);
        }
      }
    },
    ShowTtfFile(binary){
      let ttf = new TrueTypeFont(binary);
      this.setState({ttf: ttf, width:(ttf.xMax - ttf.xMin, ttf.yMax- ttf.yMin), scale:20/ttf.unitsPerEm});
      this.findTotalGlyphs();

    },
    dragExit(e){
      e.preventDefault();
      $("#dragTarget").removeClass("drag-target-dragged");
    },
    render(){
      return(
        <div>
          <div id="dragTarget" className = "dropTarget" onDragOver = {this.dragEvent} onDrop = {this.drop} onDragLeave={this.dragExit}>
            <div className= "inner-center-text">
              Drop a .ttf file here
            </div>
          </div>
          <div>
asdasd
          </div>
        </div>
      )
    }
})
