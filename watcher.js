var watch = require('node-watch');
var util=require('util')
var exec=require('child_process').exec;


watch('./test.js', { recursive: true }, function(evt, name) {
    console.log('%s changed.', name);
    exec('node ./test.js', (err, stdout, stderr) => {
        console.log(stdout);
    });
});