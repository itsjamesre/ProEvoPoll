var poll_index = 8;
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
            'click .submitRaffle': 'saveRaffle',
            'click .viewResults': 'viewResults'
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

        renderEmail: function() {
            console.log("renderEmail");
            $(this.el).html(ich.emailStep(this.model.toJSON()));
            return this;
        },

        renderResults: function() {
            console.log('renderResults');
            $(this.el).html(ich.ratingResults(this.model.toJSON()));
            return this;
        },

        saveRating: function() {
            console.log('saveRating');
            var myColl = this.collection.add({
                poll: this.model,
                rating_choice_1: this.$('.rating_data_1').val(),
                rating_choice_2: this.$('.rating_data_2').val(),
                rating_choice_3: this.$('.rating_data_3').val(),
                rating_choice_4: this.$('.rating_data_4').val()
            });
            this.renderMulti();
        },

        saveMulti: function() {
            console.log('saveMulti');
            this.collection.add({
                poll: this.model,
                multiple_choice: this.$('.multi_choice').val(),
                essay_answer: this.$('.essay_answer').val()
            });
            this.renderEmail();
        },

        saveRaffle: function() {
            console.log('saveRaffle');
            this.collection.add({
                poll: this.model,
                user_name: this.$('.full_name').val(),
                user_email: this.$('.work_email').val()
            });
            this.createResponse();
        },

        viewResults: function() {
            console.log('viewResults');
            this.createResponse();
        },

        createResponse: function() {
            console.log('createResponse');
            var create = new Array({});
            create.push(this.model);
            this.collection.each(function(c) {
                if (c.attributes.rating_choice_1) { create.push(c.attributes.rating_choice_1); }
                if (c.attributes.rating_choice_2) { create.push(c.attributes.rating_choice_2); }
                if (c.attributes.rating_choice_3) { create.push(c.attributes.rating_choice_3); }
                if (c.attributes.rating_choice_4) { create.push(c.attributes.rating_choice_4); }
                else if (c.attributes.rating_choice_4 == 'none') { create.push('n/a'); }
                if (c.attributes.multiple_choice) { create.push(c.attributes.multiple_choice); }
                if (c.attributes.essay_answer) { create.push(c.attributes.essay_answer); }
                if (c.attributes.user_name) { create.push(c.attributes.user_name); }
                if (c.attributes.user_email) { create.push(c.attributes.user_email); }
            });
            this.collection.create({
                poll:               create[1],
                rating_choice_1:    create[2],
                rating_choice_2:    create[3],
                rating_choice_3:    create[4],
                rating_choice_4:    create[5],
                multiple_choice:    create[6],
                essay_answer:       create[7],
                user_name:          create[8],
                user_email:         create[9]
            });
            poll_index = $(this.el).index(); // global variable solution
            this.model.fetch({
                success:function(collection, response) {
                    console.log("success");
                    $('.poll').eq(poll_index).html(ich.ratingResults(collection.toJSON()));
                },
                error:function() {
                    console.log("FAILED");
                }
            });
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
