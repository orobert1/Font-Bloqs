# [Font~Bloqs](http://font-bloqs.herokuapp.com/)#

## *A True Type Editing Interface*

###Takes a True Type Font
Drag in any .ttf file of your choice or choose from a list of pre-supplied files.

###Edit
Click a Glyph and load the points to the canvas. There you can drag the loaded points wherever you want.

###Download
When You're ready, click the Download button. The program will recompile the JavaScript Object back into a usable TrueType file.

In order to deal with binary data I had to write a class to read the binary and translate it into usable data. To do this I wrote a binary reader class that stores the position in the data as well as several methods for translation into numerical values. For example here is a function that I wrote for retrieving an unsigned integer
  ``` javascript
  getUint8: function() {
      assert( this.pos < this.data.length );
      return this.data[this.pos++];
  }
  ```
