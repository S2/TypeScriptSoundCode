var SinWave = (function () {
    function SinWave(frequency) {
        this.samplerate = 48000;
        this.channel = 1;
        this.stream_length = 4096;
        this.phase = 0.0;
        this.phase = 0.0;
        this.phaseStep = frequency / this.samplerate;
    }
    SinWave.prototype.next = function () {
        var retval = Math.sin(2 * Math.PI * this.phase);
        this.phase += this.phaseStep;
        return retval;
    };
    return SinWave;
})();
;
var Sound = (function () {
    function Sound(stream_length, channel) {
        this.isPlaying = false;
        this.context = new webkitAudioContext();
        this.node = this.context.createJavaScriptNode(stream_length, 1, channel);
    }
    Sound.prototype.play = function () {
        var self = this;
        this.node.onaudioprocess = function (event) {
            var data = event.outputBuffer.getChannelData(0);
            var s = gen.next();
            var i = data.length;
            while (i--)
                data[i] = s[i];
        };
        this.node.connect(this.context.destination);
        this.isPlaying = true;
    };

    Sound.prototype.stop = function () {
        this.node.disconnect();
        this.isPlaying = false;
    };
    return Sound;
})();
;
