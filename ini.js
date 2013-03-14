"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(calculate);
});
//main
function calculate(evt) {
  var f = evt.target.files[0]; 

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      out.className = 'unhidden';
      initialinput.innerHTML = contents;
      finaloutput.innerHTML = pretty;
    }
    r.readAsText(f); // Leer como texto
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= token.type %>"> <%= matching %> </span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(temp, {token: t, matching: s});   //_  se usa para hacer referencia a un metodo de la libreria underscore(template interpola lo que haya entre % en la cadena temp)
							//ttoken:--> Lo que hay que decir en el template,  t--> la cadena por la que se reemplaza
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\s+/g;
  var iniheader      = /^\[.+\]/;
  var comments       = /^[;].*/;
  var nameEqualValue = /^([^=]+)\s*(\=)\s*(.*)/g;	//   /^(([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(\S.*)/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : "blanks", match: m[0] });	// type : ________
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : "iniheader", match: m[0] });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : "comments", match: m[0] });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : "nameEqualValue", match: m[0] });
    }
    else if (m = any.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : "any", match: m[0] });
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}
