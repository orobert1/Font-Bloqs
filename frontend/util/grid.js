let $ = require('jquery');

function Grid(){
  this.width =  $('body').width();
  this.height =  window.innerHeight;
  this.gridX = 30;
  this.gridY = 20;
  this.gutterX = 10;
  this.gutterY = 10;
  this.squareWidth =
  ( this.width - ((this.gridX - 2) * this.gutterX ) )
  / this.gridX
  this.squareHeight =
  ( this.height - ((this.gridY - 2) * this.gutterY ) )
  / this.gridY
}

Grid.prototype.alignLeft = function( HTMLElement, left ){
  let element = HTMLElement;
  if( left >= 1 ){
    element.style.marginLeft = left * this.squareWidth + ( ( left - 1 ) * this.gutterX ) + 'px';
  }else{
    element.style.marginLeft = "0px";
  }

}
Grid.prototype.alignRight = function( HTMLElement, right ){
  let element = HTMLElement;
  if( right >= 1 ){
    element.style.right = right * this.squareWidth + ( ( right ) * this.gutterX ) + 'px';
  }else{
    element.style.marginLeft = "0px";
  }

}
Grid.prototype.marginRight = function( HTMLElement, right ){
  let element = HTMLElement;
  if( right >= 1 ){
    element.style.marginRight = right * this.squareWidth + ( ( right - 1 ) * this.gutterX ) + 'px';
  }else{
    element.style.marginRight = "0px";
  }

}

Grid.prototype.alignTop = function( HTMLElement, top ){
  let element = HTMLElement;
  if( top >= 1 ){
    element.style.marginTop = top * this.squareHeight + ( ( top - 1 ) * this.gutterY ) + "px";
  }else{
    element.style.marginTop = "0px";
  }

}

Grid.prototype.marginTop = function( HTMLElement, marginTop ){
  let element = HTMLElement;
  element.style.marginTop = marginTop * this.squareHeight + ( (marginTop + 1) * this.gutterY ) + "px";
}

Grid.prototype.makeWidth = function( HTMLElement, width ){
  let element = HTMLElement;
  element.style.width = width * this.squareWidth + ( (width - 1) * this.gutterX)  + "px";
}

Grid.prototype.picWidth = function( HTMLElement, width ){
  let element = HTMLElement;
  element.style.width = width * this.squareWidth + ( (width - 1) * this.gutterX)  + "px";
}
Grid.prototype.picHeight = function( HTMLElement, height ){
  let element = HTMLElement;
  element.style.height = height * this.squareHeight + ( (height - 1) * this.gutterY)  + "px";

}



module.exports = Grid;
