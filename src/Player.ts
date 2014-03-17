/// <reference path="StreamGenerator.ts" />

class Player{
    context:any;
    node:any;
    isPlaying : Boolean = false;
    options:StreamGeneratorOption;
    frequencyArray : number[];

    constructor(webkitAudioContext : any , options : StreamGeneratorOption){
        this.context = webkitAudioContext;
        this.options = options;
        this.node = this.context.createJavaScriptNode(this.options.streamLength, 2, this.options.channel);
        this.isPlaying = false;
    }
    
    public changeVolume(volume:number){
        this.options.volume = volume
    }
    public clearPitch(){
        this.frequencyArray = [];
    }

    public setPitch(scaleChars : string , pitch : number){
        var pitch = this.getPitch(scaleChars , pitch);
        this.frequencyArray.push(pitch);
        return pitch
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

    private getPitch(scaleChars : string , pitch : number):number{
        var scale = {};
        scale["C" ] = 3;
        scale["B#"] = 3;
        scale["C#"] = 4;
        scale["D" ] = 5;
        scale["D#"] = 6;
        scale["E" ] = 7;
        scale["E#"] = 8;
        scale["F" ] = 8;
        scale["F#"] = 9;
        scale["G" ] = 10;
        scale["G#"] = 11;
        scale["A" ] = 0;
        scale["A#"] = 1;
        scale["B" ] = 2;
    
        var diffFromA4 : number = 0;
        diffFromA4 += scale[scaleChars];
        diffFromA4 += (pitch - 4) * 12;
    
        var frequency : number = 440 * Math.pow(Math.pow(2.0, 1.0/12.0) , diffFromA4)
        return parseInt(frequency + "");
    }
}
