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
        rcid: '0',

        events: {
            'click .submitRatings': 'saveRating',
            'click .submitMulti': 'saveMulti',
            'click .submitRaffle': 'saveRaffle'
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

        renderResults: function() {
            console.log("RenderResults");
            $(this.el).html(ich.resultsStep(this.model.toJSON()));
            return this;
        },

        saveRating: function() {
            console.log('saveRating');
            var myColl = this.collection.add({
                poll: this.model,
                rating_choice_1: this.$('.rating_choice_1 .rating_data').val(),
                rating_choice_2: this.$('.rating_choice_2 .rating_data').val(),
                rating_choice_3: this.$('.rating_choice_3 .rating_data').val(),
                rating_choice_4: this.$('.rating_choice_4 .rating_data').val()
            });
            console.log(this.collection);
            this.renderMulti();
        },

        saveMulti: function() {
            console.log('saveMulti');
            this.collection.add({
                poll: this.model,
                multiple_choice: this.$('.multi_choice').val(),
                essay_answer: this.$('.essay_answer').val()
            });
            console.log(this.collection);
            this.renderResults();
        },

        saveRaffle: function() {
            console.log('saveRaffle');
            this.collection.add({
                poll: this.model,
                user_name: this.$('.full_name').val(),
                user_email: this.$('.work_email').val()
            });
            console.log(this.collection);
            // This is the final step where we need to create a response object and save it with the api.
            // A this.collection.create should do it but we need to pull all the steps of the collection together first
            // Then we can save it and start on the animation
        }

    });

    window.RateView = Backbone.View.extend({

        initialize: function() {
            console.log('RateView');
            _.bindAll(this, 'addOne', 'addAll');
        },

        addAll: function(){
            this.collection.each(this.addOne);
        },

        addOne: function(poll) {
            var view = new PollView({
                model: poll,
                collection: new Responses()
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

        app.router.bind('route:index', function() {
            app.polls.maybeFetch({ success: _.bind(app.rate.render,app.rate) });
        });

        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();
