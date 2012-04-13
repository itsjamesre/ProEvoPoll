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
            this.renderResults();
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
            window.create = create;
            this.collection.create({
                poll: create[1],
                rating_choice_1:    create[2],
                rating_choice_2:    create[3],
                rating_choice_3:    create[4],
                rating_choice_4:    create[5],
                multiple_choice:    create[6],
                essay_answer:       create[7],
                user_name:          create[8],
                user_email:         create[9]
            });
            this.graphRating(this.model);
        },

        graphRating: function(poll) {
            //  rating question: level 0 1 2 3 4 5 ( 0 is the default so if there is only three rating questions the fourth is 0 by default)
            /*var data = [
                { label: "Series1",  data: 10},
                { label: "Series2",  data: 30},
                { label: "Series3",  data: 90},
                { label: "Series4",  data: 70},
                { label: "Series5",  data: 80},
                { label: "Series6",  data: 110}
            ];*/

            var question_1 = new Array(0,0,0,0,0,0);
            var question_2 = new Array(0,0,0,0,0,0);
            var question_3 = new Array(0,0,0,0,0,0);
            var question_4 = new Array(0,0,0,0,0,0);

            new Responses().fetch({
                success: function(collection, response) {
                    window.response = response;
                    $.each(response.objects, function(index, value){
                        if (poll.id == value.poll) {
                            console.log('Fetching...');
                            console.log(value.rating_choice_1);
                            question_1[value.rating_choice_1] = question_1[value.rating_choice_1]+1;
                            question_2[value.rating_choice_2] = question_2[value.rating_choice_2]+1;
                            question_3[value.rating_choice_3] = question_3[value.rating_choice_3]+1;
                            question_4[value.rating_choice_4] = question_4[value.rating_choice_4]+1;
                        }
                    });
                }, error: function(collection, response) {
                    console.log('Fetch Failed'); }
            });

            console.log('Fetch and Sorted: '+poll.title );
            average_1 = [ question_1[1]*(1) + question_1[2]*(2) + question_1[3]*(3) + question_1[4]*(4) + question_1[5]*(5) ] / (question_1[1] + question_1[2] + question_1[3] + question_1[4] + question_1[5]);
            
            console.log( question_1[1] );
            
            average_2 = [ question_2[1]*(1) + question_2[2]*(2) + question_2[3]*(3) + question_2[4]*(4) + question_2[5]*(5) ] / (question_2[1] + question_2[2] + question_2[3] + question_2[4] + question_2[5]);
            average_3 = [ question_3[1]*(1) + question_3[2]*(2) + question_3[3]*(3) + question_3[4]*(4) + question_3[5]*(5) ] / (question_3[1] + question_3[2] + question_3[3] + question_3[4] + question_3[5]);
            average_4 = [ question_4[1]*(1) + question_4[2]*(2) + question_4[3]*(3) + question_4[4]*(4) + question_4[5]*(5) ] / (question_4[1] + question_4[2] + question_4[3] + question_4[4] + question_4[5]);
            var mydata = [
                {label: 'Question One Average Rating', data: average_1},
                {label: 'Question Two Average Rating', data: average_2},
                {label: 'Question Three Average Rating', data: average_3},
                {label: 'Question Four Average Rating', data: average_4}
            ];
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
