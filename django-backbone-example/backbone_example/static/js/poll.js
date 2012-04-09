(function(){
    window.Poll = Backbone.Model.extend({
        urlRoot: POLL_API
    });

    window.Polls = Backbone.Collection.extend({
        urlRoot: POLL_API,
        model: Poll,

        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this,
                successWrapper = function(success){
                    return function(){
                        self._fetched = true;
                        success && success.apply(this, arguments);
                    };
                };
            options.success = successWrapper(options.success);
            this.fetch(options);
        }
    });

    window.PollView = Backbone.View.extend({
        tagname: 'article',
        className: 'poll',

        events: {
            'click .submitRatings': 'saveRating',
            'click .submitMulti': 'saveMulti'
        },

        initialize: function() {
            console.log("PollView Initialized");
        },

        renderRatings: function() {
            $(this.el).html(ich.rateStep(this.model.toJSON()));
            return this;
        },

        renderMulti: function() {
            console.log("RenderMulti");
            $(this.el).html(ich.multiStep(this.model.toJSON()));
            return this;
        },

        saveRating: function() {
            console.log('Save Rating');
            return false;
        },

        saveMulti: function() {}

    });

    window.RateView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
            this.views = [];
        },

        addAll: function(){
            this.views =[];
            this.collection.each(this.addOne);
        },

        addOne: function(poll) {
            var view = new PollView({
                model: poll
            });
            this.el.prepend(view.renderRatings().el);
        }
    });

    window.MultiView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
            this.views = [];
        },

        addAll: function(){
            console.log('addAll Multi');
            this.views =[];
            this.collection.each(this.addOne);
        },

        addOne: function(poll) {
            var view = new PollView({
                model: poll
            });
            this.el.prepend(view.renderMulti().el);
        }
    });

    window.RateApp = Backbone.View.extend({
        render: function() {
            var rate = new RateView({
                collection: this.collection,
                el: $("#polls")
            });
            rate.addAll();
        }
    });

    window.MultiApp = Backbone.View.extend({
        render: function() {
            var multi = new MultiView({
                collection: this.collection,
                el: $("#polls")
            });
            multi.addAll();
        }
    });

    window.Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            '/multi': 'multiple'
        },

        multi: function(){},

        index: function(){}
    });

    $(function() {
        window.app = window.app || {};
        app.router = new Router();
        app.polls = new Polls();

        app.rate = new RateApp({
            el: $('#polls'),
            collection: app.polls
        });

        app.multi = new MultiApp({
            el: $('#polls'),
            collection: app.polls
        });

        app.router.bind('route:index', function() {
            app.polls.maybeFetch({ success: _.bind(app.rate.render,app.rate) });
        });

        app.router.bind('route:multi', function() {
            app.polls.maybeFetch({ success: _.bind(app.multi.render,app.multi) });
        });


        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();
