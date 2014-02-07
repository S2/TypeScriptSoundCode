interface StreamGeneratorOption{
    sampleRate : number ;
    channel : number ;
    streamLength : number ;
    phaseStep : number ;
};

class StreamGenerator{
    phase : number = 0;
    options:StreamGeneratorOption;
    constructor(options:StreamGeneratorOption){
        this.options = options;
    }
    
    public getWave(frequency : number) : number {
        var wave = Math.sin(2 * Math.PI * this.phase);
        return wave;
    }

    public getStream(frequencyArray : number[]) {
        var stream = [];
        var arrayLength : number = frequencyArray.length 
        var phaseStep = frequency / this.options.sampleRate;
        for (var i = 0 ; i < this.options.streamLength; i++) {
            for( var i = 0 ; i < arrayLength ; i++){
                var frequency = frequencyArray[i];
                stream[i] += this.getWave(frequency);
            }
            this.phase += phaseStep;
        }
        return stream;
    }
};
