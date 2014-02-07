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
        var phaseStep = frequencyArray[0] / this.options.sampleRate;
        for (var i = 0; i < this.options.streamLength; i++) {
            stream[i] = 0;
            for (var j = 0; j < arrayLength; j++) {
                var frequency = frequencyArray[j];
                stream[i] += this.getWave(frequency);
            }
            console.log(stream[i] + "");
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
                console.log(i);
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
