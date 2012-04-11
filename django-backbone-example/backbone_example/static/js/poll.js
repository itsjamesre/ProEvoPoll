(function(){
    window.Poll = Backbone.Model.extend({
        urlRoot: POLL_API
    });

    window.Polls = Backbone.Collection.extend({
        urlRoot: POLL_API,
        model: Poll,

        initialize: function() {
        },

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

    window.Response = Backbone.Model.extend({
        urlRoot: RESPONSE_API
    });

    window.Responses = Backbone.Collection.extend({
        urlRoot: RESPONSE_API,
        model: Response,

        initialize: function() {
        },

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
            'click .submitRatings': 'saveRating'
        },

        initialize: function() {
            console.log('Poll created');
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
            var save = new InputRate({
                collection: new Responses(),
                poll: this
            });
            save.createOnSubmit();
        }

    });

    window.RateView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
        },

        addAll: function(){
            this.collection.each(this.addOne);
        },

        addOne: function(poll) {
            var view = new PollView({
                model: poll
            });
            var response = new InputRate({
                collection: new Responses(),
                el: this.el
            });
            this.el.prepend(view.renderRatings().el);
        }
    });

    window.RateApp = Backbone.View.extend({

        initialize: function() {
            console.log("RateApp");
        },

        render: function() {
            var rate = new RateView({
                collection: this.collection,
                el: $("#polls")
            });
            rate.addAll();
        }
    });

    window.InputRate = Backbone.View.extend({

        initialize: function() {
            console.log("InputRate");
        },

        createOnSubmit: function() {
            this.createResponse();
        },

        createResponse: function(){
            console.log("createResponse");
            console.log(this.collection);
            this.collection.create({
                poll: this.poll,
                rating_choice_1: this.$('.rating_choice_1 .rating_data').val(),
                rating_choice_2: this.$('.rating_choice_2 .rating_data').val(),
                rating_choice_3: this.$('.rating_choice_3 .rating_data').val(),
                rating_choice_4: this.$('.rating_choice_4 .rating_data').val()
            });
            // when the creation proccess works i need to load the next slide
        }

    });

    window.MultiView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
        },

        addAll: function(){
            console.log('addAll Multi');
            this.collection.each(this.addOne);
        },

        addOne: function(poll) {
            var view = new PollView({
                model: poll
            });
            this.el.prepend(view.renderMulti().el);
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
        app.polls = new Polls(); // Collection
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
