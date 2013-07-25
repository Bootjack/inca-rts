define(function () {
    'use strict';
    
    /*  Exchangers are capable of negotiating an asynchronous transfer described by
     *  a mutually agreed upon manifest. The primary use for this is for exchanging
     *  resources between nodes in the city system, especially when there are known
     *  delays (read: contrived timeouts) involved in handling and processing material. */

    var Exchange, Exchanger;
    
    Exchange = Spine.Model.sub();
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

            console.log(this.role + ' has hung up');
            
            //  TODO Unbind listeners

            delete this.parent.exchanger;
        },
        
        
        negotiate: function (manifest) {
        
            /*  Negotiation is the heart of the exchange logic. Or maybe the brain. This
             *  is where each side can set limits to what it can accept or provide in the
             *  transaction. Either side may set an opinion on the manifest to influence
             *  the other party's behavior.
             *
             *  Two cases are handled before the negotiation is begun using the parent
             *  controller's negotiate() method: Mutual acceptance of the manifest and
             *  rejection by either party. */
             
            if ('accept' === manifest.opinion && 'target' === this.role) {
                //  If both parties accept, the transaction is carried out.             
                this.peer.deliver(manifest, this.proxy(this.receive));
            } else if ('never' === manifest.opinion) {
                //  If either party rejects, the transaction is terminated.             
                this.close();
            } else {
                //  Run some more complex negotiation logic based on what the parent thinks
                manifest = this.parent.negotiate(manifest, this.role);
                console.log('negotiating exchange as ' + this.role + ': ' + JSON.stringify(manifest));
                this.peer.negotiate(manifest);
            }
        },
        
        deliver: function (manifest, callback) {
        
            /*  The Exchange instance merely forwards this to the parent's implementation
             *  of a deliver() method, which will in turn run some game logic on its model.
             *  Note that deliver will also pass a callback, which is the target's receive()
             *  method proxied and forwarded from the target's final negotiate() call. */

            console.log('delivering manifest');
            this.parent.deliver(manifest, callback);
            this.close();
        },
        
        receive: function (packet) {

            /*  The Exchange instance merely forwards this to the parent's implementation
             *  of a receive() method, which will in turn run some game logic on its model. */

            console.log('receiving manifest');
            this.parent.receive(packet);
            this.close();
        }
    });


    /*  The Exchanger class is what this AMD module actually returns. It is intended to
     *  be added to an existing Spine.Controller to enable it to initiate and respond
     *  to new exchange() transactions. */

    Exchanger = Spine.Class.sub({
        request: function (controller, manifest) {

            /*  Initiates a new exchange with this controller taking the role of target.
             *  This is one of two "public" methods used in the game logic to start 
             *  a new transaction with another controller that includes Exchanger.*/

            this.exchanger = new Exchange({
                peer: null,
                role: 'target',
                manifest: manifest,
                parent: this
            });
            controller.exchange(this.exchanger, 'source', manifest);
        },
        offer: function (controller, manifest) {

            /*  Initiates a new exchange with this controller taking the role of source.
             *  This is one of two "public" methods used in the game logic to start 
             *  a new transaction with another controller that includes Exchanger.*/

            this.exchanger = new Exchange({
                peer: null,
                role: 'source',
                manifest: manifest,
                parent: this
            });
            controller.exchange(this.exchanger, 'target', manifest);
        },
        
        negotiate: function (manifest) {
            //  Override this function!
            manifest.opinion = 'accept';
            return manifest;
        },
        
        deliver: function () {
            //  Override this function!
            return {};
        },
        
        receive: function () {
            //  Override this function!
            return true;
        },
        
        exchange: function (peer, role, manifest) {

            /*  This method creates a new Exchange from this controller's side of the
             *  transaction. This method will not need to be called from within the game
             *  logic, it is only used by request() and offer(). */

            this.exchanger = new Exchange({
                peer: peer,
                role: role,
                manifest: manifest,
                parent: this
            });
            peer.open(this.exchanger);
        }
    });
    
    return Exchanger;
});