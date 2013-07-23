define(function () {

    /*  Exchangers are capable of negotiating an asynchronous transfer described by
     *  a mutually agreed upon manifest. The primary use for this is for exchanging
     *  resources between nodes in the city system, especially when there are known
     *  delays (read: contrived timeouts) involved in handling and processing material. */

    var Exchange = Spine.Model.sub();
    Exchange.configure('Exchange', 'peer', 'role', 'manifest', 'parent');
    Exchange.include({ 
        open: function (peer) {
            console.log('opening exchange as ' + this.role);
            this.peer = peer;
            this.peer.negotiate(this.manifest);
        },
            
        close: function () {
            this.source = undefined;
            this.target = undefined;
            this.manifest = undefined;
            
            //  TODO Unbind listeners
        },
            
        negotiate: function (manifest) {
            var self = this;
            if ('accept' === manifest.opinion && 'target' === this.role) {
                this.peer.deliver(manifest, this.proxy(this.receive));
            } else {
                manifest.opinion = 'accept';
                console.log('negotiating exchange as ' + this.role + ': ' + JSON.stringify(manifest));
                this.peer.negotiate(manifest);
            }
        },
        
        deliver: function (manifest, callback) {
            //  Implement a devlier() method on the parent controller to handle this
            console.log('delivering manifest from parent: ' + this.parent.deliver);
            if (this.parent.hasOwnProperty('deliver')) this.parent.deliver(manifest, callback);
            delete this;
        },
        
        receive: function (packet) {
            //  Implement a receive() method on the parent controller to handle this
            console.log('receiving manifest');
            if (this.parent.hasOwnProperty('receive')) this.parent.receive(packet);
        }
    });

    var Exchanger = Spine.Controller.sub({
        exchange: function (peer, role, manifest) {
            this.exchanger = new Exchange({
                peer: peer, 
                role: role,
                manifest: manifest,
                parent: this
            });
            peer.open(this.exchanger);
        },
        request: function (controller, manifest) {
            this.exchanger = new Exchange({
                peer: null, 
                role: 'target',
                manifest: manifest,
                parent: this
            });
            controller.exchange(this.exchanger, 'source', manifest);
        },
        offer: function (controller, manifest) {
            this.exchanger = new Exchange({
                peer: null, 
                role: 'source',
                manifest: manifest,
                parent: this
            });
            controller.exchange(this.exchanger, 'target', manifest);
        }
    });
    
    return Exchanger;
});