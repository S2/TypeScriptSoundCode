/// <reference path="StreamGenerator.ts" />

class Player{
    context:any;
    node:any;
    isPlaying : Boolean = false;
    options:StreamGeneratorOption;
    frequencyArray : number[];
    pitchArray : string[];
    scale : {} = {
        "C"  : 3,
        "C#" : 4,
        "D"  : 5,
        "D#" : 6,
        "E"  : 7,
        "F"  : 8,
        "F#" : 9,
        "G"  : 10,
        "G#" : 11,
        "A"  : 0,
        "A#" : 1,
        "B"  : 2,
    };

    scaleArray = [
        "C"  , 
        "C#" , 
        "D"  , 
        "D#" , 
        "E"  , 
        "F"  , 
        "F#" , 
        "G"  , 
        "G#" , 
        "A"  , 
        "A#" , 
        "B"  , 
    ];

    constructor(webkitAudioContext : any , options : StreamGeneratorOption){
        this.context = webkitAudioContext;
        this.options = options;
        this.node = this.context.createJavaScriptNode(this.options.streamLength, 2, this.options.channel);
        this.isPlaying = false;
    }
 
    public setRandomPitch(){
        var randomChars = [];
        for( var key in this.scale){
            randomChars.push(key);
        }
        var randomChar = randomChars[parseInt(Math.random() * randomChars.length + "")];
        var randomPitch = parseInt(Math.random() * 7 + 1 + "");
        this.setPitch(randomChar , randomPitch);
    }
    
    public changeVolume(volume:number){
        this.options.volume = volume
    }

    public clearPitch(){
        this.frequencyArray = [];
        this.pitchArray = [];
    }
    
    public addMajor3(baseScaleChars : string , baseScalePitch : number){
        return this.increasePitch(baseScaleChars , baseScalePitch , 4)
    }

    public addMinor3(baseScaleChars : string , baseScalePitch : number){
        return this.increasePitch(baseScaleChars , baseScalePitch , 3)
    }

    public addMajor7(baseScaleChars : string , baseScalePitch : number){
        return this.increasePitch(baseScaleChars , baseScalePitch , 11)
    }

    public addMinor7(baseScaleChars : string , baseScalePitch : number){
        return this.increasePitch(baseScaleChars , baseScalePitch , 10)
    }

    public increasePitch(baseScaleChars : string , baseScalePitch : number , upCount : number = 1){
        var baseScaleCharsIndex = 0;
        for( var i = 0 , arrayLength = this.scaleArray.length ; i < arrayLength ; i++){
            if(this.scaleArray[i] == baseScaleChars){
                baseScaleCharsIndex = i;
                break;
            }
        }
        
        baseScaleCharsIndex += upCount
        while(baseScaleCharsIndex > this.scaleArray.length){
            baseScaleCharsIndex -= this.scaleArray.length;
            baseScalePitch++
        }
        while(baseScaleCharsIndex < 0){
            baseScaleCharsIndex += this.scaleArray.length;
            baseScalePitch--
        }
        return this.setPitch(this.scaleArray[baseScaleCharsIndex] , baseScalePitch);
    }

    public setPitch(scaleChars : string , scalePitch : number){
        var pitch = this.getPitch(scaleChars , scalePitch);
        this.frequencyArray.push(pitch);
        this.pitchArray.push(scaleChars + scalePitch);
    }

    public getPitchString() : string{
        return this.pitchArray.join(",");
    }

    public getFrequencyString() : string{
        return this.frequencyArray.join(",");
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
        var diffFromA4 : number = 0;
        diffFromA4 += this.scale[scaleChars];
        diffFromA4 += (pitch - 4) * 12;
    
        var frequency : number = 440 * Math.pow(Math.pow(2.0, 1.0/12.0) , diffFromA4)
        return parseInt(frequency + "");
    }
}
