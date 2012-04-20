$(function() {

	var Poll = Backbone.Model.extend({

		defaults: function() {
			return {
				title: 'Poll Default',
				finished: false
			};
		},

		initialize: function() {
			if (this.get("title") == 'undefined') {
				this.set({"title": this.defaults.title});
			}
		},

		submit: function () {
			console.log('Save Me: '+this.get('title'));
		},

		clear: function() {
			this.destroy();
		}

	});

	var createPoll = function(num) {
		return new AppView();
	};

	var PollRating = Backbone.Model.extend({
		
		model: Poll,

		locaStorage: new Store("pe_poll_ratings"),

		initialize: function() {
			console.log('PollRating Model Initialized');
		},

		done: function() {
			return true;
		},

		choices: function() {
			return 'Rating Choices';
		}

	});

	var PollMultiple = Backbone.Model.extend({
		
		model: Poll,

		locaStorage: new Store("pe_poll_multiple"),

		initialize: function() {
			console.log('PollRating Model Initialized');
		},

		done: function() {
			return true;
		},

		choices: function() {
			return "Multiple Choices";
		}

	});

	var PollStorage = Backbone.Model.extend({

		initialize: function() {
			try {
				localStorage.setItem("name", "Hello World!"); //saves to the database, "key", "value"

			} catch (e) {
				if (e == QUOTA_EXCEEDED_ERR) {
					console.log('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
				}
			}
		}
	});

	var AppView = Backbone.View.extend({

		$el: $('#polls'),
		
		tagName: 'article',

		model: Poll,

		template: _.template($('#poll_template').html()),

		events: {
			'click .submit_ratings': 'submitRatings',
			'click .radio_rating': 'radioRating',
			'click .reset': 'clear'
		},

		initialize: function() {
			this.render();
		},

		submitRatings: function() {},

		radioRating: function() {},

		render: function() {
			console.log("Broken");
			return this.template;
		},

		clear: function() {
			this.destroy();
		}
	});

	myPoll = createPoll(1);
	myPoll.$el.append(myPoll.render);
});