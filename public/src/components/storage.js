Crafty.c('Storage', {
    init: function () {
        var self = this;
        this.requires('2D, DOM, Container');
        
        this.bind('update', function () {
            self.render();
        });
        
        this.contents = Crafty.e('2D, DOM');
    },

    storage: function (config) {
        var color, self;
        self = this;
        config = config || {};
        color = '#000000';
        if (this.Colors.hasOwnProperty(this.types[0])) color = this.Colors[(this.types[0])];
        this.addComponent('Collision');
        this.attr({
            w: this.size,
            h: this.size
        }).css({
            'background-color': color,
            'border': '2px solid black',
            'border-radius': '8px'
        });

        this.contents.attr({
            x: this._x + 2,
            y: this._y + 2,
            w: this._w - 4,
            h: 0
        }).css({
            'background-color': 'white',
            'border': '2px solid transparent',
            'border-radius': '8px'
        });
        
        this.attach(this.contents);
        
        this.render();
        return this;
    },
    
    render: function () {
        var fullness, emptiness;
        fullness = Math.min(1.0, this.quantity / this.capacity);
        emptiness = 1 - fullness;
        this.contents.attr({
            h: (this.size - 4) * emptiness
        });
        return this;
    }
});
