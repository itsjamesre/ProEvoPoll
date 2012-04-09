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
        tagName: 'article',
        className: 'poll',

        events: {
            'click .permalink': 'navigate',
            'click .radio': 'render'
        },

        initialize: function(){
            console.log('PollView initialized');
            this.model.bind('change', this.render, this);
        },

        navigate: function(e){
            this.trigger('navigate', this.model);
            e.preventDefault();
        },

        renderRatings: function(){
            $(this.el).html(ich.rateStep(this.model.toJSON()));
            return this;
        },

        renderMultiple: function(){
            $(this.el).html(ich.multipleStep(this.model.toJSON()));
            return this;
        }

    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');
            this.views = [];
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(poll){
            var view = new PollView({
                model: poll
            });
            // $(this.el).prepend(view.renderRatings().el);
            $('#polls').prepend(view.renderRatings().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        }

    });

    window.ListApp = Backbone.View.extend({
        el: "#app",

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },

        render: function(){
            // $(this.el).html(ich.rateStep({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#polls')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
        }
    });

    
    window.Router = Backbone.Router.extend({
        routes: {
            '': 'list'
        },

        detail: function(){},

        list: function(){}
    });

    $(function(){
        window.app = window.app || {};
        app.router = new Router();
        app.polls = new Polls();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.polls
        });
        app.router.bind('route:list', function(){
            app.polls.maybeFetch({ success: _.bind(app.list.render, app.list) });
        });
        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();