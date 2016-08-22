const React = require('react');
const ReactDOM = require('react-dom');
const BinaryReader = require('../util/binary_reader');
const TrueTypeFont = require('../util/true_type_font');
const Glyph = require('../util/glyph');
const ReactGlyph = require('./glyph');
const GlyphStore = require('../stores/glyphStore');
module.exports = React.createClass({
    componentDidMount(){
      this.list = GlyphStore.addListener(this.change);
    },
    componentWillUnmount(){
      GlyphStore.removeListener(this.list);
    },
    change(){
      let nowGlyph = GlyphStore.getCurrentlySelectedGlyph();
      if(nowGlyph === this.state.currentGlyph){
        let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender};
        this.state.glyphs[nowGlyph.substring(5)].render("editCanvas", 400, options);
      }else{
        this.setState({currentGlyph:nowGlyph});
        this.updateCurrentGlyph(nowGlyph);
      }
    },
    updateCurrentGlyph(nowGlyph){
      let id = Number(nowGlyph.substring(5))
      let options = {showMax:true, ascender: this.state.ascender, descender:this.state.descender, newGlyph:true};
      this.state.glyphs[id].render("editCanvas", 400, options);
    },
    dragEvent(e){
      e.preventDefault();
      $("#dragTarget").addClass("drag-target-dragged");
      $(".inner-center-text").addClass("inner-text-drag-target-dragged");

    },
    getInitialState(){
      return({ttf:"",width:"",height:"",
        scale:2,glyphs:[],currentGlyph:"asd"});
    },
    drop(e){
      e.preventDefault();
      let reader = new FileReader();
      reader.readAsArrayBuffer(e.dataTransfer.files[0]);
      const readerLoadFunc = function(e) {
        this.ShowTtfFile(reader.result);
      };
      $("#dragTarget").removeClass("drag-target-dragged");
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
      let all = [];
      let ascender = -100;
      let descender = 1000;
      for (var i = 74; i < this.state.length; i++) {
        let glyph = new Glyph(i,this.state.ttf,this.state.scale);
        all.push(glyph);
        if(glyph.yMin < descender){
          descender = glyph.yMin;
        }
        if(glyph.yMax > ascender){
          ascender = glyph.yMax;
        }

      }
      this.setState({glyphs:all, ascender: ascender, descender:descender});
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
    populate(){
      let result = [];
      for (var i = 0; i < this.state.glyphs.length; i++) {
        result.push(<ReactGlyph key={i} glyph={this.state.glyphs[i]} glyphId={"Glyph"+i} ></ReactGlyph>);
      }
      return result;
    },
    superDrag(){
    },
    submit(){
      let result = [];
      let glyphOffset = this.state.ttf.tables['glyf'].offset;
      let glyphOffsetLength = this.state.ttf.tables['glyf'].length;
      let file = this.state.ttf.file.data.slice(0);
      let glyfs = file.slice(glyphOffset, glyphOffset+glyphOffsetLength);
      for (var i = 0; i < this.state.glyphs.length; i++) {
        let glyph = this.state.glyphs[i];
        let justDisOne = glyph.convertToBinary();
        result = result.concat(justDisOne);
        for (var j = 0; j < justDisOne.length; j++) {
          if(justDisOne[j] !== glyph.binaryChunk[j]){
            console.log(justDisOne[j]);
          }
        }
      }
    },
    render(){
      return(
        <div className="content">
          <div className="container">
            <div className="scrollable">
            {
              this.populate()
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
            <div className="submit" onClick={this.submit}>submit</div>
          </div>
      </div>
      )
    }
})
