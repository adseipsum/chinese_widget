/**
 * Created by dkh on 27.04.17.
 *
 * This script build blinking point animated gif file and save it to i/point.gif
 * For change point color change color variable
 *
 * Note:
 * If you need to change big_diameter you need to change:
 *      grath_style offsets in js/src/binarysatation.js
 *          graph_point_top_offset
 *          graph_point_left_offset
 *      graph-point class in css/s.less
 *          width
 *          height
 *
 */

// Parameters
var color = '#badfe5';  // point color
var big_d=10;           // big point diameter
var small_d=3           // small point diameter


var GIFEncoder = require('gif-encoder');
var Canvas = require('canvas');
var fs = require('fs');
var encoder = new GIFEncoder(big_d,big_d);
// stream the results as they are available into myanimated.gif
encoder.pipe(fs.createWriteStream('i/point.gif'));

encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(500);  // frame delay in ms
encoder.setQuality(20); // image quality. 10 is default.
encoder.setTransparent(0x000000);
encoder.writeHeader();

var ctx = new Canvas(big_d,big_d).getContext('2d');

function drawLastPoint(radius) {
    var x=big_d/2;
    var y=big_d/2;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, big_d, big_d);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

// small point
drawLastPoint(3);
encoder.addFrame(ctx.getImageData(0, 0, big_d, big_d).data);
// big point
drawLastPoint(big_d/2);
encoder.addFrame(ctx.getImageData(0, 0, big_d, big_d).data);

encoder.finish();