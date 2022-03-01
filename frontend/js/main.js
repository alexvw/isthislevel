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

function requestOrientationPermission(){
    DeviceOrientationEvent.requestPermission()
    .then(response => {
        if (response == 'granted') {
            window.addEventListener('deviceorientation', (e) => {
                // do something with e
                initDevice();
                $('.request-button').hide();
            })
        }
    })
    .catch(console.error)
};

var gn = new GyroNorm();

function initDevice(){
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
            //$('#do_alpha').html(data.do.alpha);
    
            var betaNear = Math.abs(data.do.beta % 90).toFixed(2);
            var gammaNear = Math.abs(data.do.gamma % 90).toFixed(2);
    
            var betaTo90 = 90 - betaNear;
            var gammaTo90 = 90 - gammaNear;
    
            var betaDistance = Math.min(betaNear, betaTo90).toFixed(2);
            var gammaDistance = Math.min(gammaNear, gammaTo90).toFixed(2);
    
            $('#do_beta').html(betaDistance + "°");
            $('#do_gamma').html(gammaDistance + "°");
    
            var closest = Math.min(betaDistance, gammaDistance).toFixed(2);

            if (betaDistance < 1){
                $('#do_beta').addClass("level");
            }else{
                $('#do_beta').removeClass("level");
            }

            if (gammaDistance < 1){
                $('#do_gamma').addClass("level");
            }else{
                $('#do_gamma').removeClass("level");
            }
    
            if (betaDistance == 0 && gammaDistance == 0) {
                $('#level-indicator').css('background-color', 'pink');
                $('#text').html("Suspiciously flat");
                $('#face').html("🤔");
            } else if (betaDistance < 0.8 && gammaDistance < 0.8) {
                $('#level-indicator').css('background-color', 'GREEN');
                $('#text').html("FLAT");
                $('#face').html("😍");
            } else if (closest < 1) {
                $('#level-indicator').css('background-color', 'MEDIUMSEAGREEN');
                $('#text').html("yes");
                $('#face').html("😄");
            } else if (closest < 2.5) {
                $('#level-indicator').css('background-color', 'GOLD');
                $('#text').html("close");
                $('#face').html("😯");
            } else {
                $('#level-indicator').css('background-color', 'red');
                $('#text').html("no");
                $('#face').html("😠");
            }
    
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
    
        $('#text').html("iPhone? Needs gyroscope permission");
        $('.request-button').show();
    });  
};
initDevice();


