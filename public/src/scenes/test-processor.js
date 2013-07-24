Crafty.scene('test-processor', function() {
    require([
        'src/models/processor',
        'src/controllers/processor-node',
        'src/controllers/processor-list'
    ], function (
        Processor,
        ProcessorNode,
        ProcessorList
    ) {
        var resourceList, processorList, water, random, random2, x;

        //  Testing continous asynchronisity (gets really annoying...)
        /*
        x = 0;
        Crafty.e('Delay').delay(function () {
            console.log(x += 1);
        }, 10, 100);
        */

        //  Testing scaffold for processors
        processorList = new ProcessorList({
            el: $('#processor-list')
        });
        processorList.render();
        
        Processor.bind('create', function (model) {
            var processorNode = new ProcessorNode({
                el: $('<p>'),
                model: model
            });
            $('#resource-map').append(processorNode.render().el);
            processorList.add(model);
        });
        for (i = 0; i < 4; i += 1) {
            random = Math.floor( Math.random * 8 + 3 ); // capacity
            random2 = Math.floor( 10 + Math.random() * random );
            
            Processor.create({capacity: random, rate: random2});
        }
        processorList.models[2].startProcessing();
    });
});
