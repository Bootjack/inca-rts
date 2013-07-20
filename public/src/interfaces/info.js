define(['src/entities/entity'], function (Entity) {
    var Info = Entity.sub({
        text: "There should be a box that falls. Wait for it...",

        init: function(){
    	      this.entity = Crafty.e("2D, DOM, Text").attr(
    	          {x: 50, y: 50, z: 1000, w: 400}
    	      ).text(this.text).textColor('#000').textFont(
    	          {'size' : '24px', 'family': 'Arial'}
    	      ).bind('Click', function(){})
        }
    });
    return Info;
});