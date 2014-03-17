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
    function Player(webkitAudioContext, options) {
        this.isPlaying = false;
        this.scale = {
            "C": 3,
            "B#": 3,
            "C#": 4,
            "D": 5,
            "D#": 6,
            "E": 7,
            "E#": 8,
            "F": 8,
            "F#": 9,
            "G": 10,
            "G#": 11,
            "A": 0,
            "A#": 1,
            "B": 2
        };
        this.context = webkitAudioContext;
        this.options = options;
        this.node = this.context.createJavaScriptNode(this.options.streamLength, 2, this.options.channel);
        this.isPlaying = false;
    }
    Player.prototype.setRandomPitch = function () {
        var randomChars = [];
        for (var key in this.scale) {
            randomChars.push(key);
        }
        var randomChar = randomChars[parseInt(Math.random() * randomChars.length + "")];
        var randomPitch = parseInt(Math.random() * 7 + 1 + "");
        this.setPitch(randomChar, randomPitch);
    };

    Player.prototype.changeVolume = function (volume) {
        this.options.volume = volume;
    };

    Player.prototype.clearPitch = function () {
        this.frequencyArray = [];
        this.pitchArray = [];
    };

    Player.prototype.setPitch = function (scaleChars, scalePitch) {
        var pitch = this.getPitch(scaleChars, scalePitch);
        this.frequencyArray.push(pitch);
        this.pitchArray.push(scaleChars + scalePitch);
    };

    Player.prototype.getPitchString = function () {
        return this.pitchArray.join(",");
    };

    Player.prototype.getFrequencyString = function () {
        return this.frequencyArray.join(",");
    };

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
        var diffFromA4 = 0;
        diffFromA4 += this.scale[scaleChars];
        diffFromA4 += (pitch - 4) * 12;

        var frequency = 440 * Math.pow(Math.pow(2.0, 1.0 / 12.0), diffFromA4);
        return parseInt(frequency + "");
    };
    return Player;
})();
