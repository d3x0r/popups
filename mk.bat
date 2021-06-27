call babel -o popups.js popups.mjs 


:call rollup popups.mjs --file popups.r.js --format iife 

::set SOURCES=popups.mjs
:set SOURCES=popups.r.js
:call google-closure-compiler.cmd --language_out ECMASCRIPT6  %SOURCES%  --js_output_file=popups.js

