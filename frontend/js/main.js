var noSleep = new NoSleep();

// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
}, false);

var args = {
    frequency: 200, // ( How often the object sends the values - milliseconds )
    gravityNormalized: true, // ( If the gravity related values to be normalized )
    orientationBase: GyroNorm.WORLD, // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation 
    //values with respect to the head direction of the device. gn.WORLD returns the orientation values 
    //with respect to the actual north direction of the world. )
    //decimalCount: 2, // ( How many digits after the decimal point will there be in the return values )
    //logger: null, // ( Function to be called to log messages from gyronorm.js )
    screenAdjusted: false // ( If set to true it will return screen adjusted values. )
};

var gn = new GyroNorm();

gn.init(args).then(function() {
    gn.start(function(data) {
        // Process:
        // data.do.alpha	( deviceorientation event alpha value )
        // data.do.beta		( deviceorientation event beta value )
        // data.do.gamma	( deviceorientation event gamma value )
        // data.do.absolute	( deviceorientation event absolute value )

        // data.dm.x		( devicemotion event acceleration x value )
        // data.dm.y		( devicemotion event acceleration y value )
        // data.dm.z		( devicemotion event acceleration z value )

        // data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
        // data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
        // data.dm.gz		( devicemotion event accelerationIncludingGravity z value )

        // data.dm.alpha	( devicemotion event rotationRate alpha value )
        // data.dm.beta		( devicemotion event rotationRate beta value )
        // data.dm.gamma	( devicemotion event rotationRate gamma value )
        $('#do_alpha').html(data.do.alpha);
        $('#do_beta').html(data.do.beta);
        $('#do_gamma').html(data.do.gamma);

        var betaLevel = (360 - data.do.beta) % 90;
        var gammaLevel = (360 - data.do.gamma) % 90;
        var betaLevel90 = 90 - betaLevel;
        var gammaLevel90 = 90 - gammaLevel;

        var betaLevel = Math.min(betaLevel, betaLevel90).toFixed(2);
        var gammaLevel = Math.min(gammaLevel, gammaLevel90).toFixed(2);

        var levelOfTwo = Math.min(betaLevel, gammaLevel);

        var distance = 10 - levelOfTwo;

        if (distance > 9.5) {
            $('#level-indicator').css('background-color', 'green');
            $('#text').html("YES");
        } else if (distance > 8.5) {
            $('#level-indicator').css('background-color', 'lightgreen');
            $('#text').html("yes");
        } else if (distance > 0) {
            $('#level-indicator').css('background-color', 'yellow');
            $('#text').html("close");
        } else {
            $('#level-indicator').css('background-color', 'red');
            $('#text').html("no");
        }

        $('#distance').html(distance);
        /*
        $('#dm_x').html(data.dm.x);
        $('#dm_y').html(data.dm.y);
        $('#dm_z').html(data.dm.z);

        $('#dm_gx').html(data.dm.gx);
        $('#dm_gy').html(data.dm.gy);
        $('#dm_gz').html(data.dm.gz);

        $('#dm_alpha').html(data.dm.alpha);
        $('#dm_beta').html(data.dm.beta);
        $('#dm_gamma').html(data.dm.gamma);
        */
    });
}).catch(function(e) {
    // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
    console.log("Device doesnt support motion: " + e);

    $('#level-indicator').css('background-color', 'grey');
    $('#text').html("IDK - your device doesnt support motion");
});