;

var StreamGenerator = (function () {
    function StreamGenerator(options) {
        this.phase = 0;
        this.options = options;
    }
    StreamGenerator.prototype.getWave = function (frequency) {
        var wave = this.options.volume * Math.sin(2 * Math.PI * this.phase);
        return wave;
    };

    StreamGenerator.prototype.getStream = function (frequencyArray) {
        var stream = [];
        var arrayLength = frequencyArray.length;
        var phaseStep = frequencyArray[0] / this.options.sampleRate;
        for (var i = 0; i < this.options.streamLength; i++) {
            stream[i] = 0;
            for (var j = 0; j < arrayLength; j++) {
                var frequency = frequencyArray[j];
                stream[i] += this.getWave(frequency);
            }
            this.phase += phaseStep;
        }
        return stream;
    };
    return StreamGenerator;
})();
;
var Player = (function () {
    function Player(webkitAudioContext, options, frequencyArray) {
        this.isPlaying = false;
        this.context = webkitAudioContext;
        this.options = options;
        this.node = this.context.createJavaScriptNode(this.options.streamLength, 2, this.options.channel);
        this.isPlaying = false;
        this.frequencyArray = frequencyArray;
    }
    Player.prototype.play = function () {
        var self = this;
        var streamGenerator = new StreamGenerator(this.options);
        this.node.onaudioprocess = function (event) {
            var data = event.outputBuffer.getChannelData(0);
            var stream = streamGenerator.getStream(self.frequencyArray);
            var i = data.length;
            while (i--) {
                data[i] = stream[i];
            }
        };
        this.node.connect(this.context.destination);
        this.isPlaying = true;
    };

    Player.prototype.stop = function () {
        this.node.disconnect();
        this.isPlaying = false;
    };

    Player.prototype.getPitch = function (scaleChars, pitch) {
        var scale = {};
        scale["C"] = 3;
        scale["B#"] = 3;
        scale["C#"] = 4;
        scale["D"] = 5;
        scale["D#"] = 6;
        scale["E"] = 7;
        scale["E#"] = 8;
        scale["F"] = 8;
        scale["F#"] = 9;
        scale["G"] = 10;
        scale["G#"] = 11;
        scale["A"] = 0;
        scale["A#"] = 1;
        scale["B"] = 2;

        var diffFromA4 = 0;
        diffFromA4 += scale[scaleChars];
        diffFromA4 += (pitch - 4) * 12;

        var frequency = 440 * Math.pow(Math.pow(2.0, 1.0 / 12.0), diffFromA4);
        return parseInt(frequency + "");
    };
    return Player;
})();
