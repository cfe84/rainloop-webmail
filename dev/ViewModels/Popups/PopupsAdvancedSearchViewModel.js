
(function () {

	'use strict';

	var
		_ = require('_'),
		ko = require('ko'),
		moment = require('moment'),

		Utils = require('Common/Utils'),

		Data = require('Storage:RainLoop:Data'),

		kn = require('App:Knoin'),
		KnoinAbstractViewModel = require('Knoin:AbstractViewModel')
	;

	/**
	 * @constructor
	 * @extends KnoinAbstractViewModel
	 */
	function PopupsAdvancedSearchViewModel()
	{
		KnoinAbstractViewModel.call(this, 'Popups', 'PopupsAdvancedSearch');

		this.fromFocus = ko.observable(false);

		this.from = ko.observable('');
		this.to = ko.observable('');
		this.subject = ko.observable('');
		this.text = ko.observable('');
		this.selectedDateValue = ko.observable(-1);

		this.hasAttachment = ko.observable(false);
		this.starred = ko.observable(false);
		this.unseen = ko.observable(false);

		this.searchCommand = Utils.createCommand(this, function () {

			var sSearch = this.buildSearchString();
			if ('' !== sSearch)
			{
				Data.mainMessageListSearch(sSearch);
			}

			this.cancelCommand();
		});

		kn.constructorEnd(this);
	}

	kn.extendAsViewModel(['View:Popup:AdvancedSearch', 'PopupsAdvancedSearchViewModel'], PopupsAdvancedSearchViewModel);
	_.extend(PopupsAdvancedSearchViewModel.prototype, KnoinAbstractViewModel.prototype);

	PopupsAdvancedSearchViewModel.prototype.buildSearchStringValue = function (sValue)
	{
		if (-1 < sValue.indexOf(' '))
		{
			sValue = '"' + sValue + '"';
		}

		return sValue;
	};

	PopupsAdvancedSearchViewModel.prototype.buildSearchString = function ()
	{
		var
			aResult = [],
			sFrom = Utils.trim(this.from()),
			sTo = Utils.trim(this.to()),
			sSubject = Utils.trim(this.subject()),
			sText = Utils.trim(this.text()),
			aIs = [],
			aHas = []
		;

		if (sFrom && '' !== sFrom)
		{
			aResult.push('from:' + this.buildSearchStringValue(sFrom));
		}

		if (sTo && '' !== sTo)
		{
			aResult.push('to:' + this.buildSearchStringValue(sTo));
		}

		if (sSubject && '' !== sSubject)
		{
			aResult.push('subject:' + this.buildSearchStringValue(sSubject));
		}

		if (this.hasAttachment())
		{
			aHas.push('attachment');
		}

		if (this.unseen())
		{
			aIs.push('unseen');
		}

		if (this.starred())
		{
			aIs.push('flagged');
		}

		if (0 < aHas.length)
		{
			aResult.push('has:' + aHas.join(','));
		}

		if (0 < aIs.length)
		{
			aResult.push('is:' + aIs.join(','));
		}

		if (-1 < this.selectedDateValue())
		{
			aResult.push('date:' + moment().subtract('days', this.selectedDateValue()).format('YYYY.MM.DD') + '/');
		}

		if (sText && '' !== sText)
		{
			aResult.push('text:' + this.buildSearchStringValue(sText));
		}

		return Utils.trim(aResult.join(' '));
	};

	PopupsAdvancedSearchViewModel.prototype.clearPopup = function ()
	{
		this.from('');
		this.to('');
		this.subject('');
		this.text('');

		this.selectedDateValue(-1);
		this.hasAttachment(false);
		this.starred(false);
		this.unseen(false);

		this.fromFocus(true);
	};

	PopupsAdvancedSearchViewModel.prototype.onShow = function ()
	{
		this.clearPopup();
	};

	PopupsAdvancedSearchViewModel.prototype.onFocus = function ()
	{
		this.fromFocus(true);
	};

	module.exports = PopupsAdvancedSearchViewModel;

}());