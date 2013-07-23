define(function () {

    /*  Exchangers are capable of negotiating an asynchronous transfer described by
     *  a mutually agreed upon manifest. The primary use for this is for exchanging
     *  resources between nodes in the city system, especially when there are known
     *  delays (read: contrived timeouts) involved in handling and processing material. */

    var Exchange = Spine.Model.sub();
    Exchange.configure('Exchange', 'peer', 'role', 'manifest', 'parent');
    
    /*  The Exchange model represents the transaction between two peers from the
     *  perspective of one side. It defines that side's role, the peer on the other
     *  side, and a description of the exchange being considered. It also has a reference
     *  to its parent, the controller for a game object. */
     
    Exchange.include({ 
    
        open: function (peer) {
            
            /*  Respond to a new exchange request called on the parent controller by
             *  the initiator of the exchange. This provides the initiator with a reference 
             *  to an Exchange instance to use as its peer. */
             
            console.log('opening exchange as ' + this.role + ': ' + JSON.stringify(this.manifest));
            this.peer = peer;
            this.peer.negotiate(this.manifest);
        },
        
        close: function () {

            /*  Close and destroy the exchange. This must be performed by each party, since
             *  they have separate Exchange instances to describe the transaction. */

            console.log('exchange terminated');
            
            //  TODO Unbind listeners

            delete this;            
        },
        
        
        negotiate: function (manifest) {
            /*  Negotiation is the heart of the exchange logic. Or maybe the brain. This
             *  is where each side can set limits to what it can accept or provide in the
             *  transaction. Either side may set an opinion on the manifest to influence
             *  the other party's behavior. If either side sets an opinion of "never", the
             *  transaction is terminated immediately.
             *  Implement a negotiate() method on the parent controller to handle this. */
            var self = this;
            if ('accept' === manifest.opinion && 'target' === this.role) {
                this.peer.deliver(manifest, this.proxy(this.receive));
            } else if ('never' === manifest.opinion) {
                this.close();
            } else {
                manifest = this.parent.negotiate(manifest);
                console.log('negotiating exchange as ' + this.role + ': ' + JSON.stringify(manifest));
                this.peer.negotiate(manifest);
            }
        },
        
        deliver: function (manifest, callback) {
            //  Implement a deliver() method on the parent controller to handle this
            console.log('delivering manifest from parent');
            this.parent.deliver(manifest, callback);
            this.close();
        },
        
        receive: function (packet) {
            //  Implement a receive() method on the parent controller to handle this
            console.log('receiving manifest');
            this.parent.receive(packet);
            this.close();
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