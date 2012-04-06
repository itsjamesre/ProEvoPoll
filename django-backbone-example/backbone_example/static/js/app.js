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
        },

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);

            if(model){
                options.success && options.success(model);
                return;
            }

            model = new Poll({
                resource_uri: id
            });

            model.fetch(options);
        }
        

    });

    window.PollView = Backbone.View.extend({
        tagName: 'li',
        className: 'poll',

        events: {
            'click .permalink': 'navigate'
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        navigate: function(e){
            this.trigger('navigate', this.model);
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.rateStep(this.model.toJSON()));
            return this;
        }
    });


    window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },
        
        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            console.log('DetailApp');
            console.log(this.model.toJSON());
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }
    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
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
            $(this.el).prepend(view.render().el);
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
            $(this.el).html(ich.rateStep({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#polls')
            });
            list.addAll();
            console.log(list.views.el.html());
            list.bind('all', this.rethrow, this);
        }
    });

    
    window.Router = Backbone.Router.extend({
        routes: {
            '': 'list',
            ':id/': 'detail'
        },

        navigate_to: function(model){
            var path = (model && model.get('id') + '/') || '';
            console.log("Path:" + path);
            this.navigate(path, true);
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
        app.detail = new DetailApp({
            el: $("#app")
        });
        app.router.bind('route:list', function(){
            app.polls.maybeFetch({ success: _.bind(app.list.render, app.list) });
        });
        app.router.bind('route:detail', function(id){
            app.polls.getOrFetch(app.polls.urlRoot + id + '/', {
                success: function(model){
                    app.detail.model = model;
                    console.log('Router Detail');
                    app.detail.render();
                }
            });
        });

        app.list.bind('navigate', app.router.navigate_to, app.router);
        app.detail.bind('home', app.router.navigate_to, app.router);
        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();