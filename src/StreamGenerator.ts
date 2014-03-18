interface StreamGeneratorOption{
    sampleRate : number ;
    channel : number ;
    streamLength : number ;
    volume : number;
};

class StreamGenerator{
    phase : number = 0;
    options:StreamGeneratorOption;
    constructor(options:StreamGeneratorOption){
        this.options = options;
    }
    
    public getWave(frequency : number) : number {
        var wave = this.options.volume * Math.sin(2 * Math.PI * this.phase * frequency / this.options.sampleRate);
        return wave;
    }

    public getStream(frequencyArray : number[]) {
        var stream = [];
        var arrayLength : number = frequencyArray.length 
        for (var i = 0 ; i < this.options.streamLength; i++) {
            stream[i]  = 0;
            for( var j = 0 ; j < arrayLength ; j++){
                var frequency = frequencyArray[j];
                stream[i] += this.getWave(frequency);
            }
            this.phase ++ ;
        }
        return stream;
    }
};
