module.exports ={
  convert: function (base64) {
    var binary_string =  base64;
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
