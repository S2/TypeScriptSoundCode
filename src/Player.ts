/// <reference path="StreamGenerator.ts" />

class Player{
    context:any;
    node:any;
    isPlaying : Boolean = false;
    options:StreamGeneratorOption;
    frequencyArray : number[];

    constructor(webkitAudioContext : any , options : StreamGeneratorOption, frequencyArray : number[]){
        this.context = webkitAudioContext;
        this.options = options;
        this.node = this.context.createJavaScriptNode(this.options.streamLength, 2, this.options.channel);
        this.isPlaying = false;
        this.frequencyArray = frequencyArray;
    }

    public play (){
        var self = this;
        var streamGenerator = new StreamGenerator(this.options);
        this.node.onaudioprocess = function(event) {
            var data = event.outputBuffer.getChannelData(0);
            var stream = streamGenerator.getStream(self.frequencyArray);
            var i = data.length;
            while (i--){
                data[i] = stream[i];
            }
        };
        this.node.connect(this.context.destination);
        this.isPlaying = true;
    }

    public stop () {
        this.node.disconnect();
        this.isPlaying = false;
    }
}
