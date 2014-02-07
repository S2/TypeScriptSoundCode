;

var StreamGenerator = (function () {
    function StreamGenerator(options) {
        this.phase = 0;
        this.options = options;
    }
    StreamGenerator.prototype.getWave = function (frequency) {
        var wave = Math.sin(2 * Math.PI * this.phase);
        return wave;
    };

    StreamGenerator.prototype.getStream = function (frequencyArray) {
        var stream = [];
        var arrayLength = frequencyArray.length;
        var phaseStep = frequency / this.options.sampleRate;
        for (var i = 0; i < this.options.streamLength; i++) {
            for (var i = 0; i < arrayLength; i++) {
                var frequency = frequencyArray[i];
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
    return Player;
})();
