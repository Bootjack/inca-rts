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

        //  Testing continuous asynchronisity (gets really annoying...)
        /*
        x = 0;
        Crafty.e('Delay').delay(function () {
            console.log(x += 1);
        }, 10, 100);
        */

        //  Intercepting console.log to #spine-out
        var log = console.log;
        console.log = function (message) {
            var line = $('<p>').html(message);
            $('#spine-out').append(line);
            log(message);
        }

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
            $('#spine-out').append(processorNode.render().el);
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
