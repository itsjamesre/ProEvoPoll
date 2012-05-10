var poll_index = 8;
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
        'click .stageSave': 'savePoll',
        'click .submitContact': 'viewResults'
    },

    initialize: function() {
        // console.log('Poll created');
    },

    renderPoll: function() {
        $(this.el).html(ich.pollTemplate(this.model.toJSON()));
        this.renderEmail();
        $(this.el).find('fieldset').each(function() {
            if (!$(this).hasClass('none')) {
                $(this).attr('class','rate-choice');
            }
        });
        return this;
    },

    renderEmail: function() {
        // console.log("renderEmail");
        var c_name = $.cookie('full_name'),
            c_email = $.cookie('work_email'),
            c_opt = $.cookie('user_val');

        $(this.el).append(ich.emailStep({full_name: c_name, work_email: c_email, user_val: c_opt, id: this.model.attributes.id}));

        if (c_opt == 'true') { $(this.el).find('.user_opt_flag').attr('checked', 'checked'); }
        return this;
    },

    savePoll: function() {
        if (this.$('.essay_answer').val() === "") {essay_val = "No Response."; } else { essay_val = this.$('.essay_answer').val(); }
        var myColl = this.collection.add({
            poll: this.model,
            rating_choice_1: this.$('.rating_data_1').val(),
            rating_choice_2: this.$('.rating_data_2').val(),
            rating_choice_3: this.$('.rating_data_3').val(),
            rating_choice_4: this.$('.rating_data_4').val(),
            multiple_choice: this.$('.multi_choice').val(),
            essay_answer: essay_val
        });
        return false;
    },

    viewResults: function() {
        // console.log('saveRaffle');
        if (this.$('.full_name').val() === "")
            { full_name = "No Input."; } else
            { full_name = this.$('.full_name').val(); $.cookie('full_name', full_name); }
        if (this.$('.work_email').val() === "")
            { work_email = "No Input."; } else
            { work_email = this.$('.work_email').val(); $.cookie('work_email', work_email); }
        if (this.$('.user_opt').val() === "false")
            { user_val = false; } else
            { user_val = true; $.cookie('user_val', user_val); }
        this.collection.add({
            poll: this.model,
            user_name: full_name,
            user_email: work_email,
            user_opt: user_val
        });
        this.createResponse();
        return false;
    },

    createResponse: function() {
        // console.log('createResponse');
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
            if (c.attributes.user_opt) { create.push(c.attributes.user_opt); }
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
            user_email:         create[9],
            user_opt:           create[10]
        });
        poll_index = $(this.el).index(); // global variable solution
        this.model.fetch({
            success:function(collection, response) {

                $('.poll').eq(poll_index).html(ich.allResults(response));
                $('.poll').eq(poll_index).find('span').each(function() {
                    if (!$(this).hasClass('none') && !$(this).hasClass('random_essay')) {
                        $(this).attr('class','results-set');
                    }
                });
                // Plotting
                function myTickFormatter(v, tick) { console.log(myTickFormatter); return " "; }
                var data = [[0, response.multianswr1_num], [1, response.multianswr2_num], [2, response.multianswr3_num], [3, response.multianswr4_num]];
                if (response.multiple_answer_5 != 'none') {
                    data.push([4, response.multianswr5_num]);
                }
                var plotthis = $('.poll').eq(poll_index).find('.plotme');
                var plot = $.plot(plotthis, [
                    {
                        data: data,
                        bars: { show: true, barWidth: 0.5, fill: true },
                        yaxis: { min: 0, tickDecimals: 0 },
                        xaxis: { show: false, tickLength: 0, tickFormatter: myTickFormatter }
                    }
                ]);

                // Add label to Graph
                if (response.multiple_answer_5 != 'none') {
                    plotthis.append('<div class="labels long"><strong>A</strong><strong>B</strong><strong>C</strong><strong>D</strong><strong>E</strong></div>');
                } else {
                    plotthis.append('<div class="labels short"><strong>A</strong><strong>B</strong><strong>C</strong><strong>D</strong></div>');
                }
                // Ratings Graph
                $('.results-set .rate_bar_value').each(function() { $(this).width(((Math.abs($(this).parent().next().html())/5)*100)+'%'); });
            },
            error:function() {
                // console.log("FAILED");
            }
        });
    }
});

window.PollSetup = Backbone.View.extend({

    initialize: function() {
        // console.log('RateView');
        _.bindAll(this, 'addOne', 'addAll');

    },

    addAll: function(){
        this.collection.each(this.addOne);
        $(this.el).prepend(ich.splashTemplate());
    },

    addOne: function(poll) {
        var view = new PollView({
            model: poll,
            collection: new Responses()
        });
        this.el.prepend(view.renderPoll().el);
    }
});

window.PollApp = Backbone.View.extend({

    initialize: function() {
        // console.log("RateApp");
    },

    render: function() {
        var pollsetup = new PollSetup({
            collection: this.collection,
            el: $("#polls")
        });
        pollsetup.addAll();
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
    app.poll = new PollApp({
        el: $('#polls'),
        collection: app.polls
    });

    app.router.bind('route:index', function() {
        app.polls.maybeFetch({ success: _.bind(app.poll.render,app.poll) });
    });

    Backbone.history.start({
        pushState: true,
        silent: app.loaded
    });
});
