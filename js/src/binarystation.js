(function (js_params, jQuery, _, Backbone, currency) {

	if (!js_params) {
		return;
	}

	var getHistoryMain = true;
	var getHistoryToolMain = [];
	getHistoryToolMain.push(null);
	var getHistoryConsoleMain = [];
	getHistoryConsoleMain.push(null);
	var el = $("html");
	console_block = "console";
	var isIE = false;
	if (navigator != null && navigator.userAgent != null) {
		var ua = navigator.userAgent;
		if (ua.search(/MSIE/) > 0) {
			isIE = true;
		}
		ua = null;
	}

	if (isIE && currency == "₽") {
		currency = "P";
	}

	function getLanguageText(selector, elementId) {

		$.ajax({
			dataType: "json",
			url: language_url,
			success: function (response) {
				var json_str = JSON.stringify(response);
				var searchSelector = json_str.indexOf(selector);
				json_str = json_str.substr(searchSelector);
				searchSelector = json_str.indexOf('}');
				json_str = json_str.substr(0, searchSelector);
				json_str = json_str.substr(selector.length + 2);
				searchLang = json_str.indexOf(language);
				json_str = json_str.substr(searchLang + 5);
				searchLang = json_str.indexOf('"');
				json_str = json_str.substr(0, searchLang);

				document.getElementById(elementId).innerHTML = '';
				document.getElementById(elementId).innerHTML = json_str;
			}
		});

	}

	function getOnclickCondition(item, checkLang) {


		$binsta_console__header__data__item__one_click_trigger = item.el.find(".binsta_console__header__data__item__one_click_trigger");

		if (item.get("oneClickBuy") == true) {
			item.el.find(".console__one_click").addClass("active");

			item.el.addClass("one-click-buy");

			$al_console__header__data__item__one_click_trigger = item.el.find(".al_console__header__data__item__one_click_trigger");

			if ($al_console__header__data__item__one_click_trigger[0] != null) {
				$al_console__header__data__item__one_click_trigger.addClass('on');
			}
			if ($binsta_console__header__data__item__one_click_trigger[0] != null) {
				$binsta_console__header__data__item__one_click_trigger.addClass('on');
				$binsta_console__header__data__item__one_click_trigger.find('.data-title').removeClass('hint_one_click');
				$binsta_console__header__data__item__one_click_trigger.find('.data-title').addClass('hint_one_click_on');
				if (checkLang) {
					getLanguageText('hint_one_click_on"', 'title-one-click-trade');
				}
			}
		} else {
			$binsta_console__header__data__item__one_click_trigger.removeClass('on');
			$binsta_console__header__data__item__one_click_trigger.find('.data-title').addClass('hint_one_click');
			$binsta_console__header__data__item__one_click_trigger.find('.data-title').removeClass('hint_one_click_on');
			item.el.find(".binsta_console__header__data__item__one_click_trigger .data-title").addClass('hint_one_click');
			if (checkLang) {
				getLanguageText('hint_one_click"', 'title-one-click-trade');
			}
		}
	}

	var isLondonInSummerTime = false,
		error_count = 0;
	root_url = window.location.pathname.replace("/boxWidgetAuth", "").replace("/boxWidgetHtml", "").replace("/boxWidget", ""),
		global_console_last_buy_id = 0,
		bin_buy_success_txt_timeout = 1,
		global_requote_price = 0,
		global_plot = {},
		global_hide_blocked = false,
		lastSave = "",
		cache_tool_tf_display = {},
		cache_hook_early = {},
		get_tool_nontrading_intervals_cache = {},
		global_last_buy_blocked = false,
		global_get_opened_options = true,
		prepared = false,
		global_last_button_buy_autochartist_price = 0,
		global_button_pressed = false,
		global_last_button_buy_autochartist = null,
		settings_wss = {},
		quotes_cache = {},
		color_transparent = "rgba(255,255,255,0)",
		useDateHack = true,
		dateHackCorrection = 0,
		graphMaxDrawFreq = 1000,
		graphMaxFrequency = 100,
		hook_tool_arr = {0: [], 1: [], is_hidden: [], is_not_hidden: [], in_work: false},
		recieve_settings_from_ws = true,
		tools = [],
		lastOpenOptionQuery = "",
		tradeStatus = "opened",
		onlyForOpenedActions = ["end-time", "payouts", "buy-button", "course"],
		gc = {
			earlyCloseSubscription: {},
			earlyCloseHashes: [],
			earlyCloseLastHash: null,
			guestOptions: [],
			hookTimeframesStorage: {}
		},
		globalParameters = {
			thousandsSeparator: " ",
			decimalSeparator: ".",
			decimalCount: 2,
			guestDeposit: 1000
		},
		byDay = false,
//новый способ работы с подписками гостя
		guestWithHookOptions = true,
//подписываться hook_timeframes только на выбранный вид опциона
		hookTimeframesOnlySelectedOptionKind = true,
		lauched_ids = [],
		status_recieved = false,
		utcTime = 0,
		localData = {},
		reconnect = false,
		found_one_enabled = false,
		current_invest = 1,
		$al_console__header__data__item__one_click_trigger = 0,
		$binsta_console__header__data__item__one_click_trigger = 0;

	var min_invest, max_invest;

	if (currency == "₽" || currency == "P") {
		min_invest = 200;
		max_invest = 20000;
	} else {
		min_invest = 10;
		max_invest = 5000;
	}

	var prepared = false, wss_conn;

	if (isIE) {
		useDateHack = false;
	}

	if (typeof(js_params.p) == "undefined") {
		try {
			js_params = $.parseJSON(js_params)
		} catch (e) {
			log(e)
		}
		;
	}

	if (typeof(js_params.disable_reconnect) == "undefined" || js_params.disable_reconnect == null) {
		js_params.disable_reconnect = false;
	}

	var partner = parseInt(js_params.p);

	if (js_params.widgets_default == null) {
		js_params.widgets_default = [];
	}
	if (js_params.autoStart == null) {
		js_params.autoStart = true;
	}
	var user_data_default = {
		kind: "classic",
		accept_autochartist: 0,
		starredTools: [],
		widgets: js_params.widgets_default,
		autochartist_count: 5,
		show_one_click: 1,
		show_add_c: 1
	};


	if (js_params.thousandsSeparator != null) {
		globalParameters.thousandsSeparator = js_params.thousandsSeparator;
	}
	if (js_params.decimalSeparator != null) {
		globalParameters.decimalSeparator = js_params.decimalSeparator;
	}
	if (js_params.guestDeposit != null) {
		globalParameters.guestDeposit = js_params.guestDeposit;
	}


	var partner_params = {
		end_time_correction: 0,
		use_runner: false,
		requote_style: "custom_modal",
		use_clock: false,
		tool_types_template: "without_span",
		use_candle: false,
		default_draw_type: "graph",
		use_starred: false,
		consoleXAxisSize: 9,
		consoleYAxisSize: 10,
		directionsSetToInactivAfterBuy: true,
		blockGuest: false,
		showWidgets: false,
		autochartistBody: '.autochartist_widget .widget_body',
		reloadTime: 7000,
		maxOpenedOptions: 4,
		useCrosshair: true,
		offsetForGraphHoverValue: -11,
		offsetForGraphHoverValueTop: 0,
		offsetForGraphHoverValuePx: 0,
		offsetForGraphHoverValueTopPx: -8,
		updateDataset: true,
		minDrawFrequencyOpened: 400,
		use_markings_for_graph: false,
		drawGraphProcess: true,
		traderMoodHorisontal: true,
		useModalForEarlyClose: false,
		markPosition: "relative",
		markPositionOpened: "absolute",
		setClosePriceNewBlock: false,
		optionBehavior: "table",
		maxPages: 4,
		defaultHeader: "",
		openedMarksNew: true,
		classicConsoleAreaFill: false,
		formatDep: true,
		integerInvest: true,
		kindCleanDirection: true,
		oneClickToAll: true,
		fillOnlyChoosedDirection: true,
		clearDirAfterDoubleclick: true,
		clearDirAfterChangeTool: true,
		unsubscribeTools: true,
		fixedDirectionRange: null,
		stripEmptyQuoteIntervals: true,
		yMarksPosition: 'right',
		useNewHookTimeframes: true,
		maxConsolesSameType: 5,
		hidePreloaderOnGetHistory: false,
		arrayHooks: false,

		consolePartToolListContainer: ".b_instrument_block .b_list",
		consolePartTfContainer: ".b_duration_block .b_list",
		consolePartAllowedLineText: ".allowed_line_txt",
		consolePartEndLineText: ".end_line_txt",
		consolePartBinBuy: ".bin_buy",
		consolePartInvest: ".b_invest_select",
		consolePartChoosedTool: ".selected-instrument #selected-instrument-name",
		consolePartChoosedTF: ".b_duration_block .b_block_value",
		consolePartCourseVal1: "#instrument-options-price",
		consolePartCourseVal2: "#instrument-options-price",
		consolePartPayoutPercent: ".percent_win",
		consolePartPayoutPercentLose: ".b_refund",
		consolePartPayoutWinVal: ".payout .win",
		consolePartPayoutLoseVal: ".payout .refund",
		consolePartAllowedTimeVal: ".b_available_block .b_block_value",
		consolePartExpireTimeVal: ".b_expires_block .b_block_value",
		consolePartExpireDayVal: ".expire_day_val",
		consolePartTradeLineCallput: ".binary_traders_choice__middle_block_chart.callput_chart",
		consolePartTradeLinePut: ".binary_traders_choice__middle_block_chart.put_chart",
		consolePartTradeLineCall: ".binary_traders_choice__middle_block_chart.call_chart",
		consolePartTradeLineCallVal: ".binary_traders_choice__percent.call",
		consolePartTradeLinePutVal: ".binary_traders_choice__percent.put",
		consolePartTradeLineCallPutVal: ".binary_traders_choice__percent.callput",
		consolePartLeftPanel: ".bin_instruments_list .bin_instruments_list_table tbody",
		consolePartTimesizeElem: ".timesize",
		consolePartCallButton: ".buttons .call",
		consolePartPutButton: ".buttons .put",
		consolePartModalRequotePopup: ".bo_console__requote_popup",
		consolePartScheduleTimer: ".console__graph_schedule_timer",
		consoleLeftPanel: ".bin_instruments_list .bin_instruments_list_table tbody",
		needAcceptAuotochartist: true
	};

	var graph_style = {
		globalToolLineWidth: 1,
		// globalToolColor: "rgb((75, 103, 160)",
		globalToolColor: "rgb(7, 181, 185)",
		// globalToolColorTouch: "rgb(75, 103, 160)",
		globalToolColorTouch: "rgb(186, 223, 229)",
		// globalToolColorRange: "rgb(75, 103, 160)",
		globalToolColorRange: "rgb(20, 35, 51)",
		globalToolShadowSize: 0,
		globalToolPointShow: true,
		globalToolHorizontalLineWidth: .5,
		globalToolPointSize: 3,
		globalToolFillColor: "rgba(75, 103, 160, .2)",
		globalToolMinMaxlineColor: "rgba(70,100,120,0.3)",
		globalToolMinMaxHorizontalLineWidth: 1,
		globalGridColorText: "gray",
		globalOptionColorUp: "#73a81c",
		globalOptionColorDown: "#f36377",
		globalOptionColorUpTouch: "#73a81c",
		globalOptionColorDownTouch: "#f36377",
		globalOptionColorUpRange: "#73a81c",
		globalOptionColorDownRange: "#f36377",
		globalGridColorBorder: "#3b5998",
		globalGridColorBorderWidth: 0.00,
		globalOptionPointSize: 1,
		globalOptionPointShow: true,
		globalOptionHorizontalLineWidth: 1,
		globalOptionMinMaxHorizontalLineWidth: 0,
		globalOptionMinMaxlineColor: "rgb(255, 255, 255)",
		globalOptionFillOpacity: 1,
		globalHorisontalLineWidth: 1,
		touchLineUp: "rgb(123, 172, 53)",
		touchLineDown: "rgb(245, 125, 66)",
		graph_point_top_offset: 1
	};

	var custom_timesize_for_tool_type = {};
	var custom_timescale_for_tool_type = {};
	var custom_timescale_count_for_tool_type = {};

	var use_timeframes_for_timescale = true;
	var payout_switch = false;
	var cource_padding_top = -1;
	var cource_padding_left = 587;
	var change_buy_button_after_buy = true;
	var cource_opened_top = 0;
	var cource_opened_top2 = 0;
	var same_templates_advanced = false;
	var hook_tool_enable = true;
	var use_left_widget = false;
	var use_left_widget_fxcl = true;
	var use_new_left_widget = false;
	var el = $('#main-container');
	var console_block = ".console";
	var option_block = ".open_options_bar";
	var instrument_filter_content = ".b_instruments_filter_content";
	var instrument_filter_item = "b_instruments_filter_item";

	var obj_closed = ".closed_options_block_hider .options_table tbody";
	var obj_opened_options = ".options .options_table tbody";
	var obj_closed_options = "#binary_closed_line";
	var obj_journal_options = '.journal_options_bars_holder .dealsTable tbody';
	var check_min_rate = true;
	var fix_min_max_invest = false;

	var deposit_value_el = ".user-deposit-value";
	var credit_value_el = ".user-credit-value";
	var available_value_el = ".user-available-value";
	var options_count_value = ".opened-options-count-value";
	var running_profit_block = "";
	var set_min_invest = false;
	var percent_win_add_100 = true;

	var open_options_bar = ".open_options_bar";
	var trades_closed = $("#trades-closed");
	var real_margin_lines = true;

	var color_red = "rgba(244, 142, 43, 0.3)";
	var color_green = "rgba(137, 190, 74, 0.3)";

	var timeframes = {},
		tool_types = {},
		timeframeLockTimes = {},
		//client_allowed_timeframes=[1,2,3,4,5,7,10,11],
		timeframesDuration = {
			1: 60000,
			2: 300000,
			3: 900000,
			4: 1800000,
			5: 3600000,
			6: 7200000,
			7: 14400000,
			8: 28800000,
			9: 57600000,
			10: 86400000,
			11: 604800000,
			12: 2678400000
		},
		timeframe_before_end = {},
		tradeTimes = {},
		subscribed = [],
		subscribed_timeframes = [],
		subscribed_early = [],
		hook_timeframes_cache = {},
		hook_payout_rates_cache = {},
		timeframe_names = {},
		timeframe_ids = {},
		utsTime = parseInt(new Date().getTime() / 1000) * 1000,
		settings_recieved = false,
		user_settings_recieved = false,
		time_recieved = false,
		disclaimer = false,
		binary_page,
		default_lang_file;

	var PageView = Backbone.View.extend({
		trade_status: {allow: "true", change_at: 0},
		el: el,
		widget_blocks: {},
		time: $('#bin_system_time'),
		timezone: $('#bin_system_time_zone'),
		payouts: $('.current-payout-value'),
		timeframes: {
			"classic": "1",
			"range": "1",
			"touch": "1",
			"touch_advanced": "1",
			"range_advanced": "1",
			"range_classic": "1"
		},
		widgets_classic: $('#widgets-classic'),
		widgets_range: $('#widgets-range'),
		widgets_touch: $('#widgets-touch'),
		widgets_touch_advanced: $('#widgets-touch-advanced'),
		widgets_range_advanced: $('#widgets-range-advanced'),
		widgets_range_classic: $('#widgets-range-classic'),
		trades_closed: trades_closed,
		messages: $('#messages'),
		widgets: $("#widgets"),
		settingsChanged: false,
		pauseRender: false,
		trades_closed_header: $(".trades-closed-header"),
		trades_closed_before: $(".trades-closed-before"),
		trades_closed_time: $(".trades-closed-time"),
		utc_time: $("#utc-time"),
		time_freq: {
			"1": 1,
			"2": 60,
			"3": 60,
			"4": 60,
			"5": 60,
			"6": 300,
			"7": 300,
			"8": 300,
			"9": 300,
			"10": 900,
			"11": 3600,
			"12": 3600,
			"13": 1,
			"14": 1,
			"15": 1,

		},
		time_amount: {
			"1": 300,
			"2": 600,
			"3": 1800,
			"4": 3600,
			"5": 7400,
			"6": 400,
			"7": 600,
			"8": 900,
			"9": 1800,
			"10": 3600 * 1.5,
			"11": 24 * 7 * 2,
			"12": 24 * 7 * 4,
			"13": 60,
			"14": 60,
			"15": 60
		},
		time_count: {
			"1": 3600 * 2,
			"2": 3600 * 5,
			"3": 3600 * 15,
			"4": 3600 * 30,
			"5": 3600 * 60,
			"6": 3600 * 100,
			"7": 3600 * 120,
			"8": 3600 * 240,
			"9": 3600 * 480,
			"10": 3600 * 60,
			"11": 3600 * 1024,
			"12": 3600 * 3600,
			"13": 3600,
			"14": 3600,
			"15": 3600
		},
		time_sizes: {
			"1": "S1",
			"2": "M1",
			"3": "M1",
			"4": "M1",
			"5": "M1",
			"6": "M5",
			"7": "M5",
			"8": "M5",
			"9": "M5",
			"10": "M15",
			"11": "H4",
			"12": "H16",
			"13": "S1",
			"14": "S1",
			"15": "S1"
		},
		time_size: {
			"S1": 60,
			"M1": 3600,
			"M5": 3600 * 5,
			"M15": 3600 * 15,
			"M30": 3600 * 30,
			"H1": 3600 * 60,
			"H4": 3600 * 60 * 4,
			"H8": 3600 * 60 * 8,
			"H16": 3600 * 60 * 16,
			"D1": 3600 * 24 * 7,
			"W1": 3600 * 24 * 10,
			"MN": 3600 * 24 * 10
		},
		events: {
			'click .w_close': 'removeConsole',
			'click .w_dub': 'duplicateConsole',
			'click .change-tool': 'changeTool',
			'click .change-timeframe': 'changeTimeframe',
			'focusin .b_invest_input ': 'focusinInvest',
			'click .b_fast_choose_ball span,.b_fast_invest': 'setFixedInvest',
			'mouseleave .invest-menu': 'hideFixedInvestMenu',
			'click .bin_buy:not(.inactive)': 'buyOption',
			'click .open_options_bar_header_item.n1,.toggle_option': 'toggleOption',
			'click .bo_open_option__switcher': 'toggleOption',
			'click .open_options_block_summary_header_item.n1': 'toggleAllOptions',
			'click .bo_open_option__switcher.summary': 'toggleAllOptions',
			'click .bb_click': 'changeParam',
			'click .bb_click_all:not(.inactive)': 'changeParam',
			'mouseleave .bb_mouseleave': 'changeParam',
			'mouseleave .bb_mouseleave_all': 'changeParam',
			'keyup .bb_keyup': 'changeParam',
			'click .set-lang': 'setLang',
			//'click .set-kind': 'setKind',
			'click .bin_options_type': 'setKind',
			'click .open-options-tab .opened-tab': 'setOpenedTab',
			'click .opened-tab-set': 'setOpenedTab',
			'click .login-submit': 'submitLoginForm',
			'click .modal-button-cancel': 'modalClose',
			'click .modal-button-ok': 'modalClose',
			'click .modal-close': 'modalClose',
			'click .button_buy': 'requoteBuy',
			'click .backToMain': 'backToMain',
			'click .styleMenu': 'styleMenuToggle',
			'click .bin_instrument_type': 'updateToolType',
			'click .b_instruments_filter_item': 'updateToolType',
			'click .closed-pages': 'getJournal',
			'click .closed-pages_operations_history': 'getOperationsHistory',
			'click .b_instrument_block': 'menuToolsShow',
			'click .open_options_share_btn.share_result': 'toggleShare',
			'click #refill-deposit': 'refillDeposit',
			'click .bin_console_prechoose_bar__value': 'binSelectableClick',
			'click .bin_invest_block__button': 'showInvest',
			'click .bin_express_invest_item': 'hideInvest',
			'click #bin_logout': 'logout',
			'click .bin_call_put_button': 'choosedDirection',
			'click .deposit_funds': 'deposit_funds',
			'click .top_line': 'openAutochartistLine',
			'click .bottom_line_submit': 'buyOptionAutochartist',
			'click .button_buy_autochartist': 'buyOptionAutochartist',
			'input .b_invest_select': 'setFixedInvest1',
			//'input .timesize': 'setTimesize',
			//'click .chart_scale_list_item': 'setTimesize',
			'click .early_close': 'earlyClose',
			'click .sell_now_button': 'earlyClose',
			'click .sell_now_button_by_hash_modal': 'earlyCloseByHashModal',
			'click .sell_now_button_by_hash': 'earlyCloseByHash',
			'click .accept_autochartist': 'acceptAutochartist',
			'click .button_close_requote_modal_p4': 'closeRequoteModal',
			'click .closeReqoute': 'closeRequotePopup',
			'click .bo_console__btn': 'toggleCandle',
			'click .add-to-starred': 'addStarredTool',
			'click .remove-from-starred': 'removeStarredTool',
			'click .favorite': 'toggleStarredTool',
			'mouseenter .hide_on_mouseover': 'hideDisplay',
			'mouseenter .bo_console__graph_holder': 'hideDisplay',
			'mouseleave .bo_console__graph_holder': 'showDisplay',
			'click .console__one_click': 'toggleOneClick',
			//'click .chart_scale': 'openScaleMenu',
			//'mouseleave .console__graph_scale': 'closeScaleMenu',
			// 'click .chart_scale_list': 'closeScaleClick',
			'click .tab_nav .tab': 'tabNavClick',
			'click .widget_menu__item.close': 'widgetClose',
			'click .toggle_widget': 'toggleWidget',
			'click .widget_tabbed_block__tab': 'switchValuesMarketWatch',
			'click .trigger_click': 'triggerClick',
			'click .autochartist_item__header': 'toggleActiveAutochartistLine',
			'click .set-user-param': 'setUserParam',
			'click .toggle-user-param': 'toggleUserParam',
			'click .active-siblings': 'activeSiblings',
			'keyup #calc-first-investment': 'calcWidgetRun',
			'keyup #calc-deals-count': 'calcWidgetRun',
			'change #calc_select_tools': 'calcWidgetRun',
			'change #calc_select_option_kind': 'calcWidgetRun',
			'click #calc_timeframes *': 'calcWidgetRun',
			'mouseenter .on-hover-show-filter-tool': 'enableModeFilterSymbol',
			'mouseleave .on-hover-show-filter-tool': 'disableModeFilterSymbol',
			'keyup .filter-tool-value': 'filterSymbol',
			'click .filter-tool-clear': 'clearFilter',
			'mouseenter .bo_console': 'onConsoleHover',
			'mousemove .chart': 'showFlotValue',
			'mouseleave .b_graph_block': 'hideFlotValue',
			'mouseleave .chart': 'hideFlotValue',
			'mouseenter .console__button,.b_dir_button, .binary_actions__btn': 'showPayoutsThisDirection',
			'mouseleave .console__button,.b_dir_button, .binary_actions__btn': 'hidePayoutsThisDirection',
			'click #remove_all_widgets': 'removeAllWidgets',

			'click .invest-menu-toggle ': 'toggleInvestMenu',
			'click .toggle_open': 'toggleOpenForOption',
			// 'mouseup input[type="number"]': 'setFixedInvest1',
			// 'focusout .b_invest_select': 'setFixedInvest2',
			// 'change .b_invest_select': 'setCurrentInvest',
			'keyup .b_invest_select': function (e) {
				if (e.keyCode == 13) {
					$(e.target).parents('.sum').find('.dropdown').removeClass('show');
				}
			},
			//'keydown .b_invest_select': function (e) {
			//e.preventDefault();
			//return;
			//},
			'click .binsta__overlay': 'closeAllPopups',
			'click .binsta_console__header__data__item__one_click_trigger': 'toggleOneClickAdvanced',
			'click .disclaimer-content .button.cancel': 'toggleOneClickAdvanced',
			'click .disclaimer-content .button.ok': 'toggleOneClickAdvanced',
			'click .binsta_express_invest__button': 'hideBadFixedInvest',
			//'click .binsta_assets__item__value.with_dropdown':'openMenu',
			//'click .binsta_assets__item__value__dropdown__list_item':'closeMenu'
			'click .drop_t': 'openMenu',
			'keyup .drop_t': 'openMenu',
			'click #slide-tools-left': 'slideToolsLeft',
			'click #slide-tools-right': 'slideToolsRight',
			'click .b_duration_block a': 'showTimeframesList'
			//'click .prevent, .disabled, .active': 'closeСlosestMenu'

			//'mouseleave .binsta_assets__item__value.with_dropdown':'closeMenu'

			//'click .al_assets__item__value__dropdown':'closeMenuInvest',
			//'mouseenter .al_assets__item__value__dropdown':'openMenuInvest',
			//'mouseleave .al_assets__item__value__dropdown':'closeMenuInvest'


		},

		openMenuInvest: function (e) {
			var $target = $(e.target);
			if (!$target.hasClass("binsta_assets__item__value__dropdown")) {
				$target = $target.parents(".binsta_assets__item__value__dropdown");
			}
			$target.addClass("open");
			$target.parents(".binsta_invest__input_holder").addClass("expressed");
		},
		closeMenuInvest: function (e) {
			var $target = $(e.target);
			if ($target.hasClass("slimScrollBar"))
				return;

			if (!$target.hasClass("binsta_assets__item__value__dropdown")) {
				$target = $target.parents(".binsta_assets__item__value__dropdown");
			}
			$target.removeClass("open");
			$target.parents(".binsta_invest__input_holder").removeClass("expressed");
		},
		openMenu: function (e) {
			var doIt = true;
			if (e.type == "keyup") {
				if (e.keyCode != 13) {
					doIt = false;
				}
			}
			if (doIt) {
				var $target = $(e.target);
				$target = $target.parents(".drop_t");
				if (!$target.hasClass("invest-non-active")) {
					if ($target.hasClass("active")) {
						if (['slimScrollDiv', 'slimScrollBar'].indexOf(e.target.className) == -1) {
							$target.removeClass("active");
						}
					} else {
						$console = $target.parents(console_block);
						$console.find(".drop_t").removeClass("active");
						$dropDownList = $target.find('.dropdown_list');

						width = 0;

						var items_length = $dropDownList.find(".binsta_assets__item__value__dropdown__list_item").length;
						var items_height = 34;
						if (items_length > 7) {
							$dropDownList.height(245);
						} else {
							$dropDownList.height((items_length) * items_height);
						}

						$target.addClass("active");
					}
					e.stopPropagation();
				}
			}

		},
		closeMenu: function (e) {
			var $target = $(e.target);
			if ($target.hasClass("dropdown") || $target.parents().hasClass("dropdown")) {
				return;
			}

			$console = $target.parents(console_block);
			if ($console.length >= 1) {
				$console.find(".drop_t").removeClass("active");
			} else {
				$target.find(".drop_t").removeClass("active");
			}

		},
		hideBadFixedInvest: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);
			item.hideBadFixedInvest();
			item.updateBlockHeightLists();
		},
		closeAllPopups: function (e) {
			bw_close_all();
		},
		toggleOpenForOption: function (e) {
			var $target = $(e.target),
				$opened = $target.parents(option_block);

			$opened.toggleClass("open").toggleClass("mini");
			$opened.find(".option_body").toggleClass("hidden_tab");

			if ($opened.hasClass("open")) {
				$opened.removeClass("mini");
				$opened.find(".option_body").removeClass("hidden_tab");
			}
		},
		toggleOneClickAdvanced: function (e) {
			var $target = $(e.target);

			if ($target.hasClass('ok') || $target.hasClass('cancel')) {
				var id = $target.parents('.binsta__popup.modal-dialog').attr('data-console');

				if ($target.hasClass('ok')) {
					var item = this.consoles.get(id);
					disclaimer = true;

					$.getJSON("js/path.json", function (data) {
						$.ajax({
							url: data.url,
							type: data.method,
							data: {
								"hash_user": s_userhash,
								"disclaimer": true,
								"date": new Date().getTime()
							}
						});
					});
				} else {
					return;
				}

			} else {
				var $console = $target.parents(console_block),
					id = $console.attr("data-id"),
					item = this.consoles.get(id);

				if (!item.get("oneClickBuy") && !disclaimer) {
					bw_disclaimer(id);
					return;
				}

			}

			if (!$target.hasClass("binsta_console__header__data__item__one_click_trigger")) {
				$target = $target.parents(".binsta_console__header__data__item__one_click_trigger");
			}

			if (item != null) {

				item.set("oneClickBuy", !item.get("oneClickBuy"));

				if (!item.get("oneClickBuy")) {
					item.el.removeClass("one-click-buy");
					$target.removeClass('on');
					$target.find('.binsta_buy_btn').prop('disabled', !1);
				} else {
					item.el.addClass("one-click-buy");
					$target.addClass('on');
					item.changeParam("set-direction", null);

					item.setFixedDirection();

					$target.find('.binsta_buy_btn').prop('disabled', 1);
				}
				getOnclickCondition(item, true);
			}

			if (partner_params.oneClickToAll) {
				if (item.get("oneClickBuy")) {
					_(view.consoles.models).each(function (elem) {

						elem.set("oneClickBuy", true);
						elem.el.addClass("one-click-buy");
						elem.el.find(".binsta_console__header__data__item__one_click_trigger").addClass('on');

					});
				} else {
					console.log(2222);
					_(view.consoles.models).each(function (elem) {
						elem.set("oneClickBuy", false);
						elem.el.removeClass("one-click-buy");
						elem.el.find(".binsta_console__header__data__item__one_click_trigger").removeClass('on');
					});
				}
			}

			view.settingsChanged = true;
			this.saveUserData();
			this.saveConsoles();

		},
		hideFixedInvestMenu: function (e) {
			var $invests = $(".invest-menu");
			if ($invests.length > 0) {
				$invests.each(function (key, elem) {
					$(elem).hide();
				});
			}
		},
		toggleInvestMenu: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find(".invest-menu").toggle();
		},
		removeAllWidgets: function () {


			var widget;
			$(".bo_widget").each(function (key, elem) {
				widget = $(elem);
				widget.not('.stamp').not('.no_menu').stop(1, 1).animate({opacity: 0}, 300, function () {
					$(this).slideUp(300, function () {
						$(this).remove();
					});
				});
			});

			setTimeout(function () {
				view.updateWidgetSelectors();
				view.addSaveDataRequest();
			}, 1000);


		},
		showPayoutsThisDirection: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = view.consoles.get(id);

			if (item == null || item.el.hasClass("forbidden-timeframe")) {
				return;
			}

			if (item.get("oneClickBuy")) {
				var direction = $target.attr("data-value") ? $target.attr("data-value") : $target.parents(".actionBtn").attr("data-value");
				if ($console.find(".console__button.active")[0] == null && direction != null) {
					item.attributes.direction = direction;
				}
				item.changeParam("payouts");

				setTimeout(chart.drawConsole(item, true), 0);

			}
		},
		hidePayoutsThisDirection: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (item.get("oneClickBuy")) {
				if ($console.find(".console__button.active")[0] == null) {
					item.attributes.direction = null;
				}
				;

				setTimeout(chart.drawConsole(item, true), 0);
				item.changeParam("payouts");
			}
		},
		hideFlotValue: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find(".hover_date").hide();
			$console.find(".hover_value").hide();
			$console.find(".hover_crosshair_hor").hide();
			$console.find(".hover_crosshair_ver").hide();
			$console.find(".hover_crosshair_center").hide();
		},

		showFlotValue: function (e) {

			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);
			var offset = $console.find(".chart").offset();
			if (offset == null) {
				return
			}

			var x = e.clientX - offset.left - partner_params.offsetForGraphHoverValuePx;
			var y = e.clientY - offset.top + $(window).scrollTop() + partner_params.offsetForGraphHoverValueTopPx;

			if (x > 600 || x < 10 || y > 175 || y < 5) {
				$console.find(".hover_date").hide();
				$console.find(".hover_value").hide();
				$console.find(".hover_crosshair_hor").hide();
				$console.find(".hover_crosshair_ver").hide();
				$console.find(".hover_crosshair_center").hide();
				return;
			}

			var position = 0;
			if (item.get("plotData") != null) {
				position = item.get("plotData").xaxis.c2p(x - partner_params.offsetForGraphHoverValuePx + partner_params.offsetForGraphHoverValue);
			} else {
				return;
			}

			var value = item.get("plotData").yaxis.c2p(y + partner_params.offsetForGraphHoverValueTop);

			$console.find(".hover_crosshair_hor").css({top: y + 8}).show();
			$console.find(".hover_crosshair_ver").css({left: x + 8}).show();
			$console.find(".hover_crosshair_center").css({top: y + 8 - 10, left: x + 9 - 10}).show();
			var data = item.get("plotData").data;
			var use_graph_value = false;
			if (use_graph_value) {
				for (var i in data) {
					if (position <= data[i][0]) {
						$console.find(".hover_value").text((data[i][1] - dateHackCorrection).toFixed(item.get("tool").decimal_count)).show().css({top: y - 10});
						data = null;
						position = null;
						$target = null;
						$console = null;
						id = null;
						item = null;
						return;
					}
				}
			} else {
				$console.find(".hover_value").text((value).toFixed(item.get("tool").decimal_count)).show().css({top: y});
				$console.find(".hover_date").text(common.UTS2TimeMin(position - dateHackCorrection)).show().css({left: x - 8});
			}

		},
		onConsoleHover: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			if ($target.hasClass("bo_console")) {
				$console = $target;
			}
			var id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (view.consoles.where({kind: item.get("kind")}).length == 1) {
				$console.removeClass("not-single");
			} else {
				$console.addClass("not-single");
			}
		},
		clearFilter: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);
			$console.find(".filter-tool-value").val("");
			$console.find(".filter-tool-clear").css({display: "none"});
			item.tools.find(".console__dropdown_list_item").each(function (key, elem) {
				$el1 = $(elem);
				$el1.show();
			});

		},
		filterSymbol: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id),
				$el1,
				val = $target.val().trim(),
				r = new RegExp($target.val().trim(), "i");

			if (val == "") {
				$console.find(".filter-tool-clear").css({display: "none"});
			} else {
				$console.find(".filter-tool-clear").css({display: "block"});
			}


			item.tools.find(".console__dropdown_list_item").each(function (key, elem) {
				$el1 = $(elem);
				if ($el1.text().search(r) == -1 && val != "") {
					$el1.hide();
				} else {
					$el1.show();
				}
			});
		},
		enableModeFilterSymbol: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);

			$console.find(".filter-tool-value").focus();
		},
		disableModeFilterSymbol: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find(".filter-tool-value").blur();
		},

		calcWidgetRun: function () {

			var sum = parseFloat($("#calc-first-investment").val().replace(",", ".").replace("$", "")) || 0;
			var count = parseInt($("#calc-deals-count").val()) || 0;
			var percent = 1.70;

			var tool_id = $("#calc_select_tools option:selected").attr("data-id") || 1;
			var option_kind = $("#calc_select_option_kind option:selected").attr("data-id") || 1;
			var timeframe_id = $("#calc_timeframes .calc_timeframe.active").attr("data-id") || 1;


			if (hook_payout_rates_cache[option_kind + "-" + tool_id + "-" + timeframe_id] != null) {
				percent = parseFloat(hook_payout_rates_cache[option_kind + "-" + tool_id + "-" + timeframe_id].percent) / 100 + 1;
			}

			animateNumberFromXtoY({elem: $("#calc_result"), finish: calcWidgetGetResult(sum, count, percent)});

		},
		activeSiblings: function (e) {
			var $target = $(e.target);
			if (!$target.hasClass("active-siblings")) {
				$target = $target.parents(".active-siblings");
			}
			$target.siblings(".active-siblings").each(function (key, elem) {
				$(elem).removeClass("active");
			});
			$target.addClass("active");
		},
		toggleUserParam: function (e) {
			e.preventDefault();

			var $target = $(e.target);
			if (!$target.hasClass("toggle-user-param")) {
				$target = $target.parents(".toggle-user-param");
			}

			try {
				if ($target.hasClass("active")) {
					$target.removeClass("active").parent().removeClass("checked");
				} else {
					$target.addClass("active").parent().addClass("checked");
				}

				settings.setParam($target.attr("data-param"), $target.hasClass("active") ? "1" : "0");
			} catch (e) {

			}
		},
		setUserParam: function (e) {
			e.preventDefault();
			var $target = $(e.target);
			if (!$target.hasClass("set-user-param")) {
				$target = $target.parents(".set-user-param");

			}
			try {
				settings.setParam($target.attr("data-param"), $($target.attr("data-elem-selecter")).val());
			} catch (e) {

			}
		},
		toggleActiveAutochartistLine: function (e) {
			$(e.target).parents(".line").toggleClass("active");
		},
		triggerClick: function (e) {
			var $target = $(e.target), attr = $target.attr("data-click");
			if (attr != null) {
				$(attr).trigger("click");
			}
		},
		switchValuesMarketWatch: function (e) {
			var $target = $(e.target);
			var class1 = "";
			switch ($target.attr("data-id")) {
				case "1":
					class1 = "min";
					break;
				case "2":
					class1 = "min15";
					break;
				case "3":
					class1 = "hour";
					break;
				case "4":
					class1 = "daily";
					break;
				case "5":
					class1 = "weekly";
					break;
			}

			$("#market_rates_widget__table .market_rates_widget_row").each(function (key, elem) {
				$(elem).find(".market_rates_min").text($(elem).find("." + class1 + "_low").text());
				$(elem).find(".market_rates_max").text($(elem).find("." + class1 + "_high").text());
			});
		},
		tabNavClick: function (e) {
			var $target = $(e.target);

			if ($target.hasClass('active')) {
				return false;
			} else {
				$target.addClass('active').siblings('.tab').removeClass('active');
			}
		},
		openScaleMenu: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find('.chart_scale_list').stop(1, 1).slideDown(200);
		},
		closeScaleMenu: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find('.chart_scale_list').stop(1, 1).slideUp(200);
		},
		closeScaleClick: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block);
			$console.find('.chart_scale_list_item.active').removeClass("active");
			$target.addClass("active");
			$console.find('.chart_scale_list').stop(1, 1).slideUp(200);
			e.stopPropagation();
		},
		toggleOneClick: function (e) {
			console.log("toggleOneClick");
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (item != null) {
				item.set("oneClickBuy", !item.get("oneClickBuy"));
				if (item.get("oneClickBuy")) {
					item.changeParam("set-direction", null); //Очищаем direction!!!
					item.el.addClass("one-click-buy");
				} else {
					item.el.removeClass("one-click-buy");
				}
			}


			view.settingsChanged = true;
			this.saveUserData();
			this.saveConsoles();
		},
		hideDisplay: function (e) {
			$(".hide_on_mouseover").each(function (k, elem) {
				$(elem).addClass("hovered");
			});
		},
		showDisplay: function (e) {
			$(".hide_on_mouseover").each(function (k, elem) {
				$(elem).removeClass("hovered");
			});
		},

		toggleStarredTool: function (e) {
			var $target = $(e.target);
			if (!$target.hasClass(".change-tool")) {
				$target = $target.parents(".change-tool");
			}

			var tool_id = parseInt($target.data('value'));

			if (view.starredTools.where({tool_id: tool_id})[0] == null) {
				view.starredTools.add({tool_id: tool_id});
				$(this).parents('.favorite').addClass("active");
			} else {
				view.starredTools.remove(view.starredTools.where({tool_id: tool_id}));
				$(this).parents('.favorite').removeClass("active");
			}
			view.settingsChanged = true;
			this.saveUserData();
			this.saveConsoles();
		},
		addStarredTool: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id),
				tool_id = parseInt(item.get("tool").tool_id);

			if (view.starredTools.where({tool_id: tool_id})[0] == null) {
				view.starredTools.add({tool_id: tool_id});
				view.settingsChanged = true;
				this.saveUserData();
				this.saveConsoles();
			}

		},
		removeStarredTool: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id),
				tool_id = parseInt(item.get("tool").tool_id);
			if (view.starredTools.where({tool_id: tool_id})[0] != null) {
				view.starredTools.remove(view.starredTools.where({tool_id: tool_id}));
				this.saveConsoles();
				view.settingsChanged = true;
				this.saveUserData();
			}
		},
		slideToolsLeft: function (e) {
			var $last = $('.b_instruments_filter_content div:last');
			$last.remove().css({ 'margin-left': '-400px' }).removeClass('active');
			$('.b_instruments_filter_content div:first').before($last);
			$last.animate({ 'margin-left': '0px' }, 1000).addClass('active');
			this.updateToolType(e);
		},
		slideToolsRight: function (e) {
			var $last = $('.b_instruments_filter_content div:last');
			$last.remove().css({ 'margin-left': '-400px' }).removeClass('active');
			$('.b_instruments_filter_content div:first').before($last);
			$last.animate({ 'margin-left': '0px' }, 1000).addClass('active');
			this.updateToolType(e);
		},
		showTimeframesList: function(e){
			$('.b_duration_block .b_list').toggle();
		},
		toggleCandle: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			$target.parent().find('.bo_console__btn_item').toggleClass('active');

			if (item.get("candle") == true) {
				item.set("candle", false);
				item.hideAllAreas();
				item.hideAllTexts();
			} else {
				item.set("candle", true);
				item.showAllAreas();
				item.showAllTexts();
			}
			setTimeout(chart.drawConsole(item), 0);
		},
		hideAllTopElem: function () {
			$(".tools .bin_console_prechoose_bar__value").hide();
			$(".tf .bin_console_prechoose_bar__value").hide();
			$(".expire_time_val").hide();
			$(".expire_day_val").hide();
		},
		acceptAutochartist: function () {
			view.user.accept_autochartist = "1";
			view.user.user_data.accept_autochartist = "1";
			view.saveConsoles();
			$target = $(".line[data-id='" + global_last_button_buy_autochartist + "']");
			if ($target[0] != null) {
				$target.find(".bottom_line_submit").click();
			}


			view.addSaveDataRequest();
		},

		addSaveDataRequest: function () {
			//(["addSaveDataRequest"]);
			view.settingsChanged = true;

			setTimeout(function () {
				view.saveUserData();
			}, 5000);
		},

		saveUserData: function () {
			if (view.settingsChanged == true) {
				var settings = view.user.user_data || user_data_default;
				settings.widgets = view.getWidgets();
				settings.consoles = [];
				_(view.consoles.models).each(function (elem) {
					settings.consoles.push({
						id: elem.get("id"),
						tool_id: elem.get("tool").tool_id,
						kind: elem.get("kind"),
						invest: elem.get("invest"),
						timeframe: elem.get("timeframe"),
						oneClickBuy: elem.get("oneClickBuy")
					});
				});
				settings.disclaimer = disclaimer;
				settings.starredTools = _.pluck(view.starredTools.toJSON(), "tool_id");
				//сохранять только если отличается от предыдущего состояния
				var newSave = '{"command":"set_user_settings","user_settings":"' + Js(settings).replaceAll('"', '|') + '"}';

				if (lastSave != newSave) {
					if (!user.isGuest()) {
						wss_conn.send(newSave);

					}
					lastSave = newSave;
				}

				newSave = null;
				view.settingsChanged = false;


				if (!isLocalstorageAvailable()) {
					if (localData.user_data != null && localData.user_data.starredTools != null) {
						localData.user_data.starredTools = localData.user_data.starredTools.split(",");
					}
				} else {
					if (localStorage.user_data != null && localStorage.user_data.starredTools != null) {
						localStorage.user_data.starredTools = localStorage.user_data.starredTools.split(",");
					}
				}

			}
		},

		loadUserData: function () {
			wss_conn.send('{"command":"get_user_settings"}');
		},

		setTradeMessage: function (header, before) {

			$("#bin_options_types_block_lefter").addClass("hidden_tab");
			$("#bin_instruments_types_block").addClass("hidden_tab");


			//$(".console-tab").each(function () {
			//    if (!$(this).hasClass("hidden_tab"))
			//        $(this).slideUp(10, function () {
			//            $(this).addClass("hidden_tab").slideDown(0);
			//        });
			//});
			$(".console-tab").each(function () {
				if (!$(this).hasClass("hidden_tab"))
					$(this).addClass("hidden_tab");
			});

			if (view.trades_closed.hasClass("hidden_tab")) {
				view.trades_closed.removeClass("hidden_tab")
			}

			view.trades_closed_header.html(header);
			view.trades_closed_before.text(before).show();
			view.trades_closed_time.show();

			$("#bin_no_trade_dsc").show();
			$("#bin_trade_message").hide();
		},
		setTradeMessage2: function (html) {

			$("#bin_options_types_block_lefter").addClass("hidden_tab");
			$("#bin_instruments_types_block").addClass("hidden_tab");

			if (tradeStatus == "opened") {

				//$(".console-tab").each(function () {
				//    if (!$(this).hasClass("hidden_tab"))
				//        $(this).slideUp(10, function () {
				//            $(this).addClass("hidden_tab").slideDown(0);
				//        });
				//});
				$(".console-tab").each(function () {
					if (!$(this).hasClass("hidden_tab"))
						$(this).addClass("hidden_tab");
				});

				if (view.trades_closed.hasClass("hidden_tab")) {
					view.trades_closed.removeClass("hidden_tab")
				}

				$("#bin_trade_message").show().find(".text").html(html);
				$("#bin_no_trade_dsc").hide();
				try {
					$("#bin_trade_header").hide()
				} catch (e) {
				}

				$(".trades-closed-header").html(html);
				$(".trades-closed-before").hide();
				$(".trades-closed-time").hide();

			}


		},
		setTradeMessage3: function (html) {

			//$("#bin_options_types_block_lefter").addClass("hidden_tab");
			//$("#bin_instruments_types_block").addClass("hidden_tab");

			if (tradeStatus == "opened") {


				if (trades_closed.hasClass("hidden_tab")) {
					trades_closed.removeClass("hidden_tab")
				}

				try {
					$("#bin_trade_message").show().find(".text").html(html)
				} catch (e) {
				}

				try {
					$("#bin_no_trade_dsc").hide()
				} catch (e) {
				}


			}

		},
		hideTradeMessage: function () {

			$("#bin_options_types_block_lefter").removeClass("hidden_tab");
			$("#bin_instruments_types_block").removeClass("hidden_tab");

			var all_closed = true;
			$(".console-tab").each(function () {
				if (!$(this).hasClass("hidden_tab")) {
					all_closed = false;
				}
			});

			if (!trades_closed.hasClass("hidden_tab")) {

				trades_closed.addClass("hidden_tab");
			}

			if (all_closed) {
				$(".console-tab").eq(0).removeClass("hidden_tab");
			}

			subscribed_timeframes = [];
			resubscribeWSS();
		},
		updateCurrency: function () {
			$(".currency").each(function () {
				$('<style>.currency:before{content:"' + currency + '"}</style>').appendTo('head');


			});

		},
		closeRequoteModal: function (e) {

			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (item != null) {
				item.closeRequoteModal();
			}

		},

		closeRequotePopup: function (e) {

			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (item != null) {
				item.closeRequotePopup();
			}

		},

		earlyClose: function (e) {

			var $target = $(e.target),
				$opened = $target.parents(option_block),
				id = $opened.attr("data-id"),
				data = $target.attr("data-value"),
				item = this.opened_options.get(id);

			if (!partner_params.useModalForEarlyClose) {
				if (item != null && !$target.hasClass("inactive")) {
					item.earlyClose();
				}
			}

		},
		earlyCloseByHash: function () {
			if (gc.earlyCloseLastHash != null) {

				_(view.opened_options.models).each(function (elem) {
					if (elem.get("hash") == gc.earlyCloseLastHash) {
						elem.earlyClose();
					}
				});

			}
			gc.earlyCloseLastHash = null;
		},
		earlyCloseByHashModal: function (e) {
			var $target = $(e.target),
				$opened = $target.parents(option_block),
				id = $opened.attr("data-id"),
				data = $target.attr("data-value"),
				item = this.opened_options.get(id);
			if (item.get("end_time") * 1000 - utcTime - item.get("early").early_interval * 1000 <= 0 || item.get("early").early_allow == "") return;
			if (item.el.find(".sell_now_button_by_hash_modal.inactive")[0] != null) return;

			if (item != null && item.get("closed") != true) {
				gc.earlyCloseLastHash = item.get("hash");

				var params = {
					hash: gc.earlyCloseLastHash,
					currency: currency
				};
				bw_close_all();
				bw_alert(Mustache.render($("#modal-early-close-text").html(), params), "OK", "sell_now_button_by_hash", null, null, view.messages.find(".label_early_header").text());
			}
		},
		setFixedInvest1: function (e) {
			console.log('setFixedInvest1');
			//var freeMoney = parseFloat(view.user.getDeposit()) + parseFloat($(".user-credit-value")[0].innerHTML.replace(" ",""));
			var freeMoney = parseFloat(view.user.getDeposit());
			var $target = $(e.target),
				target_tool_type = $target.attr("data-type"),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if (freeMoney < parseFloat($target[0].value)) {
				$target[0].value = freeMoney;
				$console.find(".drop_t").removeClass("active");
				bw_close_all();
				$console.find(".invest").addClass("invest-non-active");
				bw_alert(view.messages.find(".error-insufficient_funds").text());
			}
			item.changeParam("set-invest");
		},
		setFixedInvest2: function (e) {
			console.log('setFixedInvest2');
			var $target = $(e.target);
			var target_val = parseInt($target.val()),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);
			item.changeParam("set-invest");
			$target.val(isNaN(target_val) ? '' : target_val);
		},
		setCurrentInvest: function (e) {
			console.log('setCurrentInvest');
			current_invest = parseInt($(e.target).val());
		},
		setTimescale: function (e) {
			var $target = $(e.target),
				target_tool_type = $target.attr("data-type"),
				$console = $("#widgets-" + view.kind + " .bin_console"),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);
		},
		getCurrentConsole: function (e) {
			return view.consoles.where({kind: view.kind})[0];
		},
		getCurrentConsoleAll: function (e) {
			return view.consoles.where({kind: view.kind});
		},
		buyOptionAutochartist: function (e) {
			if (global_last_button_buy_autochartist != null) {
				var $target = $(".line[data-id='" + global_last_button_buy_autochartist + "']");
			} else {
				var $target = $(e.target).parents(".line");
			}

			var bin_buy_default_txt = $('#messages .bin_buy_default_txt').text();
			var bin_buy_success_txt = $('#messages .bin_buy_hidden_msg').text();

			$target.find(".bottom_line_submit span").fadeOut(200, function () {
				$(this).text(bin_buy_success_txt).css({"font-size": 10}).fadeIn(100);
			});

			setTimeout(function () {
				$target.find(".bottom_line_submit span").fadeOut(200, function () {
					$(this).text(bin_buy_default_txt).css({"font-size": 18}).fadeIn(100);
				});
			}, 1200);

			var id = $target.attr("data-id"),
				sum = parseFloat($target.find(".bottom_line_sum").val()),
				tool_id = $target.attr("data-tool_id"),
				dir = $target.attr("data-direction"),
				tf = $target.attr("data-timeframe"),
				course = global_last_button_buy_autochartist_price || quotes_cache[$target.attr("data-tool")] || 0;


			if (view.user.accept_autochartist == "0" && partner_params.needAcceptAuotochartist) {
				global_last_button_buy_autochartist = id;

				bw_alert(view.messages.find(".accept_autochartist_message").html(), view.messages.find(".accept").text(), "accept_autochartist");
				return;
			}

			var min_i = min_invest;
			var max_i = max_invest;


			if (sum < min_i || sum > max_i) {
				bw_alert(view.messages.find(".error-min_sum").text()
					.replace("{min}", currency + intellectRound(min_i))
					.replace("{max}", currency + intellectRound(max_i))
				);

				_(view.consoles.models).each(function (elem) {
					elem.changeParam("set-direction", null);
					elem.setFixedDirection();
				});

				return;
			}

			var open_query = '{"command":"open_option","sum":"{sum}","tool_id":"{tool_id}","direction":"{direction}","price_open":"{price_open}","plugin":"{plugin}","timeframe_id":"{timeframe_id}","option_kind":"{option_kind}"}'
				.replace("{sum}", sum)
				.replace("{tool_id}", tool_id)
				.replace("{direction}", dir)
				.replace("{price_open}", course)
				.replace("{timeframe_id}", tf)
				.replace("{plugin}", "autochartist")
				.replace("{option_kind}", 1);


			if (!(partner_params.blockGuest && view.user.isGuest())) {
				if (tool_id != null && dir != null && course != null && tf != null) {

					wss_conn.send(open_query);
					global_last_button_buy_autochartist = id;
					global_last_button_buy_autochartist_price = null;
				}
			} else {
				bw_alert($("#messages .not_avialible_for_guest").html());
			}


		},
		openAutochartistLine: function (e) {
			var $target = $(e.target);

			if ($target.hasClass("active")) {
				$target.removeClass("active");
				$target.parents(".line").find(".bottom_line").hide();
				$target.parents(".line").find(".middle_line").hide();
			} else {
				$target.addClass("active");
				$target.parents(".line").find(".bottom_line").show();
				$target.parents(".line").find(".middle_line").show();
			}
		},
		logout: function (e) {
			window.location.href = "/";
		},
		deposit_funds: function (e) {
			window.location.href = "/transaction/deposit?id=" + account;
		},
		choosedDirection: function (e) {
			if (global_console_last_buy_id != 0) {
				if (typeof (bin_buy_success_txt_timeout) != "undefined") {
					clearTimeout(bin_buy_success_txt_timeout);
				}

				var buy_btn = view.consoles.get(global_console_last_buy_id).bin_buy;
				if (typeof (bin_buy_success_txt_timeout) != "undefined") {
					clearTimeout(bin_buy_success_txt_timeout);
				}
				var bin_buy_default_txt = $('#messages .bin_buy_default_txt').text();
				var bin_buy_success_txt = $('#messages .bin_buy_hidden_msg').text();
				var bin_buy_success_txt_show_time = 2000;
				if (buy_btn.hasClass("bin_btn_turned")) {
					buy_btn.transition({rotateX: 90}, 100, function () {
						buy_btn.text(bin_buy_default_txt).removeClass('bin_btn_turned').transition({rotateX: 0}, 100);
					});
				}

			}
		},

		initialize: function () {
			this.consoles = new Consoles();
			this.opened_options = new OpenedOptions();
			this.option_kinds = new OptionKinds();
			this.starredTools = new StarredTools();
			this.widgetCollection = new Widgets();
			this.lazyUpdates = new LazyUpdates();

			this.department = new Department();
			this.user = new User();

			if (this.option_kinds == null || this.option_kinds.length == 0) {
				this.option_kinds.add([
					{id: 1, name: "classic"},
					{id: 2, name: "touch_advanced"},
					{id: 3, name: "range_advanced"},
					{id: 4, name: "touch"},
					{id: 5, name: "range"},
					{id: 6, name: "range_classic"}
				]);
			}

			this.widgetCollection.bind("add", this.onAddWidget);
			this.widgetCollection.bind("remove", this.onRemoveWidget);

			this.starredTools.bind("add", this.onAddStarredTool);
			this.starredTools.bind("remove", this.onRemoveStarredTool);

			this.consoles.bind("add", this.appendConsole);
			this.opened_options.bind("add", this.appendOpenedOption);

			_.bindAll(this, 'render', 'appendConsole', 'duplicateConsole', 'appendOpenedOption', 'setOpenedTab', 'closeMenu');

			$(document).bind('mousedown', this.closeMenu);

			setTimeout(function run() {
				view.makeLazyUpdate();
				setTimeout(run, 1000);
			}, 1000);
		},
		render: function () {
			console.log('render');
			el.html($("#page-login").html());
		},
		addLazyUpdateRequest: function (selector, value) {
			//var existed = this.lazyUpdates.findWhere({selector:selector});

			_(this.lazyUpdates).each(function (elem) {
				if (item.get("selector") == selector) {
					existed = item;
				}
			});

			if (existed == null) {
				this.lazyUpdates.add({selector: selector, value: value});
			} else {
				existed.set("value", value);
			}
		},
		makeLazyUpdate: function () {
			_(this.lazyUpdates.models).each(function (elem) {
				nodeBySelector(elem.get("selector")).val(elem.get("value"));
				view.lazyUpdates.remove(elem);
			});
		},
		toggleWidget: function (e) {
			e.stopPropagation();
			global_button_pressed = true;

			var currentWidgets = view.getWidgets();
			var $target = $(e.target), name = $target.attr("data-name");
			var widgetAdded = _.some(currentWidgets, function (el) {
				return el.name === $target.attr("data-name");
			});
			if (widgetAdded) {

				view.widgetCollection.remove(view.widgetCollection.where({name: name}));
			} else {

				view.widgetCollection.add({"name": name});
			}

			this.updateWidgetSelectors();
		},
		updateWidgetSelectors: function () {
			var currentWidgets = view.getWidgets();
			var widgetAdded;
			var $elem;

			$(".toggle_widget").each(function (index, elem) {
				$elem = $(elem);
				widgetAdded = _.some(currentWidgets, function (el) {
					return el.name === $elem.attr("data-name");
				});
				if (widgetAdded) {
					$elem.addClass("active").attr("checked", true).parent().addClass("checked");
				} else {
					$elem.removeClass("active").attr("checked", false).parent().removeClass("checked");
				}
			});

		},
		updateSettingsSelectors: function () {

			var settingOn = false, $elem, val;

			$(".toggle-user-param").each(function (index, elem) {
				$elem = $(elem);
				if ($elem.attr("data-param") != null) {
					val = settings.getParam($elem.attr("data-param"));

					settings.updateAllSettings($elem.attr("data-param"), val);

					if (val == "1") {
						$elem.addClass("active").parent().addClass("checked");
					} else {
						$elem.removeClass("active").parent().removeClass("checked");
					}
				}
			});

		},

		checkIfWidgedExist: function (name) {
			var currentWidgets = view.getWidgets();
			return _.some(currentWidgets, function (el) {
				return el.name === name;
			});
		},
		onAddWidget: function (widget) {

			//проверить что такого виджета ещЄ нет
			var currentWidgets = view.getWidgets();
			var widgetAdded = _.some(currentWidgets, function (el) {
				return el.name === widget.get("name");
			});

			if (widgetAdded != false || widget.name == null) {
				view.widgetCollection.remove(widget);
				return;
			}

			//сделать необходимые подписки
			//...

			//добавить в заданный блок
			var template = $("#bo_widget_template_" + widget.get("name"));

			var place = widget.get("defaultContainer");
			var cid = widget.cid;
			if (place == null) {
				if (widget.get("name") == "opened_options") {
					place = "#sort2";
				} else {
					place = "#sort1";
				}
			}


			if (template[0] != null && place != null && cid) {
				$(place).append(template.html().replace("{cid}", cid));
			}
			template = null;
			place = null;
			cid = null;

			setTimeout(function () {
				if (js_params.p != "7") {
					$('.scroll').each(function (key, elem) {
						if (!$(elem).parent().hasClass("slimScrollDiv")) {
							$(elem).slimScroll({destroy: true}).slimScroll(
								{
									width: '100%',
									height: '100%',
									size: '4px',
									position: 'right',
									color: '#000',
									opacity:0.8,
									railColor: '#233847',
									railOpacity: 0.8,
									alwaysVisible: false,
									distance: '0px',
									start: 'top',
									railVisible: false,
									wheelStep: 10,
									allowPageScroll: false,
									disableFadeOut: false
								}
							);
						}
					});
				}
			}, 1000);

			switch (widget.get("name")) {
				case "promo":
					widgets.onAddPromo();
					break;
				case "market_rates":
					widgets.onAddMarketRates();
					break;
				case "traders_choice":
					widgets.onAddTradersChoice();
					break;
				case "autochartist":
					widgets.onAddAutochartist();
					break;
				case "calc":
					widgets.onAddCalc();
					break;
				case "opened_options":
					widgets.onAddOpenedOptions();
					break;
			}

			view.addSaveDataRequest();
			view.updateWidgetSelectors();


		},
		widgetClose: function (e) {
			var $target = $(e.target);
			view.widgetCollection.remove(view.widgetCollection.get($target.parents(".bo_widget").attr("data-id")));
			view.addSaveDataRequest();
		},
		onRemoveWidget: function (widget) {

			try {
				view.addSaveDataRequest();
				$(".bo_widget[data-id='" + widget.cid + "']").remove();
				view.updateWidgetSelectors();
			} catch (e) {
			}
		},

		getWidgets: function () {
			var widgets = [];
			_(view.widgetCollection.containers).each(function (item) {
				_($(item).find(".bo_widget")).each(function (widget) {
					widgets.push({name: $(widget).attr("data-name"), defaultContainer: item});

				});
			});
			return widgets;
		},
		addAllWidgets: function (user_data) {
			_(user_data.widgets).each(function (elem) {
				view.widgetCollection.add(elem);
			});

			setTimeout(function () {
				view.updateWidgetSelectors();
			}, 1000);
		},
		onAddStarredTool: function () {

			if (this.pauseRender == false) {
				_(view.consoles.models).each(function (item) {
					item.setToolTypes(item.getToolTypes());
				});
			}

			_(view.consoles.models).each(function (item) {
				item.updateStarredStatus();
			});
		},
		onRemoveStarredTool: function () {
			if (this.pauseRender == false) {
				_(view.consoles.models).each(function (item) {
					item.setToolTypes(item.getToolTypes());
				});
			}

			_(view.consoles.models).each(function (item) {
				item.updateStarredStatus();
			});

		},
		showInvest: function (e) {
			console.log('showInvest');
			var timout, $this = $(e.target);
			clearTimeout(timout);


			if (currency == "₽" || currency == "P" || (partner == 3 && currency != "$" && currency != "€")) {

				var $target = $(e.target),
					$console = $target.parents(console_block),
					id = $console.attr("data-id"),
					item = this.consoles.get(id);

				var list = [200, 500, 1000, 2500, 7500, 5000, 10000], i = 6;
				item.set("set-invest", "200");
				item.el.find(".bin_express_invest_item").each(function (key, item1) {
					$(item1).text(list[i]);
					i--;
				});
				list = null;
				i = null;
			}

			if ($this.hasClass('active')) {

				$this.find('.bin_express_invest_item').each(function () {
					var elem_index = $(this).index();

					$(this).delay(elem_index * 50).animate({'margin-left': 10, opacity: 0}, 200);
				});

				timout = setTimeout(function () {
					$('.bin_invest_block__button').removeClass('active');
				}, 50 * $('.bin_express_invest_item').length);

			} else {
				clearTimeout(timout);
				$('.bin_express_invest_item').css({'margin-left': 10, opacity: 0});
				$this.addClass('active').find('.bin_express_invest_item').each(function () {
					var elem_index = $(this).index();
					$(this).delay(elem_index * 50).animate({'margin-left': 0, opacity: 1}, 200);
				});
			}

		},
		hideInvest: function (e) {
			var timout, $this = $(e.target);
			view.consoles.get(parseInt($this.parents(console_block).attr("data-id"))).set("invest", $this.text());
			$this.parents(console_block).find(".bin_invest input").val($this.text());
			item = view.consoles.get($this.parents(console_block).attr("data-id"));

			item.changeParam("set-invest", parseFloat($this.text()));

			setTimeout(function () {
				item.changeParam("set-invest", parseFloat($this.text()));
			}, 200);

			$('.bin_invest_block__button').removeClass('active');

		},
		refillDeposit: function (e) {
			var deposit = parseFloat($("#user-deposit-value").text() || $(".user-deposit-value").text());

			if (deposit < 10000) {
				wss_conn.send('{"command":"transaction_balance_reset"}');
				bw_alert(view.messages.find(".deposit-refilled").text());
			} else {
				bw_alert(view.messages.find(".only_if_less_10000").text());
			}
		},
		styleMenuToggle: function (e) {
			$(".styleMenuContent").toggle();
		},
		backToMain: function (e) {
			window.location.href = "/";
		},
		getJournal: function (e) {

			var $target = $(e.target);
			option.getClosedBinaryOptionsWss($target.attr("data-page"));
		},
		getOperationsHistory: function (e) {

			var $target = $(e.target);
			option.getHistoryBinaryOptionsWss($target.attr("data-page"));
		},
		updateToolType: function (e) {
			console.log('updateToolType');
			e.preventDefault();
			var $target = $(e.target),
				target_tool_type = $target.attr("data-type"),
				$console = $target.parents(console_block);
			if ($console[0] == null) {
				$console = $("#widgets-" + view.kind + " " + console_block)
			}

			if ($(e.target).hasClass("empty")) {
				return;
			}

			var id = $console.attr("data-id"),
				item = this.consoles.get(id),
				all_tools = false;

			if (target_tool_type == null) {
				target_tool_type = $target.parent().parent().find('.b_instruments_filter_content .active').attr("data-type");
			}
			//HARDCODE
			this.setToolType(1, target_tool_type);
		},
		setToolType: function (console_id, tool_type) {
			console.log('setToolType');
			var target_tool_type = tool_type,
				item = this.consoles.get(console_id),
				//timeframe = item.get("timeframe"),
				//settings = settings_wss[item.get("kind")],
				newhtml = "",
				$console = $(item.el),
				all_tools = false;

			item.set("tool_type", tool_type);

			if (use_left_widget) {
				item.testMessageLeftWidget();
			}

			if (target_tool_type == 0) {
				all_tools = true;
			}


			var body = $("#console-tools").html();
			var body_left_panel = $("#left-panel-tools").html();


			var tools_html = "", tools_left_panel_html = "";
			var params;
			for (var i in tools.slice(0,20)) {

				if (all_tools
					|| tools[i].tool_type == target_tool_type
					|| target_tool_type == "starred" && view.starredTools.where({tool_id: parseInt(tools[i].tool_id)})[0] != null) {

					var inFavorite = $.inArray(parseInt(tools[i].tool_id), view.user.user_data.starredTools) != -1 ? 'inFavorites' : '';
					params = {
						tool_id: tools[i].tool_id,
						tool_name: tools[i].tool_view_name,
						inFavorite: inFavorite
					};

					if (tools[i] != null && tools[i].tool_view_name != null && tools[i].tool_view_name.length > 0 && settings.getAllowedByTool(item.get("kind"), tools[i].tool_id).length > 0) {
						tools_html += Mustache.render(body, params);
						tools_left_panel_html += Mustache.render(body_left_panel, params);
					}

				}
			}

			$('.b_instrument_block .b_list').hide().html(tools_html).show(1000);
			item.tools.html(tools_html);

			if (item.left_panel != null && item.left_panel[0] != null) {
				item.left_panel.html(tools_left_panel_html);
			}


			if (item.el.find("." + instrument_filter_item.replaceAll(" ", "."))[0] == null) {
				$('.' + instrument_filter_item.replaceAll(" ", ".")).removeClass("active");
				$('.' + instrument_filter_item.replaceAll(" ", ".") + "[data-type='" + target_tool_type + "']").addClass("active");
			} else {
				item.el.find("." + instrument_filter_item.replaceAll(" ", ".")).removeClass("active");
				item.el.find("." + instrument_filter_item.replaceAll(" ", ".") + "[data-type='" + target_tool_type + "']").addClass("active");
			}


			if (tools_html != "") {
				if (item.tools.find(".change-tool")[0] != null) {
					//item.tools.find(".change-tool").eq(0).trigger("click");
					item.changeParam("tool", item.tools.find(".change-tool").eq(0).attr("data-value"));
					item.tools.parents(".b_list_holder").removeClass("visible");
				}
			} else {
				//item.choosed_tool.html(" - ");
			}


			if (partner_params.use_runner) {

				var chooser = $console.find(".bo_instruments_chooser");
				var runner = $console.find('.bo_instruments_chooser__runner');
				runner.stop(1, 1).animate({
					width: chooser.find('.bo_instrument.active').innerWidth(),
					left: chooser.find('.bo_instrument.active').position().left
				}, 300, 'easeInOutQuint');
			}

			setTimeout(function () {
				if (js_params.partner == "3") {
					view.closeAllDropdowns();
				}
			}, 500);

		},
		setLang: function (e) {
			console.log('setLang');
			if ($(e.target).attr("data-lang") != null) {
				language = $(e.target).attr("data-lang");
				l100n.localize_all_pages(language);
				_(this.consoles.models).each(function (item) {
					item.update();
				}, this);
				view.saveConsoles();
			}
		},
		setKind: function (e) {
			$(".console-tab").addClass("hidden_tab");

			var kind = $(e.target).attr("data-kind");
			$('.b_options_types_item').removeClass("active");
			$(e.target).addClass("active");
			$(".drop_t").removeClass("active");
			if (kind != null && (settings_wss[kind] == null || settings_wss[kind].enable == "false")) {
				kind = null;
			}

			if (kind == null) {
				if (settings_wss.classic != null && settings_wss.classic.enable == "true") {
					kind = "classic";
				} else if (settings_wss.touch != null && settings_wss.touch.enable == "true") {
					kind = "touch";
				} else if (settings_wss.touch_advanced != null && settings_wss.touch_advanced.enable == "true") {
					kind = "touch_advanced";
				} else if (settings_wss.range != null && settings_wss.range.enable == "true") {
					kind = "range";
				} else if (settings_wss.range_classic != null && settings_wss.range_classic.enable == "true") {
					kind = "range_classic";
				} else if (settings_wss.range_advanced != null && settings_wss.range_advanced.enable == "true") {
					kind = "range_advanced";
				}
			}

			if (settings_wss.classic == undefined || settings_wss.classic == null || settings_wss.classic.enable != "true") {
				$(".bin_options_type[data-kind='classic']").each(function (key, elem) {
					$(elem).remove();
				});
			}
			if (settings_wss.touch == undefined || settings_wss.touch == null || settings_wss.touch.enable != "true") {
				$(".bin_options_type[data-kind='touch']").each(function (key, elem) {
					$(elem).remove();
				});
			}
			if (settings_wss.touch_advanced == undefined || settings_wss.touch_advanced == null || settings_wss.touch_advanced.enable != "true") {
				$(".bin_options_type[data-kind='touch_advanced']").each(function (key, elem) {
					$(elem).remove();
				});
			}
			if (settings_wss.range==undefined || settings_wss.range == null || settings_wss.range.enable != "true") {
				$(".bin_options_type[data-kind='range']").each(function (key, elem) {
					$(elem).remove();
				});
			}
			if (settings_wss.range_advanced==undefined || settings_wss.range_advanced == null || settings_wss.range_advanced.enable != "true") {
				$(".bin_options_type[data-kind='range_advanced']").each(function (key, elem) {
					$(elem).remove();
				});
			}
			if (settings_wss.range_clasic==undefined || settings_wss.range_classic == null || settings_wss.range_classic.enable != "true") {
				$(".bin_options_type[data-kind='range_classic']").each(function (key, elem) {
					$(elem).remove();
				});
			}


			this.kind = kind;
			var tool_type, found;
			$(".bin_instrument_type").each(function (key, elem) {
				tool_type = $(elem).attr("data-type");
				found = false;
				for (var i in settings_wss[kind].tools) {
					if (settings_wss[kind].tools[i].tool_type == tool_type && settings.getAllowedByTool(kind, settings_wss[kind].tools[i].tool_id).length > 0) {
						found = true;
						break;
					}
				}
				if (found || tool_type == 0) {
					$(elem).show();
				} else {
					$(elem).hide();
				}
			});


			view.saveConsoles();
			this.showOptionsByKind(kind);

			_(view.consoles.models).each(function (item) {
				if (partner_params.kindCleanDirection) {
					item.changeParam("set-direction", null);
					item.setFixedDirection();
				}
			});

			try {
				view.user.user_data.kind = kind;
				view.addSaveDataRequest();
			} catch (e) {
			}


			try {
				$(".b_options_types_item").each(function (key, elem) {
					$(elem).removeClass("active");
				});
				$(".b_options_types_item[data-kind={1}]".replace("{1}", kind)).each(function (key, elem) {
					$(elem).addClass("active");
				});
			} catch (e) {
				log(e);
			}


			view.redrawCurrentConsole();


			view.checkConsolesCloseButton();
			l100n.localize_all_pages(language);


		},
		redrawCurrentConsole: function () {
			_(view.consoles.models).each(function (item) {
				if (item.get("kind") == view.kind) {
					setTimeout(chart.drawConsole(item, true), 0);
				}
			});
		},
		toggleShare: function (e) {
			var $target = $(e.target),
				$opened_option = $target.parents(".open_options_bar"),
				id = $opened_option.attr("data-id"),
				item = this.opened_options.get(id);

			$opened_option.find(".open_options_share_buttons").toggle();
		},
		menuToolsShow: function (e) {
			var $target = $(e.target);

			if ($target.hasClass("b_add_title") || $target.hasClass("b_instruments_filter") || $target.hasClass("b_instruments_filter_item"))
				return;
			var $console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);

			if ($target.parent().hasClass("b_instruments_filter_item")) {
				return;
			}


			item.changeParam("menu-tools-show");
		},

		showOptionsByKind: function (kind) {
			var kind = kind || this.kind;
			//([kind,"#widgets-" + kind, $("#widgets-" + kind)[0]]);
			$("#widgets-" + kind).removeClass("hidden_tab").slideDown(0);


			$(".bin_console_main_block__graph_block .graph-mark").hide();

			/*_(this.consoles.models).each(function (item) {
			 chart.drawConsole(item);
			 }, this);*/


//        $(".open_options_bar[data-kind-id={kind}]"
//                .replace("{kind}", this.option_kinds.getIdByName(kind))).removeClass("hidden_tab");
//
//        $(".open_options_bar:not([data-kind-id={kind}])"
//                .replace("{kind}", this.option_kinds.getIdByName(kind))).addClass("hidden_tab");
		},
		modalClose: function (e) {
			try {
				$('#overlay').fadeOut(300);
			} catch (e) {
			}
			try {
				$('.binsta__overlay').fadeOut(300);
			} catch (e) {
			}
			$(e.target).parents(".bin_popup").remove();
			$(e.target).parents(".modal-dialog").remove();
			$(".invest-non-active").removeClass("invest-non-active");

		},
		requoteBuy: function (e) {

			try {
				global_last_buy_blocked = false;
				var item = view.consoles.get(global_console_last_buy_id);
				var lq = JSON.parse(lastOpenOptionQuery);
				if(lq.hasOwnProperty('direction')){
					item.changeParam("set-direction", lq.direction);
				}else {
					item.changeParam("set-direction", item.el.find(".binary_actions__btn.active").data('value'));
				}
				item.changeParam('buy-option');
				/*
				 if (item.get("oneClickBuy")) {
				 item.el.find(".binary_actions__btn.active").trigger("click");
				 item.el.find(".dir_control.active").trigger("click");
				 item.el.find(".bin_buy").trigger("click");
				 } else {
				 if (js_params.p == "6") {
				 item.el.find(".bin_buy").trigger("click");
				 } else {
				 if (item.bin_buy != null && item.bin_buy[0] != null) {
				 item.bin_buy.trigger("click");
				 log(1);

				 } else {
				 item.el.find(".b_buy_value").trigger("click");
				 }
				 }
				 }*/

				global_requote_price = 0;
				bw_close($(e.target).parents(".bin_popup"));
			} catch (e) {

				if (global_last_button_buy_autochartist != null && global_last_button_buy_autochartist_price != null) {
					global_last_button_buy_autochartist_price = null;

					var id = global_last_button_buy_autochartist,
						$target = $(view.el).find(".line[data-id='" + global_last_button_buy_autochartist + "']"),
						sum = parseFloat($target.find(".bottom_line_sum").val()),
						tool_id = $target.attr("data-tool_id"),
						dir = $target.attr("data-direction"),
						tf = $target.attr("data-timeframe"),
						course = global_last_button_buy_autochartist_price || quotes_cache[$target.attr("data-tool")] || 0;


					if (view.user.accept_autochartist == "0") {
						global_last_button_buy_autochartist = id;

						bw_alert(view.messages.find(".accept_autochartist_message").html(), view.messages.find(".accept").text(), "accept_autochartist");
						return;
					}

					var min_i = min_invest;
					var max_i = max_invest;

					if (sum < min_i || sum > max_i) {
						bw_alert(view.messages.find(".error-min_sum").text()
							.replace("{min}", currency + intellectRound(min_i))
							.replace("{max}", currency + intellectRound(max_i))
						);

						_(view.consoles.models).each(function (elem) {
							elem.changeParam("set-direction", null);
							elem.setFixedDirection();
						});

						return;
					}

					var open_query = '{"command":"open_option","sum":"{sum}","tool_id":"{tool_id}","direction":"{direction}","price_open":"{price_open}","plugin":"{plugin}","timeframe_id":"{timeframe_id}","option_kind":"{option_kind}"}'
						.replace("{sum}", sum)
						.replace("{tool_id}", tool_id)
						.replace("{direction}", dir)
						.replace("{price_open}", course)
						.replace("{timeframe_id}", tf)
						.replace("{plugin}", "autochartist")
						.replace("{option_kind}", 1);


					if (!(partner_params.blockGuest && view.user.isGuest())) {
						if (tool_id != null && dir != null && course != null && tf != null) {

							wss_conn.send(open_query);
							global_last_button_buy_autochartist = id;
							global_last_button_buy_autochartist_price = null;
						}
					} else {
						bw_alert($("#messages .not_avialible_for_guest").html());
					}
				}

			}


		},
		appendOpenedOptions: function () {
			$("#widgets .widget").remove();
			view.widgets.append($("#opened-options").html());

			wss_conn.send('{"command":"hook_options","source":"site","enable":"true"}');


			if (!view.user.isGuest()) {
				wss_conn.send('{"command":"hook_user_status","enable":"true"}');
			}


			l100n.localize_page("binary", language);
		},
		appendUserData: function () {
			$(el).prepend(Mustache.render($("#user-info").html(), {currency: currency}));

			l100n.localize_page("binary", language);
			setTimeout(function () {
				l100n.localize_page("binary", language)
			}, 1000);
		},


		appendConsole: function (item) {

			if (item.kind == undefined) {
				item.kind = "classic";
			}
			item.set("oneClickBuy", true);
			item.set("type", "history");
			if (item.get("oneClickBuy") == null) {
				item.set("oneClickBuy", true);
			}
			if (item.get("tool") == null) {
				//TODO проверить, разрешЄн ли tool
				item.set("tool", settings_wss[item.kind].tools[0]);
			}
			if (item.get("timeframe") == null) {
				//TODO проверить, разрешЄн ли timeframe
				item.set("timeframe", 1);
			}
			if (isNaN(parseFloat(item.get("invest"))) || item.get("invest") == null || item.get("invest") == "NaN") {
				item.set("invest", min_invest);

			}
			if (item.get("timesize") == null) {
				item.set("timesize", "M1");
			}
			if (item.get("tool_type") == null) {
				item.set("tool_type", 0);
			}
			//console.log(item.get("timeframe"));
			if (item.get("tool").allowed_timeframes.indexOf(item.get("timeframe")) < 0) {
				for (var i in  settings_wss[item.kind].tools) {
					var _tool = settings_wss[item.kind].tools[i];
					if (_tool.allowed_timeframes.length > 0) {
						item.set("tool", _tool);
						item.set("timeframe", _tool.allowed_timeframes[0]);
					}
				}
			}


			var tool = item.get("tool");
			subscribeWSS(wss_conn, tool.tool_id);
			subscribeWSSTimeframes(wss_conn, tool.tool_id, view.option_kinds.getIdByName(item.get("kind")));
			item.set("percent_win", 1.75);
			item.set("percent_lose", 0.05);
			var body;
			if (item.get("kind") != null) {
				if (same_templates_advanced) {
					body = $("#console-" + item.get("kind").replace("_advanced", "").replace("_classic", "")).html();
				} else {
					body = $("#console-" + item.get("kind")).html();

				}
			}
			if (item.get("kind") == "range_classic") {
				body = $("#console-range_classic").html();
			}

			var params = {
				id: item.id,
				invest: item.get("invest"),
				advanced: item.get("kind") == "touch_advanced",
				currency: currency
			};
			var old = $("#console-" + item.id);
			if (old[0] != null) {
				//("remove before add");
				old.remove();
			}
			old = null;


			//$("#widgets-" + item.get("kind")).append(Mustache.render(body, params)).css({"overflow": "visible"});
			$("#widgets-" + item.get("kind")).append(Mustache.render(body, params));
			$("#console-" + item.id).addClass("animation-target");
			item.initElems();

			item.on("change:tickdir", item.updateTickDir);
			item.on("change:direction", item.updateDirectionClass);
			item.on("change:oneClickBuy", item.updateOneClickBuy);
			item.on("change:timeframe", item.updateTimeframe);

			if (use_timeframes_for_timescale) {
				if (item.timesize_elem != null && item.timesize_elem[0] != null) {
					item.timesize_elem.hide();
				}
			}
			$(".user-deposit-currency").show();

			item.setToolTypes(item.getToolTypes());
			item.updateStarredStatus();
			item.setTools(item.getTools());
			item.setTimeframes(item.getTimeframes());
			item.setKindTypes();
			//item.el.hide().show("fade",100);
			item.changeParam("tool_type", item.get("tool_type"));
			item.changeParam("timeframe", item.get("timeframe"));
			item.changeParam("tool", item.get("tool").tool_id);
			item.changeParam("invest", item.get("invest"));
			item.invest.attr("placeholder", view.messages.find(".invest_placeholder").text());
			item.changeParam("set-invest");
			item.set("invest_ok", true);

			l100n.localize_page("binary", language);

			$("#console-" + item.id).find('.scroll').slimScroll({
				width: '100%',
				height: '100%',
				size: '7px',
				position: 'right',
				color: '#000',
				opacity:0.8,
				railColor: '#233847',
				railOpacity: 0.8,
				distance: 0,
				start: 'top',
				railVisible: false,
				wheelStep: 10,
				allowPageScroll: false,
				borderRadius: 3
			});

			$("#console-" + item.id + " .label_scale_4hours").trigger("click");
			$("#console-" + item.id + " .chart_scale").removeClass("active");

			//$(".add_console").show();

			if (currency == "₽" || currency == "P" || (partner == 3 && currency != "$" && currency != "€")) {
				var list = [200, 500, 1000, 2500, 7500, 5000, 10000], i = 6;
				item.set("set-invest", "200");
				item.el.find(".bin_express_invest_item").each(function (key, item1) {
					$(item1).text(list[i]);
					i--;
				});
				list = null;
				i = null;
			}

			if (partner_params.default_draw_type == "candle") {
				item.set("candle", true);
			}

			if (item.get("hideAddWindow") || view.consoles.where({kind: item.get("kind")}).length == partner_params.maxConsolesSameType) {
				item.el.next(".w_dub").remove();
			}

			//prepends one click buy functional
			// if (item.get("oneClickBuy") == true) {
			//     item.set("oneClickBuy", false);
			//     item.el.find(".console__one_click").trigger("click");
			// }

			view.saveConsoles();

			if (language == 'ru') {
				item.el.find(".console__one_click__text").addClass("ru");
			}

			getOnclickCondition(item, false);

			//	init simpleTip
			$('.tipped').simpleTip();

			resubscribeWSS();

			item.setFixedDirection();

			if (!view.user.isGuest()) {
				if (view.user.deposit != null) {
					view.user.setDeposit(view.user.deposit);
				}
				if (view.user.credit != null) {
					view.user.setCredit(view.user.credit);
				}
				if (view.user.availableAmount != null) {
					view.user.setAvailableAmount(view.user.availableAmount);
				}
				if (view.user.opened_count != null) {
					view.user.setOpenedCount(view.user.opened_count);
				}
			} else {
				view.user.setOpenedCount(0);
			}

			view.checkConsolesCloseButton();

			item.getHistory();
		},
		duplicateConsole: function (e) {
			var id = this.getNewId();
			var old_console_view = view.consoles.where({kind: view.kind});
			var old_console = this.consoles.get(old_console_view[old_console_view.length - 1].id);
			if (old_console == null) {
				this.consoles.add({id: id, kind: view.kind});
				var new_console = this.consoles.get(id);
				new_console.changeParam("tool", 1);
				new_console.changeParam("timeframe", 1);
				new_console.timeframes.parents(".drop_t").removeClass("active");
			} else {
				$("." + old_console.get("kind") + "_w_dub").remove();
				if (view.consoles.where({kind: old_console.get("kind")}).length < partner_params.maxConsolesSameType || partner_params.maxConsolesSameType == -1) {
					this.consoles.add({
						id: id,
						kind: old_console.get("kind"),
						tool: old_console.get("tool"),
						timeframe: old_console.get("timeframe"),
						invest: old_console.get("invest")
					});
					var new_console = this.consoles.get(id);
					new_console.setToolTypes(old_console.getToolTypes());
					new_console.updateStarredStatus();
					if (old_console.get("oneClickBuy"))
						new_console.el.find(".console__one_click").trigger("click");
				}
				if (view.consoles.where({kind: old_console.get("kind")}).length == partner_params.maxConsolesSameType) {
					$("." + old_console.get("kind") + "_w_dub").remove();
				}
			}

			id = null;

			view.saveConsoles();
		},

		removeConsole: function (e) {
			var countConsoles = $(e.target).parents(".console-tab").find(console_block).length;

			if (countConsoles > 1) {
				/*if (countConsoles > 2) {
				 $("."+view.kind+"_w_dub").remove();
				 }*/
				var parent = $(e.target).parents(".console-tab");
				this.consoles.remove(this.consoles.get($(e.target).parents(console_block).attr("data-id")));
				$(e.target).parents(console_block).remove();
				if (countConsoles == partner_params.maxConsolesSameType) {
					parent.append('<div class="button add_console w_dub ' + view.kind + '_w_dub">ADD CONSOLE</div>');
					l100n.localize_page("binary", language);
				}

			} else {
				//("can't delete last, sorry");
			}

			view.checkConsolesCloseButton();
			view.saveConsoles();
		},

		checkConsolesCloseButton: function () {
			var currentKindConsoles = view.consoles.where({kind: view.kind});
			if (currentKindConsoles.length > 0) {
				if (currentKindConsoles.length == 1) {
					currentKindConsoles[0].el.addClass("single");
				} else {
					_(currentKindConsoles).each(function (elem) {
						elem.el.removeClass("single");
					});
				}
			}
		},

		getNewId: function () {
			var max = 0;
			_(this.consoles.models).each(function (item) {
				if (item.id > max) {
					max = item.id;
				}
			}, this);
			return max + 1;
		},
		changeParam: function (e) {

			//e.preventDefault();

			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				action =
					$target.hasClass("bb_" + e.type) && $target.attr("data-action")        //дл¤ действи¤ только в этом блоке
					|| $target.hasClass("bb_" + e.type + "_all") && $target.attr("data-action") //дл¤ действи¤ во всЄм родительском блоке
					|| $target.parents(".bb_" + e.type + "_all").attr("data-action"), //дл¤ действи¤ элемента внутри родительского блока

				data = $target.attr("data-value") || $target.parents(".bb_" + e.type + "_all").attr("data-value") || "0",
				item = this.consoles.get(id);


			item.changeParam(action, data);

		},
		changeTool: function (e, fromHook) {
			if (fromHook == true) {
				var $target = e;
			} else {
				var $target = $(e.currentTarget);
			}
			var $console = $target.parents(console_block);
			var id = $console.attr("data-id");
			var data = $target.attr("data-value");
			var item = this.consoles.get(id);

			if (fromHook != true) {
				timeframe = item.get("timeframe");
				if (item.getTool(parseInt(data)) != null) {
					$console.attr("data-tool-type", item.getTool(parseInt(data)).tool_type);
				}
				item.changeParam("tool", data);

				$target.parent().find('.instrument').removeClass('active');
				$target.addClass('active');

				if (!$.inArray(timeframe, settings.getAllowedByTool(item.get("kind"), data))) {
					$console.find(".bin_selectable.tf .change-timeframe").eq(0).click();
				}
			}
			view.saveConsoles();
		},
		buyOption: function (e) {
			console.log('buyOption');

			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				data = $target.attr("data-value");

			if (id == null) {
				console.log('id = null');
				view.buyOptionAutochartist();
				return;
			}

			/*if ($target.hasClass("bin_btn_inactive") || $target.parents().hasClass("bin_btn_inactive")) {
			 return;
			 }*/

			var item = this.consoles.get(id);
			item.setFixedDirection();

			var min_i = min_invest;
			var max_i = max_invest;

			item.closeRequoteModal();
			item.closeRequotePopup();

			if (!fix_min_max_invest) {
				if (item.get("min_invest") != null && item.get("max_invest") != null) {

					min_i = item.get("min_invest");
					max_i = item.get("max_invest");
				}
			}
			//костыль!
			item.set("invest", $('.b_invest_select').val());
			if (parseFloat(item.get("invest")) < parseFloat(min_i) || parseFloat(item.get("invest")) > parseFloat(max_i)) {
				item.el.find(".bin_buy").addClass("inactive");
				item.set("invest_ok", false);
				bw_alert(view.messages.find(".error-min_sum").text().replace("{min}", currency + intellectRound(min_i)).replace("{max}", currency + intellectRound(max_i)));

				_(view.consoles.models).each(function (elem) {
					elem.changeParam("set-direction", null);

					elem.setFixedDirection();
				});


				return;
			}

			if (parseFloat(item.get("invest")) > parseFloat(max_i)) {
				item.el.find(".bin_buy").addClass("inactive");
				item.set("invest_ok", false);
				return;
			}


			item.changeParam("buy-option");


		},
		focusinInvest: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);


			item.changeParam("invest-select-show");
		},
		focusoutInvest: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				item = this.consoles.get(id);


			item.changeParam("invest-select-hide");
		},
		changeTimeframe: function (e) {
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				data = $target.attr("data-value"),
				item = this.consoles.get(id);
			item.changeParam("payouts", data);
			item.changeParam("timeframe", data);

			view.saveConsoles();
		},
		setHistory: function (params) {

			if (!(params.data.length > 0))
				return;

			_(this.consoles.models).each(function (item) {
				if (item.get("tool").tool_id == params.tool_id && (params.request_id == null || params.request_id == 0) || params.request_id == item.el.attr("id")) {

					item.cource_val.text((params.data[params.data.length - 1][1]).toFixed(item.get("tool").decimal_count));
					item.cource_val2.text((params.data[params.data.length - 1][1]).toFixed(item.get("tool").decimal_count));
					item.set("data", params.data);
					setTimeout(chart.drawConsole(item), 0);
				}
			}, this);

			var newData = [];
			var correction = isLondonInSummerTime ? 3600000 : 0;

			var len = params.data.length - 1;
			for (var i = 0; i < len; i++) {
				if (params.data[i] != null) {
					newData.push([params.data[i][0] - correction, params.data[i][1]]);
				}
			}


		},
		setFixedInvest: function (e) {
			var freeMoney = parseFloat(view.user.getDeposit());
			var $target = $(e.target),
				$console = $target.parents(console_block),
				id = $console.attr("data-id"),
				data = $target.attr("data-value"),
				item = this.consoles.get(id);

			if (freeMoney < parseFloat(data)) {
				data = freeMoney;
				bw_alert(view.messages.find(".error-insufficient_funds").text());
			}

			item.changeParam("set-fixed-invest", data);
			item.changeParam("set-invest");

			item.changeParam("invest-select-hide");
			$console.find(".invest-menu").hide();
			$console.find(".al_invest__input_holder").removeClass('expressed');
		},
		setOpenedBlock: function (e) {

			var $target = $(e.target);

			$(".body").fadeOut(300);
			$(".body.page-" + $target.attr("data-link")).stop(true, false).fadeIn(300);
		},
		setToolsRates: function(data){
			var val, tool_rate;
			for (var i = 0; i < data.length; i++) {

				val = data[i];

				if (typeof (val.option_kind) != "undefined") {
					tool_rate[val.tool_id] = {
						option_kind: val.option_kind,
						tool_id: val.tool_id,
						timeframe_id: val.timeframe,
						percent: val.percent,
						price: val.price
					};
				}
				console.log("Tool rate" + tool_rate);
			}
		},
		setPayoutRates: function (data) {

			var val, id;
			for (var i = 0; i < data.length; i++) {

				val = data[i];

				id = val.option_kind + "-" + val.tool_id + "-" + val.timeframe;


				if (typeof (val.option_kind) != "undefined") {
					hook_payout_rates_cache[id] = {
						option_kind: val.option_kind,
						tool_id: val.tool_id,
						timeframe_id: val.timeframe,
						percent: val.percent
					};
				}


			}
		},
		setEndTimes: function (data) {
			var timeframes = [], val, id, id1, timeframe_id;

			var redraw = false;
			for (var i in data) {
				if (data[i] != null) {

					id = data[i].option_kind + "-" + data[i].tool_id + "-" + data[i].timeframe_id;

					if (partner_params.useNewHookTimeframes) {
						if (typeof (hook_timeframes_cache[id]) != "undefined") {
							for (var key in data[i]) {
								hook_timeframes_cache[id][key] = data[i][key];
							}
						} else {
							val = common.clone(data[i]);
							if (typeof (data[i].option_kind) != "undefined") {
								hook_timeframes_cache[id] = val;
							}
						}

					} else {
						val = common.clone(data[i]);
						if (typeof (data[i].option_kind) != "undefined") {
							hook_timeframes_cache[id] = val;
						}
					}


					redraw = typeof (hook_timeframes_cache[id]) == "undefined";

					if (redraw) {
						view.redrawCurrentConsole();
					}
				}
			}

			_(this.consoles.models).each(function (item) {
				timeframe_id = parseInt(item.get("timeframe"));
				id1 = this.option_kinds.getIdByName(item.get("kind")) + "-" + item.get("tool").tool_id + "-" + item.get("timeframe");

				item.testMessageLeftWidget();
				if (typeof (hook_timeframes_cache[id1]) != "undefined") {
					var min_i = min_invest;
					var max_i = max_invest;
					if (typeof (hook_timeframes_cache[id1]["min_rate"]) != "undefined") {
						min_i = Math.floor(hook_timeframes_cache[id1]["min_rate"]);
						item.set("min_invest", min_i);
					}
					if (typeof (hook_timeframes_cache[id1]["max_rate"]) != "undefined") {
						max_i = Math.floor(hook_timeframes_cache[id1]["max_rate"]);
						item.set("max_invest", max_i);
					}


					var badInvestTooltip = item.el.find('.badInvest-buy-hover');
					var buttons = item.el.find('.actionBtn');
					buttons.removeClass('inactive');
					badInvestTooltip.addClass('hidden');
					if (min_i > item.get('invest') || item.get('invest') > max_i) {
						badInvestTooltip.removeClass('hidden');
						var message = view.messages.find(".error-min_sum").text().replace("{min}", currency + min_i).replace("{max}", currency + max_i);
						badInvestTooltip.find('div').html(message);
						buttons.addClass('inactive');
					}

					if (item.get("kind") == "classic") {
						item.set("percent_win", hook_timeframes_cache[id1].percent_win / 100 + 1);
						item.set("percent_lose", hook_timeframes_cache[id1].percent_lose / 100);
						item.set("percent_win_up", hook_timeframes_cache[id1].percent_win / 100 + 1);
						item.set("percent_lose_up", hook_timeframes_cache[id1].percent_lose / 100);
						item.set("percent_win_down", hook_timeframes_cache[id1].percent_win / 100 + 1);
						item.set("percent_lose_down", hook_timeframes_cache[id1].percent_lose / 100);
						item.set("call_percent", hook_timeframes_cache[id1].call_percent);

					} else if (item.get("kind") == "touch" || item.get("kind") == "touch_advanced") {

						if (item.get("kind") == "touch_advanced") {
							//(hook_timeframes_cache[id1]);
						}

						item.set("percent_lose_down", hook_timeframes_cache[id1].percent_lose_down);
						item.set("percent_lose_up", hook_timeframes_cache[id1].percent_lose_up);
						item.set("percent_lose_up_down", hook_timeframes_cache[id1].percent_lose_up_down);
						item.set("percent_win_down", hook_timeframes_cache[id1].percent_win_down);
						item.set("percent_win_up", hook_timeframes_cache[id1].percent_win_up);
						item.set("percent_win_up_down", hook_timeframes_cache[id1].percent_win_up_down);
						item.set("down_delta", hook_timeframes_cache[id1].down_delta);
						item.set("up_delta", hook_timeframes_cache[id1].up_delta);
						item.set("updown_delta_down", hook_timeframes_cache[id1].updown_delta_down);
						item.set("updown_delta_up", hook_timeframes_cache[id1].updown_delta_up);
						item.set("up_down_percent", hook_timeframes_cache[id1].up_down_percent);
						item.set("up_percent", hook_timeframes_cache[id1].up_percent);
						item.set("down_percent", hook_timeframes_cache[id1].down_percent);


					} else if (item.get("kind") == "range" || item.get("kind") == "range_advanced") {
						item.set("percent_in_lose", hook_timeframes_cache[id1].percent_in_lose);
						item.set("percent_in_win", hook_timeframes_cache[id1].percent_in_win);
						item.set("percent_out_lose", hook_timeframes_cache[id1].percent_out_lose);
						item.set("percent_out_win", hook_timeframes_cache[id1].percent_out_win);

						if (item.get("kind") == "range") {
							item.set("delta_top", hook_timeframes_cache[id1].delta_top);
							item.set("delta_bottom", hook_timeframes_cache[id1].delta_bottom);
						} else {
							item.set("delta_bottom_external", hook_timeframes_cache[id1].delta_bottom_external);
							item.set("delta_bottom_internal", hook_timeframes_cache[id1].delta_bottom_internal);

							item.set("delta_top_external", hook_timeframes_cache[id1].delta_top_external);
							item.set("delta_top_internal", hook_timeframes_cache[id1].delta_top_internal);
						}

						item.set("in_percent", hook_timeframes_cache[id1].in_percent);

					} else if (item.get("kind") == "range_classic") {
						item.set("delta_down", hook_timeframes_cache[id1].delta_down);
						item.set("delta_up", hook_timeframes_cache[id1].delta_up);
						item.set("percent_down_lose", hook_timeframes_cache[id1].percent_down_lose);
						item.set("percent_down_win", hook_timeframes_cache[id1].percent_down_win);
						item.set("percent_up_lose", hook_timeframes_cache[id1].percent_up_lose);
						item.set("percent_up_win", hook_timeframes_cache[id1].percent_up_win);
						item.set("up_percent", hook_timeframes_cache[id1].up_percent);

					}

					item.set("date_open", hook_timeframes_cache[id1].date_open);
					item.set("date_close", hook_timeframes_cache[id1].date_close);
					item.set("allow", hook_timeframes_cache[id1].allow == "yes");

					item.changeParam("end-time");
					item.changeParam("set-invest");
					item.updateScheduleTimer();
					item.updateHookTimeframesStatus();
				}
			}, this);

			if (view.kind != null) {
				if (use_new_left_widget) {

					var $line, win,
						choosed_kind = view.option_kinds.getIdByName(view.kind),
						choosed_tf = "1",
						item = view.getCurrentConsole();

					if (item != null) {
						choosed_tf = item.get("timeframe");
						choosed_kind = view.option_kinds.getIdByName(item.get("kind"));
						item.updateInvestValue();
					}

					var $widgets = $("#widgets-" + view.kind);

					var time = $widgets.find(".expire_time_val").text();
					$widgets.find(".left-panel-widget tr").each(function (key, elem) {
						$(elem).find(".time").text(time);
					});

					$.each(hook_payout_rates_cache, function (i, elem) {
						if (elem.option_kind.toString() == choosed_kind.toString() && elem.timeframe_id.toString() == choosed_tf.toString()) {
							win = elem.percent;

							$line = $widgets.find(".left-panel-widget tr[data-tool-id='" + elem.tool_id + "']");
							$line.find(".percent").text(parseFloat(win).toFixed());


						}
					});

				} else {

					var $line, win,
						choosed_kind = view.option_kinds.getIdByName(view.kind),
						choosed_tf = "1",
						items = view.getCurrentConsoleAll();

					for (i in items) {
						item = items[i];
						if (item != null) {
							choosed_tf = item.get("timeframe");
							choosed_kind = view.option_kinds.getIdByName(item.get("kind"));
							item.updateInvestValue();
						}

						var $widgets = $("#widgets-" + view.kind);

						var time = $widgets.find(".expire_time_val").text();
						$widgets.find(".left-panel-widget tr").each(function (key, elem) {
							$(elem).find(".time").text(time);
						});

						$.each(hook_timeframes_cache, function (i, elem) {
							if (elem.option_kind != null && elem.timeframe_id != null) {
								if (elem.option_kind.toString() == choosed_kind.toString() && elem.timeframe_id.toString() == choosed_tf.toString()) {
									win = elem.percent_win || elem.percent_win_up || elem.percent_in_win;

									$line = $widgets.find(".left-panel-widget tr[data-tool-id='" + elem.tool_id + "']");
									$line.find(".percent").text(parseFloat(win).toFixed());
								}
							}
						});

					}

				}

				$line = null;
				win = null;
				choosed_tf = null;
				choosed_kind = null;
				item = null;
				time = null;
				$widgets = null;
			}

			timeframes = null;
		},
		saveConsoles: function () {
			var consoles = [];
			_(this.consoles.models).each(function (item) {
				consoles.push({
					id: item.get("id"),
					tool_id: item.get("tool").tool_id,
					timeframe: item.get("timeframe"),
					invest: item.get("invest"),
					kind: item.get("kind"),
					oneClickBuy: item.get("oneClickBuy")
				});
			}, this);

			if (!isLocalstorageAvailable()) {
				localData.consoles = Js(consoles);
			} else {
				localStorage.consoles = Js(consoles);
			}

			var kind = "classic";

			if (!isLocalstorageAvailable()) {

				try {
					kind = view.user.user_data.kind;
					localData.user_data = Js(view.user.user_data);
				} catch (e) {
				}

				localData.user_data = Js({
					kind: kind,
					accept_autochartist: view.user.accept_autochartist,
					starredTools: _.pluck(view.starredTools.toJSON(), 'tool_id')
				});

				localData.language = language;
			} else {
				try {
					kind = view.user.user_data.kind;
					localStorage.user_data = Js(view.user.user_data);
				} catch (e) {
				}

				localStorage.user_data = Js({
					kind: kind,
					accept_autochartist: view.user.accept_autochartist,
					starredTools: _.pluck(view.starredTools.toJSON(), 'tool_id')
				});

				localStorage.language = language;
			}

			view.addSaveDataRequest();
			consoles = null;
		},
		loadConsolesAndUserData: function () {


			if (js_params.consoles_ls_default != null) {
				var consoles_ls_default = js_params.consoles_ls_default;
			} else {
				if (currency == "?" || currency == "P") {

					var consoles_ls_default = [
						{id: 1, tool_id: 1, kind: "classic", invest: 200, timeframe: 1, oneClickBuy: true},
						{id: 2, tool_id: 1, kind: "touch_advanced", invest: 200, timeframe: 4, oneClickBuy: false},
						{id: 3, tool_id: 1, kind: "range_advanced", invest: 200, timeframe: 4, oneClickBuy: false},
						{id: 4, tool_id: 1, kind: "touch", invest: 200, timeframe: 4, oneClickBuy: false},
						{id: 5, tool_id: 1, kind: "range", invest: 200, timeframe: 4, oneClickBuy: false},
						{id: 6, tool_id: 1, kind: "range_classic", invest: 200, timeframe: 4, oneClickBuy: false}
					];

				} else {

					var consoles_ls_default = [
						{id: 1, tool_id: 1, kind: "classic", invest: 20, timeframe: 1, oneClickBuy: true},
						{id: 2, tool_id: 1, kind: "touch_advanced", invest: 20, timeframe: 4, oneClickBuy: false},
						{id: 3, tool_id: 1, kind: "range_advanced", invest: 20, timeframe: 4, oneClickBuy: false},
						{id: 4, tool_id: 1, kind: "touch", invest: 20, timeframe: 4, oneClickBuy: false},
						{id: 5, tool_id: 1, kind: "range", invest: 20, timeframe: 4, oneClickBuy: false},
						{id: 6, tool_id: 1, kind: "range_classic", invest: 20, timeframe: 4, oneClickBuy: false}
					];

				}
			}
			var consoles_ls;
			if (view.user.user_data == null) {
				view.user.user_data = user_data_default
			}

			if (view.user.user_data.consoles != null && view.user.user_data.consoles.length > 0) {
				consoles_ls = view.user.user_data.consoles;
			} else {
				if (!isLocalstorageAvailable()) {
					if (localData.consoles != null && localData.consoles.length > 290 && Jp(localData.consoles)) {
						consoles_ls = Jp(localData.consoles);
					} else {
						consoles_ls = consoles_ls_default;
					}
				} else {
					if (localStorage.consoles != null && localStorage.consoles.length > 290 && Jp(localStorage.consoles)) {
						consoles_ls = Jp(localStorage.consoles);
					} else {
						consoles_ls = consoles_ls_default;
					}
				}
			}

			if (consoles_ls.length < 6 || user.isGuest()) {
				consoles_ls = consoles_ls_default;
			}

			var user_data = view.user.user_data;

			disclaimer = view.user.user_data.disclaimer;

			if (user_data.widgets == null) {
				user_data.widgets = js_params.default_widgets;
			}

			if (!isLocalstorageAvailable()) {
				localData.user_data = Js(user_data);
			} else {
				localStorage.user_data = Js(user_data);
			}

			this.pauseRender = true;
			for (var i in user_data.starredTools) {
				this.starredTools.add({tool_id: user_data.starredTools[i]});
			}
			this.pauseRender = false;


			if (partner_params.showWidgets == true) {
				if (view.user.isGuest()) {
					user_data = user_data_default;
				}
				if (user_data != null && user_data.widgets != null) {

					if (user_data.widgets.length > 0) {
						//(["[show]",user_data]);
						view.addAllWidgets(user_data);
					}

				} else {
					//user_data
				}
			}

			if (js_params.reset_consoles == "true" || consoles_ls.length <= 0) {
				consoles_ls = consoles_ls_default;
			}

			//language = localStorage.language || language;
			view.consoles.reset();

			if (js_params.isTradePage === undefined || js_params.isTradePage == true || js_params.isTradePage == "true") {
				var consolesIdWithoutAddWindows = [],
					consolesKindWithAddWindows = [],
					kinds = [];

				for (var j = consoles_ls.length - 1; j >= 0; j--) {
					if (consolesKindWithAddWindows.indexOf(consoles_ls[j].kind) != -1) {
						consolesIdWithoutAddWindows.push(j);
					} else {
						consolesKindWithAddWindows.push(consoles_ls[j].kind);
					}
				}


				for (var i in consoles_ls) {
					view.consoles.add({
						id: parseInt(consoles_ls[i].id),
						tool: get_tool(parseInt(consoles_ls[i].tool_id)),
						kind: consoles_ls[i].kind,
						timeframe: consoles_ls[i].timeframe,
						invest: consoles_ls[i].invest,
						oneClickBuy: consoles_ls[i].oneClickBuy == true,
						invest_ok: true,
						hideAddWindow: consolesIdWithoutAddWindows.indexOf(parseInt(i)) != -1
					});
				}

			}

			//(user_data.kind);
			try {
				$(view.el).find(".b_options_types_item[data-kind={1}]".replace("{1}", user_data.kind)).trigger("click");
			} catch (e) {
				log(e);
			}
			// $(view.el).find(".bin_options_type[data-kind={1}]".replace("{1}", user_data.kind)).trigger("click");
			$(view.el).find(".dropdown.chooseKind").removeClass('show');
			view.user.accept_autochartist = user_data.accept_autochartist;

			_(view.consoles.models).each(function (item) {
				item.setToolTypes(item.getToolTypes());
			});


			setTimeout(function () {
				view.updateWidgetSelectors();
			}, 1000);


			view.updateSettingsSelectors();

		},


		appendOpenedOption: function (item) {

			subscribeWSS(wss_conn, item.get("tool").tool_id);

			if (global_console_last_buy_id != 0) {
				var console1 = view.consoles.get(global_console_last_buy_id);
				if (console1.get("oneClickBuy")) {
					var bin_buy_default_txt = $('#messages .bin_buy_default_oneclick_txt').text();
					var buy_btn = console1.el.find(".console__one_click__text");
				} else {
					var bin_buy_default_txt = $('#messages .bin_buy_default_txt').text();
					var buy_btn = console1.bin_buy;
				}

				if (typeof (bin_buy_success_txt_timeout) != "undefined") {
					clearTimeout(bin_buy_success_txt_timeout);
				}

				var bin_buy_success_txt = $('#messages .bin_buy_hidden_msg').text();
				var bin_buy_success_txt_show_time = 2000;


				if (change_buy_button_after_buy) {

					if (js_params.p == "7") {

						console1.el.find(".buy__popup").addClass("visible");

						setTimeout(function () {
							console1.el.find(".buy__popup").removeClass("visible");
						}, 1000)

					} else if (js_params.p == "12") {
						console1.el.find(".successMsg").addClass('show');

						setTimeout(function () {
							console1.el.find(".successMsg").removeClass('show');
						}, 2000)
					} else {
						buy_btn.transition({rotateX: 90}, 200, function () {
							buy_btn.text(bin_buy_success_txt).addClass('bin_btn_turned').transition({rotateX: 0}, 200, function () {
								bin_buy_success_txt_timeout = setTimeout(function () {
									buy_btn.transition({rotateX: 90}, 200, function () {
										buy_btn.text(bin_buy_default_txt).removeClass('bin_btn_turned').transition({rotateX: 0}, 200);
									});
								}, bin_buy_success_txt_show_time);
							});
						});
						console1.showBuyButtonMessage(view.messages.find(".option_opened").html());
					}
				}

			}

			if (item.get("kind") == view.option_kinds.getIdByName("touch")) {
				var special_params = (item.get("special_params"));

				if (item.get("direction") == "UP") {
					var line1 = parseFloat(item.get("course")) + parseFloat(special_params.up_delta);
					var line2 = null;
				} else if (item.get("direction") == "DOWN") {
					var line1 = null;
					var line2 = parseFloat(item.get("course")) - parseFloat(special_params.down_delta);
				} else {
					var line1 = parseFloat(item.get("course")) + parseFloat(special_params.updown_delta_up);
					var line2 = parseFloat(item.get("course")) - parseFloat(special_params.updown_delta_down);
				}
			}

			var targetLines = ((line1 != null) ? line1.toFixed(5) : "") + ((line1 != null && line2 != null) ? " / " : "") + ((line2 != null) ? line2.toFixed(5) : "");

			if (item == null) {
				return;
			}

			var body = $("#opened-option").html();


			var direction_text = "";


			switch (item.get("kind").toString()) {
				case "1":
					direction_text = "classic";
					break;

				case "2":
				case "4":
					direction_text = "touch";
					break;

				case "3":
				case "5":
					direction_text = "range";
					break;
				case "6":
					direction_text = "range_classic";
					break;
			}


			direction_text += "_" + item.get("direction").toLowerCase();

			var direction_text_1 = direction_text;
			direction_text = $("#messages ." + direction_text.replace("/", "")).text();


			item.set("early", common.getEarlyPercent(item.get("kind") + "-" + item.get("tool").tool_id + "-" + item.get("timeframe")));


			var params = {
				option_id: item.get("option_id"),
				id: item.get("id"),
				direction_text: direction_text,
				hash: item.get("hash"),
				timeframe: item.get("timeframe"),
				timeframe_name: timeframes[item.get("timeframe")] || "",
				tool_name: item.get("tool").tool_view_name,
				start_time: common.UTS2Time(item.get("start_time") * 1000),
				expiration: common.UTS2Time(item.get("expiration") * 1000),
				expiration_date: common.UTS2Date(item.get("expiration") * 1000),
				invest: intellectRound(item.get("invest"), true),
				forecast: item.getForecast(),
				direction: item.get("direction").replace('/', ''),
				direction_tb: (item.get("direction")).replace("/", "").replace("UPDOWN", "TOP BOTTOM").replace("UP", "TOP").replace("DOWN", "BOTTOM"),
				direction_call_put: (item.get("direction") == "CALL" || item.get("direction") == "IN" || item.get("direction") == "UP" || item.get("direction") == "TOUCHUP") ? "call" : "put",
				direction_call_put2: "bin_open_option__" + (item.get("direction")).toLowerCase().replace("/", ""),
				direction_call_put3: (item.get("direction")).toLowerCase().replace("/", "").replace("updown", "up down").replace("up", "top").replace("down", "bottom"),
				direction_call_put4: "bin_kind" + item.get("kind"),
				course: parseFloat(item.get("course").toFixed(item.get("tool").decimal_count)),
				currency: currency,
				payment_win: intellectRound(item.get("payment_win")),
				payment_lose: intellectRound(item.get("payment_lose")),
				percent_win: intellectRound(item.get("payment_win") / item.get("invest") * 100 - 100),
				payment_win2: intellectRound((item.get("payment_win") / item.get("invest") * 100) / 100 * item.get("invest"), true),

				percent_lose: intellectRound(item.get("payment_lose") / item.get("invest") * 100),
				target_course: item.get("kind") == view.option_kinds.getIdByName("touch") || item.get("kind") == view.option_kinds.getIdByName("touch_advanced") ? targetLines : "",
				kind_id: item.get("kind")

			};
			if ($(obj_opened_options)[0] != null) {
				if (partner_params.optionBehavior == "standart") {
					$(obj_opened_options).prepend(Mustache.render(body, params));
				} else if (partner_params.optionBehavior == "table") {
					$(Mustache.render(body, params)).insertAfter($(obj_opened_options).eq(0));
				}
				item.el = $("#opened-" + item.id);
				item.el.find(".pw").text(parseFloat(item.el.find(".pw")[0].innerHTML) + parseFloat((percent_win_add_100 ? 100 : 0)));

				if ($("#bin_open_options_common_headers .bin_open_options__switcher").hasClass("open")) {
					item.el.find(".bin_open_option__head").trigger("click");
				}

				item.el.find(".bin_console_main_block__graph_block .graph-mark").hide();

				item.win = function (course, direction, last_value) {
					if (direction == "CALL") {
						return last_value > course;
					} else {
						return last_value < course;
					}
				}
				l100n.localize_page("binary", language);
				item.open_options_bar_body_rate_num = item.el.find(".open_options_bar_body_rate_num");
				item.bin_open_option__info__values = item.el.find(".bin_open_option__info__values.cource");

				chart.drawOpened(item);

				item.early_percent_value = item.el.find(".early_percent_value");
				item.early_percent_sum_value = item.el.find(".early_percent_sum_value");
				item.sell_now = item.el.find(".sell_now_button");

				item.payout = item.el.find(".opened_payout");
			} else {
				setTimeout(function () {

					$(obj_opened_options).prepend(Mustache.render(body, params));

					item.el = $("#opened-" + item.id);


					if ($("#bin_open_options_common_headers .bin_open_options__switcher").hasClass("open")) {
						item.el.find(".bin_open_option__head").trigger("click");
					}

					item.el.find(".bin_console_main_block__graph_block .graph-mark").hide();

					item.win = function (course, direction, last_value) {
						if (direction == "CALL") {
							return last_value > course;
						} else {
							return last_value < course;
						}
					}
					l100n.localize_page("binary", language);
					item.open_options_bar_body_rate_num = item.el.find(".open_options_bar_body_rate_num");
					item.bin_open_option__info__values = item.el.find(".bin_open_option__info__values.cource");
					chart.drawOpened(item);

					item.early_percent_value = item.el.find(".early_percent_value");
					item.early_percent_sum_value = item.el.find(".early_percent_sum_value");
					item.sell_now = item.el.find(".sell_now_button");

					item.payout = item.el.find(".opened_payout");


				}, 100);

			}

			//	init simpleTip
			$('.option_tipped').simpleTip();
			view.addOptionToWidgetOpenedOptions(params);
			/*setTimeout(function () {
			 var added = _.some(view.getWidgets(), function (el) {
			 return el.name === "opened_options";
			 });

			 if (added) {

			 view.addOptionToWidgetOpenedOptions(params);
			 }
			 params = null;
			 }, 1000);*/

		},
		addOptionToWidgetOpenedOptions: function (params) {
			var template = $("#opened-option").html();
			var html = Mustache.render(template, params);

			$(".open_options_bar.dealsTable").prepend(html);

		},
		removeOptionFromWidgetOpenedOptions: function (hash) {
			var elWidget = $("#opened-" + hash);
			if (elWidget[0] != null) {
				elWidget.remove();
			}
		},
		removeOpenedOption: function (id) {
			if (this.opened_options.length > 1) {
				this.opened_options.remove(id);
				$(e.target).parents(".open_options_bar").remove();
			}
		},
		getNewIdOption: function () {
			var max = 0;
			_(this.opened_options.models).each(function (item) {
				if (item.id > max) {
					max = item.id;
				}
			}, this);
			return max + 1;
		},
		getOptionByHash: function (hash) {
			var max = 0;
			var found_item = null;
			_(this.opened_options.models).each(function (item) {
				if (item.get("hash") === hash) {
					found_item = item;
				}
			}, this);
			return found_item;
		},
		toggleOption: function (e) {
			var $target = $(e.target),
				$open_options_bar = $target.parents(open_options_bar),
				id = $open_options_bar.attr("data-id"),
				data = $target.attr("data-value"),
				item = this.opened_options.get(id);


			if ($target.parents("#journal_options_bars")[0] != null) return;

			if (item != null) {
				item.changeParam("toggle-option", data);
			} else {
				$open_options_bar.toggleClass("mini");

				if ($open_options_bar.hasClass("mini")) {
					$open_options_bar.find(".graph-mark").hide();
					$open_options_bar.removeClass("open");
				} else {
					$open_options_bar.addClass("open");
				}


			}
		},
		toggleAllOptions: function (e) {
			var $target = $(e.target);

			if ($(".opened-tab[data-tab='journal']")[0] != null
				&& $(".opened-tab[data-tab='journal'].active")[0] != null
			) {
				return;
			}

			var all_is_opened = $target.hasClass("open");

			if (all_is_opened == true) {
				$(option_block).each(function (key, item) {
					$(item).removeClass("mini").addClass("open");
				});
			} else {
				$(option_block).each(function (key, item) {
					$(item).addClass("mini").removeClass("open");
				});
			}
			$target.toggleClass("open");


		},
		setOpenedTab: function (e) {

			$('#main-container .deals-tabs .pull-right').css('display', 'none');
			var $target = $(e.target);
			$(".opened-tab").each(function () {
				$(this).removeClass("active");
			});
			$(".opened-tab-set").each(function () {
				$(this).removeClass("active");
			});
			$(".w_content .opened-tab").each(function () {
				$(this).addClass("hidden_tab");
			});

			$target.addClass("active").removeClass("hidden_tab");

			$(".options_block_hider").addClass("hidden_tab");
			$(".journal_options_block_hider").addClass("hidden_tab");
			$(".closed_options_block_hider").addClass("hidden_tab");
			try {
				$("#closed-pages-container").addClass("hidden_tab");
			} catch (e) {
			}
			try {
				$("#history-pages-container").addClass("hidden_tab");
			} catch (e) {
			}
			try {
				$(".history_block_hider").addClass("hidden_tab");
			} catch (e) {
			}

			switch ($target.attr("data-tab")) {
				case "opened":
					$(".options_block_hider").removeClass("hidden_tab");
					break;

				case "journal":
					$('#main-container .deals-tabs .pull-right').css('display', 'block');
					if (view.user.isGuest()) {
						//bw_alert("only for users");
						return;
					}

					try {
						$("#closed-pages-container").removeClass("hidden_tab");
					} catch (e) {
					}
					option.getClosedBinaryOptionsWss();
					$(".journal_options_block_hider").removeClass("hidden_tab");
					break;

				case "closed":
					$(".closed_options_block_hider").removeClass("hidden_tab");
					break;


				case "history":
					if (view.user.isGuest()) {
						//bw_alert("only for users");
						return;
					}

					try {
						$("#history-pages-container").removeClass("hidden_tab");
					} catch (e) {
					}

					option.getHistoryBinaryOptionsWss();
					$(".history_block_hider").removeClass("hidden_tab");
					break;
			}


		},


		submitLoginForm: function () {
			this.actionLogin($(this.el).find('.login-username').val(), $(this.el).find('.login-password').val());
		},
		actionLogin: function (username, password) {
			var result = false;

			var checkInterval;
			if (typeof (WebSocket) == "undefined") {
				bw_alert("use new web browser, or install flash player");
				return;
			}
			var check_login = new WebSocket(js_params.wss_url);

			check_login.onopen = function () {

				check_login.send('{"command":"connect","bo":"{bo}","email":"{username}","password":"{password}","platform":"mt4","source":"site"}'
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{username}", username)
					.replace("{password}", password)
				);
			};

			check_login.onmessage = function (e) {
				var data = JSON.parse(e.data);
				result = data.connect === "success";
				if (result === true) {
					view.user.username = username;
					view.user.password = password;
					if (view.user.isGuest()) {
						view.user.setDeposit(1000);
					}
					location.href = location.href.split("#")[0] + "#binary";
				} else {
					bw_alert("login_error");
				}
				check_login.close();
			};
		},
		binSelectableClick: function (e) {

			var $target = $(e.target);
			if ($target.closest('.bin_selectable').hasClass('open')) {
				$target.closest('.bin_selectable').removeClass('open').find('.bin_console_prechoose_bar__dropdown').stop(true, true).slideUp(200);
			} else {

				if (js_params.partner == "3") {
					view.closeAllDropdowns();
				}
				$target.closest('.bin_selectable').addClass('open').find('.bin_console_prechoose_bar__dropdown').stop(true, true).slideDown(200);
			}

			$target.parents(".bin_console_actions_holder").find('.bin_scroll').each(function (key, elem) {
				if (!$(elem).parent().hasClass("slimScrollDiv")) {
					$(elem).slimScroll({destroy: true}).slimScroll({
						width: '100%',
						height: '100%',
						size: '4px',
						position: 'right',
						color: '#000',
						opacity:0.8,
						railColor: '#233847',
						railOpacity: 0.8,
						alwaysVisible: false,
						distance: '0px',
						start: 'top',
						railVisible: false,
						wheelStep: 10,
						allowPageScroll: false,
						disableFadeOut: false
					});
				}
			});

		},
		closeAllDropdowns: function (e) {

			$('.bin_selectable').each(function (key, target) {
				$(target).removeClass('open').find('.bin_console_prechoose_bar__dropdown').stop(true, true).slideUp(200);
			});

			$('.b_list_holder  ').each(function (key, target) {
				$(target).removeClass('visible');
			});

			try {
				$('.al_assets__item__value__dropdown').each(function (key, target) {
					$(target).removeClass('open');
				});
			} catch (e) {
			}

			$(".b_graph_block_overlay").each(function (key, elem) {
				$(elem).show()
			});


		}
	});


	var OptionKind = Backbone.Model.extend({});


	var Department = Backbone.Model.extend({
		name: "",
		image: ""
	});


	var Widget = Backbone.Model.extend({
		name: "",
		defaultContainer: "#sort1",
		params: {}
	});
	var Widgets = Backbone.Collection.extend({
		model: Widget,
		containers: ["#sort1", "#sort2", "#sort3"]
	});


	var StarredTool = Backbone.Model.extend({
		tool: ""
	});
	var StarredTools = Backbone.Collection.extend({
		model: StarredTool
	});


	var User = Backbone.Model.extend({
		user_hash: s_userhash || "",
		user_type: "guest",
		username: s_username,
		accept_autochartist: 0,
		password: s_password,
		deposit: '-',
		credit: '-',
		availableAmount: '-',
		opened_count: '-',
		setDefault: function () {
			this.username = "" || "";
			this.password = "" || "";
		},
		setDeposit: function (v, cc, c, a) {

			if (cc == true) {
				if (a == "true") {
					v = parseFloat(v) - parseFloat(c);
				} else {
					$(".user-credit-value").text("0.00");
				}
			}

			if (parseFloat(v) < 0) {
				v = 0;
			}
			this.deposit = v;

			view.user.deposit = v;

			_(view.consoles.models).each(function (elem) {
				elem.updateInvestDataset();
			});

			/**
			 if ($("#user-deposit-value")[0] != null) {
            $("#user-deposit-value").text(intellectRound(v));
        }
			 */

			if (partner_params.formatDep) {
				$(deposit_value_el).text(money(v));
			} else {
				$(deposit_value_el).text(parseFloat(v.toString()).toFixed(2));
			}

		},
		setBonus: function (v) {
			if (parseFloat(v) < 0) {
				v = 0;
			}
			this.bonus = v;

			view.user.bonus = v;

			if ($("#user-bonus-value")[0] != null) {
				$("#user-bonus-value").text(intellectRound(v));
			}
		},
		setCredit: function (v) {

			if (parseFloat(v) < 0) {
				v = 0;
			}
			this.credit = v;

			view.user.credit = v;

			if (partner_params.formatDep) {
				$(credit_value_el).text(money(v));
			} else {
				$(credit_value_el).text(parseFloat(v.toString()).toFixed(2));
			}
		},
		setAvailableAmount: function (v) {
			if (parseFloat(v) < 0) {
				v = 0;
			}
			this.availableAmount = v;

			view.user.availableAmount = v;

			if (partner_params.formatDep) {
				$(available_value_el).text(money(v));
			} else {
				$(available_value_el).text(parseFloat(v.toString()).toFixed(2));
			}
		},
		getDeposit: function () {
			if ($("#bin_balance .balance")[0] != null) {
				return parseFloat($("#bin_balance .balance").text().replace(/ /g, ""));
			} else {
				return parseFloat($(".user-deposit-value").eq(1).text().replace(/ /g, ""));
			}
		},

		setOpenedCount: function (v) {
			if (v == "-") {
				v = 0;
			}
			view.user.opened_count = v;
			$(options_count_value).text(v);
			if (running_profit_block != "") {
				if (parseInt(v) > 0) {
					$(running_profit_block).show();
				} else {
					$(running_profit_block).hide();
				}
			}


		},
		isGuest: function () {
			return !!(this.username == "guest" || this.username == "a30@ya.ru" && this.user_hash == "");
		}

	});

	var user = new User();


	var Console = Backbone.Model.extend({
		tooltipChartJS: function (tooltip) {
			var graph = this,
				canvas = $("#canvas-" + graph.get("id")).get(0),
				ctx = canvas.getContext("2d"),
				lastId = graph.plot.datasets[0].points.length - 1;

			var tooltipEl = graph.el.find('.chartjs-tooltip');
			var len = graph.plot.datasets[0].points;

			//while (len > 0) {
			//    len--;
			//}
			if (!tooltip) {
				tooltipEl.css({
					opacity: 0
				});
				graph.el.find(".hover_crosshair_hor").hide();
				graph.el.find(".hover_crosshair_ver").hide();
				return;
			}

			tooltipEl.removeClass('above below');
			tooltipEl.addClass(tooltip.yAlign);
			var text = tooltip.title + " : " + tooltip.labels[0];

			tooltipEl.html(text);

			tooltipEl.css({
				opacity: 1,
				left: tooltip.chart.canvas.offsetLeft + tooltip.x + 45 + 'px',
				top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px'
			});

			len = graph.plot.scale.xLabels.length;
			var index = 0;
			while (len > 0) {
				len--;
				if (tooltip.title == graph.plot.scale.xLabels[len]) {
					index = len;
				}
			}

			if (graph.plot.datasets[0].points[index] == null) {
//tooltipEl.html(tooltip.title);
				tooltipEl.css({
					opacity: 0
				});
				graph.el.find(".hover_crosshair_hor").hide();
				graph.el.find(".hover_crosshair_ver").hide();
				return;
			}

			if (Chart == null || Chart.useRightScale == null || Chart.useRightScale == false) {
				graph.el.find(".hover_crosshair_ver").show().css({left: graph.plot.datasets[0].points[index].x + graph.plot.datasets[0].points[0].x - graph.plot.scale.yLabelWidth + 0.36});
				graph.el.find(".hover_crosshair_hor").show().css({
					width: 514,
					left: 63,
					top: graph.plot.datasets[0].points[index].y
				});
			}

			ctx.beginPath();
			ctx.arc(graph.plot.datasets[0].points[index].x, graph.plot.datasets[0].points[index].y, 3, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#0289cc';
			ctx.fill();

			lastId = null;
			ctx = null;
			canvas = null;
			tooltipEl = null;
			len = null;
			graph = null;
		},
		fillDirectionsChartJS: function () {
			var graph = this,
				canvas = $("#canvas-" + graph.get("id")).get(0),
				ctx = canvas.getContext("2d"),
				lastId = graph.plot.datasets[0].points.length - 1;


			if (graph.get("kind") == "range") {

				if (graph.get("direction") == "IN") {
					if (graph.get("addLineUp1") && graph.get("addLineUp2")) {
						ctx.fillStyle = color_green;
						ctx.fillRect(graph.plot.datasets[2].points[0].x, graph.plot.datasets[2].points[0].y, graph.plot.datasets[3].points[lastId].x - graph.plot.datasets[2].points[0].x, graph.plot.datasets[3].points[0].y - graph.plot.datasets[2].points[0].y);
					}
				} else if (graph.get("direction") == "OUT") {
					ctx.fillStyle = color_red;
					ctx.fillRect(graph.plot.datasets[2].points[0].x, 0, graph.plot.datasets[2].points[lastId].x - graph.plot.datasets[2].points[0].x, graph.plot.datasets[2].points[0].y);

					ctx.fillStyle = color_red;
					ctx.fillRect(graph.plot.datasets[2].points[0].x, graph.plot.datasets[3].points[0].y, graph.plot.datasets[2].points[lastId].x - graph.plot.datasets[2].points[0].x, graph.plot.scale.endPoint - graph.plot.datasets[3].points[0].y);

				}

			}

			if (graph.get("kind") == "range_classic") {

				if (graph.get("direction") == "CALL") {
					if (graph.get("addLineUp1")) {
						ctx.fillStyle = color_green;
						ctx.fillRect(graph.plot.datasets[2].points[0].x, 0, graph.plot.datasets[2].points[lastId].x - graph.plot.datasets[2].points[0].x, graph.plot.datasets[2].points[0].y);
					}
				} else if (graph.get("direction") == "PUT") {
					if (graph.get("addLineUp2")) {
						ctx.fillStyle = color_red;
						ctx.fillRect(graph.plot.datasets[2].points[0].x, graph.plot.datasets[2].points[0].y, graph.plot.datasets[2].points[lastId].x - graph.plot.datasets[2].points[0].x, graph.plot.scale.endPoint - graph.plot.datasets[2].points[0].y);
					}
				}

			}
			lastId = null;
			ctx = null;
			canvas = null;
			graph = null;
		},
		setFixedDirection: function () {
			partner_params.fixedDirectionRange = null;
			if (this.get("kind") == "range" && partner_params.fixedDirectionRange != null) {
				this.changeParam("set-direction", partner_params.fixedDirectionRange);

			}
		},
		updateStarredStatus: function () {

			var $elem = $("#console-" + this.get("id") + " ." + instrument_filter_item + "[data-type='starred']");

			if ($elem[0] != null) {

				if (view.starredTools.models.length == 0) {
					$elem.addClass("empty");
				} else {
					$elem.removeClass("empty");
				}
			}

			$elem = null;
		},
		updateInvestDataset: function () {
			var el1 = this.el.find(".b_invest_select_name");
			if (el1[0] != null) {

				if (parseFloat(view.user.deposit) > 0) {
					el1.attr("id", "b_invest_select_name-" + this.get("id"));
				} else {
					el1.attr("id", "InvestDataset" + this.get("id"));
				}
			}
		},
		updateDirectionClass: function () {
			this.el.removeClass("call").removeClass("put");

			switch (this.get("direction")) {
				case "CALL":
				case "TOUCHUP":
				case "IN":
					this.el.addClass("call");
					break;
				case "PUT":
				case "TOUCHDOWN":
				case "OUT":
					this.el.addClass("put");
					break;
			}
		},
		updateTickDir: function () {
			this.el.removeClass("tickup").removeClass("tickdown").removeClass("tickequal");

			switch (this.get("tickdir")) {
				case "up":
					this.el.addClass("tickup");
					break;
				case "down":
					this.el.addClass("tickdown");
					break;
				case "equal":
					this.el.addClass("tickequal");
					break;
			}
		},
		updateScheduleTimer: function () {
			if (this.scheduleTimer != null) {
				var scheduleTimerCurrent = common.getStartDate(this.get("tool").tool_id);
				if (scheduleTimerCurrent.result == 0) {
					this.el.removeClass("schedule-closed");
					this.scheduleTimer.parent().hide();
				} else {
					this.scheduleTimer.text(scheduleTimerCurrent.result_human);
					this.el.addClass("schedule-closed");
					this.scheduleTimer.parent().show();
				}
				scheduleTimerCurrent = null;

			}
		},
		updateOneClickBuy: function () {
			if (this.get("oneClickBuy")) {
				this.el.find(".console__one_click").addClass("active");
			} else {
				this.el.find(".console__one_click").removeClass("active");
			}
		},
		updateTimeframe: function () {
			if (tools != null) {
				var len = tools.length, id, kind_id = view.option_kinds.getIdByName(this.get("kind"));
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						id = kind_id + "-" + tools[i].tool_id + "-" + this.get("timeframe");

						if (cache_tool_tf_display[id] != null) {
							if (cache_tool_tf_display[id].enable == "false") {
								chart.hideTool1(tools[i].tool_id, kind_id);
							} else {
								chart.showTool1(tools[i].tool_id, kind_id);
							}
						} else {
							chart.showTool1(tools[i].tool_id, kind_id);
						}
					}
				}
			}

		},

		openRequoteModal: function () {
			if (this.modal_requote_popup != null) {
				this.modal_requote_popup.css({
					scale: .5,
					display: 'block',
					zIndex: 4,
					visibility: "visible"
				}).stop(1, 1).transition({scale: 1, opacity: 1}, 200);
				this.modal_requote_popup.find(".requote_price").text(global_requote_price);
				this.modal_requote_popup.find(".timer").text("0:05");

				this.$time = this.modal_requote_popup.find(".timer");
				this.count = 5;

				this.counter();
			}
		},

		closeRequoteModal: function () {
			try {
				if (this.modal_requote_popup != null && this.modal_requote_popup.transition != null) {
					this.modal_requote_popup.stop(1, 1).transition({scale: .5, opacity: 0, zIndex: 0}, 200);
				}
			} catch (e) {
				//(["closeRequoteModal",e])
			}
		},

		closeRequotePopup: function () {
			try {
				$(this.el).find('.requote.show').removeClass('show');
			} catch (e) {

			}
		},

		candlise_data: function (corrected_data, count) {

			var candle_data = [],
				count = count || 6,
				to_slice,
				len_corrected_data = corrected_data.length;

			for (var i = 0; i < len_corrected_data; i++) {
				if (common.UTS2Time(corrected_data[i][0]).substr(-4, 4) == "0:00") {
					to_slice = i;
					break;
				}
			}
			//выровнять по минутам
			corrected_data = corrected_data.slice(to_slice);
			var interval_len = corrected_data.length / count,
				part_arrays = [],
				array_number = 0, array_counter = 0, normal_time, len = corrected_data.length;
			var barEnd = 0, barLenght = 300000;

			for (var i = 0; i < len; i++) {
				normal_time = common.UTS2Time(corrected_data[i][0]);

				if (array_counter == 0
					&&
					(barEnd == 0 && (normal_time.substr(-3, 3) == ":00" && len < 2000 || (normal_time.substr(-4, 4) == "0:00" || normal_time.substr(-4, 4) == "5:00") && len >= 2000 )
						||
						(barEnd > 0 && barEnd <= corrected_data[i][0])
					)
				) {
					array_counter = 1;
					barEnd = corrected_data[i][0] + barLenght;

					while (common.UTS2Time(barEnd).substr(-3, 3) != ":00" && barEnd > 0) {
						barEnd -= 1000;
					}

					//([barEnd,UTS2Time(corrected_data[i][0]),UTS2Time(barEnd)]);
					array_number++
				}
				//([normal_time,corrected_data[i][1],array_number]);


				corrected_data[i].array_number = array_number;
				if (typeof (part_arrays[array_number]) == "undefined") {
					part_arrays[array_number] = [];

				}
				if (part_arrays[array_number].length == 0) {
					while (common.UTS2Time(corrected_data[i][0]).substr(-3, 3) != ":00" && barEnd > 0) {
						corrected_data[i][0] -= 1000;
					}
				}

				part_arrays[array_number].push(corrected_data[i]);

				array_counter = 0;
			}


			//(part_arrays);
			var min = 0, max = 0, open = 0, close = 0, len_part_arrays = part_arrays.length, d, decimalsCount = parseFloat(this.get("tool").decimal_count);

			for (var i in part_arrays) {
				min = part_arrays[i][0][1];
				max = part_arrays[i][0][1];
				open = part_arrays[i][0][1];
				close = part_arrays[i][part_arrays[i].length - 1][1];

				for (var j in part_arrays[i]) {
					min = min < part_arrays[i][j][1] ? min : part_arrays[i][j][1];
					max = max > part_arrays[i][j][1] ? max : part_arrays[i][j][1];
				}

				d = new Date(part_arrays[i][0][0]);
				d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

				candle_data.push([

					d,
					//UTS2TimeHM(part_arrays[i][0][0]),
					parseFloat(min.toFixed(decimalsCount)),
					parseFloat(open.toFixed(decimalsCount)),
					parseFloat(close.toFixed(decimalsCount)),
					parseFloat(max.toFixed(decimalsCount)), "O:" + open.toFixed(decimalsCount) + " \nH:" + max.toFixed(decimalsCount) + " \nL:" + min.toFixed(decimalsCount) + " \nC:" + close.toFixed(decimalsCount), parseFloat(this.get("addLineUp1")), parseFloat(this.get("addLineUp1")).toFixed(decimalsCount), parseFloat(this.get("addLineUp2")), parseFloat(this.get("addLineUp1")).toFixed(decimalsCount), parseFloat(this.get("addLineUp3")), parseFloat(this.get("addLineUp1")).toFixed(decimalsCount), parseFloat(this.get("addLineUp4")), parseFloat(this.get("addLineUp1")).toFixed(decimalsCount)

				]);
			}
			//(candle_data);
			if (array_number < 5) {
				//this.set("candle",false);
				//chart.drawConsole(this);
			}

			d = null;
			barEnd = null;
			count = null;
			barLenght = null;
			to_slice = null;
			len_corrected_data = null;
			interval_len = null;
			part_arrays = null;
			array_number = null;
			array_counter = null;
			normal_time = null;
			len = null;
			min = null;
			max = null;
			open = null;
			close = null;
			len_part_arrays = null;

			return candle_data;
		},

		prepare: function () {
			if (this.get("prepared") == null) {
				if (!chart.isVisible(this) || this.get("first_draw") == null || this.get("kind") != view.kind) {
					$(this.el).addClass("loading");
					this.set("first_draw", true);
					return;
				} else {
					$(this.el).removeClass("loading");
				}

				if (this.get("kind") == "classic") {
					$(this.el).find(".bin_console_main_block__graph_block .graph-mark").hide();
				} else {
					$(this.el).find(".bin_console_main_block__graph_block .graph-mark").show();
				}

				this.set("use_one_tunnel", (this.get("kind") == "range"));
				//range update here
				this.set("range_classic", (this.get("kind") == "range"));
				this.set("prepared", true);
			}
		},


		getAdditionalLines: function () {


			var data = this.get("data");
			if (data.length == 0) {
				return;
			}
			var last_point = data[data.length - 1][1];
			var add_line1 = true;
			var add_line2 = true;
			var minVal = this.get("min");
			var maxVal = this.get("max");
			var points = this.get("points");

			var color_fill1 = this.get("color_fill1");
			var color_fill2 = this.get("color_fill2");
			var color_fill3 = this.get("color_fill3");
			var color_fill4 = this.get("color_fill4");

			if (this.get("kind") == "touch" || this.get("kind") == "touch_advanced") {


				if (this.get("direction") == "TOUCHUP") {
					add_line2 = false;
					this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("up_delta")));
				}
				if (this.get("direction") == "TOUCHDOWN") {
					add_line1 = false;
					this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("down_delta")));
				}

				if (this.get("direction") == "TOUCHUPDOWN" || this.get("direction") == "TOUCH" || this.get("direction") == null) {
					if (this.get("kind") == "touch_advanced") {
						this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("updown_delta_up")));
						this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("updown_delta_down")));
					} else {
						this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("up_delta")));
						this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("down_delta")));
					}
				}


				if (add_line1) {
//                this.set("addLineUp1", data[data.length - 1][1] + 100 * points);
					if (real_margin_lines) {
						this.set("addLineUp1m", this.get("addLineUp1"));
					} else {
						this.set("addLineUp1m", this.get("addLineUp1") > maxVal ? maxVal + 2 * points : this.get("addLineUp1"));
					}

//            maxVal = this.get("addLineUp1") > maxVal ? this.get("addLineUp1") : maxVal;
//            minVal = this.get("addLineUp1") < minVal ? this.get("addLineUp1") : minVal;

				} else {
					this.set("addLineUp1", null);
					this.set("addLineUp1m", null);
				}

				if (add_line2) {
//                this.set("addLineUp2", data[data.length - 1][1] - 100 * points);
//                this.set("addLineUp2m", this.get("addLineUp2") < minVal ? minVal - 2 * points : this.get("addLineUp2"));
//                this.set("addLineUp2m", this.get("addLineUp2"));
					if (real_margin_lines) {
						this.set("addLineUp2m", this.get("addLineUp2"));
					} else {
						this.set("addLineUp2m", this.get("addLineUp2") < minVal ? minVal - 2 * points : this.get("addLineUp2"));
					}


//            maxVal = this.get("addLineUp2") > maxVal ? this.get("addLineUp2") : maxVal;
//            minVal = this.get("addLineUp2") < minVal ? this.get("addLineUp2") : minVal;
				} else {
					this.set("addLineUp2", null);
					this.set("addLineUp2m", null);

				}

				if (real_margin_lines) {
					minVal = this.get("addLineUp1") < minVal && this.get("addLineUp1") != null ? this.get("addLineUp1") : minVal;
					minVal = this.get("addLineUp2") < minVal && this.get("addLineUp2") != null ? this.get("addLineUp2") : minVal;

					maxVal = this.get("addLineUp1") > maxVal && this.get("addLineUp1") != null ? this.get("addLineUp1") : maxVal;
					maxVal = this.get("addLineUp2") > maxVal && this.get("addLineUp2") != null ? this.get("addLineUp2") : maxVal;
				}


			} else if (this.get("kind") == "range" || this.get("kind") == "range_advanced") {

				this.set("fill_range", true);
				min_max_offset = 10;


				if (this.get("range_classic")) {
					color_fill1 = (this.get("direction") == "IN") ? color_green : color_red;
					color_fill2 = color_red;
					color_fill3 = color_red;
					color_fill4 = (this.get("direction") == "OUT") ? color_green : color_red;
				} else {
					color_fill1 = (this.get("direction") == "OUT") ? color_green : color_red;
					color_fill2 = (this.get("direction") == "OUT") ? color_red : color_green;
					color_fill3 = color_red;
					color_fill4 = (this.get("direction") == "OUT") ? color_green : color_red;
				}

				if (partner_params.fillOnlyChoosedDirection) {

					if (this.get("range_classic")) {
						color_fill1 = (this.get("direction") == "IN") ? color_green : color_transparent;
						color_fill2 = color_transparent;
						color_fill3 = color_transparent;
						color_fill4 = (this.get("direction") == "OUT") ? color_red : color_transparent;
					} else if (this.get("kind") == "range_advanced") {
						color_fill1 = (this.get("direction") == "OUT") ? color_red : color_transparent;
						color_fill2 = (this.get("direction") == "OUT") ? color_transparent : color_green;
						color_fill3 = color_transparent;
						color_fill4 = (this.get("direction") == "OUT") ? color_red : color_transparent;
					} else if (this.get("kind") == "range") {
						color_fill1 = (this.get("direction") == "OUT") ? color_red : color_transparent;
						color_fill2 = (this.get("direction") == "OUT") ? color_transparent : color_green;
						color_fill3 = color_red;
						color_fill4 = (this.get("direction") == "OUT") ? color_red : color_transparent;
					}
				}

				if (this.get("direction") == null) {
					color_fill1 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill2 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill3 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill4 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
				}


				if (this.get("kind") == "range") {

					this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("delta_top")));
					this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("delta_bottom")));

					this.set("addLineUp3", parseFloat(last_point) + parseFloat(this.get("delta_top")));
					this.set("addLineUp4", parseFloat(last_point) - parseFloat(this.get("delta_bottom")));

				} else {
					this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("delta_top_external")));
					this.set("addLineUp2", parseFloat(last_point) + parseFloat(this.get("delta_top_internal")));

					this.set("addLineUp3", parseFloat(last_point) - parseFloat(this.get("delta_bottom_external")));
					this.set("addLineUp4", parseFloat(last_point) - parseFloat(this.get("delta_bottom_internal")));
				}

				if (!real_margin_lines) {
					if (this.get("use_one_tunnel")) {
						this.set("addLineUp1m", this.get("addLineUp1") > maxVal ? maxVal + 10 * points : this.get("addLineUp1"));
						this.set("addLineUp2m", this.get("addLineUp2") < minVal ? minVal - 5 * points : this.get("addLineUp4"));
					} else {
						this.set("addLineUp1m", this.get("addLineUp1") > maxVal ? maxVal + 10 * points : this.get("addLineUp1"));
						this.set("addLineUp2m", this.get("addLineUp2") > maxVal ? maxVal + 5 * points : this.get("addLineUp2"));
						this.set("addLineUp3m", this.get("addLineUp3") < minVal ? minVal - 10 * points : this.get("addLineUp3"));
						this.set("addLineUp4m", this.get("addLineUp4") < minVal ? minVal - 5 * points : this.get("addLineUp4"));
					}
				} else {
					this.set("addLineUp1m", this.get("addLineUp1"));
					this.set("addLineUp2m", this.get("addLineUp2"));
					this.set("addLineUp3m", this.get("addLineUp3"));
					this.set("addLineUp4m", this.get("addLineUp4"));

					maxVal = this.get("addLineUp1") > maxVal ? this.get("addLineUp1") : maxVal;
					maxVal = this.get("addLineUp2") > maxVal ? this.get("addLineUp2") : maxVal;
					maxVal = this.get("addLineUp3") > maxVal ? this.get("addLineUp3") : maxVal;
					maxVal = this.get("addLineUp4") > maxVal ? this.get("addLineUp4") : maxVal;

					minVal = this.get("addLineUp1") < minVal ? this.get("addLineUp1") : minVal;
					minVal = this.get("addLineUp2") < minVal ? this.get("addLineUp2") : minVal;

					minVal = this.get("addLineUp3") < minVal ? this.get("addLineUp3") : minVal;
					minVal = this.get("addLineUp4") < minVal ? this.get("addLineUp4") : minVal;
				}

				color = graph_style.globalToolColorRange;

			} else if (this.get("kind") == "range_classic") {

				this.set("fill_range", true);
				this.set("use_one_tunnel", true);


				if (this.get("direction") == "CALL") {
					add_line2 = false;
					this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("delta_up")));

				} else if (this.get("direction") == "PUT") {
					add_line1 = false;
					this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("delta_down")));

					if (partner_params.fillOnlyChoosedDirection) {
						var color_fill2 = color_red;
						var color_fill3 = "rgba(0, 100, 0, 0)";
						var color_fill4 = "rgba(0, 100, 0, 0)";
					} else {
						var color_fill2 = color_green;
						var color_fill3 = "rgba(0, 100, 0, 0)";
						var color_fill4 = "rgba(0, 100, 0, 0)";
					}

				} else {
					this.set("addLineUp1", parseFloat(last_point) + parseFloat(this.get("delta_up")));
					this.set("addLineUp2", parseFloat(last_point) - parseFloat(this.get("delta_down")));


					var color_fill3 = color_green;
					var color_fill4 = color_green;

					color_fill1 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill2 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill3 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
					color_fill4 = {colors: ["rgba(100,100,100, 0)", "rgba(100,100,100, 0)", "rgba(100,100,100, 0)"]};
				}


				if (add_line1) {
					if (real_margin_lines) {
						this.set("addLineUp1m", this.get("addLineUp1"));
					} else {
						this.set("addLineUp1m", this.get("addLineUp1") > maxVal ? maxVal + 2 * points : this.get("addLineUp1"));
					}
				} else {
					this.set("addLineUp1", null);
					this.set("addLineUp1m", null);
				}

				if (add_line2) {
					if (real_margin_lines) {
						this.set("addLineUp2m", this.get("addLineUp2"));
					} else {
						this.set("addLineUp2m", this.get("addLineUp2") < minVal ? minVal - 2 * points : this.get("addLineUp2"));
					}
				} else {
					this.set("addLineUp2", null);
					this.set("addLineUp2m", null);

				}

				if (real_margin_lines) {
					minVal = this.get("addLineUp1") < minVal && this.get("addLineUp1") != null ? this.get("addLineUp1") : minVal;
					minVal = this.get("addLineUp2") < minVal && this.get("addLineUp2") != null ? this.get("addLineUp2") : minVal;

					maxVal = this.get("addLineUp1") > maxVal && this.get("addLineUp1") != null ? this.get("addLineUp1") : maxVal;
					maxVal = this.get("addLineUp2") > maxVal && this.get("addLineUp2") != null ? this.get("addLineUp2") : maxVal;
				}


			} else if (this.get("kind") == "classic") {

				if (partner_params.classicConsoleAreaFill) {
					this.set("fill_range", true);
					this.set("use_one_tunnel", true);

					var color_fill1;
					var color_fill4;

					if (this.get("direction") == "CALL") {
						this.set("addLineUp1", parseFloat(last_point));
						this.set("addLineUp2", parseFloat(last_point));

						color_fill1 = color_green;
						color_fill4 = color_red;

					} else if (this.get("direction") == "PUT") {
						this.set("addLineUp2", parseFloat(last_point));
						this.set("addLineUp1", parseFloat(last_point));

						color_fill1 = color_red;
						color_fill4 = color_green;

					} else {
						add_line1 = false;
						add_line2 = false;
					}

					if (add_line1) {
						this.set("addLineUp1m", this.get("addLineUp1"));
					} else {
						this.set("addLineUp1", null);
						this.set("addLineUp1m", null);
					}

					if (add_line2) {
						this.set("addLineUp2m", this.get("addLineUp2"));
					} else {
						this.set("addLineUp2", null);
						this.set("addLineUp2m", null);
					}
				}
			}

			if (this.get("kind") == "range") {
				this.set("addLineUp3", null);
				this.set("addLineUp3m", null);
				this.set("addLineUp4", null);
				this.set("addLineUp4m", null);

				this.set("use_one_tunnel", true);
			}
			this.set("color_fill1", color_fill1);
			this.set("color_fill2", color_fill2);
			this.set("color_fill3", color_fill3);
			this.set("color_fill4", color_fill4);

			this.set("min", minVal);
			this.set("max", maxVal);

			color_fill1 = null;
			color_fill2 = null;
			color_fill3 = null;
			color_fill4 = null;
			data = null;
			points = null;
			add_line1 = null;
			add_line2 = null;
			minVal = null;
			maxVal = null;

		},

		getFormattedData: function () {
			var graph_data = this.get("data"), data = [], data2 = [];

			if (graph_data != null && graph_data != undefined) {
				var len = graph_data.length;
				for (var i = 0; i < len; i++) {
					data.push(graph_data[i]);
				}
				i = null;
				len = null;
			}

			if (custom_timesize_for_tool_type !== {} && custom_timesize_for_tool_type[this.get("tool").tool_type] != null && custom_timesize_for_tool_type[this.get("tool").tool_type] != undefined) {
				if (use_timeframes_for_timescale) {
					var freq = custom_timescale_count_for_tool_type[this.get("tool").tool_type] || 60;
					var graph_param = {
						freq: freq,
						amount: custom_timesize_for_tool_type[this.get("tool").tool_type] / 60
					};
				}

			} else {
				if (use_timeframes_for_timescale) {
					var freq = 60;

					var graph_param = {
						freq: view.time_freq[this.get("timeframe")],
						amount: view.time_amount[this.get("timeframe")]
					};
				} else {
					var freq = 60;
					var graph_param = {
						freq: freq,
						amount: view.time_size[this.get("timesize")] / 60
					};
				}
			}

			if (data != null) {
				len = data.length;
				for (i = 0; i < len; i++) {
					if (i != (len - 1)) {
						if ((data[i][0] / 1000) % graph_param.freq == 0) {
							data2.push([data[i][0], data[i][1]]);
						}
					}
				}
				i = null;
				len = null;
			}

			//(data2,data2.length,graph_param.amount,data2.length > graph_param.amount);

			while (data2.length > graph_param.amount) {
				data2 = data2.slice(1);
			}


			data2.push(data[data.length - 1]);

			graph_data = null;
			data = null;

			return data2;
		},


		counter: function () {
			this.count--;

			//if (this.count > 5) { this.count = 1; }
			if (this.count > 0) {
				this.$time.html("0:0" + this.count);
				var that = this;
				timer = setTimeout(function () {
					that.counter();
				}, 1000);
			} else {
				var that = this;
				timer = setTimeout(function () {
					that.closeRequoteModal();
					that.closeRequtePopup();
				}, 100);
			}
		},
		showBuyButtonMessage: function (message) {
			if (this.buyButtonMessage == null) {
				this.buyButtonMessage = this.el.find('.bo_console__option_bought_msg');
				if (this.buyButtonMessage == null) {
					return;
				}
			}

			this.buyButtonMessage.html(message);

			this.buyButtonMessage.css({scale: .5, display: 'block'}).stop(1, 1).transition({
				scale: 1,
				opacity: 1
			}, 200).delay(2500).transition({scale: .5, opacity: 0}, 200, function () {
				$(this).css({display: 'none'});
			});

		},

		drawText: function (params) {

			var top, width, left, height1, heightGraph, pixStep;
			var plot1 = $("#plot-" + this.get("id"));
			heightGraph = plot1.height() - 25;
			pixStep = heightGraph / (params.max - params.min);

			var show = false;
			if (this.get("texts") == null) {
				this.set("texts", {});
			}

			if (this.get("texts")[params.area_name] == null) {
				show = true;

				this.el.prepend("<div class='hide_on_mouseover " + params.area_name + "' style='font-family:Arial; color:black; font-size:9px; position: absolute;display:none;z-index: 1;'></div>");
				this.get("texts")[params.area_name] = this.el.find("." + params.area_name);
			}
			top = plot1.offset().top + pixStep * (params.max - params.topLine) + 5;
			height = 10;
			width = 265;
			left = 100;

			this.get("texts")[params.area_name].css({
				height: height,
				top: top,
				left: left,
				width: width
			}).text(params.text);

			if (show) {
				this.get("texts")[params.area_name].show();
			}

			top = null;
			width = null;
			left = null;
			height = null;
			height1 = null;
			heightGraph = null;
			pixStep = null;
			plot1 = null;
		},
		drawArea: function (params) {

			var top, width, left, height1, heightGraph, pixStep;
			var plot1 = $("#plot-" + this.get("id"));
			heightGraph = plot1.height() - 35;
			pixStep = heightGraph / (params.max - params.min);

			var show = false;
			if (this.get("areas") == null) {
				this.set("areas", {});
			}
			if (this.get("areas")[params.area_name] == null) {
				show = true;
				this.el.prepend("<div class='hide_on_mouseover " + params.area_name + "' style='position: absolute;display:none;z-index: 1;'></div>");
				this.get("areas")[params.area_name] = this.el.find("." + params.area_name);
			}
			top = plot1.offset().top + pixStep * (params.max - params.topLine);
			height = (pixStep * (params.topLine - params.bottomLine));
			width = 265;
			left = 52;

			if (!this.get("areas")[params.area_name].hasClass("hovered")) {
				this.get("areas")[params.area_name].animate({"background-color": params.color}, 100);
			}

			this.get("areas")[params.area_name].animate({height: height, top: top, left: left, width: width}, 100);

			if (show) {
				this.get("areas")[params.area_name].show();
			}

			top = null;
			width = null;
			left = null;
			height = null;
			height1 = null;
			heightGraph = null;
			pixStep = null;
			plot1 = null;
		},
		hideAllAreas: function () {
			if (this.get("areas") != null) {
				for (var i in this.get("areas")) {
					this.get("areas")[i].hide();
				}
			}
		},
		showAllAreas: function () {
			if (this.get("areas") != null) {
				for (var i in this.get("areas")) {
					if (!this.get("areas")[i].hasClass("hovered")) {
						this.get("areas")[i].show();
					}
				}
			}
		},
		hideAllTexts: function () {
			if (this.get("texts") != null) {
				for (var i in this.get("texts")) {
					this.get("texts")[i].hide();
				}
			}
		},
		showAllTexts: function () {
			if (this.get("texts") != null) {
				for (var i in this.get("texts")) {
					if (!this.get("texts")[i].hasClass("hovered")) {
						this.get("texts")[i].show();
					}
				}
			}
		},
		setKindTypes: function () {
			if (settings_wss != null) {
				for (var i in settings_wss) {

					if (settings_wss[i] != null && settings_wss[i].enable === "false") {
						this.el.find(".b_options_types_item.set-kind[data-kind={kind}]".replace("{kind}", i)).hide();
					}
				}

			}
		}, /*
		 hideTool: function (tool_id_to_hide) {
		 $el = this.tools;
		 if ($el != null) {
		 is_tool_active = (this.get("tool").tool_id == tool_id_to_hide);

		 $el.find("div[data-value='{id}']".replace("{id}", tool_id_to_hide)).addClass("hidden_by_hook_tool").hide();
		 if (is_tool_active) {
		 this.changeParam("tool", $el.find("div:not(.hidden_by_hook_tool)").eq(0).attr("data-value"));
		 }

		 $el = this.el.find(".left-panel-widget .bin_instruments_list_table");
		 $el.find("div[data-value='{id}']".replace("{id}", tool_id_to_hide)).parent().addClass("hidden_by_hook_tool").hide();

		 }

		 this.testMessageLeftWidget();

		 }, */
		testMessageLeftWidget: function () {
			if (use_left_widget_fxcl && settings_wss[this.get("kind")] != null) {
				for (var i in settings_wss[this.get("kind")].tools) {
					var _tool_settings = settings_wss[this.get("kind")].tools[i];
					if (_tool_settings.tool_id == this.get('tool').tool_id) {
						if (_tool_settings.allowed_timeframes.indexOf(this.get("timeframe")) < 0) {
							this.setMessageLeftWidget();

						} else {
							this.hideMessageLeftWidget();

						}
						return;
					}
				}

			}
		},
		setMessageLeftWidget: function () {
			this.el.find(".empty-symbols").show();
			this.el.find(".info_raw").hide();
			$("." + view.kind + "_w_dub").hide();

		},
		hideMessageLeftWidget: function () {
			this.el.find(".empty-symbols").hide();
			this.el.find(".info_raw").show();
			$("." + view.kind + "_w_dub").show();
		},
		showTool: function (tool_id_to_show) {
			$el = this.tools;
			$el.find("div[data-value='{id}']".replace("{id}", tool_id_to_show)).removeClass("hidden_by_hook_tool").show();

			$el = this.el.find(".left-panel-widget .bin_instruments_list_table");
			$el.find("div[data-value='{id}']".replace("{id}", tool_id_to_show)).parent().removeClass("hidden_by_hook_tool").show();
		},
		hideTf: function (tf_to_hide) {
			$el = this.timeframes;

			is_tool_active = (this.get("timeframe") == tf_to_hide);

			$el.find("div[data-value='{id}']".replace("{id}", tf_to_hide)).addClass("hidden_by_hook_tool").hide();
			if (is_tool_active) {
				this.changeParam("timeframe", $el.find("div:not(.hidden_by_hook_tool)").eq(0).attr("data-value"));
			}


		},
		showTf: function (tf_to_show) {
			console.log('showTf');
			$el = this.timeframes;
			$el.find("div[data-value='{id}']".replace("{id}", tf_to_show)).removeClass("hidden_by_hook_tool").show();
		},
		updateTfDisplay: function () {
			/*var len = cache_tools_and_tf_visible[this.get("kind")].length, el, tool_id = this.get("tool").tool_id;
			 for (var i = 0; i < len; i++) {
			 el = cache_tools_and_tf_visible[this.get("kind")][i];
			 if (tool_id = el.tool_id) {
			 if (el.enable == "true") {
			 this.hideTf(el.timeframe);
			 } else {
			 this.showTf(el.timeframe);
			 }
			 }
			 }*/
		},
		checkHookTimeframes: function () {
			return (hook_timeframes_cache[view.option_kinds.getIdByName(this.get("kind")) + "-" + this.get("tool").tool_id + "-" + this.get("timeframe")] != null);
		},
		updateHookTimeframesStatus: function () {
			if (!this.checkHookTimeframes()) {
				this.el.addClass("forbidden-timeframe");

				try {
					this.el.find(".binary_top_chooser__block__value.b_block_value").text("-");
					this.el.find(".binary_payouts__block_value_money .b_value").text("-");
					this.el.find(".percent_win").text("-");
					this.el.find(".binary_payouts__block_value_percent .b_refund").text("-");
					this.el.find(".binsta_payouts__block__value_money .b_value").text("-");
					this.el.find(".b_refund").text("-");
					this.el.find(".b_expires_block .b_block_value").text("-");
				} catch (e) {
				}
				;

			} else {
				this.el.removeClass("forbidden-timeframe");
			}
		},
		updateInvestValue: function () {
			var amounts = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];
			min_invest = parseInt(this.get('min_invest'));
			max_invest = parseInt(this.get('max_invest'));
			//var $invests = this.el.find(".invest_block .invest .dropdown .scroll");
			var $invests = this.el.find(".sum .dropdown .scroll>.select");

			if (this.invest.val() < min_invest || this.invest.val() > max_invest) {
				this.invest.val(min_invest);
			}

			for (var i = amounts.length - 1; i >= 0; --i) {
				if (i == amounts.length - 1) {
					$invests.empty();
				}
				if (amounts[i] >= min_invest && amounts[i] <= max_invest) {
					//$invests.prepend("<div class='binsta_assets__item__value__dropdown__list_item b_fast_invest' data-value='" + amounts[i] + "'>" + currency + amounts[i] + "</div>");
					$invests.prepend('<div class="option clearfix"><span class="val currency">' + amounts[i] + '</span></div>');
				}
			}
			amounts = null;
			$invests = null;
		},
		getHistory: function () {
			var id = (view.option_kinds.getIdByName(this.get("kind")) + "-" + this.get("tool").tool_id + "-" + this.get("timeframe"));

			if (!settings_wss.hasOwnProperty(this.get("kind")) || settings_wss[this.get("kind")] == null || (!settings_wss[this.get("kind")].enable)
				||
				cache_tool_tf_display[id] != null
				&&
				cache_tool_tf_display[id].enable == "false") {
				return;
			}

			if (custom_timescale_for_tool_type[this.get("tool").tool_type] != null && typeof(this.el.attr("id")) != "undefined") {
				chart.getHistoryWss(
					{
						tool_id: this.get("tool").tool_id,
						count: custom_timesize_for_tool_type[this.get("tool").tool_type] || view.time_count[5],
						time_size: custom_timescale_for_tool_type[this.get("tool").tool_type] || this.get("timesize"),
						request_id: this.el.attr("id")
					}
				);


			} else if (typeof(this.el.attr("id")) != "undefined") {

				if (use_timeframes_for_timescale) {

					chart.getHistoryWss(
						{
							tool_id: this.get("tool").tool_id,
							count: view.time_count[this.get("timeframe")] || view.time_count[5],
							time_size: view.time_sizes[this.get("timeframe")] || "M1",
							request_id: this.el.attr("id")
						}
					);

				} else {
					chart.getHistoryWss(
						{
							tool_id: this.get("tool").tool_id,
							count: tempObjTimesizeParams[2] || view.time_count[5],
							time_size: tempObjTimesizeParams[0],
							request_id: this.el.attr("id")
						}
					);

					var tempObjTimesizeParams = this.get("timesize").split("-");


					tempObjTimesizeParams = null;

				}

			}


		},
		changeParam: function (action, value) {
			if (this.get("kind") != view.kind && indexOf(onlyForOpenedActions, action) != -1
			) {
				return;
			}
			//PROFILING
			//if (js_params.profiling && action)
			console.time(action);

			switch (action) {
				case "menu-timeframes-show":
					this.el.find(".b_duration_block .b_list_holder").addClass("visible");
					this.el.find(".b_graph_block_overlay").hide();
					break;
				case "menu-timeframes-hide":
					this.el.find(".b_duration_block .b_list_holder").removeClass("visible");
					this.el.find(".b_graph_block_overlay").show();
					break;
				case "menu-tools-show":
					this.el.find(".b_instrument_block .b_list_holder").addClass("visible");
					this.el.find(".b_graph_block_overlay").hide();

					break;
				case "menu-tools-hide":
					this.el.find(".b_instrument_block .b_list_holder").removeClass("visible");
					this.el.find(".b_graph_block_overlay").show();
					break;
				case "menu-tool-types-show":
					this.el.find(".b_instruments_filter").addClass("visible");

					break;
				case "menu-tool-types-hide":
					this.el.find(".b_instruments_filter").removeClass("visible");

					break;
				case "set-direction":

					if (this.get("kind") == "range" && partner_params.fixedDirectionRange != null) {
						value = partner_params.fixedDirectionRange;
					}

					global_last_buy_blocked = false;

					if (this.el.hasClass("forbidden-timeframe")) {
						return;
					}

					/*if (!this.get("oneClickBuy") && partner_params.clearDirAfterDoubleclick && value != null && this.get("direction") == value && !(this.get("kind") == "range" && partner_params.fixedDirectionRange != null)) {
					 this.changeParam("set-direction", null);

					 this.setFixedDirection();

					 return;
					 }*/

					this.set("direction", value);
					this.set("lastTime", null);
					var okb = this.get("oneClickBuy");
					if (this.get("kind") == "classic" || this.get("kind") == "range_classic") {
						if (value == "CALL") {
							if (okb) {
								this.call_button.addClass("inactive").addClass("active");
							} else {
								this.call_button.removeClass("inactive").addClass("active");
							}
							this.put_button.removeClass("active").addClass("inactive");

							this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");


						} else if (value == "PUT") {

							if (okb) {
								this.put_button.addClass("inactive").addClass("active");
							} else {
								this.put_button.removeClass("inactive").addClass("active");
							}
							this.call_button.removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");

						} else {
							this.put_button.removeClass("active").addClass("inactive");
							this.call_button.removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");

						}
					} else if (this.get("kind") == "range" || this.get("kind") == "range_advanced") {
						if (value == "IN") {
							if (okb) {
								this.call_button.addClass("inactive").addClass("active");
							} else {
								this.call_button.removeClass("inactive").addClass("active");
							}
							this.put_button.removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
							this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");

						} else if (value == "OUT") {
							if (okb) {
								this.put_button.addClass("inactive").addClass("active");
							} else {
								this.put_button.removeClass("inactive").addClass("active");
							}
							this.call_button.removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");

						} else {

							this.put_button.removeClass("active").addClass("inactive");
							this.call_button.removeClass("active").addClass("inactive");
							this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");
						}


					} else if (this.get("kind") == "touch" || this.get("kind") == "touch_advanced") {

						if (this.get("kind") == "touch") {
							var use_only_up_down = true;
						} else {
							var use_only_up_down = false;
						}

						if (use_only_up_down) {
							if (value == "TOUCHUP") {
								if (okb) {
									this.call_button.addClass("inactive").addClass("active");
								} else {
									this.call_button.removeClass("inactive").addClass("active");
								}
								this.put_button.removeClass("active").addClass("inactive");

								this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");

							} else if (value == "TOUCHDOWN") {
								if (okb) {
									this.put_button.addClass("inactive").addClass("active");
								} else {
									this.put_button.removeClass("inactive").addClass("active");
								}
								this.call_button.removeClass("active").addClass("inactive");
								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
								this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");

							} else {

								this.put_button.removeClass("active").addClass("inactive");
								this.call_button.removeClass("active").addClass("inactive");
								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");
							}
						} else {
							if (value == "TOUCHUP") {

								if (this.call_button.hasClass("active")) {
									this.call_button.removeClass("active").addClass("inactive");
								} else {
									this.call_button.removeClass("inactive").addClass("active");
								}

								this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");


							} else if (value == "TOUCHDOWN") {

								if (this.put_button.hasClass("active")) {
									this.put_button.removeClass("active").addClass("inactive");
								} else {
									this.put_button.removeClass("inactive").addClass("active");
								}
								this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							} else if (value == "TOUCHUPDOWN") {
								this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");
							} else {


								this.call_button.removeClass("active").addClass("inactive");
								this.put_button.removeClass("active").addClass("inactive");

								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");

								this.changeParam("buy-button");
							}


							var dir = "TOUCH" + (this.call_button.hasClass("active") ? "UP" : "")
								+ (this.put_button.hasClass("active") ? "DOWN" : "");
							this.set("direction", dir);

							if (dir == "TOUCHUP") {
								this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");
							} else if (dir == "TOUCHDOWN") {
								this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
							} else if (dir == "TOUCHUPDOWN") {
								this.el.find(".bin_call_payout").removeClass("inactive").addClass("active");
								this.el.find(".bin_put_payout").removeClass("inactive").addClass("active");
							} else {
								this.set("direction", null);
								this.changeParam("payouts");
								this.el.find(".bin_call_payout").removeClass("active").addClass("inactive");
								this.el.find(".bin_put_payout").removeClass("active").addClass("inactive");
							}
						}
					}

					setTimeout(chart.drawConsole(this, true), 0);

					if (this.get("direction") == null && partner_params.directionsSetToInactivAfterBuy == true) {
						if (okb)
							this.el.find(".binary_actions__btn.active").removeClass("active");
						this.el.find(".binary_actions__btn.active").removeClass("inactive");
					}

					if (this.get("direction") != null && okb) {
						this.el.find(".binary_actions__btn.active").removeClass("active");
						this.el.find(".binary_actions__btn.active").addClass("inactive");
						this.bin_buy.trigger("click");
					}

					this.changeParam("buy-button");
					this.changeParam("payouts");
					okb = null;

					break;
				case "set-invest":
					var min_i = min_invest;
					var max_i = max_invest;
					if (this.get("min_invest") != null && this.get("max_invest") != null) {
						min_i = parseFloat(this.get("min_invest"));
						max_i = parseFloat(this.get("max_invest"));
					}
					var invest = this.invest.val();
					var buttons = this.el.find('.actionBtn');

					if (this.invest[0] != null) {
						if (partner_params.integerInvest && invest != parseInt(invest) && invest != "") {
							invest = Math.floor(parseFloat(invest)).toString();
							this.invest.val(invest);
						}

						if (invest.match(/[^\d.-]|(\.{1,})|,|\..*?\./)) {
							invest = invest.replace(',', '.');
							invest = invest.replace(/[^\d.-]/g, '');
							invest = invest.replace(/\.{2,}/g, '.');
							if (partner_params.integerInvest) {
								invest = invest.replace('.', '');
								invest = invest.replace(',', '');
							}
							if (invest.match(/\..*?\./)) {
								invest = invest.slice(0, -1);
							}
							this.invest.val(invest);

						}
						this.set("invest", invest);


					}

					if (isNaN(parseFloat(this.get("invest"))) || this.get("invest") == null || this.get("invest") == "NaN") {

						this.set("invest", "");
						this.invest.val("");

					}


					if (!fix_min_max_invest) {
						buttons.removeClass('inactive');
						var badInvestTooltip = this.el.find('.badInvest-buy-hover');
						badInvestTooltip.addClass('hidden');
						if (min_i > invest || invest > max_i) {
							badInvestTooltip.removeClass('hidden');
							var message = view.messages.find(".error-min_sum").text().replace("{min}", currency + min_i).replace("{max}", currency + max_i);
							badInvestTooltip.find('div').html(message);
							buttons.addClass('inactive');

						}
					}


					this.changeParam("buy-button");

					var direction_ok = (this.get("direction") != null && this.get("direction") != "TOUCH");
					//([this.get("invest"),min_i,this.get("invest")>=min_i]);

					this.set("invest_ok", true);
					this.changeParam("payouts");
					this.el.find(".b_buy_block").addClass("invest_ok");

					if (direction_ok) {
						this.bin_buy.removeClass("inactive");
					}
					else {
						this.el.find(".b_buy_block").removeClass("invest_ok");
						this.bin_buy.addClass("inactive");
						this.set("invest_ok", true);
					}

					view.saveConsoles();
					break;
				case "tool_type":
					this.set("tool_type", value);

					var template;

					if ($("#template_tool_types")[0] != null) {
						template = $("#template_tool_types").html();
					} else {
						template = '<div data-type="{tool_type_id}" class="label brand-main-color text-uppercase overflow-hidden filter_item {class}">{tool_type_name}</div>';
					}

					var tool_type, new_html = "";
					var tool_types1 = this.getToolTypes();
					for (var i in tool_types1) {
						tool_type = tool_types1[i];
						new_html += template
							.replace("{tool_type_id}", tool_type.id)
							.replace("{tool_type_name}", tool_type.tool_type_name)
							.replace("{class}", instrument_filter_item);
					}

					this.el.find("#display-group-slider").html(new_html);


					break;
				case "invest":
				case "set-fixed-invest":

					this.invest.val(value);

					this.set("invest", parseFloat(value));

					if (this.get("invest") >= 1 && /^[0-9]+([\.|\,][0-9])*$/.test(this.el.find(".b_invest_input").val())) {
						this.set("invest_ok", true);
					} else {
						this.set("invest_ok", false);
					}
					this.changeParam("payouts");
					break;
				case "tool":
					getHistoryMain = true;

					var tool1 = this.getTool(parseInt(value));

					if (tool1 != null) {
						if (typeof(this.choosed_tool) == "undefined" || this.choosed_tool != null && this.choosed_tool[0] == null) {
							return;
						}

						this.choosed_tool.html(tool1.tool_view_name);

						subscribeWSS(wss_conn, tool1.tool_id);
						subscribeWSSTimeframes(wss_conn, tool1.tool_id, view.option_kinds.getIdByName(this.get("kind")));
						subscribeWSSEarly(wss_conn, tool1.tool_id, view.option_kinds.getIdByName(this.get("kind")));

						//resubscribeWSS();
						setTimeout(updateSubscribtionsWSS, 5000);

						common.getTradingIntervals(tool1.tool_id);

						var getHistory = false;
						if (this.get("tool").tool_id !== tool1.tool_id) {
							this.set("data", []);
							getHistory = true;
						}

						this.set("tool", tool1);
						if (getHistory) {
							this.getHistory();
						}
						getHistory = null;

						this.changeParam("payouts");
						if (js_params.partner == "3") {
							view.closeAllDropdowns();
						}
						/*var starredButton = this.el.find(".toggle-starred");
						 if (starredButton[0] != null) {

						 if (view.starredTools.where({tool_id: parseInt(tool1.tool_id)})[0] != null) {
						 starredButton.addClass("active");
						 } else {
						 starredButton.removeClass("active");
						 }
						 }*/


						if (partner_params.clearDirAfterChangeTool) {
							this.changeParam("set-direction", null);
							this.setFixedDirection();
						}


						setTimeout(function () {
							$(".b_graph_block_overlay").each(function (key, elem) {
								$(elem).show()
							})
						}, 500);
						setTimeout(chart.drawConsole(this), 0);
					}

					this.setTimeframes();
					var that = this;
					setTimeout(function () {
						that.set("lastTime", null)
					}, 1000);
					this.set("lastTime", null);

					break;
				case "oneClickBuy":
					console.log(value);
					this.set("oneClickBuy", value);
					getOnclickCondition(this, false);
					break;
				case "timesize":
					this.set("timesize", value);

					break;
				case "timeframe":
					var timeframe = parseInt(value) || this.get("timeframe");

					if (this.getTimeframe(timeframe) != null) {
						this.choosed_tf.html(this.getTimeframe(timeframe).timeframe_nom);
					}
					view.timeframes[view.kind] = timeframe;

					this.set("timeframe", timeframe);
					this.set("timesize", view.time_sizes[timeframe]);

					if (use_timeframes_for_timescale) {
						chart.getHistoryWss(
							{
								tool_id: this.get("tool").tool_id,
								count: view.time_count[this.get("timeframe")] || view.time_count[5],
								time_size: view.time_sizes[this.get("timeframe")] || "M1",
								request_id: this.el.attr("id")
							}
						);
					}

					if (js_params.partner == "3") {
						view.closeAllDropdowns();
					}

					setTimeout(function () {
						$('.scroll').each(function (key, elem) {
							if (!$(elem).parent().hasClass("slimScrollDiv")) {
								$(elem).slimScroll({destroy: true}).slimScroll(
									{
										width: '100%',
										height: '100%',
										size: '4px',
										position: 'right',
										color: '#000',
										opacity:0.8,
										railColor: '#233847',
										railOpacity: 0.8,
										alwaysVisible: false,
										distance: '0px',
										start: 'top',
										railVisible: false,
										wheelStep: 10,
										allowPageScroll: false,
										disableFadeOut: false
									}
								);
							}
						});
					}, 1000)


					var that = this;
					setTimeout(function () {
						that.updateHookTimeframesStatus();
						that = null;
					}, 3000);


					if (partner_params.clearDirAfterChangeTool) {
						this.changeParam("set-direction", null);
						this.setFixedDirection();
					}


					var that = this;
					setTimeout(function () {
						chart.drawConsole(that, true);
					}, 500);
					//setTimeout(function () {
					//    chart.drawConsole(that, true);
					//}, 1000);


					break;
				case "timeframes":
					var timeframe = parseInt(value) || this.get("timeframe");

					this.el.find(".b_duration_block .b_block_value").html(this.getTimeframe(timeframe).timeframe_nom);

					this.el.find(".b_duration_block .b_block_value").attr("data-timeframe", this.getTimeframe(timeframe).timeframe_id);

					this.set("timeframe", timeframe);
					break;
				case "course":
					this.set("course", value);
					if (value != null) {

						var current_price = parseFloat(value).toFixed(this.get("tool").decimal_count);
						this.el.find('#instrument-options-price').html(current_price);
						if ($('.requote_alert').length) {
							$('.requote_alert').find('.large').html(current_price);
						}
					}
					break;
				case "buy-button":

					var invest_ok = this.get("invest_ok");
					var direction_ok = (this.get("direction") != null && this.get("direction") != "TOUCH");

					if (this.get("kind") == "range" && partner_params.fixedDirectionRange != null) {
						direction_ok = true;
					}

					if (direction_ok) {
						this.bin_buy
							.removeClass("if_put")
							.removeClass("if_put")
							.removeClass("if_call")
							.removeClass("inactive")
							.removeClass("inactive");


						if (this.get("direction") == "CALL" || this.get("direction") == "TOUCHUP" || this.get("direction") == "IN" || this.get("direction") == "TOUCHUPDOWN") {
							this.bin_buy.addClass("if_call");
						} else {
							this.bin_buy.addClass("if_put");
						}
					} else {
						this.bin_buy.addClass("inactive");
					}


					break;
				case "payouts":

					if (this.get("kind") == "classic") {
						var invest_ok = this.get("invest_ok");
						//callput diff percent

						var invest = this.get("invest"),
							percent_win = this.get("percent_win"),
							percent_win_up = this.get("percent_win_up"),
							percent_win_down = this.get("percent_win_down"),
							percent_lose = this.get("percent_lose"),
							percent_lose_up = this.get("percent_lose_up"),
							percent_lose_down = this.get("percent_lose_down"),
							direction = this.get("direction"),
							direction_ok = (direction != null);

						this.el.find(".b_chosen_pair").html(this.get("tool").tool_view_name);
						if (this.getTimeframe([this.get("timeframe")]) != null) {
							this.el.find(".b_chosen_time").html(this.getTimeframe([this.get("timeframe")]).timeframe_gen);
						}

						if (invest_ok && direction_ok) {
							if (direction == "CALL" || !payout_switch) {

								this.payout_win_val.html(money((invest * percent_win_up)));
								this.payout_lose_val.html(money((invest * percent_lose_up)));
							} else {

								this.payout_win_val.html(money((invest * percent_lose_down)));
								this.payout_lose_val.html(money((invest * percent_win_down)));
							}
							this.changeParam("buy-button");
						} else {
							this.payout_win_val.html(intellectRound(0, true));
							this.payout_lose_val.html(intellectRound(0, true));
							this.changeParam("buy-button");
						}
					} else if (this.get("kind") == "touch" || this.get("kind") == "touch_advanced") {

						var invest_ok = this.get("invest_ok");

						var invest = this.get("invest"),
							direction = this.get("direction"),
							direction_ok = (direction != null && direction != "TOUCH");

						this.el.find(".b_chosen_pair").html(this.get("tool").tool_view_name);
						if (this.getTimeframe([this.get("timeframe")]) != null) {
							this.el.find(".b_chosen_time").html(this.getTimeframe([this.get("timeframe")]).timeframe_gen);
						}


						if (direction_ok) {

							try {
								if (direction == "TOUCHUP") {
									this.el.find(".b_chosen_dir.higher").html(this.get("addLineUp1").toFixed(this.get("tool").decimal_count)).show();
									this.el.find(".b_chosen_dir.lower").hide();
									this.el.find(".b_payouts_line_or").hide();

									if (invest_ok) {
										this.payout_win_val.html(money((invest * (this.get("percent_win_up") / 100 + 1)).toFixed(2)));
										this.payout_lose_val.html(money((invest * this.get("percent_lose_up") / 100).toFixed(2)));
									}
								} else if (direction == "TOUCHDOWN") {
									if (this.get("addLineUp2") != null) {
										this.el.find(".b_chosen_dir.lower").html(this.get("addLineUp2").toFixed(this.get("tool").decimal_count)).show();
										this.el.find(".b_chosen_dir.higher").hide();
										this.el.find(".b_payouts_line_or").hide();
									}
									if (invest_ok) {
										this.payout_win_val.html(money('' + (invest * (this.get("percent_win_down") / 100 + 1)).toFixed(2)));
										this.payout_lose_val.html(money('' + (invest * (this.get("percent_lose_down") / 100)).toFixed(2)));
									}
								} else if (direction == "TOUCHUPDOWN") {

									this.el.find(".b_chosen_dir.higher").html(this.get("addLineUp1").toFixed(this.get("tool").decimal_count)).show();
									this.el.find(".b_chosen_dir.lower").html(this.get("addLineUp2").toFixed(this.get("tool").decimal_count)).show();
									this.el.find(".b_payouts_line_or").show();

									if (invest_ok) {
										this.payout_win_val.html(money('' + (invest * (this.get("percent_win_up_down") / 100 + 1)).toFixed(2)));
										this.payout_lose_val.html(money('' + (invest * (this.get("percent_lose_up_down") / 100)).toFixed(2)));
										// this.payout_lose_val.html('' + (invest * (this.get("percent_lose_up_down") / 100)).toFixed(2));
									}
								}
							} catch (e) {
								log(e);
							}

						} else {
							this.payout_lose_val.html(intellectRound(0, true));
							this.payout_win_val.html(intellectRound(0, true));
							this.changeParam("buy-button");
						}

						this.changeParam("buy-button");
					} else if (this.get("kind") == "range" || this.get("kind") == "range_advanced") {

						var invest_ok = this.get("invest_ok");

						var invest = this.get("invest"),
							direction = this.get("direction"),
							direction_ok = (direction != null);

						this.el.find(".b_chosen_pair").html(this.get("tool").tool_view_name);
						if (this.getTimeframe([this.get("timeframe")]) != null) {
							this.el.find(".b_chosen_time").html(this.getTimeframe([this.get("timeframe")]).timeframe_gen);
						}

						if (invest_ok && direction_ok) {
							if (payout_switch) {
								if (direction == "IN") {
									this.payout_win_val.html(money('' + (invest * (parseFloat(this.get("percent_in_win") / 100 + 1)))));
									this.payout_lose_val.html(money('' + (invest * (parseFloat(this.get("percent_in_lose") / 100)))));

								} else if (direction == "OUT") {
									this.payout_lose_val.html(money('' + (invest * (parseFloat(this.get("percent_out_win") / 100 + 1)))));
									this.payout_win_val.html(money('' + (invest * (parseFloat(this.get("percent_out_lose") / 100)))));
								}
							} else {
								if (direction == "IN") {
									this.payout_win_val.html(money('' + (invest * (parseFloat(this.get("percent_in_win") / 100 + 1)))));
									this.payout_lose_val.html(money('' + (invest * (parseFloat(this.get("percent_in_lose") / 100)))));

								} else if (direction == "OUT") {
									this.payout_win_val.html(money('' + (invest * (parseFloat(this.get("percent_out_win") / 100 + 1)))));
									this.payout_lose_val.html(money('' + (invest * (parseFloat(this.get("percent_out_lose") / 100)))));
								}
							}

						} else {
							this.payout_win_val.html(intellectRound(0, true));
							this.payout_lose_val.html(intellectRound(0, true));
						}

						this.changeParam("buy-button");
					} else if (this.get("kind") == "range_classic") {

						var invest_ok = this.get("invest_ok");

						var invest = this.get("invest"),
							direction = this.get("direction"),
							direction_ok = (direction != null);

						this.el.find(".b_chosen_pair").html(this.get("tool").tool_view_name);
						if (this.getTimeframe([this.get("timeframe")]) != null) {
							this.el.find(".b_chosen_time").html(this.getTimeframe([this.get("timeframe")]).timeframe_gen);
						}

						if (invest_ok && direction_ok) {
							if (direction == "CALL") {
								var win_val = ('' + (invest * (parseFloat(this.get("percent_up_win") / 100 + 1)).toFixed(2)));
								var lose_val = ('' + (invest * (parseFloat(this.get("percent_up_lose") / 100))));

								this.payout_win_val.html(money(win_val));
								this.payout_lose_val.html(money(lose_val));

							} else if (direction == "PUT") {

								var win_val = ('' + (invest * (parseFloat(this.get("percent_down_win") / 100 + 1))));
								var lose_val = ('' + (invest * (parseFloat(this.get("percent_down_lose") / 100))));

								this.payout_win_val.html(money(win_val));
								this.payout_lose_val.html(money(lose_val));
							}

						} else {
							this.payout_win_val.html(intellectRound(0, true));
							this.payout_lose_val.html(intellectRound(0, true));
						}


						this.changeParam("buy-button");
					}


					break;

				case "end-time":

					if (this.el === undefined || this.getTimeframe() == null)
						return;

					if (this.getTimeframe().lock_time == 0) {
						var before_end = this.get("date_close") - this.get("date_open");
					} else {
						var before_end = (((this.get("date_close") * 1000 - utcTime) / 1000) - this.getTimeframe().lock_time);
					}

					if (before_end < 0) {
						this.allowed_time_val.html('00:00:00:00');
					} else {
						this.allowed_time_val.html((before_end).toString().toDDHHMMSS());
					}

					var expire = this.get("date_close") * 1000 - (isLondonInSummerTime == true ? 3600000 : 0);

					if (expire < 0) {
						this.expire_time_val.html(" - ");
						this.expire_day_val.html(" - ");
					} else {
						this.expire_time_val.html(common.UTS2Time(expire));
						this.expire_day_val.html(common.UTS2Date(expire));
					}


					var percent_win = 75;
					var percent_lose = 5;
					var direction = this.get("direction");

					if (this.get("kind") == "classic") {
						if (partner_params.traderMoodHorisontal) {
							this.trade_line_call.css({"width": (this.get("call_percent") + "%")});
							this.trade_line_put.css({"width": (100 - parseFloat(this.get("call_percent")) + "%")});
						} else {
							this.trade_line_call.css({"height": (this.get("call_percent") + "%")});
							this.trade_line_put.css({"height": (100 - parseFloat(this.get("call_percent")) + "%")});
						}


						if (this.get("call_percent") == 100) {
							this.trade_line_call.addClass("fullrounded");
						} else {
							this.trade_line_call.removeClass("fullrounded");
						}

						if (this.get("call_percent") == 0) {
							this.trade_line_put.addClass("fullrounded");
						} else {
							this.trade_line_put.removeClass("fullrounded");
						}


						this.trade_line_call_val.text(parseFloat(this.get("call_percent")).toFixed() + "%");
						this.trade_line_put_val.text((100 - parseFloat(this.get("call_percent")).toFixed()) + "%");

						if (direction == "CALL") {
							percent_win = (this.get("percent_win_up") - 1) * 100;
							percent_lose = (this.get("percent_lose_up")) * 100;
						} else {
							percent_win = (this.get("percent_win_down") - 1) * 100;
							percent_lose = (this.get("percent_lose_down")) * 100;
						}
					} else if (this.get("kind") == "touch" || this.get("kind") == "touch_advanced") {
						var call = this.get("up_percent");
						var callput = this.get("up_down_percent");
						var put = this.get("down_percent");

						if (partner_params.traderMoodHorisontal) {
							this.trade_line_call.css({"width": this.get("up_percent") + "%"});
							this.trade_line_callput.css({"width": this.get("up_down_percent") + "%"});
							this.trade_line_put.css({"width": this.get("down_percent") + "%"});
						} else {
							this.trade_line_call.css({"height": this.get("up_percent") + "%"});
							this.trade_line_callput.css({"height": this.get("up_down_percent") + "%"});
							this.trade_line_put.css({"height": this.get("down_percent") + "%"});
						}

						this.trade_line_call_val.html(parseFloat(this.get("up_percent")).toFixed() + "%");
						this.trade_line_callput_val.html(parseFloat(this.get("up_down_percent")).toFixed() + "%");
						this.trade_line_put_val.html(parseFloat(this.get("down_percent")).toFixed() + "%");

						if (this.get("up_percent") == 100) {
							this.trade_line_call.addClass("fullrounded");
						} else {
							this.trade_line_call.removeClass("fullrounded");
						}

						if (this.get("down_percent") == 100) {
							this.trade_line_put.addClass("fullrounded");
						} else {
							this.trade_line_put.removeClass("fullrounded");
						}

						if (direction == "TOUCHUP") {
							percent_lose = this.get("percent_lose_down");
							percent_win = this.get("percent_win_up");
						} else if (direction == "TOUCHDOWN") {
							percent_lose = this.get("percent_lose_down");
							percent_win = this.get("percent_win_down");
						} else if (direction == "TOUCHUPDOWN") {
							percent_lose = this.get("percent_lose_up_down");
							percent_win = this.get("percent_win_up_down");
						} else {
							percent_lose = this.get("percent_lose_up");
							percent_win = this.get("percent_win_up");
						}

					} else if (this.get("kind") == "range" || this.get("kind") == "range_advanced") {

						if (this.get("in_percent") == 100) {
							this.trade_line_call.addClass("fullrounded");
						} else {
							this.trade_line_call.removeClass("fullrounded");
						}

						if (this.get("in_percent") == 0) {
							this.trade_line_put.addClass("fullrounded");
						} else {
							this.trade_line_put.removeClass("fullrounded");
						}

						if (partner_params.traderMoodHorisontal) {
							this.trade_line_call.css({"width": this.get("in_percent") + "%"});
							this.trade_line_put.css({"width": ((100 - parseFloat(this.get("in_percent"))) + "%")});
						} else {
							this.trade_line_call.css({"height": this.get("in_percent") + "%"});
							this.trade_line_put.css({"height": ((100 - parseFloat(this.get("in_percent"))) + "%")});
						}

						this.trade_line_call_val.text(parseFloat(this.get("in_percent")).toFixed() + "%");
						this.trade_line_put_val.text((100 - parseFloat(this.get("in_percent")).toFixed()) + "%");

						if (direction == "IN") {
							percent_lose = this.get("percent_in_lose");
							percent_win = this.get("percent_in_win");
						} else {
							percent_lose = this.get("percent_out_lose");
							percent_win = this.get("percent_out_win");
						}


					} else if (this.get("kind") == "range_classic") {

						if (partner_params.traderMoodHorisontal) {
							this.trade_line_call.css({"width": this.get("up_percent") + "%"});
							this.trade_line_put.css({"width": ((100 - parseFloat(this.get("up_percent"))) + "%")});
						} else {
							this.trade_line_call.css({"height": this.get("up_percent") + "%"});
							this.trade_line_put.css({"height": ((100 - parseFloat(this.get("up_percent"))) + "%")});
						}


						this.trade_line_call_val.text(parseFloat(this.get("up_percent")).toFixed() + "%");
						this.trade_line_put_val.text((100 - parseFloat(this.get("up_percent")).toFixed()) + "%");

						if (direction == "CALL") {
							percent_lose = this.get("percent_up_lose");
							percent_win = this.get("percent_up_win");
						} else {
							percent_lose = this.get("percent_down_lose");
							percent_win = this.get("percent_down_win");
						}
					}

					if (percent_win) {
						if (this.payout_percent_lose[0] != null) {
							this.payout_percent.html(intellectRound(parseFloat(percent_win) + (percent_win_add_100 ? 100 : 0)) + "%");
							if (percent_win_add_100 || (parseFloat(percent_win) > 0)) {
								this.payout_percent.prepend("+");
							}

							this.payout_percent_lose.html(intellectRound(percent_lose) + "%");
							if (parseFloat(percent_lose) > 0) {
								this.payout_percent_lose.prepend("+");
							}

						} else {
							this.payout_percent.html(intellectRound(parseFloat(percent_win) + (percent_win_add_100 ? 100 : 0)));
						}
					}


					var win_val = filterNaN(intellectRound(parseFloat(percent_lose) * this.get("invest") / 100));
					if (win_val != "-") {
						win_val = parseFloat(win_val).toFixed(2);
					}
					this.payout_win_val.html(win_val);

					var lose_val = filterNaN(intellectRound(parseFloat(percent_lose) * this.get("invest") / 100));
					if (lose_val != "-") {
						lose_val = parseFloat(lose_val).toFixed(2);
					}
					this.payout_lose_val.html(lose_val);

					this.changeParam("payouts");
					break;

				case "invest-select-show":
					this.el.stop(true, true).css({'width': 741});
					break;

				case "buy-option":

					this.bin_buy.addClass("inactive");

					if (partner_params.blockGuest && view.user.isGuest()) {
						bw_alert($("#messages .not_avialible_for_guest").html());
						return;
					}

					if (view.user.isGuest() && view.user.getDeposit() < parseFloat(this.get("invest"))) {
						bw_alert(view.messages.find(".error-insufficient_funds").text());
						//return;
					}

//                 global_get_opened_options = false;

					if (global_last_buy_blocked === true) {
						//("prevent fast click");
						return;
					}

					global_last_buy_blocked = true;

					var course = this.get("course");

					//course = 10;
					global_requote_price = 0;

					global_console_last_buy_id = this.id;

					var plugin = "site";

					switch (this.get("kind")) {
						case "classic":
							var open_query = '{"command":"open_option","plugin":"{plugin}","sum":"{sum}","tool_id":"{tool_id}","direction":"{direction}","price_open":"{price_open}","timeframe_id":"{timeframe_id}","option_kind":"{option_kind}"}'
								.replace("{sum}", this.get("invest"))
								.replace("{tool_id}", this.get("tool").tool_id)
								.replace("{direction}", this.get("direction"))
								.replace("{price_open}", course)
								.replace("{plugin}", plugin)

								.replace("{timeframe_id}", this.get("timeframe"))
								.replace("{option_kind}", view.option_kinds.getIdByName(this.get("kind")));

							break;
						case "touch":
						case "touch_advanced":
							var direction = this.get("direction");

							var margin_top = parseFloat(course);
							var margin_bottom = parseFloat(course);

							switch (direction) {
								case "TOUCHUP":
									margin_top += parseFloat(this.get("up_delta"));
									direction = "UP";
									break;
								case "TOUCHDOWN":
									margin_bottom -= parseFloat(this.get("down_delta"));
									direction = "DOWN";
									break;
								case "TOUCHUPDOWN":
									margin_top += parseFloat(this.get("updown_delta_up"));
									margin_bottom -= parseFloat(this.get("updown_delta_down"));
									direction = "UP/DOWN";
									break;
								default:
									return;
							}

							var point = 1 / Math.pow(10, this.get("tool").decimal_count);

							var open_query = '{"command":"open_option","plugin":"{plugin}","sum":"{sum}","tool_id":"{tool_id}","direction":"{direction}","price_open":"{price_open}","timeframe_id":"{timeframe_id}","option_kind":"{option_kind}","margin_top":"{margin_top}","margin_bottom":"{margin_bottom}"}'
								.replace("{sum}", this.get("invest"))
								.replace("{tool_id}", this.get("tool").tool_id)
								.replace("{plugin}", plugin)
								.replace("{direction}", direction)
								.replace("{price_open}", course)
								.replace("{timeframe_id}", this.get("timeframe"))
								.replace("{option_kind}", view.option_kinds.getIdByName(this.get("kind")))
								.replace("{margin_top}", (margin_top).toFixed(this.get("tool").decimal_count))
								.replace("{margin_bottom}", (margin_bottom).toFixed(this.get("tool").decimal_count));
							point = null;
							break;
						case "range_advanced":

							var point = 1 / Math.pow(10, this.get("tool").decimal_count);


							var open_query = JSON.stringify({
								"command": "open_option",
								"sum": this.get("invest"),
								"tool_id": this.get("tool").tool_id,
								"direction": this.get("direction"),
								"plugin": plugin,
								"price_open": course,
								"timeframe_id": this.get("timeframe"),
								"option_kind": view.option_kinds.getIdByName(this.get("kind")),
								"margin_top_external": (parseFloat(course) + parseFloat(this.get("delta_top_external"))).toFixed(this.get("tool").decimal_count),
								"margin_top_internal": (parseFloat(course) + parseFloat(this.get("delta_top_internal"))).toFixed(this.get("tool").decimal_count),
								"margin_bottom_internal": (parseFloat(course) - parseFloat(this.get("delta_bottom_internal"))).toFixed(this.get("tool").decimal_count),
								"margin_bottom_external": (parseFloat(course) - parseFloat(this.get("delta_bottom_external"))).toFixed(this.get("tool").decimal_count)

							});
							point = null;
							break;
						case "range":

							var point = 1 / Math.pow(10, this.get("tool").decimal_count);

							var open_query = JSON.stringify({
								"command": "open_option",
								"sum": this.get("invest"),
								"tool_id": this.get("tool").tool_id,
								"direction": this.get("direction"),
								"plugin": plugin,
								"price_open": course,
								"timeframe_id": this.get("timeframe"),
								"option_kind": view.option_kinds.getIdByName(this.get("kind")),
								"margin_top_external": (parseFloat(course) + parseFloat(this.get("delta_top"))).toFixed(this.get("tool").decimal_count),
								"margin_top_internal": (parseFloat(course) - parseFloat(this.get("delta_bottom"))).toFixed(this.get("tool").decimal_count)
							});

							point = null;
							break;
						case "range_classic":
							var direction = this.get("direction");
							var point = 1 / Math.pow(10, this.get("tool").decimal_count);


							switch (direction) {
								case "CALL":
									direction = "UP";
									break;
								case "PUT":
									direction = "DOWN";
									break;
								default:
									return;
							}

							var open_query = JSON.stringify({
								"command": "open_option",
								"sum": this.get("invest"),
								"tool_id": this.get("tool").tool_id,
								"direction": direction,
								"plugin": plugin,
								"price_open": course,
								"timeframe_id": this.get("timeframe"),
								"option_kind": view.option_kinds.getIdByName(this.get("kind")),
								"margin_up": (parseFloat(course) + parseFloat(this.get("delta_up"))).toFixed(this.get("tool").decimal_count),
								"margin_down": (parseFloat(course) - parseFloat(this.get("delta_down"))).toFixed(this.get("tool").decimal_count),
							});


							point = null;
							break;

					}


					if (!(partner_params.blockGuest && view.user.isGuest())) {
						if (this.get("direction") == null) {
							console.log('direction is null');
						}
						if (this.get("direction") != null) {
							// console.log(open_query);
							//trade request
							wss_conn.send(open_query);
							lastOpenOptionQuery = open_query;
							bw_alert($("#messages .bin_buy_hidden_msg").html());
						}

						if (this.get("kind") == "range" && partner_params.fixedDirectionRange != null) {
							this.bin_buy.addClass('inactive');
						}


					} else {
						bw_alert($("#messages .not_avialible_for_guest").html());
					}

					this.setFixedDirection();


					break;


				case "invest-select-hide":
					//this.el.stop(true, true).css({'width': 686});
					break;

				default:
//                //("action");
//                //(action);
					break;
			}
			//PROFILING
			if (js_params.profiling && action)
				console.timeEnd(action);

		},
		initElems: function () {
			var item = this;

			item.el = $("#console-" + item.id);
			item.mark_course = item.el.find(".graph-mark.course");
			item.graph_point = item.el.find(".graph-point");
			item.mark_lines = {
				1: item.el.find(".graph-mark.line1"),
				2: item.el.find(".graph-mark.line2"),
				3: item.el.find(".graph-mark.line3"),
				4: item.el.find(".graph-mark.line4")
			};

			item.tools = item.el.find(partner_params.consolePartToolListContainer);
			item.timeframes = item.el.find(partner_params.consolePartTfContainer);
			item.allowed_line_txt = item.el.find(partner_params.consolePartAllowedLineText);
			item.end_line_txt = item.el.find(partner_params.consolePartEndLineText);
			item.bin_buy = item.el.find(partner_params.consolePartBinBuy);

			item.invest = item.el.find(partner_params.consolePartInvest);
			item.choosed_tool = item.el.find(partner_params.consolePartChoosedTool);
			item.choosed_tf = item.el.find(partner_params.consolePartChoosedTF);
			item.cource_val = item.el.find(partner_params.consolePartCourseVal1);
			item.cource_val2 = item.el.find(partner_params.consolePartCourseVal2);
			item.payout_percent = item.el.find(partner_params.consolePartPayoutPercent);
			item.payout_percent_lose = item.el.find(partner_params.consolePartPayoutPercentLose);
			item.payout_win_val = item.el.find(partner_params.consolePartPayoutWinVal);
			item.payout_lose_val = item.el.find(partner_params.consolePartPayoutLoseVal);
			item.allowed_time_val = item.el.find(partner_params.consolePartAllowedTimeVal);
			item.expire_time_val = item.el.find(partner_params.consolePartExpireTimeVal);
			item.expire_day_val = item.el.find(partner_params.consolePartExpireDayVal);

			item.trade_line_callput = item.el.find(partner_params.consolePartTradeLineCallput);
			item.trade_line_put = item.el.find(partner_params.consolePartTradeLinePut);
			item.trade_line_call_val = item.el.find(partner_params.consolePartTradeLineCallVal);
			item.trade_line_put_val = item.el.find(partner_params.consolePartTradeLinePutVal);
			item.trade_line_callput_val = item.el.find(partner_params.consolePartTradeLineCallPutVal);
			item.trade_line_call = item.el.find(partner_params.consolePartTradeLineCall);
			item.timesize_elem = item.el.find(partner_params.consolePartTimesizeElem);
			item.call_button = item.el.find(partner_params.consolePartCallButton);
			item.put_button = item.el.find(partner_params.consolePartPutButton);
			item.modal_requote_popup = item.el.find(partner_params.consolePartModalRequotePopup);
			item.scheduleTimer = item.el.find(partner_params.consolePartScheduleTimer);

			item.left_panel = item.el.find(partner_params.consoleLeftPanel);


		},
		updateSelectedToolType: function () {
			if (this.get("kind") == view.kind && this.get("tool_type") != null && this.get("tool_type") != 0) {
				view.setToolType(this.id, this.get("tool_type"));
			}
		},
		setToolTypes: function (tool_t) {
			if (this.get("kind") != view.kind) {
				return;
			}

			var tool_type, new_html = "", len1, kind, template, found;

			if ($("#template_tool_types")[0] != null) {
				template = $("#template_tool_types").html();
			} else {
				if (partner_params.tool_types_template == "with_span" && tool_type_name.length == 0) {
					template = '<div data-type="{tool_type_id}" class="label brand-main-color text-uppercase overflow-hidden filter_item {class}"><span>{tool_type_name}</span></div>';
				} else {
					template = '<div data-type="{tool_type_id}" class="label brand-main-color text-uppercase overflow-hidden {class}">{tool_type_name}</div>';
				}
			}

			new_html = template
				.replace("{class}", instrument_filter_item + " active")
				.replace("{tool_type_id}", 0)
				.replace("{tool_type_name}", view.messages.find(".all").text());

			for (var i in tool_t) {
				tool_type = tool_t[i];
				found = false;
				kind = view.kind;

				found = false;

				if (settings_wss[kind] != null) {

					len1 = settings_wss[kind].tools.length;


					for (var tool_i = 0; tool_i < len1; tool_i++) {

						if (settings_wss[kind].tools[tool_i].tool_type == tool_type.id) {
							if (!(settings.getAllowedByTool(kind, settings_wss[kind].tools[tool_i].tool_id).length == 0)) {
								found = true;
							}
						}
					}
				}


				if (found) {

					new_html += template
						.replace("{class}", instrument_filter_item)
						.replace("{tool_type_id}", tool_type.id)
						.replace("{tool_type_name}", tool_type.tool_type_name)

				}

			}


			if (partner_params.use_starred) {
				var class1 = instrument_filter_item;
				if (view.starredTools.models.length == 0) {
					class1 += " empty";
				}
				new_html += template
					.replace("{class}", class1)
					.replace("{tool_type_id}", "starred")
					.replace("{tool_type_name}", view.messages.find(".starred").html());

			}
			$(instrument_filter_content).html(new_html);

			if (partner_params.use_runner) {
				var $console, chooser, runner;
				$(".bo_console").each(function (key, console) {
					$console = $(console);
					chooser = $console.find(".bo_instruments_chooser");
					runner = $console.find('.bo_instruments_chooser__runner');
					runner.stop(1, 1).animate({
						width: chooser.find('.bo_instrument.active').innerWidth(),
						left: chooser.find('.bo_instrument.active').position().left
					}, 300, 'easeInOutQuint');
				});

				$console = null;
				chooser = null;
				runner = null;
			}

			this.updateStarredStatus();
			this.updateSelectedToolType();

		},
		setTools: function (tool_t) {

			var body = $("#console-tools").html(),
				body_left_panel = $("#left-panel-tools").html(),
				tools_html = "",
				tools_left_panel_html = "",
				params;

			for (var i in tool_t) {
				var inFavorite = $.inArray(parseInt(tool_t[i].tool_id), view.user.user_data.starredTools) != -1 ? 'inFavorites' : '';
				params = {
					tool_id: tool_t[i].tool_id,
					tool_name: tool_t[i].tool_view_name,
					currency: currency,
					inFavorite: inFavorite
				};

				if (tool_t[i].tool_view_name != null && tool_t[i].tool_view_name.length > 0 && tool_t[i].allowed_timeframes.length > 0) {
					tools_html += Mustache.render(body, params);
					tools_left_panel_html += Mustache.render(body_left_panel, params);
				}

			}

			$('.b_instrument_block .b_list').hide().html(tools_html).show(1000);
			this.tools.html(tools_html);

			if (this.left_panel != null && this.left_panel[0] != null) {
				this.left_panel.html(tools_left_panel_html);
			}


		},
		setTimeframes: function (timeframe_t) {
			var timeframe_t = timeframe_t || this.getTimeframes(),
				body = $("#console-timeframes").html(),
				timeframes_html = "",
				params,
				choose_first = false,
				tool = this.get("tool");

			//var id = view.option_kinds.getIdByName(this.get("kind"))+"-"+this.get("tool").tool_id+"-"+this.get("timeframe");

			for (var i in timeframe_t) {
				params = {
					timeframe_id: timeframe_t[i].id,
					timeframe_name: timeframe_t[i].timeframe_nom,
					timeframe_gen: timeframe_t[i].timeframe_gen
				};

				if (indexOf(tool["allowed_timeframes"], params.timeframe_id) !== -1
				//&& (indexOf( client_allowed_timeframes, params.timeframe_id , true ) > -1)
				) {
					// if(cache_tool_tf_display[id]==null || cache_tool_tf_display[id].enable=="true"){
					timeframes_html += Mustache.render(body, params);
					//}
				} else {
					if (this.get("timeframe") == params.timeframe_id) {
						choose_first = true;
					}
				}
			}
			
			if(timeframes_html) {
				this.timeframes.html(timeframes_html);
			}

			if (choose_first) {
				this.timeframes.find(".change-timeframe").eq(0).click();

			}

		},
		updateBlockHeightLists: function () {
			var width;
			// $('.binsta_assets__item__value__dropdown__list__sizer').each(function(){
			width = 0;
			var items_length = $(this).find('.dropdown_list').length;
			var items_height = $(this).find('.dropdown_list').innerHeight();
			if (items_length > 6) {
				$(this).height(192);
			} else {
				$(this).height((items_length) * items_height);
			}

			//});
		},
		hideBadFixedInvest: function () {
			var min_i = this.get("min_invest"), max_i = this.get("max_invest");

			this.el.find(".b_fast_invest").each(function (key, elem) {
				if (parseFloat($(elem).attr("data-value")) < parseFloat(min_i)
					|| parseFloat($(elem).attr("data-value")) > parseFloat(max_i)) {
					$(elem).remove();
				}
			});

			this.updateBlockHeightLists();
			var that = this;
			setTimeout(function () {
				that.updateBlockHeightLists();
			}, 1000);
		},
		update: function () {

			var body = $("#console-timeframes").html();
			var timeframes_html = "";
			for (var i in timeframes[language]) {
				params = {
					timeframe_id: timeframes[language][i].timeframe_id,
					timeframe_name: timeframes[language][i].timeframe_name,
					currency: currency
				};

				timeframes_html += Mustache.render(body, params);
			}
			this.timeframes.html(timeframes_html);
			this.changeParam("payouts");
			this.changeParam("timeframe", this.get("timeframe"));
		},
		getTool: function (id) {
			if (settings_wss[this.kind] != null && settings_wss[this.kind].tools != undefined)
				if (typeof (id) == "string") {
					for (var i in settings_wss[this.kind].tools) {
						if (settings_wss[this.kind].tools[i].tool_name == id) {
							return settings_wss[this.kind].tools[i];
						}
					}
				} else {

					for (var i in settings_wss[this.kind].tools) {
						if (settings_wss[this.kind].tools[i].tool_id == id) {
							return settings_wss[this.kind].tools[i];
						}
					}
				}
		},
		getTools: function () {
			if (settings_wss[this.get("kind")] != null && settings_wss[this.get("kind")].tools != undefined) {
				return settings_wss[this.get("kind")].tools.slice(0, 20);
			} else {
				return settings_wss["classic"].tools.slice(0, 20);

			}
		},
		getTimeframe: function (id) {
			var id = id || this.get("timeframe");
			if (settings_wss[this.get("kind")] != null)
				for (var i in settings_wss[this.get("kind")].timeframes) {
					if (settings_wss[this.get("kind")].timeframes[i] != null && settings_wss[this.get("kind")].timeframes[i].id == id) {
						return settings_wss[this.get("kind")].timeframes[i];
					}
				}
		},
		getTimeframes: function () {
			if (settings_wss[this.get("kind")] != null) {
				return settings_wss[this.get("kind")].timeframes;
			} else {
				return settings_wss["classic"].timeframes;
			}
		},
		getToolType: function (id) {
			for (var i in settings_wss[this.get("kind")].tool_types) {
				if (settings_wss[this.get("kind")].tool_types[i].id == id) {
					return settings_wss[this.get("kind")].tool_types[i];
				}
			}
		},
		getToolTypes: function () {
			if (settings_wss[this.get("kind")] != null && settings_wss[this.get("kind")] != undefined) {
				return settings_wss[this.get("kind")].tool_types;
			} else {
				return settings_wss["classic"].tool_types;
			}


		}
	});

	var OpenedOption = Backbone.Model.extend({
		earlyClose: function () {
			this.el.addClass("closed-early");
			gc.earlyCloseHashes.push(this.get("hash"));
			//('{"command":"option_close_early","hash":"{hash}","request_id":"{hash}"}'.replace("{hash}", this.get("hash")).replace("{hash}", this.get("hash")));
			wss_conn.send('{"command":"option_close_early","hash":"{hash}","request_id":"{hash}"}'.replace("{hash}", this.get("hash")).replace("{hash}", this.get("hash")));
			this.el.find('.sell_now_button').addClass("inactive").addClass("closearly");
			this.el.find('.option_sell_now_timer').hide();
			this.el.find('.option_sell_payout').hide();
			this.el.find('.sell').hide();
		},
		getForecast: function () {
			var dir = this.get("direction"),
				special_params = this.get("special_params"),
				start_course = this.get("start_course"),
				kind = this.get("kind"),
				tool = this.get("tool");

			return getForecast(dir, special_params, start_course, kind, tool)
		},
		changeParam: function (action, value) {

			switch (action) {
				case "toggle-option":
					this.el.toggleClass("open");

					if (this.el.hasClass("open")) {

						this.el.removeClass("mini");
					} else {

						this.el.addClass("mini");
					}
					break;

				case "close-option":
					this.el.removeClass("mini");
					break;

				case "course":
					this.course = value;
					if (typeof (this.el) != "undefined" && this.el != null && this.el != null && this.el[0] != null) {
						this.open_options_bar_body_rate_num.text(value);
						this.bin_open_option__info__values.text(value);
					}
					break;
			}


		},
		updateEndTime: function (force_finish) {
			var correction = partner_params.end_time_correction;
			var closeOption = this.get("end_time") * 1000;
			var force_finish = force_finish || false,
				endtime = closeOption - utcTime + correction;
			if (this.get("early_closed")) {
				return;
			}
			if (endtime >= 0 && !force_finish
				&& this.el != null
				&& this.el.find(".open_options_bar_body_optionends_time").text().split(".").length < 3) {
				if (typeof (this.el) != "undefined" && this.el != null && this.el != null && this.el[0] != null) {
					this.el.find(".open_options_bar_body_optionends_time").text(toDDHHMMSSD(endtime));
				}

			}
			/*else {
			 if (force_finish) {
			 //this.el.find(".open_options_bar_body_optionends_time").text("");
			 if (endtime <= 0) {
			 // this.el.find(".open_options_bar_body_optionends_time").text(UTS2DateAndTime(closeOption));
			 } else {
			 //   this.el.find(".open_options_bar_body_optionends_time").text(UTS2DateAndTime(closeOption - (closeOption - utcTime + correction)));
			 }
			 }
			 }*/
			var data1 = this.get("data") || [];
			if (data1.length > 0) {
				var last_data_time = data1[data1.length - 1][0];
				if (last_data_time < utcTime) {
					data1.push([utcTime, data1[data1.length - 1][1]]);
					this.set("data", data1);
					chart.drawOpened(this);
				}
			} else {
				data1.push([utcTime, this.get("start_course")]);
				this.set("data", data1);
				chart.drawOpened(this);
			}
			data1 = null;
			last_data_time = null;
		},
		updateEarly: function () {

			if (this.early_percent_value != null && this.early_percent_sum_value != null) {
				this.set("early", common.getEarlyPercent(this.get("kind") + "-" + this.get("tool").tool_id + "-" + this.get("timeframe")));
				var earlyPayoutValue = 0;
				var early_percent_value = 0;
				var early = this.get("early");
				if (this.get("win")) {

					if (early.early_alt_formula == "true") {

						var allow_time = (this.get("end_time") - early.early_interval) * 1000;
						var current_time = utcTime;
						var starttime = parseInt(this.get("start_time")) * 1000;
						var t1 = current_time - starttime;
						var t2 = allow_time - starttime;
						var early_percent_value = allow_time > current_time ? (parseFloat(early.early_percent_win) * (1 - t1 / t2)).toFixed(2) : 0;

						if (early_percent_value < 0) {
							early_percent_value = 0;
						}

					} else {
						early_percent_value = early.early_percent_win;
					}

				} else {
					early_percent_value = early.early_percent_lose;
				}
				this.early_percent_value.text(early_percent_value);
				earlyPayoutValue = intellectRound(parseFloat(this.get("invest")) * early_percent_value / 100);
				this.early_percent_sum_value.html($("#messages .sell_option_text").html().replace("{payout}", earlyPayoutValue));

				if (early.early_allow == "true" && this.get("closed") != true) {
					endSellTime = this.get("end_time") * 1000 - utcTime - early.early_interval * 1000;
					if (endSellTime <= 0) {
						this.el.find(".option_sell_now_timer").text('');
						this.el.find(".option_sell_payout").text('');
						this.sell_now.addClass("inactive");
						$('.option_tipped').simpleTip();
						this.el.find('.sell').hide();
					} else {
						if (!this.sell_now.hasClass("closearly")) {
							this.el.find(".option_sell_now_timer").text(toHHMMSS(endSellTime));
							this.el.find(".option_sell_payout").text(earlyPayoutValue);
							this.sell_now.removeClass("inactive");
							this.sell_now.addClass("option_tipped");
							$('.option_tipped').simpleTip();
							this.el.find('.sell').show();
						}
					}
				} else {
					this.el.find(".option_sell_now_timer").text('');
					this.el.find(".option_sell_payout").text('');
					this.sell_now.addClass("inactive");
					this.el.find('.sell').hide();
					$('.option_tipped').simpleTip();
				}

				var el1 = $("#" + this.get("hash") + "-early-payout");
				if (el1[0] != null) {
					el1.text(earlyPayoutValue);
				}


			}


		},
		getWin: function () {
			var win = false,
				last_value = this.get("data")[this.get("data").length - 1][1],
				direction = this.get("direction"),
				course = parseFloat(this.get("course")),
				start_course = parseFloat(this.get("start_course"));

			//classic
			if (this.get("kind") == view.option_kinds.getIdByName("classic")) {

				if (last_value > start_course && direction == "CALL" || last_value < start_course && direction == "PUT") {
					win = true;
				}
			}

			//touch
			if (this.get("kind") == view.option_kinds.getIdByName("touch") || this.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {
				win = common.checkWinTouch({
					pC: course,
					p1: this.get("addLineUp1"),
					p2: this.get("addLineUp2")
				});

				if (win === true) {
					this.set("touch_win", true);
				}

				if (this.get("touch_win") === true) {
					win = true;
				}


			}

			//range
			if (this.get("kind") == view.option_kinds.getIdByName("range") || this.get("kind") == view.option_kinds.getIdByName("range_advanced")) {

				win = common.checkWinRange({
					pC: last_value,
					p1: this.get("addLineUp1"),
					p2: this.get("addLineUp2"),
					p3: this.get("addLineUp3"),
					p4: this.get("addLineUp4"),
					use_one_tunnel: this.get("use_one_tunnel"),
					dir: this.get("direction")
				});


			}


			//range classic
			if (this.get("kind") == view.option_kinds.getIdByName("range_classic")) {

				win = common.checkWinTouch({
					pC: last_value,
					p1: this.get("addLineUp1"),
					p2: this.get("addLineUp2")
				});

			}

			return win;

		},
		updatePayout: function () {
			if (this.el.hasClass('not-update-payout')) {
				return;
			}
			var data = this.get("data");
			if (data.length > 0) {
				var last_value = data[data.length - 1][1],
					direction = this.get("direction"),
					course = parseFloat(this.get("course")),
					start_course = parseFloat(this.get("start_course")),
					win = this.getWin();


				if (this.el != null) {

					if (this.get("early_closed") == true) {

						var early = this.get("early"), payment = 0;

						var payment = 0;
						if (win) {

							this.set("win", true);
							if (early.early_alt_formula == "true") {
								var allow_time = (this.get("end_time") - early.early_interval) * 1000;
								var current_time = utcTime;
								var starttime = parseInt(this.get("start_time")) * 1000;
								var t1 = current_time - starttime;
								var t2 = allow_time - starttime;
								payment = allow_time > current_time ? (((parseFloat(this.get("invest")) * parseFloat(early.early_percent_win)) / 100) * (1 - t1 / t2)).toFixed(2) : 0;
							} else {
								payment = (parseFloat(this.get("invest")) * parseFloat(early.early_percent_win) / 100).toFixed(2);
							}
							this.set("payout", parseFloat(early.early_percent_win));
						} else {
							this.set("win", false);
							payment = (parseFloat(this.get("invest")) * parseFloat(early.early_percent_lose) / 100).toFixed(2);
							this.set("payout", parseFloat(early.early_percent_lose));
						}

						if (this.get("equal") == true) {
							payment = (parseFloat(this.get("invest")) * parseFloat(early.early_percent_equal) / 100).toFixed(2);
							this.set("payout", parseFloat(early.early_percent_equal));
						}

						this.el.find(".bin_payout_sum").text(payment);
						this.el.find(".table-cell.bin_open_options__payout").text(payment);
						this.el.find(".bin_open_option__info__values__payout").text(payment);

						//payment = null;
						//early = null;

						return;
					}
					//([win,this.get("touch_win"),this.get("payment_win"),this.get("payment_lose")]);

					if (win) {
						this.el.find(".bin_payout_sum").text(parseFloat(this.get("payment_win")).toFixed(2));
						this.el.find(".table-cell.bin_open_options__payout").text(parseFloat(this.get("payment_win")).toFixed(2));
						this.el.find(".bin_open_option__info__values__payout").text(parseFloat(this.get("payment_win")).toFixed(2));
						this.el.removeClass('los');
						this.el.addClass('win');
						this.set("win", true);
						this.set("payout", parseFloat(this.get("payment_win")));

					} else {
						this.set("win", false);
						this.el.addClass('los');
						this.el.removeClass('win');
						this.el.find(".bin_payout_sum").text(parseFloat(this.get("payment_lose")).toFixed(2));
						this.el.find(".table-cell.bin_open_options__payout").text(parseFloat(this.get("payment_lose")).toFixed(2));
						this.el.find(".bin_open_option__info__values__payout").text(parseFloat(this.get("payment_lose")).toFixed(2));

						this.set("payout", parseFloat(this.get("payment_lose")));
					}

				} else {

					//("empty el");

				}

				var elWidget = $("#widget-line-" + this.get("hash"));
				if (elWidget[0] != null) {
					elWidget.find(".open_options_widget__payout .open_options_widget__cell_value").html(parseFloat(this.get("payout")).toFixed(2));
					if (this.get("closed") == true || this.get("end_time") * 1000 - utcTime <= 0) {
						elWidget.find(".open_options_widget__timeleft .open_options_widget__cell_value").html(0);
					} else {
						elWidget.find(".open_options_widget__timeleft .open_options_widget__cell_value").html(toDDHHMMSS2(this.get("end_time") * 1000 - utcTime));
					}

				}


				if (this.get("equal") == true) {
					var percent_equal = this.get("percent_equal");

					payment = 0;
					if (percent_equal != null && percent_equal != "") {
						payment = (parseFloat(this.get("invest")) * parseFloat(percent_equal) / 100).toFixed(2);

						this.set("payout", parseFloat(payment));

						this.el.find(".bin_payout_sum").text(payment);
						this.el.find(".table-cell.bin_open_options__payout").text(payment);
						this.el.find(".bin_open_option__info__values__payout").text(payment);

					}
					percent_equal = null;
					payment = null;
					early = null;
				}


			}


			//touch
			if (
				this.get("kind") == view.option_kinds.getIdByName("touch") || this.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {
				win = common.checkWinTouch({
					pC: course,
					p1: this.get("addLineUp1"),
					p2: this.get("addLineUp2")
				});

				if (win === true) {
					this.set("touch_win", true);
				}

				if (this.get("touch_win") === true) {
					win = true;
				}


				if (this.el != null) {


					if (win) {
						this.el.find(".bin_payout_sum").text(parseFloat(this.get("payment_win")).toFixed(2));
						this.el.find(".table-cell.bin_open_options__payout").text(parseFloat(this.get("payment_win")).toFixed(2));
						this.el.find(".bin_open_option__info__values__payout").text(parseFloat(this.get("payment_win")).toFixed(2));

						this.set("payout", parseFloat(this.get("payment_win")));
					} else {
						this.el.find(".bin_payout_sum").text(parseFloat(this.get("payment_lose")).toFixed(2));
						this.el.find(".table-cell.bin_open_options__payout").text(parseFloat(this.get("payment_lose")).toFixed(2));
						this.el.find(".bin_open_option__info__values__payout").text(parseFloat(this.get("payment_lose")).toFixed(2));

						this.set("payout", parseFloat(this.get("payment_lose")));
					}

				}

			}


		},
		moveToClosed: function () {
			//("moved!");
			try {
				view.removeOptionFromWidgetOpenedOptions(this.get("hash"));
			} catch (e) {
			}

			this.sell_now.addClass("inactive");
			var lastPrice = this.get("data");
			lastPrice = lastPrice[lastPrice.length - 1][1];

			this.open_options_bar_body_rate_num.text(lastPrice);


			if (partner_params.optionBehavior == "standart") {
				this.el.prependTo(obj_closed);
			} else if (partner_params.optionBehavior == "table") {
				$("#opened-" + this.get("id")).detach().insertAfter($(obj_closed).eq(0));
			}

			var $el = $("#opened-" + this.get("id"));
			$el.toggleClass("open").toggleClass("mini");

			if ($el.hasClass("mini")) {
				$el.find(".graph-mark").each(function (key, elem) {
					if ($(elem).text() != "")
						$(elem).show();
				});
			}


			this.updateEndTime(true);

			view.opened_options.remove({id: this.get("id")});

			if (view.user.isGuest()) {
				view.user.setOpenedCount(view.opened_options.length);
			}
		},
		remove: function () {
			//("Removed!");

		}
	});


	var Consoles = Backbone.Collection.extend({
		model: Console
	});

	var OpenedOptions = Backbone.Collection.extend({
		model: OpenedOption
	});

	var OptionKinds = Backbone.Collection.extend({
		model: OptionKind,
		getIdByName: function (name) {
			if (this.where({name: name}).length > 0) {
				return this.where({name: name})[0].get("id") || 1;
			} else {
				return 1;
			}
		},
		getNameById: function (id) {
			try {
				return this.get(id).get("name")
			}
			catch (e) {
				return "classic"
			}

		}
	});


	var LazyUpdate = Backbone.Model.extend({
		selector: "",
		value: ""
	});
	var LazyUpdates = Backbone.Collection.extend({
		model: LazyUpdate
	});


	function WssConn(url, username, password) {
		this.url = url;
		this.username = username;
		this.password = password;
		this.state;
		this.error = false;
		this.wss;

		/*var socket = new WebSocket(wss_url);
		 var that = this;

		 socket.onopen = function() {
		 socket.send('{ "command":"get_token", "email":"ramil@binarystation.com", "password":"9876", "ip": "{ip}" }'.replace("{ip}", s_ip));
		 }

		 socket.onmessage = function(event) {
		 var json_data = JSON.parse(event.data);
		 s_token = json_data.token;
		 that.init();
		 };*/

		this.init();

	}

	WssConn.prototype.init = function () {

		var url = this.url;
		var username = this.username;
		var password = this.password;

		this.wss = new WebSocket(url);
		var wss = this.wss;

		//("wss: connecting to " + url);

		var obj = this;
		wss.onopen = function () {

			obj.state = "connected";
			if (wss.readyState != WebSocket.OPEN) {
				return;
			}

			if (typeof(s_token) != "undefined" && s_token != null && s_token != "") {
				wss.send(wssQuery.ConnectWithToken
					.replace("{token}", s_token)
				);
			} else if (s_userhash != "") {
				wss.send(wssQuery.ConnectWithUserhash
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{user_hash}", s_userhash)
				);
			} else if (username != "" && password != "") {
				wss.send(wssQuery.ConnectWithUsernameAndPassword
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{username}", username)
					.replace("{username}", username)
					.replace("{password}", password));
			} else {
				return;
			}

			wss.send(wssQuery.HookTime);

			if (this.error == true) {
				/* setTimeout(function () {
				 subscribed = [];
				 subscribed_timeframes = [];
				 _(view.consoles.models).each(function (item) {
				 item.changeParam("tool", item.get("tool").tool_id);
				 });
				 updateSubscribtionsWSS();
				 }, 2000);*/
			}
		};

		wss.onmessage = common.handleWssMessage;

		wss.onclose = function () {

			/* if (js_params.disable_reconnect == true || js_params.disable_reconnect == "true") {
			 return;
			 }
			 error_count++;

			 if (view.user.error_not_found == false) {
			 setTimeout(function () {
			 subscribed = [];
			 subscribed_timeframes = [];

			 //("wss: coonection closed, try to reconnect");
			 obj.state = "closed";

			 if (error_count == 5) {
			 window.location.reload();
			 }

			 obj.init();

			 this.error = true;
			 setTimeout(function () {
			 subscribed = [];
			 subscribed_timeframes = [];
			 _(view.consoles.models).each(function (item) {
			 item.changeParam("tool", item.get("tool").tool_id);
			 });
			 updateSubscribtionsWSS();
			 }, 5000);
			 }, 1000);
			 }

			 */
		};

		wss.onerror = function () {

			if (view.user.error_not_found == false) {
				/* setTimeout(function () {
				 subscribed = [];
				 subscribed_timeframes = [];

				 obj.state = "closed";

				 if (reconnect != null) {
				 reconnect = true;
				 }
				 obj.init();
				 this.error = true;

				 setTimeout(function () {
				 subscribed = [];
				 subscribed_timeframes = [];
				 _(view.consoles.models).each(function (item) {
				 item.changeParam("tool", item.get("tool").tool_id);
				 });
				 updateSubscribtionsWSS();
				 }, 5000);
				 }, 1000);*/
			}

		};


	};


	WssConn.prototype.send = function (data) {
		if (this.wss.readyState == WebSocket.OPEN) {
			this.wss.send(data);
		}
	};

	function subscribeWSS(wss, tool_id) {
		if (subscribed.indexOf(parseInt(tool_id)) == -1 && !isNaN(parseInt(tool_id))) {
			subscribed.push(parseInt(tool_id));

			wss.send(wssQuery.HookQuotes
				.replace("{bo}", (account_type == '') ? 'demo' : account_type)
				.replace("{tool_id}", tool_id)
				.replace("{interval}", js_params.quote_interval)
			);
		}
	}

	function subscribeWSSTimeframes(wss, tool_id, option_kind) {

		if (indexOf(subscribed_timeframes, tool_id + "-" + option_kind) == -1) {
			subscribed_timeframes.push(tool_id + "-" + option_kind);

			if (settings_wss[view.option_kinds.getNameById(option_kind)] != null && settings_wss[view.option_kinds.getNameById(option_kind)].enable == "false") {
				return;
			}

			if (partner_params.arrayHooks) {
				var arrTimerfames = [];
				for (var i in timeframes) {
					arrTimerfames.push(i);
				}
				wss.send(wssQuery.HookTimeframesNew
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{option_kind}", option_kind)
					.replace("{tool_id}", tool_id)
					.replace('"{timeframe_id}"', "[" + arrTimerfames.toString() + "]"));

			} else {
				if (partner_params.useNewHookTimeframes) {
					for (var i in timeframes) {
						wss.send(wssQuery.HookTimeframesNew
							.replace("{bo}", (account_type == '') ? 'demo' : account_type)
							.replace("{option_kind}", option_kind)
							.replace("{tool_id}", tool_id)
							.replace("{timeframe_id}", i));

					}
				} else {
					for (var i in timeframes) {
						wss.send(wssQuery.HookTimeframes
							.replace("{bo}", (account_type == '') ? 'demo' : account_type)
							.replace("{option_kind}", option_kind)
							.replace("{tool_id}", tool_id)
							.replace("{timeframe_id}", i));
					}
				}

			}
		}
	}


	function subscribeWSSEarly(wss, tool_id, option_kind) {

		if (settings_wss[view.option_kinds.getNameById(option_kind)] != null && settings_wss[view.option_kinds.getNameById(option_kind)].enable == "false") {
			return;
		}


		if (partner_params.arrayHooks) {
			var arrTimerfames = [];
			for (var i in timeframes) {
				arrTimerfames.push(i);
			}

			if (indexOf(subscribed_early, tool_id + "-" + option_kind) == -1) {
				subscribed_early.push(tool_id + "-" + option_kind);
				wss.send(wssQuery.HookEarlyClose
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{option_kind}", option_kind)
					.replace("{tool_id}", tool_id)
					.replace('"{timeframe_id}"', "[" + arrTimerfames.toString() + "]"));
			}
		} else {

			if (indexOf(subscribed_early, tool_id + "-" + option_kind) == -1) {
				subscribed_early.push(tool_id + "-" + option_kind);
				for (var i in timeframes) {
					if (cache_hook_early[option_kind + "-" + tool_id + "-" + i] == null) {
						wss.send(wssQuery.HookEarlyClose
							.replace("{bo}", (account_type == '') ? 'demo' : account_type)
							.replace("{option_kind}", option_kind)
							.replace("{tool_id}", tool_id)
							.replace("{timeframe_id}", i)
						);
					}
				}
			}

		}

	}


	function unsubscribeExcess() {
		var lauched = [];
		var id;
		if (view.option_kinds != null) {

			_(view.consoles.models).each(function (item) {
				id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
				if (indexOf(lauched, id) == -1) {
					lauched.push(id);
				}
			});

			if (view.opened_options.models.length > 0)
				_(view.opened_options.models).each(function (item) {
					id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
					if (indexOf(lauched, id) == -1) {
						lauched.push(id);
					}
				});
		}
		log([lauched, subscribed, subscribed_early, subscribed_timeframes]);

	}

	function unsubscribeWSSExcess() {

		var lauched = [];
		var id;
		if (view.option_kinds != null) {

			_(view.consoles.models).each(function (item) {
				id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
				if (indexOf(lauched, id) == -1) {
					lauched.push(id);
				}
			});

			if (view.opened_options.models.length > 0)
				_(view.opened_options.models).each(function (item) {
					id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
					if (indexOf(lauched, id) == -1) {
						lauched.push(id);
					}
				});
		}

		var tool_id, option_kind;
		for (var i in subscribed_timeframes) {
			if (indexOf(lauched, subscribed_timeframes[i]) == -1) {
				tool_id = subscribed_timeframes[i].split("-")[0];
				option_kind = subscribed_timeframes[i].split("-")[1];

				unsubscribeWSSTimeframes(wss_conn, tool_id, option_kind);

				delete subscribed_timeframes[i];
			}
		}

		for (var i in subscribed_early) {
			if (indexOf(lauched, subscribed_early[i]) == -1) {
				tool_id = subscribed_early[i].split("-")[0];
				option_kind = subscribed_early[i].split("-")[1];

				//unsubscribeWSSEarly(wss_conn, tool_id, option_kind);

				delete subscribed_early[i];
			}
		}

		lauched_ids = null;
	}

	function getLaunched() {
		var lauched = [];
		if (view.option_kinds != null) {

			_(view.consoles.models).each(function (item) {
				id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
				if (indexOf(lauched, id) == -1) {
					lauched.push(id);
				}
			});

			if (view.opened_options.models.length > 0)
				_(view.opened_options.models).each(function (item) {
					id = item.get("tool").tool_id + "-" + view.option_kinds.getIdByName(item.get("kind"));
					if (indexOf(lauched, id) == -1) {
						lauched.push(id);
					}
				});
		}
		return lauched;

	}

	function resubscribeWSS() {

		var lauched = getLaunched();
		var id;

		var tool_id, option_kind;
		for (var i in subscribed_timeframes) {
			option_kind = subscribed_timeframes[i].split("-")[1];
			if (indexOf(lauched, subscribed_timeframes[i]) == -1 || hookTimeframesOnlySelectedOptionKind && option_kind != view.option_kinds.getIdByName(view.kind)) {
				tool_id = subscribed_timeframes[i].split("-")[0];
				unsubscribeWSSTimeframes(wss_conn, tool_id, option_kind);
				delete subscribed_timeframes[i];
			}

			//if (indexOf(lauched, subscribed_timeframes[i]) == -1) {
			//unsubscribeWSSEarly(wss_conn, tool_id, option_kind);
			//}
		}
		if (lauched.length > 0) {
			for (var i in lauched) {
				if (lauched[i].split !== undefined && (!hookTimeframesOnlySelectedOptionKind || lauched[i].split("-")[1] == view.option_kinds.getIdByName(view.kind))) {
					tool_id = lauched[i].split("-")[0];
					option_kind = lauched[i].split("-")[1];
					subscribeWSS(wss_conn, tool_id);
					subscribeWSSTimeframes(wss_conn, tool_id, option_kind);
				}

				if (lauched[i].split !== undefined) {
					tool_id = lauched[i].split("-")[0];
					option_kind = lauched[i].split("-")[1];
					subscribeWSSEarly(wss_conn, tool_id, option_kind);
				}
			}
		}

		lauched = null;
		lauched_ids = null;
		tool_id = null;
		option_kind = null
	}


	function unsubscribeWSSTimeframes(wss, tool_id, option_kind) {
		var id = "";
		if (partner_params.arrayHooks) {
			var arrTimerfames = [];
			for (var i in timeframes) {
				arrTimerfames.push(i);
			}
			wss.send(wssQuery.UnHookTimeframes
				.replace("{bo}", (account_type == '') ? 'demo' : account_type)
				.replace("{option_kind}", option_kind)
				.replace("{tool_id}", tool_id)
				.replace('"{timeframe_id}"', "[" + arrTimerfames.toString() + "]"));

		} else {

			for (var i in timeframes) {
				wss.send(wssQuery.UnHookTimeframes
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
					.replace("{option_kind}", option_kind)
					.replace("{tool_id}", tool_id)
					.replace("{timeframe_id}", i));

				id = option_kind + "-" + tool_id + "-" + i;
				delete(hook_timeframes_cache[id]);
			}
		}
		arrTimerfames = null;
	}

	function unsubscribeWSSEarly(wss, tool_id, option_kind) {
		if (partner_params.arrayHooks) {
			var arrTimerfames = [];
			for (var i in timeframes) {
				arrTimerfames.push(i);
			}
			wss.send(wssQuery.UnHookEarlyClose
				.replace("{option_kind}", option_kind)
				.replace("{tool_id}", tool_id)
				.replace('"{timeframe_id}"', "[" + arrTimerfames.toString() + "]"));

		} else {
			for (var i in timeframes) {
				wss.send(wssQuery.UnHookEarlyClose
					.replace("{option_kind}", option_kind)
					.replace("{tool_id}", tool_id)
					.replace("{timeframe_id}", i)
				);
			}
		}
	}


	function unsubscribeWSS(wss, tool_id) {

		for (var i in timeframes) {
			wss.send('{"command":"hook_timeframes","tool_id":"' + tool_id + '","timeframe_id":"' + i + '","bo":"{bo}","source":"site","enable":"false","interval":"1000"}'
					.replace("{bo}", (account_type == '') ? 'demo' : account_type)
			);
		}

		if (partner_params.unsubscribeTools) {

			wss.send('{"command":"hook_quotes","bo":"{bo}","source":"site","tool_id":"{tool_id}","enable":"false","interval":"{interval}"}'
				.replace("{bo}", (account_type == '') ? 'demo' : account_type)
				.replace("{tool_id}", tool_id)
				.replace("{interval}", js_params.quote_interval)
			);
		}
	}

	function updateSubscribtionsWSS() {

		var lauched_ids = [];
		var tool_id;

		if (view.consoles.models.length > 0)
			_(view.consoles.models).each(function (item) {

				tool_id = item.get("tool").tool_id;
				if (lauched_ids.indexOf(tool_id) == -1) {
					lauched_ids.push(parseInt(tool_id));
				}
			});

		if (view.opened_options.models.length > 0)
			_(view.opened_options.models).each(function (item) {

				tool_id = item.get("tool").tool_id;
				if (lauched_ids.indexOf(tool_id) == -1) {
					lauched_ids.push(parseInt(tool_id));
				}
			});


		if (view.opened_options.models.length > 0) {
			_(view.opened_options.models).each(function (item) {

				tool_id = item.get("tool").tool_id;
				if (lauched_ids.indexOf(tool_id) == -1) {
					lauched_ids.push(parseInt(tool_id));
				}
			});
		}

		//удалить лишние подписки

		for (var i in subscribed) {
			if (lauched_ids.indexOf(subscribed[i]) == -1) {
				unsubscribeWSS(wss_conn, subscribed[i]);
				delete subscribed[i];
			}
		}


		//подписаться на недостающие
		for (var i in lauched_ids) {
			if (subscribed.indexOf(lauched_ids[i]) == -1) {
				subscribeWSS(wss_conn, lauched_ids[i]);
				subscribed.push(lauched_ids[i]);

			}
		}


		unsubscribeWSSExcess();

	}

	var wssQuery = {};
	wssQuery.GetAffiliateList = '{"command":"get_affiliate_list"}';
	wssQuery.HookTime = '{"command":"hook_time","enable":"true"}';
	wssQuery.GetTradeSettings = '{"command":"get_cfg_trade","language":"{language}"}';
	wssQuery.ConnectWithUsernameAndPassword = '{"command":"connect","bo":"{bo}","email":"{username}","login":"{username}","password":"{password}","platform":"mt4","source":"site"}';
	wssQuery.ConnectWithUserhash = '{"command":"connect","bo":"{bo}","hash":"{user_hash}","platform":"mt4","source":"site"}';
	wssQuery.ConnectWithToken = '{"command":"connect","token":"{token}"}';
	wssQuery.HookQuotes = '{"command":"hook_quotes","bo":"{bo}","source":"site","tool_id":"{tool_id}","enable":"true","interval":"100"}';
	wssQuery.HookTimeframes = '{"command":"hook_timeframes","option_kind":"{option_kind}","tool_id":"{tool_id}","timeframe_id":"{timeframe_id}","bo":"{bo}","source":"site","enable":"true","interval":"1000"}';
	wssQuery.HookEarlyClose = '{"command":"hook_close_early","option_kind":"{option_kind}","tool_id":"{tool_id}","timeframe_id":"{timeframe_id}","bo":"{bo}","source":"site","enable":"true","interval":"1000"}';
	wssQuery.HookTimeframesNew = '{"mode":"new","command":"hook_timeframes","option_kind":"{option_kind}","tool_id":"{tool_id}","timeframe_id":"{timeframe_id}","bo":"{bo}","source":"site","enable":"true","interval":"1000"}';
	wssQuery.UnHookTimeframes = '{"command":"hook_timeframes","option_kind":"{option_kind}","tool_id":"{tool_id}","timeframe_id":"{timeframe_id}","bo":"{bo}","source":"site","enable":"false","interval":"1000"}';

	wssQuery.HookOptions = '{"command":"hook_options","source":"site","enable":"true","interval":"100"}';


	if (typeof (language_url) == "undefined") {
		language_url = "lang.json";
	}

	$.getJSON(language_url, function () {
	})
		.success(function (result) {
			var binary_page = result;
			l100n.add_page("binary", binary_page);
		})
		.error(function () {
			var binary_page = default_lang_file;
			l100n.add_page("binary", binary_page);
		});


//запуск программы
	var start = function () {
		if (ieVersion < 9) {
			l100n.localize_all_pages(language);
			alert($("#messages .old_browser").text());

			return;
		}

		if (interval != null) {
			clearInterval(interval);
		}
		if (intervalCheckConnection != null) {
			clearInterval(intervalCheckConnection);
		}
		wss_conn = new WssConn(wss_url, view.user.username, view.user.password);
		interval = setInterval(prepareWorkspace, 500);
		intervalCheckConnection = setInterval(checkConnection, partner_params.reloadTime);

	};

	this.initialize = function () {
		start();
	};
//переподключение с заданным хэшем
	this.connectWith = function (input) {
		if (input.hash == null || input.type == null) {
			console.error("empty hash or type");
			return;
		}

		switch (input.type) {
			case "userhash":
				s_userhash = input.hash;
				s_token = "";
				break;
			case "token":
				s_userhash = "";
				s_token = input.hash;
				break;
		}

		wss_conn.wss.close();
		wss_conn.state = "closed";

		interval = setInterval(prepareWorkspace, 500);

		wss_conn = new WssConn(wss_url, view.user.username, view.user.password);

		view.opened_options.reset();

		$(".binsta_option").each(function (key, elem) {
			$(elem).remove();
		});

		setTimeout(function () {
			wss_conn.send(wssQuery.hookOptions);
		}, 3000);

		try {
			$(".binsta_oo__switcher__item[data-tab='opened']").trigger("click");
		} catch (e) {
		}
	}


//общие функции
	var common = function () {
	};

//общие функции
	var widgets = function () {
	};

	var lengthTest = 0, global_time_start = microtime(true);

	common.handleWssMessage = function (data) {

		var data = data.data;
		// console.log(data);

		//data = data.toString().replaceAll('"}"', '"}');
		//data = data.toString().replaceAll('"{"', '{"');
		if (data == "{}") return;
		var json_data = "";
		try {
			json_data = Jp(data);
		} catch (e) {
			console.log(["wsserror", e.name, data]);
			json_data = null;
			return;
		}

		//([json_data.result,data]);
		//PROFILING
		if (js_params.profiling && json_data != null && json_data.result)
			console.time(json_data.result);
		switch (json_data.result) {

			case "connect":


				if (json_data.error == "11") {

					if (typeof(localStorage) != "undefined") {
						if (localStorage.tokenErrorCount == null) {
							localStorage.tokenErrorCount = 1;
						} else {
							localStorage.tokenErrorCount--;
						}
					}

					if (typeof(localStorage) != "undefined" && localStorage.tokenErrorCount >= 0) {

						if ((js_params.disable_reconnect == true || js_params.disable_reconnect == "true")) {
							setTimeout(function () {
								window.location.reload();
							}, 3000);
						}

					} else {
						bw_alert(view.messages.find(".error-token").text());
					}

					return;
				} else {
					if (typeof(localStorage) != "undefined") {
						localStorage.tokenErrorCount = 1;
					}
				}

				if (json_data.error == "410") {
					l100n.localize_all_pages(language);
					$('#main-container').find('.account-disabled').remove();
					$(".bsw_loader").hide();
					$('.tabs').hide();
					$('#main-container').prepend("<h2 class='account-disabled-message' style='text-align:center'>" + view.messages.find(".account-disabled").text() + "</h2>");
					return;
				}


				if (json_data.error != "5") {
					//(["connect",json_data]);
					//wss_conn.send(wssQuery.HookTime);
					wss_conn.send(wssQuery.GetTradeSettings.replace("{language}", language));
				}

				subscribed = [];
				subscribed_timeframes = [];
				subscribed_early = [];


				//(["connect",json_data]);
//            console.timeEnd("коннект");
				if (json_data.error == "3") {
					view.user.error_not_found = true;

					view.user.error_not_found = true;
					view.setTradeMessage(view.messages.find(".error_auth").html(), "");

					view.widgets.remove();

					l100n.localize_all_pages(language);

				} else {
					view.user.error_not_found = false;
				}

				/*                if (js_params.p == "2") {
				 view.widgetCollection.add({"name": "autochartist"});
				 }*/

				view.hideTradeMessage();
				view.loadUserData();

				if (!view.user.isGuest() && json_data.error != "5") {
					wss_conn.send('{"command":"hook_user_status","enable":"true"}');
				}


				if (hook_tool_enable && json_data.error != "5") {
					wss_conn.send('{"command":"hook_tool","enable":"true"}');
				}

				if (json_data.currency_symbol != null) {
					currency = unescape(JSON.parse('"' + json_data.currency_symbol + '"'));

					if (json_data.currency_symbol == "\u0420") {
						currency = "₽";
					}
					if (!isIE && currency == "P") {
						currency = "₽";
					}
					if (isIE && currency == "₽") {
						currency = "P";
					}

					view.updateCurrency();
				}

				if (json_data.error != "5") {
					setTimeout(function () {
						wss_conn.send(wssQuery.HookOptions);
					}, 5000);
				}

				if (reconnect) {
					setTimeout(function () {
						try {
							$(".b_options_types_item.active").eq(0).removeClass("active").trigger("click");
						} catch (e) {
							log(e);
						}
					}, 2000);
				}

				if (!recieve_settings_from_ws)
					settings_recieved = true;

				if ($(".bsw_loader")[0] != null && !partner_params.hidePreloaderOnGetHistory) {
					setTimeout(function () {
						$(".bsw_loader").hide();
					}, 5000);
				}

				break;

			case "get_affiliate_list":

				if (json_data != null && json_data.affiliates != null && json_data.affiliates[0] != null) {
					common.setDepartment(json_data.affiliates[0]);
				}
				break;

			case "get_tool_nontrading_intervals":
				if (json_data != null && json_data.tool_id != null)
					get_tool_nontrading_intervals_cache[json_data.tool_id] = json_data.tool_schedule;
				break;

			case "get_user_settings":

				if (json_data.error == "0") {

					try {
						json_data.user_settings = Jp(json_data.user_settings.replaceAll("|", '"'));
					} catch (e) {
						json_data.user_settings = user_data_default;
					}
					if (json_data.user_settings != null) {

						var data = json_data.user_settings;

						if (data.accept_autochartist != null) {
							view.user.accept_autochartist = data.accept_autochartist;
						}
						view.user.user_data = data;

						if (!isLocalstorageAvailable()) {
							localData.user_data = {};
							localData.user_data = Js(view.user.user_data);
						} else {
							localStorage.user_data = Js(view.user.user_data);
						}

						data = null;
					}
				} else if (json_data.error == "8") {
					view.addSaveDataRequest();
				}

				view.updateSettingsSelectors();

				user_settings_recieved = true;
				break;

			case "hook_tool":
				chart.hook_tool(json_data);

				json_data = null;
				break;

			case "get_cfg_trade":

				settings_recieved = true;
				if (!recieve_settings_from_ws) {
					return
				}


				// console.timeEnd("получены настройки");
				settings_wss = {};
				// console.log(Js(json_data));
				for (var i = 0; i < json_data.options_settings.length; i++) {
					if(json_data.options_settings[i].hasOwnProperty('option_kind')) {
						settings_wss[view.option_kinds.getNameById(json_data.options_settings[i].option_kind)]=json_data.options_settings[i];
					}
				}
				view.option_kinds.forEach(function(model){
					var kind = model.get('name');
					if(!settings_wss.hasOwnProperty(kind)){
						settings_wss[kind]=null;
					}
				});
				// settings_wss.classic = (json_data.options_settings[0] == undefined) ? null : json_data.options_settings[0];
				// settings_wss.touch = (json_data.options_settings[1] == undefined) ? null : json_data.options_settings[1];
				// settings_wss.range = (json_data.options_settings[2] == undefined) ? null : json_data.options_settings[2];
				// settings_wss.touch_advanced = (json_data.options_settings[3]==undefined) ? null : json_data.options_settings[3];
				// settings_wss.range_advanced = (json_data.options_settings[4]==undefined) ? null : json_data.options_settings[4];


				// if (json_data.options_settings.length >= 6) {
				//     settings_wss.range_classic = (json_data.options_settings[5] == undefined) ? null : json_data.options_settings[5];
				// }


				tools = [];

				if (settings_wss.classic != null) {
					settings_wss.classic.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.classic.tools) {
						if (get_tool(parseInt(settings_wss.classic.tools[i].tool_id)) == null)
							tools.push(settings_wss.classic.tools[i]);
					}
					for (var i in settings_wss.classic.timeframes) {
						timeframes[settings_wss.classic.timeframes[i].id] = settings_wss.classic.timeframes[i].timeframe_nom;
						timeframeLockTimes[settings_wss.classic.timeframes[i].id] = settings_wss.classic.timeframes[i].lock_time;
					}
				}
				if (settings_wss.touch != null) {
					settings_wss.touch.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.touch.tools) {
						if (get_tool(parseInt(settings_wss.touch.tools[i].tool_id)) == null)
							tools.push(settings_wss.touch.tools[i]);
					}
					for (var i in settings_wss.touch.timeframes) {

						timeframes[settings_wss.touch.timeframes[i].id] = settings_wss.touch.timeframes[i].timeframe_nom;


					}
				}
				if (settings_wss.range != null) {
					settings_wss.range.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.range.tools) {
						if (get_tool(parseInt(settings_wss.range.tools[i].tool_id)) == null)
							tools.push(settings_wss.range.tools[i]);
					}
					for (var i in settings_wss.range.timeframes) {
						timeframes[settings_wss.range.timeframes[i].id] = settings_wss.range.timeframes[i].timeframe_nom;

					}
				}
				if (settings_wss.touch_advanced != null) {
					settings_wss.touch_advanced.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.touch_advanced.tools) {
						if (get_tool(parseInt(settings_wss.touch_advanced.tools[i].tool_id)) == null)
							tools.push(settings_wss.touch_advanced.tools[i]);
					}
					for (var i in settings_wss.touch_advanced.timeframes) {
						timeframes[settings_wss.touch_advanced.timeframes[i].id] = settings_wss.touch_advanced.timeframes[i].timeframe_nom;


					}
				}
				if (settings_wss.range_advanced != null) {
					settings_wss.range_advanced.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.range_advanced.tools) {
						if (get_tool(parseInt(settings_wss.range_advanced.tools[i].tool_id)) == null)
							tools.push(settings_wss.range_advanced.tools[i]);
					}
					for (var i in settings_wss.range_advanced.timeframes) {
						timeframes[settings_wss.range_advanced.timeframes[i].id] = settings_wss.range_advanced.timeframes[i].timeframe_nom;

					}
				}
				if (settings_wss.range_classic != null) {
					settings_wss.range_classic.tools.sort(function (x, y) {
						return ((x["tool_view_name"] < y["tool_view_name"]) ? -1 : (x["tool_view_name"] > y["tool_view_name"]) ? 1 : 0);
					});
					for (var i in settings_wss.range_classic.tools) {
						if (get_tool(parseInt(settings_wss.range_classic.tools[i].tool_id)) == null)
							tools.push(settings_wss.range_classic.tools[i]);
					}
					for (var i in settings_wss.range_classic.timeframes) {
						timeframes[settings_wss.range_classic.timeframes[i].id] = settings_wss.range_classic.timeframes[i].timeframe_nom;
					}
				}


				if (use_left_widget) {
					if (!use_new_left_widget) {

						var enabled_kinds = [];
						for (var i in settings_wss) {
							if (settings_wss[i] != null && settings_wss[i].enable == "true") {
								enabled_kinds.push(settings_wss[i].option_kind);
							}
						}
						for (var i in tools) {
							for (var j in enabled_kinds) {
								subscribeWSSTimeframes(wss_conn, tools[i].tool_id, enabled_kinds[j]);
							}
						}
						enabled_kinds = null;
						setTimeout(resubscribeWSS, 5000);

					} else {

						var enabled_kinds = [];
						for (var i in settings_wss) {
							if (settings_wss[i] != null && settings_wss[i].enable == "true") {
								enabled_kinds.push(settings_wss[i].option_kind);
							}
						}

						for (var i in tools) {
							for (var j in enabled_kinds) {
								subscribeWSSPayouts(wss_conn, tools[i].tool_id, enabled_kinds[j]);
							}
						}

						setInterval(checkLeftWidgetPayouts, 3000);

						enabled_kinds = null;
					}
				}


				if (isLondonInSummerTime) {
					tradeTimes = {
						begin: "0210000",
						end: "5210000"
					}
				} else {
					tradeTimes = {
						begin: "0220000",
						end: "5220000"
					}
				}


				settings_recieved = true;

				break;
			case "hook_time":
				$('.serverTime span.time').html(common.UTS2Time(json_data.time * 1000));
				option.updateTime(parseInt(json_data.time) * 1000 - (isLondonInSummerTime ? 3600000 : 0));
				utsTime = json_data.time * 1000;
				time_recieved = true;
				break;
			case "hook_trade_time":

				view.time_zone_val = json_data.time_zone;
				view.time_zone_number = parseInt(json_data.time_zone.replace("UTC", "").replace("GMT", "").replace(":00", "").replace(":30", ""));
				//need to notice ":30 timezone"!!!
				view.timezone.html(json_data.time_zone);
				delete json_data.result;
				delete json_data.error;
				view.trade_status = json_data;

				status_recieved = true;
				break;
			case "hook_quotes":
				// console.log(Js(json_data.quotes));
				delete json_data.error;
				delete json_data.result;
				var time1 = json_data.time;

				delete json_data.time;
				var newquotes = {};

				if (ieVersion != null && ieVersion < 9) {
					for (var el in json_data.quotes) {
						var temp_arr = [];
						temp_arr.length = 0;
						newquotes[json_data.quotes[el].name] = {};
						newquotes[json_data.quotes[el].name][utcTime / 1000] = json_data.quotes[el].value;
						quotes_cache[json_data.quotes[el].name] = json_data.quotes[el].value;
					}

				} else {
					for (var el in json_data.quotes) {
						var temp_arr = [];
						temp_arr.length = 0;
						temp_arr[time1 - (isLondonInSummerTime ? 0 : 0)] = json_data.quotes[el].value;
						newquotes[json_data.quotes[el].name] = $.extend({}, temp_arr);
						quotes_cache[json_data.quotes[el].name] = json_data.quotes[el].value;
					}
				}
				chart.drawMain(newquotes);
				wipe(newquotes);
				newquotes = null;

				break;
			case "get_quotes_history":
				//(["get_quotes_history",json_data,data,UTS2DateAndTime(json_data.time[0]*1000)]);
				if (json_data.error == '8') {
					getHistoryMain = false;
					getHistoryToolMain.push(json_data.tool_id);
					getHistoryConsoleMain.push(json_data.request_id);

				} else {

					chart.setHistoryFromWss(json_data);
					chart.closeLoading();
					if ($(".bsw_loader")[0] != null && !partner_params.hidePreloaderOnGetHistory) {
						setTimeout(function () {
							$(".bsw_loader").hide();
						}, 0);
					}
				}
				break;

			case "hook_timeframes":
				//(Js(json_data));
				if (json_data.error == "410") {
					window.location.href = location.href;
				}

				if (json_data.error == "0") {
					if ($.inArray(json_data.hook_timeframes[0].tool_id, getHistoryToolMain) > 0) {

					} else {

						view.setEndTimes(json_data.hook_timeframes);
					}
				}

				break;

			case "hook_close_early":

				if (json_data != null && json_data.hook_close_early != null && json_data.hook_close_early.length > 0) {
					var len = json_data.hook_close_early.length;
					for (var i = 0; i < len; i++) {
						cache_hook_early[json_data.hook_close_early[i].option_kind + "-" + json_data.hook_close_early[i].tool_id + "-" + json_data.hook_close_early[i].timeframe_id] = json_data.hook_close_early[i];
					}
					len = null;
				}

				break;
			case "open_option":
				if (json_data.error == "410") {
					window.location.href = location.href;
					break;
				}
				log(["open_option", Jps(json_data)]);
				if (json_data.status == "1") {
					global_last_button_buy_autochartist = null;
				}
				option.openOptionWss(json_data);
				break;
			case "get_user_options_history":
				//(["get_user_options_history", (json_data)]);
				option.setClosedBinaryOptionsFromWss(json_data);
				break;
			case "get_user_transactions":
				log(["get_user_transactions", (json_data)]);
				option.setOperationsHistoryFromWss(json_data);
				break;
			case "hook_user_status":
				//(["hook_user_status",Jps(json_data),json_data.options_opened,json_data.deposit]);
				if (json_data.deposit != null && !isNaN(parseFloat(json_data.deposit)) && json_data.options_opened != null) {
					//Post data to balaceUrl if it is configured
					if (window.platform_type=="real" && window.hasOwnProperty('balanceUrl') && window.balanceUrl != null) {
						try {
							$.ajax({
								url: window.balanceUrl,
								method: "POST",
								data: {
									deposit: json_data.deposit,
									credit: json_data.credit,
									allowed_loan_trade: json_data.allowed_loan_trade
								},
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								success:function (res) {

								},
								error: function (jqXHR, textStatus) {
									console.log("Post balance failed: balanceUrl:" + window.balanceUrl
										+ ", status: " + jqXHR.status+ ' - ' + jqXHR.statusText
										+ ", data:" + Js({
											deposit: json_data.deposit,
											credit: json_data.credit,
											allowed_loan_trade: json_data.allowed_loan_trade
										})
									);
								}
							});
						}catch(e){

						}
					}
					view.user.setDeposit(json_data.deposit, true, json_data.credit, json_data.allowed_loan_trade);
					setBonus(json_data.bonus);
					view.user.setOpenedCount(json_data.options_opened);
					if (json_data.allowed_loan_trade == "true") {
						view.user.setCredit(json_data.credit);
					} else {
						view.user.setCredit(0);
					}

					view.user.setAvailableAmount(parseFloat(json_data.deposit).toFixed(13));

				}
				break;
			case "hook_options":
			case "hook_options_all":
				log(["hook_options", json_data]);
				if (!view.user.isGuest() || guestWithHookOptions) {
					option.openAllOptionsWss(json_data);
				}
				option.closeAllOptionsWss(json_data);

				break;

			case "hook_signal":
				log(["hook_signal", Js(json_data)]);
				setSignals(json_data);
				wipe(json_data);
				json_data = null;
				break;

			case "set_user_settings":
				break;
			case "option_close_early":

				//(["option_close_early", Js(json_data)]);

				if (json_data.error != "0" && json_data.request_id != null) {
					_(view.opened_options.models).each(function (elem) {
						if (elem.get("hash") == json_data.request_id) {
							elem.sell_now.removeClass("inactive").removeClass("closearly");
							elem.sell_now.parents('.summary_line').find('.option_sell_now_timer').show();
							elem.sell_now.parents('.summary_line').find('.option_sell_payout').show();
						}
					});
					common.cleanEarlyHash(json_data.request_id);
				}

				break;
			case "hook_cfg_payout_rates":

				if (json_data.rates != null && json_data.rates.length > 0) {
					view.setPayoutRates(json_data.rates);
				}
				break;
			default:
				//(["other", json_data,Js(json_data)]);
				getHistoryMain = true;
		}
		//PROFILING
		if (js_params.profiling && json_data != null && json_data.result)
			console.timeEnd(json_data.result);
	}

	common.UTS2Date = function (uts) {
		//var newuts = uts - londonTimeCorrection;

		if (isLondonInSummerTime) {
			uts += 3600000;
		}

		var date1 = new Date(parseInt(uts));
		var date = date1.getUTCDate();
		var month = date1.getUTCMonth() + 1;
		var year = date1.getUTCFullYear();

		date = date <= 9 ? "0" + date : date;
		month = month <= 9 ? "0" + month : month;

		var formattedTime = date + '.' + month + '.' + year;
		//newuts = null;

		date1 = null;

		date = null;
		month = null;
		year = null;

		return formattedTime;
	}

	common.UTS2DateTime = function (uts) {


		var date = new Date(uts);
		var year = date.getUTCFullYear();

		var day = date.getUTCDate();
		var month = date.getUTCMonth() + 1;
		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		var seconds = date.getUTCSeconds();
		minutes = minutes <= 9 ? "0" + minutes : minutes;
		seconds = seconds <= 9 ? "0" + seconds : seconds;
		month = month <= 9 ? "0" + month : month;
		day = day <= 9 ? "0" + day : day;
		hours = hours <= 9 ? "0" + hours : hours;

		var formattedTime = day + '.' + month + '.' + year + " " + hours + ':' + minutes + ':' + seconds;
		wipe(date);
		date = null;
		year = null;
		day = null;
		month = null;
		hours = null;
		minutes = null;
		seconds = null;
		return formattedTime;
	}

	common.getStartDate = function (tool_id) {
		if (get_tool_nontrading_intervals_cache[tool_id] != null) {
			var tz = view.time_zone_number,
				result,
				time = utsTime,
				date = new Date(time),
				day = date.getUTCDay(),
				first = date.getDate() - date.getDay(),
				firstday = new Date(date.setDate(first)),
				open_time;

			firstday.setUTCHours(0);
			firstday.setUTCMinutes(0);
			firstday.setUTCSeconds(0);

			var utc_first = firstday.getTime() - 3600000 * tz;

			var intervals = [];

			i = 0;
			while (i <= 6) {
				if (get_tool_nontrading_intervals_cache[tool_id][i] != null) {
					intervals.push(get_tool_nontrading_intervals_cache[tool_id][i].schedule.split(","));
				}
				i++;
			}

			for (var i in intervals) {
				for (var j in intervals[i]) {
					intervals[i][j] = intervals[i][j].split("-");

					if (intervals[i][j][0] != null) {
						intervals[i][j][0] = intervals[i][j][0].split(":");
					}
					if (intervals[i][j][1] != null) {
						intervals[i][j][1] = intervals[i][j][1].split(":");
					}
				}
			}


			var day, interval_start, interval_end, day_offset;
			for (var i in intervals) {
				day = i;
				day_offset = day * 86400000;

				for (var j in intervals[i]) {
					if (intervals[i][j][0] != null) {
						//intervals[i][j][0][0]=parseInt(intervals[i][j][0][0]);
						//intervals[i][j][0][1]=parseInt(intervals[i][j][0][1]);
						intervals[i][j][0] = (utc_first + day_offset + parseInt(intervals[i][j][0][0]) * 3600000 + parseInt(intervals[i][j][0][1]) * 60000);
					}
					if (intervals[i][j][1] != null) {
						//intervals[i][j][1][0]=parseInt(intervals[i][j][1][0]);
						//intervals[i][j][1][1]=parseInt(intervals[i][j][1][1]);
						intervals[i][j][1] = (utc_first + day_offset + parseInt(intervals[i][j][1][0]) * 3600000 + parseInt(intervals[i][j][1][1]) * 60000);
					}
				}
			}

			result = 0;
			open_time = 0;
			for (var i in intervals) {
				for (var j in intervals[i]) {
					if (intervals[i][j][0] != null && intervals[i][j][1] != null) {
						if (utsTime > intervals[i][j][0] && utsTime < intervals[i][j][1]) {
							result = intervals[i][j][1] - utsTime;
							open_time = intervals[i][j][1];
							//([UTS2DateAndTime(intervals[i][j][1]),UTS2DateAndTime(utsTime)]);
						}
					}
				}
			}

			return {open_time: open_time, result_human: toDDHHMMSS(result), result: result};
			// получить timestamp сегодняшних интервалов
			// найти timestamp следующего интервала, если он четный то вернуть разницу с текущим
		} else {
			return {open_time: 0, result_human: toDDHHMMSS(0), result: 0};
		}
	};

	common.UTS2Time = function (uts) {
		var date = new Date(parseInt(uts));

		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		var seconds = date.getUTCSeconds();
		hours = hours <= 9 ? "0" + hours : hours;
		minutes = minutes <= 9 ? "0" + minutes : minutes;
		seconds = seconds <= 9 ? "0" + seconds : seconds;

		wipe(date);

		date = null;

		return hours + ':' + minutes + ':' + seconds;
	};

	common.UTS2TimeMin = function (uts) {
		var date = new Date(parseInt(uts));

		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();

		hours = hours <= 9 ? "0" + hours : hours;
		minutes = minutes <= 9 ? "0" + minutes : minutes;

		wipe(date);

		date = null;

		return hours + ':' + minutes;
	};

	common.checkWinRange = function (p) {
		if (p.use_one_tunnel) {
			if (p.dir == "IN") {
				return (p.pC > p.p2 && p.pC < p.p1);
			} else {
				//([p,p.pC >= p.p1 || p.pC <= p.p2]);
				return (p.pC > p.p1 || p.pC < p.p2);
			}
		} else {
			if (p.dir == "IN") {
				return (p.pC > p.p2 && p.pC < p.p1 || p.pC > p.p4 && p.pC < p.p3);
			} else {
				return (p.pC > p.p1 || p.pC < p.p3);
			}
		}
	};

	common.cleanEarlyHash = function (deleteValue) {
		for (var i = 0; i < gc.earlyCloseHashes.length; i++) {
			if (gc.earlyCloseHashes[i] == deleteValue) {
				gc.earlyCloseHashes.splice(i, 1);
				i--;
			}
		}
	};

	common.checkWinTouch = function (p) {
		return (p.p1 != null && p.pC >= p.p1 || p.p2 != null && p.pC <= p.p2);
	};

	common.checkPlugin = function (plugin) {
		return js_params.plugins != "undefined" && indexOf(js_params.plugins, plugin) !== -1;
	};

	common.getTradingIntervals = function (tool_id) {
		wss_conn.send('{"command":"get_tool_nontrading_intervals","tool_id":"' + tool_id + '"}');
	};

	common.checkopenedOptionsGuest = function () {
		view.user.setOpenedCount(view.opened_options.length);
	};

	common.getEarlyPercent = function (index) {
		if (cache_hook_early[index] != null) {
			return cache_hook_early[index];
		} else {
			return {
				"result": "get_close_early",
				"early_allow": "0",
				"early_percent_win": "0",
				"early_percent_lose": "0",
				"early_interval": "0"
			};
		}
	};

	common.checkTime = function (time) {


		if (view.trade_status.allow != "true" && view.error_not_found != true) {

			view.setTradeMessage(view.trades_closed_header.text(), view.trades_closed_before.text());

			if (view.trade_status.change_at != null) {
				view.trades_closed_time.text(toDDHHMMSS2(view.trade_status.change_at * 1000 - utcTime));
			} else {
				view.trades_closed_time.text('-');
			}

			tradeStatus = "closed";

		} else {
			if (tradeStatus == "closed") {
				tradeStatus = "opened";
				view.hideTradeMessage();
			}

			resubscribeWSS();
		}
	};

	common.clone = function (obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	};

	common.elemsCache = [];

	common.nodeCache = [];

	common.setDepartment = function (data) {
		if (data.logo != null) {
			$("#logo").setImageFromBase64(data.logo);
		}
	};

	common.getDepartment = function () {
		wss_conn.send(wssQuery.GetAffiliateList);
	};

	common.declOfNum = function (n, titles) {
		cases = [2, 0, 1, 1, 1, 2];
		return titles[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5]];
	};

	function prepareWorkspace() {
		var $trade_block = $(".trade_block");
		$trade_block.hide();
		if (wss_conn.state == "connected" && settings_recieved && user_settings_recieved && time_recieved) {
			$trade_block.show();
			clearInterval(interval);
			hideLoading();
			init();
			if ((js_params.disable_reconnect == true || js_params.disable_reconnect == "true")) {
				clearInterval(intervalCheckConnection);
			}
		}
	}

	function checkConnection() {

		if (wss_conn.state != "connected") {

			console.log('no connection');
			l100n.localize_page("binary", language);

			view.setTradeMessage2(view.messages.find(".error-no-connection").text(), "");
			$(".bsw_loader").hide();
			$('.bin_options_type').hide();
			clearInterval(intervalCheckConnection);
			setTimeout(function () {
				window.location.reload();
			}, 3000);

			return false
		} else {
			if ((js_params.disable_reconnect == true || js_params.disable_reconnect == "true")) {
				clearInterval(intervalCheckConnection);
			}
			return true;
		}


	}

	function init() {
		if (prepared === false) {

			if (wss_conn.state != "connected") {
				if ((js_params.disable_reconnect == true || js_params.disable_reconnect == "true")) {
					return;
				}
				// wss_conn = new WssConn(wss_url, view.user.username, view.user.password);
			}
			if (js_params.isTradePage === undefined || (js_params.isTradePage == true || js_params.isTradePage == "true")) {
				view.appendOpenedOptions();
				view.appendUserData();
			} else {
				$(".trade_block").each(function (key, elem) {
					$(elem).hide();
				});
			}

			view.loadConsolesAndUserData();

			l100n.localize_page("binary", language);
			view.lang = language;

			if (view.user.isGuest()) {
				view.user.setDeposit(globalParameters.guestDeposit);
				check_opened = setInterval(common.checkopenedOptionsGuest, 5000);
				if ($(".bin_open_options_tab[data-tab='journal']")[0] != null) {
					$(".bin_open_options_tab[data-tab='journal']").hide();
				}
			}


			$(".body.page-binary").fadeIn(0);
			setTimeout(function () {
				l100n.localize_page("binary", language);
				for (var i in settings_wss) {
					if (settings_wss[i] != null && settings_wss[i].enable === "false") {
						$(".bin_options_type[data-kind={kind}]".replace("{kind}", i)).hide();
					}
				}
			}, 1000);
			prepared = true;

			if ($(obj_opened_options)[0] != null) {
				wss_conn.send(wssQuery.HookOptions);
			} else {
				setTimeout(function () {
					wss_conn.send(wssQuery.HookOptions);
				}, 5000);
			}

			if (!view.user.isGuest()) {
				wss_conn.send('{"command":"hook_user_status","enable":"true"}');
			}
		}


		var i = view.consoles.models.length - 1;
		while (i--) {
			setTimeout(chart.drawConsole(view.consoles.models[i]), 0);
		}
		i = null;


	}

	var settings = function () {
	};

	settings.getAllowedByTool = function (kind, tool_id) {
		var allowed = [];
		if (settings_wss[kind] != null) {
			for (var i in settings_wss[kind].tools) {
				if (settings_wss[kind].tools[i].tool_id == tool_id) {
					allowed = settings_wss[kind].tools[i].allowed_timeframes;
				}
			}
		}
		return allowed;
	};

	settings.setParam = function (param, value) {
		if (!view.user.isGuest()) {
			if (view.user.user_data == null) {
				view.user.user_data = user_data_default;
			}
			view.user.user_data[param] = value;
			view.addSaveDataRequest();
		}
		settings.updateAllSettings(param, value);

	};

	settings.updateAllSettings = function (param, value) {

		switch (param) {
			case "show_add_c":
				settings.updateConsoleButton(value);
				break;
			case "show_one_click":
				settings.updateShowClickButton(value);
				break;
		}
	};

	settings.updateConsoleButton = function (value) {
		if (value == "1") {
			$(".add_console").show();
		} else {
			$(".add_console").hide();
		}
	};

	settings.updateShowClickButton = function (value) {

		if (value == "1") {
			$(".bo_console").removeClass("hide_one_click");
		} else {
			$(".bo_console").addClass("hide_one_click");
		}
	};

	settings.getParam = function (param) {

		if (!view.user.isGuest()) {

			if (view.user.user_data == null) {
				view.user.user_data = user_data_default;
			}

			if (view.user.user_data[param] == null && user_data_default[param]) {
				view.user.user_data[param] = user_data_default[param];

			}

			return view.user.user_data[param];
		} else {
			return user_data_default[param];
		}
	};

	function setSignals(data) {

		if (data.signal != null) {
			data.items = data.signal.items;
		}

		if (data.items != null) {
			var len = data.items.length, item, html = "", template = $("#autochartist_line").html(), s, found, allowed, invest = 25;
			try {

				_(view.consoles).each(function (elem) {
					if (elem.get("kind") == "classic") {
						invest = elem.get("invest");
					}
				});

			} catch (e) {
				log(e);
			}


			var item, tool;
			for (var i = 0; i < len; i++) {
				item = data.items[i];
				tool = get_tool(item.symbol);
				if (tool != null) {
					item.tool_id = tool.tool_id;
					item.timeframe = get_timeframe(item.timeframe_id);

					allowed = settings.getAllowedByTool(view.kind, item.tool_id);

					subscribeWSS(wss_conn, item.tool_id);

					if ($.inArray(parseInt(item.timeframe_id), allowed) != -1) {
						item.dir = item.direction == "1" ? "up" : "down";
						item.direction2 = item.direction == "1" ? "call" : "put";
						item.direction = item.direction == "1" ? "CALL" : "PUT";
						item.forecast_pure = item.forecast;
						item.forecast = parseFloat(item.forecast).toFixed(5);
						item.id = utsTime + item.symbol + item.identified + item.timeframe_id + item.direction + item.forecast;
						item.invest = invest;
						item.currency = currency;
						if (item.filename != null) {
							item.filename = item.filename.replace("w=0", "w=238").replace("h=0", "h=100");
						} else {
							item.filename = "null";
						}

						s = item.identified;
						item.date = UTS2DateAndTime(Date.UTC(s.substring(0, 4), parseInt(s.substring(4, 6)) - 1 > 0 ? parseInt(s.substring(4, 6)) - 1 : 0, s.substring(6, 8), s.substring(8, 10), s.substring(10, 12)));
						html += Mustache.render(template, item);

					}
				}

			}


			$(partner_params.autochartistBody).prepend(html);
			var max_autochartist_count = settings.getParam("autochartist_count") || 50;

			if (len > 0) {
				$(".empty-signals").hide();
				$('.autochartist_widget .widget_body .line').each(function (key, elem) {
					if (key >= max_autochartist_count) {
						$(elem).remove();
					}
				});
			}


		}
		data = null;
		wipe(data);
	}

	function subscribeWSSPayouts(wss, tool_id, option_kind) {

		for (var timeframe in timeframes) {
			wss.send('{"command":"hook_cfg_payout_rates","tool_id":"' + tool_id + '","timeframe_id":"' + timeframe + '","option_kind_id":"' + option_kind + '","enable":"true"}');
		}

		count = null;
	}

	function get_tool(id) {

		if (typeof (id) == "string") {
			for (var i in tools) {
				if (tools[i].tool_name == id) {
					return tools[i];
				}
			}
			return null;
		} else {
			for (var i in tools) {
				if (tools[i].tool_id == id) {
					return tools[i];
				}
			}
			return null;
		}
	}

	function get_timeframe(id) {
		return timeframes[id] || null;
	}

	function bw_disclaimer(console_id) {
		var template = $("#modal-disclaimer").html(),
			params = {
				console_id: console_id,
				header: "One-Click Trade",
				text: "2",
				button_name: "Ok"
			};

		$(el).prepend(Mustache.render(template, params));

		$(el).find('.scroll').slimScroll({
			width: '100%',
			height: '200px',
			size: '7px',
			position: 'right',
			color: '#000',
			opacity:0.8,
			railColor: '#233847',
			railOpacity: 0.8,
			distance: 0,
			start: 'top',
			railVisible: false,
			wheelStep: 10,
			allowPageScroll: false,
			borderRadius: 3
		});

		l100n.localize_all_pages(language);

		$(el).find('#agreement').on('change', function (e) {
			if (e.target.checked) {
				$(el).find('.button.ok').removeAttr('disabled');
			} else {
				$(el).find('.button.ok').attr('disabled', 'disabled');
			}
		});

		/*$(el).find('.button.cancel').on('click' function(e) {
		 allow_one_click = false;
		 });*/
	}

	function bw_alert(message, button_name, button_class, id, hide, header) {

		var animTime = 1000, animCirc = 'easeInCirc', header = header || partner_params.defaultHeader;
		if (typeof (hide) == "undefined" || hide == null) {
			hide = true;
		}
		$('.bin_popup').remove();


		var id = id || 0,
			button_name = button_name || "OK",
			button_class = button_class || "",
			template = $("#modal-alert").html(),
			params = {
				id: "modal" + parseInt(microtime(true)) + rand(0, 1000),
				text: message,
				button_name: button_name,
				button_class: button_class,
				currency: currency,
				header: header
			};


		$('#main-container').prepend(Mustache.render(template, params));

		try {
			// $('.binsta__overlay').fadeIn(200, function () {
			$('.binsta__popup').fadeIn(200);
			// });
		} catch (e) {
		}


		l100n.localize_all_pages(language);


		var $elem = $("#" + params.id);
		//  $elem.animate({'margin-top': -170, 'opacity': 'show'}, animTime, animCirc);

		$elem

			.unbind()
			.bind("mouseenter", function () {
				$elem.addClass("hovered");
				$elem.css({'opacity': '.9'});
			})
			.bind("mouseleave", function () {
				$elem.removeClass("hovered");
				if (hide == true) {

					setTimeout(function () {
						if ($elem[0] != null && !$elem.hasClass("hovered"))
							$elem.css({'opacity': '.9'});
					}, 6000);

					setTimeout(function () {
						if ($elem[0] != null && !$elem.hasClass("hovered"))
							bw_close($elem);
					}, 10000);
				}
			});


		if (button_class == "") {
			$elem.find(".bin_popup_cancel_btn").hide();
		}

		if (hide == true) {
			var timeout1 = 6000;
			var timeout2 = 10000;
			if (button_class == "button_buy") {
				timeout1 = 4000;
				timeout2 = 5000;
			}
			if (button_class == "button_buy") {
				setTimeout(function () {
					if ($elem[0] != null && $elem.find(".inner")[0] == null)
						$elem.find(".inner").append("<div class='counter'>0:04</div>");
				}, 1000);

				setTimeout(function () {
					if ($elem[0] != null && $elem.find(".counter")[0] == null)
						$elem.find(".counter").html("0:03");
				}, 2000);

				setTimeout(function () {
					if ($elem[0] != null && $elem.find(".counter")[0] == null)
						$elem.find(".counter").html("0:02");
				}, 3000);

				setTimeout(function () {
					if ($elem[0] != null && $elem.find(".counter")[0] == null)
						$elem.find(".counter").html("0:01");
				}, 4000);

				setTimeout(function () {
					if ($elem[0] != null && $elem.find(".counter")[0] == null)
						$elem.find(".counter").html("0:00");
					$("#" + id + "binary_holder").find(".lastPrice").text("");
				}, 5000);
			}

			setTimeout(function () {
				if ($elem[0] != null && !$elem.hasClass("hovered") || button_class == "button_buy")
					$elem.css({'opacity': '.9'});

			}, timeout1);

			setTimeout(function () {
				if ($elem[0] != null && !$elem.hasClass("hovered") || button_class == "button_buy")
					bw_close($elem);
				if (button_class == "button_buy") {
					$("#" + id + "binary_holder").find(".lastPrice").text("");
				}
			}, timeout2);
			timeout1 = null;
			timeout2 = null;
		}
		try {
			$('#overlay').fadeIn(300);
		} catch (e) {
		}
	}

	function bw_close($elem) {
		try {
			$('#overlay').fadeOut(300);
		} catch (e) {
		}
		try {
			$('.binsta__overlay').fadeOut(300);
		} catch (e) {
		}
		$($elem).remove();
		$(".invest-non-active").removeClass("invest-non-active");
	}

	function bw_close_all() {
		try {
			$('#overlay').fadeOut(300);
		} catch (e) {
		}
		try {
			$('.binsta__overlay').fadeOut(300);
		} catch (e) {
		}
		$(".modal-dialog").remove();
		$(".invest-non-active").removeClass("invest-non-active");
	}

//Опционы
	var option = function () {
	};

	function compareDateClose(a, b) {
		if (a.date_close < b.date_close)
			return -1;
		if (a.date_close > b.date_close)
			return 1;
		return 0;
	}

	option.setClosedBinaryOptionsFromWss = function (json_data) {

		//((JSON.stringify(json_data)));

		var obj, byDay, optionArray = [];

		if ($(".bin_open_options_tab.opened-tab-set.active").attr("data-tab") == "closed") {
			obj = $(obj_closed);
			byDay = true;
			return;
		} else {
			var closed_option1 = $(obj_closed_options).html();
			obj = $(obj_journal_options);

			byDay = false;
		}

		//log(json_data);


		if (partner_params.optionBehavior == "standart") {
			obj.html("");
		} else if (partner_params.optionBehavior == "table") {
			obj.each(function (key, elem) {
				if (key > 0) {
					$(elem).remove();
				}
			});
			$(".journal_options_bars_holder").find(".open_options_bar").each(function (key, elem) {
				$(elem).remove();
			});
		}

		var closed_pages = $('#closed-pages-container'),
			pages = json_data.pages,
			page = json_data.page_number || 1,
			html = "",
			maxPageSiblings = Math.floor(partner_params.maxPages / 2),
			pageButtonTemplate = "",
			pageDividerTemplate = "";

		if (maxPageSiblings > 5) {
			maxPageSiblings = 5;
		}


		if ($("#template_pager_divider")[0] != null) {
			pageDividerTemplate = $("#template_pager_divider").html();
		} else {
			pageDividerTemplate = "<span class='float-left-pagination-fix'>...</span>";
		}

		if ($("#template_pager_page")[0] != null) {
			pageButtonTemplate = $("#template_pager_page").html();
		} else {
			pageButtonTemplate = "<span class='closed-pages post_page ease {class}'  data-page='{page}'>{page}</span>";
		}


		if (pages > 1) {
			if (pages < partner_params.maxPages) {
				var pc = pages;
				for (var i = 1; i <= pc; i++) {
					html += pageButtonTemplate
						.replace("{class}", (page == i ? "selected active" : ''))
						.replaceAll("{page}", i);
				}
				pc = null;
			} else {
				var pc = pages;
				for (var i = 1; i <= pc; i++) {
					if (i <= maxPageSiblings || i > pc - maxPageSiblings || (i < (parseInt(page) + maxPageSiblings) && i > (parseInt(page) - maxPageSiblings))) {
						html += pageButtonTemplate
							.replace("{class}", (page == i ? "selected active" : ''))
							.replaceAll("{page}", i);
					} else {
						if (i == parseInt(page) + maxPageSiblings || i == parseInt(page) - maxPageSiblings) {
							html += pageDividerTemplate;
						}
					}
				}
				pc = null;
			}
		}
		closed_pages.html(html);

		var len = json_data.get_user_options_history.length;
		for (var t = 0; t < len; t++) {
			optionArray.push(json_data.get_user_options_history[t]);
		}


		var direction_text = "";

		var closed_option;
		for (var i in optionArray) {
			closed_option = optionArray[i];
			closed_option.direction.replace("/", "");

			if (closed_option.tool_name != null) {

				direction_text = "";
				switch (closed_option.direction) {
					case "call":
					case "put":
					case "odd":
					case "even":
						direction_text = "classic";
						break;


					case "up":
					case "down":
					case "up/down":
					case "updown":
						direction_text = "touch";
						break;

					case "in":
					case "out":
						direction_text = "range";
						break;
				}

				var decimals = get_tool(closed_option.tool_name).decimal_count;

				var kind_id = null, kind = null;

				if (closed_option.option_kind != null) {
					kind = view.option_kinds.getNameById(closed_option.option_kind);
					kind_id = closed_option.option_kind;
					switch (kind_id) {
						case "1":
							direction_text = "classic";
							break;

						case "2":
						case "4":
							direction_text = "touch";
							break;

						case "3":
						case "5":
							direction_text = "range";
							break;
						case "6":
							direction_text = "range";
							break;
					}
				}


				direction_text += "_" + closed_option.direction.toLowerCase();


				if (false && kind_id === "6") {
					direction_text = view.messages.find("." + direction_text.replace("/", "").replace("up", "in").replace("down", "out")).text();
				} else {
					direction_text = view.messages.find("." + direction_text.replace("/", "")).text();
				}

				var params = {
					"option_id": closed_option.option_id,
					"closed_early": closed_option.early_closed == true ? "closed-early" : "",
					"direction_text": direction_text,
					"timeframe_name": timeframes[closed_option.timeframe_id] || "",
					"tool_name_with_slash": get_tool(closed_option.tool_name).tool_view_name,
					"time_open": common.UTS2DateTime(closed_option.date_open * 1000),
					"time_close": common.UTS2DateTime(closed_option.date_close * 1000),
					"expiration": common.UTS2Time(closed_option.date_close * 1000),
					"expiration_date": common.UTS2Date(closed_option.date_close * 1000),
					"direction": closed_option.direction == "call" ? "call" : "put",
					"direction_td": closed_option.direction.replace("/", "").replace("\"", "").toUpperCase().replace("UPDOWN", "TOP BOTTOM").replace("UP", "TOP").replace("DOWN", "BOTTOM"),
					"dir": closed_option.direction.replace("/", "").replace("\"", "").toUpperCase(),
					"sum": intellectRound(closed_option.sum, true),
					"invest": intellectRound(closed_option.sum, true),
					"price_open": parseFloat(closed_option.price_open).toFixed(decimals),
					"direction_call_put2": "bin_open_option__" + (closed_option.direction).toLowerCase().replace("/", ""),
					"direction_call_put4": "bin_kind" + kind_id,
					"kind": kind,
					"kind_id": kind_id,
					"course": parseFloat(closed_option.price_open).toFixed(decimals),
					"price_close": parseFloat(closed_option.price_close).toFixed(decimals),
					"payment": intellectRound(closed_option.sum - closed_option.result_sum, true),
					"tool_name": get_tool(closed_option.tool_name).tool_view_name,
					"currency": currency,
					"forecast": getForecast(closed_option.direction.replace("/", "").replace("\"", "").toUpperCase(), closed_option.special_params, parseFloat(closed_option.price_open).toFixed(decimals), closed_option.option_kind, get_tool(closed_option.tool_name)),
					"mini": 1

				};

				//вычислять из result_sum
				if (closed_option.result_sum < 0) {
					params.win = "win";
				} else {
					params.win = "los";
				}


				//if this option not recently closed:
				if (byDay == true && $(".bin_open_option[data-hash='" + closed_option.hash + "']")[0] == null && utcTime - parseInt(closed_option.date_close) * 1000 < 86400000 || byDay == false) {

					if (partner_params.optionBehavior == "standart") {

						obj.prepend(Mustache.render(closed_option1, params));

					} else if (partner_params.optionBehavior == "table") {
						$('.journal_options_block_hider table').append(Mustache.render(closed_option1, params));
						//$(Mustache.render(closed_option1, params)).insertAfter($(obj_journal_options).last())
					}

				}


			}
		}

		params = null;
		closed_option1 = null;
		obj = null;
		optionArray = null;
		json_data = null;
	};

	option.setOperationsHistoryFromWss = function (json_data) {

		var obj, byDay, optionArray = [];
		var closed_option1 = $("#binary_closed_line_operations_history").html();
		obj = $("#binarystation_operations_history");
		var obj_history = "#binarystation_operations_history tbody";
		if (partner_params.optionBehavior == "standart") {
			obj.html("");
		} else if (partner_params.optionBehavior == "table") {
			obj.find("tr").each(function (key, elem) {
				if (key > 0) {
					$(elem).remove();
				}
			});
			$(".history_block_hider").find(".open_options_bar").each(function (key, elem) {
				$(elem).remove();
			});
		}

		var closed_pages = $('#history-pages-container'),
			pages = json_data.pages,
			page = json_data.page_number || 1,
			html = "",
			maxPageSiblings = Math.floor(partner_params.maxPages / 2),
			pageButtonTemplate = "",
			pageDividerTemplate = "";

		if (maxPageSiblings > 5) {
			maxPageSiblings = 5;
		}


		if ($("#template_pager_divider")[0] != null) {
			pageDividerTemplate = $("#template_pager_divider").html();
		} else {
			pageDividerTemplate = "<span class='float-left-pagination-fix'>...</span>";
		}

		if ($("#template_pager_page_operations_history")[0] != null) {
			pageButtonTemplate = $("#template_pager_page_operations_history").html();
		} else {
			pageButtonTemplate = "<span class='closed-pages post_page ease {class}'  data-page='{page}'>{page}</span>";
		}


		if (pages > 1) {
			if (pages < partner_params.maxPages) {
				var pc = pages;
				for (var i = 1; i <= pc; i++) {
					html += pageButtonTemplate
						.replace("{class}", (page == i ? "selected active" : ''))
						.replaceAll("{page}", i);
				}
				pc = null;
			} else {
				var pc = pages;
				for (var i = 1; i <= pc; i++) {
					if (i <= maxPageSiblings || i > pc - maxPageSiblings || (i < (parseInt(page) + maxPageSiblings) && i > (parseInt(page) - maxPageSiblings))) {
						html += pageButtonTemplate
							.replace("{class}", (page == i ? "selected active" : ''))
							.replaceAll("{page}", i);
					} else {
						if (i == parseInt(page) + maxPageSiblings || i == parseInt(page) - maxPageSiblings) {
							html += pageDividerTemplate;
						}
					}
				}
				pc = null;
			}
		}
		closed_pages.html(html);

		var len = json_data.get_user_transactions.length;
		for (var t = 0; t < len; t++) {
			optionArray.push(json_data.get_user_transactions[t]);
		}


		/*if(js_params.p=="5" || js_params.p=="3" || js_params.p=="8"){
		 optionArray.sort(compareDateClose);
		 }*/

		var direction_text = "";
		var operation = {};
		var operationTypes = {
			"1+": view.messages.find(".label_operation_in").text(),
			"1-": view.messages.find(".label_operation_out").text(),
			"2": view.messages.find(".label_operation_bonus").text(),
			"3": view.messages.find(".label_operation_credit").text(),
			"4": view.messages.find(".label_operation_comp").text()
		}
		var newId = 1;
		for (var i in optionArray) {
			operation = optionArray[i];

			if (operation.transact_type == "1") {
				if (parseFloat(operation.amount) >= 0) {
					operation.transact_type += "+";
				} else {
					operation.transact_type += "-";
				}
			}

			var sum = (parseFloat(operation.amount) >= 0) ? (currency + operation.amount) : ("-" + currency + operation.amount.replace("-", ""));
			if (operation.transact_type != "4") {
				sum = sum.replace("-", "");
			}

			var params = {
				"comment": operation.comment,
				"time": operation.transact_time,
				"sum": sum
			};

			if (partner_params.optionBehavior == "standart") {
				obj.prepend(Mustache.render(closed_option1, params));
			} else if (partner_params.optionBehavior == "table") {
				$(Mustache.render(closed_option1, params)).insertAfter($(obj_history).last());

				var td_class = '';
				if (operation.transact_type == "1-") {
					td_class = 'deposit_minus';
				}
				if (operation.transact_type == "1+") {
					td_class = 'deposit_plus';
				}
				el.find("#transaction_type_name").attr("id", "transaction_type_name" + newId).addClass(td_class);

				getLanguageText(td_class, 'transaction_type_name' + newId);
				newId++;
			}
		}

		params = null;
		closed_option1 = null;
		obj = null;
		json_data = null;
	};

	function compareDateOpen(a, b) {
		if (a.date_open < b.date_open)
			return -1;
		if (a.date_open > b.date_open)
			return 1;
		return 0;
	}

	function popGuestOption(hash) {
		var ind = gc.guestOptions.length, found = false;


		if (ind == 0) {
			return false;
		}
		while (ind > 0) {
			ind--;
			if (gc.guestOptions[ind] == hash) {
				found = true;
				delete(gc.guestOptions[ind]);
				break;
			}
		}
		return found;
	}

	option.openAllOptionsWss = function (json_data) {

		if (json_data.options_open == null) {
			return;
		}
		global_get_opened_options = false;
		var graph, id, option, optionArray = [];
		var len = json_data.options_open.length;
		for (var i = 0; i < len; i++) {
			optionArray.push(json_data.options_open[i]);
		}


		if (js_params.p == "6" || js_params.p == "3") {
			optionArray.sort(compareDateOpen);
		}


		for (var i = 0; i < len; i++) {

			optionArray.sort(function (x, y) {
				return ((x["option_id"] < y["option_id"]) ? -1 : (x["option_id"] > y["option_id"]) ? 1 : 0);
			});
			option = optionArray[i];
			if (view.opened_options.length == 0 || view.opened_options.where({hash: option.option_hash}).length == 0) {


				//if (view.opened_options.length == 0) {
				//    id = 1;
				//} else {
				id = view.getNewIdOption();
				//}

				var direction_text = "";
				switch (option.option_kind.toString()) {
					case view.option_kinds.getIdByName("classic").toString():
						direction_text = "classic";
						break;

					case view.option_kinds.getIdByName("touch").toString():
						direction_text = "touch";
						break;

					case view.option_kinds.getIdByName("range").toString():
						direction_text = "range";
						break;

					case view.option_kinds.getIdByName("touch_advanced").toString():
						direction_text = "touch_advanced";
						break;

					case view.option_kinds.getIdByName("range_advanced").toString():
						direction_text = "range_advanced";
						break;
				}


				//([direction_text,"."+direction_text.replace("/","")]);
				direction_text += "_" + option.direction.toLowerCase();
				//([direction_text,"."+direction_text.replace("/","")]);

				l100n.localize_all_pages(language);

				direction_text = $("#messages ." + direction_text.replace("/", "")).text();

				subscribeWSSEarly(wss_conn, get_tool(option.tool_name.toString()).tool_id, option.option_kind);

				if (guestWithHookOptions) {
					if (view.user.isGuest() && !popGuestOption(option.option_hash)) {

						setTimeout(function () {

							if (popGuestOption(option.option_hash) && parseFloat(option.date_close) * 1000 - utcTime > 6000) {
								view.opened_options.add({
									id: id,
									data_id: id,
									data: [],
									direction_text: direction_text,
									timeframe: option.timeframe_id,
									tool: get_tool(option.tool_name.toString()),
									hash: option.option_hash,
									option_id: option.option_id,
									kind: option.option_kind,
									percent_equal: option.percent_equal,
									start_time: option.date_open,
									payment_win: parseFloat((parseInt(option.percent_win) + 100) * option.bet / 100),
									payment_lose: parseFloat(parseInt(option.percent_lose) * option.bet / 100),
									invest: parseFloat(option.bet),
									expiration: option.date_close,
									end_time: option.date_close,
									start_course: parseFloat(option.price_open),
									course: parseFloat(option.price_open),
									special_params: option.special_params || [],
									direction: option.direction.toUpperCase(),
									dir: option.direction.toUpperCase()
								});

								if (view.user.isGuest()) {
									if (parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)) < 0) {

										return;
									}
									if (view.user.getDeposit() == null || isNaN(parseFloat(view.user.getDeposit()))) {
										view.user.deposit = globalParameters.guestDeposit;
									}
									view.user.setDeposit(parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)));
								}

							}

						}, 3000);

						setTimeout(function () {

							if (popGuestOption(option.option_hash) && parseFloat(option.date_close) * 1000 - utcTime > 6000) {
								view.opened_options.add({
									id: id,
									data_id: id,
									data: [],
									direction_text: direction_text,
									timeframe: option.timeframe_id,
									tool: get_tool(option.tool_name.toString()),
									option_id: option.option_id,
									hash: option.option_hash,
									kind: option.option_kind,
									percent_equal: option.percent_equal,
									start_time: option.date_open,
									payment_win: parseFloat((parseInt(option.percent_win) + 100) * option.bet / 100),
									payment_lose: parseFloat(parseInt(option.percent_lose) * option.bet / 100),
									invest: parseFloat(option.bet),
									expiration: option.date_close,
									end_time: option.date_close,
									start_course: parseFloat(option.price_open),
									course: parseFloat(option.price_open),
									special_params: option.special_params || [],
									direction: option.direction.toUpperCase(),
									dir: option.direction.toUpperCase()
								});

								if (view.user.isGuest()) {
									if (parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)) < 0) {

										return;
									}
									if (view.user.getDeposit() == null || isNaN(parseFloat(view.user.getDeposit()))) {
										view.user.deposit = globalParameters.guestDeposit;
									}
									view.user.setDeposit(parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)));
								}

							}

						}, 10000);
						return;
					} else {
						if (view.user.isGuest()) {
							if (parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)) < 0) {

								return;
							}
							if (view.user.getDeposit() == null || isNaN(parseFloat(view.user.getDeposit()))) {
								view.user.deposit = globalParameters.guestDeposit;
							}
							view.user.setDeposit(parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(option.bet)));
						}
					}
				}

				if (parseFloat(option.date_close) * 1000 - utcTime > 6000) {

					view.opened_options.add({
						id: id,
						data_id: id,
						data: [],
						direction_text: direction_text,
						timeframe: option.timeframe_id,
						tool: get_tool(option.tool_name.toString()),
						hash: option.option_hash,
						option_id: option.option_id,
						kind: option.option_kind,
						percent_equal: option.percent_equal,
						start_time: option.date_open,
						percent_win: option.percent_win,
						payment_win: parseFloat((parseInt(option.percent_win) + 100) * option.bet / 100),
						payment_lose: parseFloat(parseInt(option.percent_lose) * option.bet / 100),
						invest: parseFloat(option.bet),
						expiration: option.date_close,
						end_time: option.date_close,
						start_course: parseFloat(option.price_open),
						course: parseFloat(option.price_open),
						special_params: option.special_params || [],
						direction: option.direction.toUpperCase(),
						dir: option.direction.toUpperCase()
					});
				}


			}

		}
		graph = null;
	};

	option.closeAllOptionsWss = function (json_data) {

		var graph;
		if (json_data.options_close != null && json_data.options_close.length > 0) {
			for (var i in json_data.options_close) {
				graph = view.getOptionByHash(json_data.options_close[i].option_hash);
				common.cleanEarlyHash(json_data.options_close[i].option_hash);

				if (graph != null) {
					graph.el.addClass('not-update-payout');
					var payout = (parseFloat(json_data.options_close[i]['bet']) - parseFloat(json_data.options_close[i]['revenue'])).toFixed(2);
					graph.el.find('.bin_open_option__info__values__payout').text(payout);
					graph.el.find('.option_rate').text(parseFloat(json_data.options_close[i]['price_close']).toFixed(graph.get("tool").decimal_count));
					graph.el.find('.option_timeleft').text(common.UTS2DateTime(json_data.options_close[i]['date_close'] * 1000));
					graph.el.removeClass('win');
					graph.el.removeClass('lose');
					var win_lose = json_data.options_close[i]['revenue'] < 0 ? "win" : "lose";
					var sum = json_data.options_close[i]['revenue'] < 0 ? payout :(parseFloat(json_data.options_close[i]['bet'])-payout).toFixed(2);
					graph.el.addClass(win_lose);
					if (view.user.isGuest()) {
						view.user.setDeposit((parseFloat(view.user.getDeposit()) + parseFloat(json_data.options_close[i].bet) - parseFloat(json_data.options_close[i].revenue)).toFixed(2));
					}


					if (json_data.options_close[i].early_close != null && json_data.options_close[i].early_close == "1") {
						graph.set("early_closed", true);
						graph.set("closed", true);
					}
					if (json_data.options_close[i].percent_equal != null) {
						graph.set("percent_equal", json_data.options_close[i].percent_equal);
					}
					//([json_data.options_close[i].date_close,UTS2DateAndTime(json_data.options_close[i].date_close*1000)]);
					chart.drawOpened(graph, true, json_data.options_close[i].price_close, json_data.options_close[i].date_close);

					$("#widget-line-" + json_data.options_close[i].option_hash).remove();
					bw_alert($('#messages .msg_closed_'+win_lose).html().replace('{{sum}}',sum));
				}
			}
		}

		graph = null;
	};


	option.openOptionWss = function (json_data) {
		var data = json_data, current_requote_price = 0, result, item;
		if (global_console_last_buy_id != null && view.consoles.get(global_console_last_buy_id) != null)
			var item = view.consoles.get(global_console_last_buy_id);

		if (item.get("oneClickBuy") == true) {
			item.el.find(".actionBtn").removeClass("active");
		}
		if (data.hash != null && guestWithHookOptions) {
			gc.guestOptions.push(data.hash);
		}

		if (data != null && data.status != 1 && data.status != 10) {
			data.error = data.status;
		}

		if (data != null && data.status != 10) {
			global_last_button_buy_autochartist = null;
			item.changeParam("set-direction", null);
			item.setFixedDirection();
			item = null;
		}

		if (data != null && data.status == 1) {

			data.payment_win = parseFloat(data.payment_win).toFixed(2);
			data.payment_lose = parseFloat(data.payment_lose).toFixed(2);

			result = {
				data: {
					id: null,
					hash: data.hash,
					tool: data.tool,
					type: "opened",
					option_kind: data.option_kind,
					timeframe_id: data.timeframe_id,
					payment_up: data.direction == "CALL" ? data.payment_win : data.payment_lose,
					payment_down: data.direction == "CALL" ? data.payment_lose : data.payment_win,
					payment_win: data.payment_win,
					payment_lose: data.payment_lose,
					startPrice: parseFloat(data.start_price).toFixed(5),
					startTime: parseInt(data.date_open),
					endTime: parseInt(data.date_close),
					time: data.time,
					data: [[(parseInt(data.date_open)) * 1000, data.start_price]],
					sum: data.sum,
					direction: data.direction
				},
				status: data.status
			};

			if (data.special_params != null) {
				result.data.special_params = Jps(data.special_params);
			}


		} else if (data.error != 0) {
			global_last_button_buy_autochartist = null;
			global_last_buy_blocked = false;
			var errorClass;


			log(["open_error", parseInt(data.error, 10)]);

			switch (parseInt(data.error, 10)) {
				case 2:
					errorClass = "wrong_sum";
					break;
				case 3:
					errorClass = null;
					log(data.error);
					//return;
					//var item = view.consoles.get(global_console_last_buy_id);
					//bw_alert(view.messages.find(".error-min_sum").text().replace("{min}", currency + intellectRound(item.get("min_invest"))).replace("{max}", intellectRound(item.get("max_invest"))));
					//bw_alert(view.messages.find(".error-min_sum").text().replace("{min}",item.get("min_invest")).replace("{max}",item.get("max_invest")));
					break;
				case 4:
					errorClass = "insufficient_funds";
					break;
				case 5:
					errorClass = "wrong_timeframe";
					break;
				case 12:
					errorClass = "lock-time";
					break;
				case 13:
					errorClass = "not_liq_symbol";
					break;
				case 6:
					errorClass = "wrong_pair";
					break;
				case 7:
					errorClass = "wrong_pair";
					break;
				case 8:
					errorClass = "inactive_user";
					break;
				case 9:
					errorClass = "demo_period_ends";
					break;
				case 14:
					errorClass = "forbidden_option_kind";
					break;
				case 15:
					errorClass = "forbidden_tool";
					break;
				case 16:
					errorClass = "forbidden_group";
					break;
				case 17:
					errorClass = "forbidden_loan";
					break;
				case 18:
					errorClass = "forbidden_max_rev";
					break;
				case 19:
					errorClass = "forbidden_max_opened";
					break;
				case 20:
					errorClass = "forbidden_max_bid";
					break;


				default:
					console.log("open_option error:" + Js(data));
					break;
			}


			if (errorClass != null) {
				var textElem = view.messages.find(".error-" + errorClass);
				if (textElem[0] != null && textElem.text() != "") {
					bw_alert(textElem.text());
				}
				textElem = null;
			}

			result = {
				status: data.error
			};

			_(view.consoles.models).each(function (elem) {
				elem.changeParam("set-direction", null);
				elem.setFixedDirection();
			});


		} else {
			global_requote_price = parseFloat(data.new_price).toFixed(item.get("tool").decimal_count);

			current_requote_price = global_requote_price;
			global_last_button_buy_autochartist_price = parseFloat(data.new_price);

			result = {
				status: data.status,
				newPrice: parseFloat(data.new_price)
			};

		}

		if (result.status == 10) {
			if (current_requote_price == null || current_requote_price == 0) {
				current_requote_price = global_last_button_buy_autochartist_price;
			}

			if (partner_params.requote_style == "custom_modal") {

				var newPrice = result.newPrice;

				if (current_requote_price != 0 && current_requote_price != null) {
					$(".quote_changed").html(($(".quote_changed").html().replace("{{price}}", current_requote_price)));
					item.el.find('.requote').toggleClass('show');
				}


			} else if (partner_params.requote_style == "in_console") {

				var newPrice = result.newPrice;

				if (current_requote_price != 0) {
					global_last_buy_blocked = false;
					if (global_last_button_buy_autochartist != null) {
						bw_alert($("#modal-alert-requote").html().replace("{{price}}", global_requote_price), "OK", "button_buy_autochartchartist");
					} else {
						var console1 = view.consoles.get(global_console_last_buy_id);

						if (console1 != null) {
							console1.openRequoteModal();
						} else {
							bw_alert($("#modal-alert-requote").html().replace("{{price}}", global_requote_price), "OK", "button_buy");
						}
					}
				}

			} else if (partner_params.requote_style == "in_console_v2") {

				var newPrice = result.newPrice;

				if (current_requote_price != 0) {
					global_last_buy_blocked = false;
					if (global_last_button_buy_autochartist != null) {


						bw_alert(
							$("#modal-alert-requote2").text()
								.replace("{{price}}", global_requote_price)
								.replace("{{new_price}}", view.messages.find(".new-price").text()), "OK", "button_buy_autochartist");
					} else {
						var console1 = view.consoles.get(global_console_last_buy_id);

						if (console1 != null) {
							console1.openRequoteModal();
						} else {
							bw_alert($("#modal-alert-requote").html().replace("{{price}}", global_requote_price), "OK", "button_buy");
						}
					}
				}

			} else {
				var newPrice = result.newPrice;

				if (current_requote_price != 0) {
					global_last_buy_blocked = false;
					bw_alert(view.messages.find(".new-price").html() + " <span class='new_price'>" + global_requote_price + "</span>", "OK", "button_buy");
				}
			}
		}

		if (result.status == 1) {
			//сначала проверить, одобрен ли опцион
			//нужно получать опционы через подписку

			global_last_button_buy_autochartist_price = null;
			global_last_button_buy_autochartist = null;


			if (!view.user.isGuest()) {
				return;
			}


			if (!guestWithHookOptions) {
				var id = view.getNewIdOption();
				view.opened_options.add({
					id: id,
					data_id: id,
					data: [], //result.data.data,
					timeframe: result.data.timeframe_id,
					tool: get_tool(result.data.tool),
					percent_equal: result.data.percent_equal,
					hash: result.data.hash,
					option_id: option.option_id,
					kind: result.data.option_kind,
					payment_win: data.payment_win,
					payment_lose: data.payment_lose,
					invest: result.data.sum,
					expiration: result.data.endTime,
					start_time: result.data.startTime,
					end_time: result.data.endTime,
					start_course: result.data.startPrice,
					course: result.data.startPrice,
					special_params: result.data.special_params || [],
					direction: data.direction,
					dir: data.direction
				});

				if (view.user.isGuest()) {
					if (view.user.getDeposit() == null || isNaN(parseFloat(view.user.getDeposit()))) {
						view.user.deposit = globalParameters.guestDeposit;
					}
					view.user.setDeposit(parseFloat(view.user.getDeposit()) - parseFloat(parseFloat(result.data.sum)));
				}
			}

		}

	};

	option.updateTime = function (uts) {

		var payout_sum = 0;
		if (view.opened_options.models.length > 0) {
			for (var i in view.opened_options.models) {
				try {
					view.opened_options.models[i].updateEarly();
					view.opened_options.models[i].updateEndTime();
					view.opened_options.models[i].updatePayout();
					payout_sum += view.opened_options.models[i].get("payout");
				} catch (e) {
				}
			}
		}


		if (!isNaN(payout_sum)) {
			$(".current-payout-value").each(function () {
				$(this).html(payout_sum.toFixed(2));
			});
		}

		var $el = view.utc_time;
		if ($el[0] != null) {
			$el.text(common.UTS2Time(uts));
		}

		var $el2 = $(".w_clock_list");
		if ($el2[0] != null) {
			var time, $hours, $min, $sec;

			$el2.each(function (i, el3) {

				time = UTCgetHMS(uts);
				$hours = $(el3).find(".hours");
				$min = $(el3).find(".min");
				$sec = $(el3).find(".sec");

				$hours.text(time.hours);
				$min.text(time.minutes);
				$sec.text(time.seconds);

			});

			$hours = null;
			$min = null;
			$sec = null;
		}

		utcTime = uts;
		common.checkTime(utcTime);

		if (partner_params.use_clock) {
			if (!view.trades_closed.hasClass("hidden_tab")) {
				var date = new Date(parseInt(uts));

				var hours = date.getUTCHours();
				var minutes = date.getUTCMinutes();
				var seconds = date.getUTCSeconds();
				var day = date.getUTCDate();
				var month = date.getUTCMonth();
				var year = date.getUTCFullYear();


				hours--;
				while (hours > 12) {
					hours -= 12
				}
				seconds = seconds * 6;
				minutes = minutes * 6;
				hours = hours * 30 + minutes / 2;
				day = day;
				month = month + 1;

				var srotate = 'rotate(' + seconds + 'deg)';
				var mrotate = 'rotate(' + minutes + 'deg)';
				var hrotate = 'rotate(' + hours + 'deg)';

				$('#no_trade_clock__sec').css({
					'-moz-transform': srotate,
					'-webkit-transform': srotate,
					'-o-transform': srotate,
					'-ms-transform': srotate,
					'transform': srotate
				});
				$('#no_trade_clock__min').css({
					'-moz-transform': mrotate,
					'-webkit-transform': mrotate,
					'-o-transform': mrotate,
					'-ms-transform': mrotate,
					'transform': mrotate
				});
				$('#no_trade_clock__hou').css({
					'-moz-transform': hrotate,
					'-webkit-transform': hrotate,
					'-o-transform': hrotate,
					'-ms-transform': hrotate,
					'transform': hrotate
				});
				$('#no_trade_clock__day').text(day);
				$('#no_trade_clock__month').text(month);
				$('#no_trade_clock__year').text(year);

				date = null;
				hours = null;
				minutes = null;
				seconds = null;
				day = null;
				month = null;
				year = null;
			}
		}


	};

	option.getClosedBinaryOptionsWss = function (page) {
		var page = page || 1;
		//('{"command":"get_user_options_history","page_size":"10","page_number":"{page}"}'.replace("{page}",page));

		wss_conn.send('{"command":"get_user_options_history","page_size":"20","page_number":"{page}"}'.replace("{page}", page));

	};

	option.getHistoryBinaryOptionsWss = function (page) {
		var page = page || 1;
		//('{"command":"get_user_options_history","page_size":"10","page_number":"{page}"}'.replace("{page}",page));
		wss_conn.send('{"command":"get_user_transactions","page_size":"20","page_number":"{page}","type":[1,4]}'.replace("{page}", page));

	};

//графики
	var chart = function () {
	};

	chart.hook_tool = function (data, force) {
		var force = force || false;

		var toolNames = [];
		if ($('.console').length > 0) {
			$('.console').each(function (key, elem) {
				curTool = 6 //$(elem).find('.b_instrument_block').find('.b_block_value')[0].innerText;
				$(elem).find('.b_instrument_block').find('.change-tool').each(function (key, tool) {
					if ($(tool)[0].innerText == curTool) {
						toolNames[$(elem).attr('data-id')] = $(tool).attr('data-value');
					}
				});
			});
		}

		//var currentToolName = $('.b_instrument_block').find('.b_block_value');


		if (data.tools != null) {

			var len = data.tools.length;
			for (var i = 0; i < len; i++) {
				if (data.tools[i].affiliate_id == "1" || data.tools[i].affiliate_id == null) {
					cache_tool_tf_display[data.tools[i].option_kind + "-" + data.tools[i].tool_id + "-" + data.tools[i].timeframe_id] = data.tools[i];
				}
			}
			force = true;
		}

		if (hook_tool_arr.in_work && !force) {
			return;
		}
		hook_tool_arr.in_work = true;

		var len2 = tools.length;

		var found_enabled, found_enabled_for_current_tf, found, kind;


		for (var i = 0; i < len2; i++) {
			//для каждого инструмента проверить, запрещены ли все таймфреймы
			//если все таймфреймы запрещены, тогда прятать, если есть хоть один разрешенный - отображать

			found_one_enabled = false;
			found_enabled = {
				"1": false,
				"2": false,
				"3": false,
				"4": false,
				"5": false,
				"6": false
			};
			found = {
				"1": false,
				"2": false,
				"3": false,
				"4": false,
				"5": false,
				"6": false
			};

			found_enabled_for_current_tf = {
				"1": false,
				"2": false,
				"3": false,
				"4": false,
				"5": false,
				"6": false
			};

			kind = 0;

			var id, id2, timeframeLength = $.map(timeframes, function (value, index) {
				return [value];
			}).length;
			for (var kind = 1; kind <= view.option_kinds.length; kind++) {

				for (var j = 1; j < timeframeLength; j++) {
					id = kind + "-" + tools[i].tool_id + "-" + j;

					if (tools[i].tool_id == 1 && kind == "1") {
						log([cache_tool_tf_display[id]]);
					}

					if (cache_tool_tf_display[id] != null && cache_tool_tf_display[id].enable == "true") {
						found_one_enabled = true;
						found_enabled[kind.toString()] = true;
						found[kind] = true;
						break;
					} else if (cache_tool_tf_display[id] != null && cache_tool_tf_display[id].enable == "false") {
						found[kind] = true;
					}
				}

			}
			//console.log('ENABLED:: '+[found["1"],found_enabled["1"],found_one_enabled]);
			if (found["1"] && !found_one_enabled) {
				l100n.localize_all_pages(language);
			}

			for (var kind = 1; kind <= view.option_kinds.length; kind++) {

				if (kind == 1) {
					//log([found[kind],found_enabled[kind]]);
				}

				if (found[kind]) {
					if (found_enabled[kind]) {
						chart.showTool1(tools[i].tool_id, kind);
					} else {
						chart.hideTool1(tools[i].tool_id, kind);
					}
				}
			}
		}

		//дополнительно спрячем tool если для них запрещен текущий выбранный таймфрейм


		var item = view.getCurrentConsole();

		if (tools != null && item != null) {
			var len = tools.length, id, kind_id = view.option_kinds.getIdByName(view.kind);
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					id = kind_id + "-" + tools[i].tool_id + "-" + item.get("timeframe");

					if (cache_tool_tf_display[id] != null) {
						if (cache_tool_tf_display[id].enable == "false") {
							//chart.hideTool1(tools[i].tool_id, kind_id);
						} else {
							chart.showTool1(tools[i].tool_id, kind_id);
						}
					} else {
						chart.showTool1(tools[i].tool_id, kind_id);
					}
				}
			}
		}


		/*var tool_id;
		 _(view.consoles.models).each(function (item) {
		 tool_id = item.get("tool").tool_id;

		 $.each(cache_tool_tf_display, function (index, value) {
		 if (value.tool_id == tool_id && value.option_kind == view.option_kinds.getIdByName(item.get("kind"))) {
		 if (value.enable == "false") {
		 item.hideTf(value.timeframe_id);
		 } else {
		 item.showTf(value.timeframe_id);
		 }
		 }
		 });

		 });*/


		global_hide_blocked = false;

		setTimeout(function () {
			hook_tool_arr.in_work = false;
		}, 5000);

	};

	chart.normalizeData = function (data) {
		var len = data.length, last, i = 1;
		if (len > 0) {
			last = data[0][0];
			while (i < len) {
				if (data[i][0] < last) {
					data[i][0] = last;
				}
				last = data[i][0];
				i++;
			}
		}

		return data;
	};

	chart.hideTool1 = function (tool_id_to_hide, option_kind) {
		if (in_array(tool_id_to_hide + "-" + option_kind, hook_tool_arr.is_hidden)) {
			return;
		} else {
			hook_tool_arr.is_not_hidden = remove_from_array(tool_id_to_hide + "-" + option_kind, hook_tool_arr.is_not_hidden);
			hook_tool_arr.is_hidden.push(tool_id_to_hide + "-" + option_kind)
		}

		var is_tool_active, $el, $el2, option_kind = option_kind || 1;
		/*
		 _(view.consoles.models).each(function (item) {
		 if (view.option_kinds.getIdByName(item.get("kind")) == option_kind) {
		 item.hideTool(tool_id_to_hide);
		 }
		 });
		 */
	};

	chart.showTool1 = function (tool_id_to_show, option_kind) {
		if (in_array(tool_id_to_show + "-" + option_kind, hook_tool_arr.is_not_hidden)) {
			return;
		} else {
			hook_tool_arr.is_hidden = remove_from_array(tool_id_to_show + "-" + option_kind, hook_tool_arr.is_hidden);
			hook_tool_arr.is_not_hidden.push(tool_id_to_show + "-" + option_kind)
		}

		var is_tool_active, $el, $el2, option_kind = option_kind || 1;
		_(view.consoles.models).each(function (item) {
			if (view.option_kinds.getIdByName(item.get("kind")) == option_kind) {
				item.showTool(tool_id_to_show);
			}

			item.testMessageLeftWidget();
		});
	};

	chart.drawMain = function (data) {

		var correction = 0;
		var length = 0;
		var correctionHistrory = 60000;
		var convertedPlotData = [];
		var convertedPlotDataWidget = [];
		var plotData = [];
		var parsedData = [];
		var result;
		var last = 1;
		for (var tool in data) {
			for (var time in data[tool]) {
				if (time != "") {
					convertedPlotData[tool] = [];
					convertedPlotData[tool].push([(parseInt(time) * 1000 + correction), parseFloat(data[tool][time])]);
					convertedPlotDataWidget.push({
						name: tool,
						price: parseFloat(data[tool][time])
					});
				}
			}
		}


		if (view.consoles.models.length != 0) {

			for (var i in view.consoles.models) {
				var graph = view.consoles.models[i];
				if (graph == null || graph.get("type") != "history") continue;

				if (graph != null && graph.el != null) {

					var graph_tool = graph.get("tool").tool_name;
					if (graph_tool != null) {
						var graph_data = graph.get("data") || [];


						if (graph_data.length > 10 && graph_data.length < 20 || graph_data[0] == null) {
							graph.getHistory();
						}

						if (convertedPlotData[graph_tool] != null) {


							var lastData = [convertedPlotData[graph_tool][0][0], convertedPlotData[graph_tool][0][1]];
							//([graph,graph_tool,graph_data,graph_data.length,graph_data.length == 0]);


							/*if (custom_timescale_for_tool_type[graph.get("tool").tool_type] != null && typeof(graph.el.attr("id")) !== "undefined") {

							 chart.getHistoryWSS({
							 tool_id: graph.get("tool").tool_id,
							 count: custom_timescale_for_tool_type[graph.get("tool").tool_type] || view.time_count[5],
							 time_size: item.get("timesize"),
							 request_id: graph.el.attr("id")
							 }
							 );
							 } else {
							 if (use_timeframes_for_timescale) {

							 var to_slice = view.time_amount[graph.get("timeframe").toString()] * 60 * 1000;
							 } else {
							 var to_slice = view.time_size[graph.get("timesize").toString()] * 60 * 1000;
							 }
							 }*/


//							([(graph_data[graph_data.length - 1][0]),((lastData[0])),convertedPlotData[graph_tool][0][0]]);


							if (graph_data.length == 0) {

								graph_data.push(lastData);
							} else {
								if (graph_data.length > 0 && graph_data[graph_data.length - 1] != null && parseInt(graph_data[graph_data.length - 1][0]) < parseInt(lastData[0])) {
									graph_data.push(lastData);
								} else {
									graph_data[graph_data.length - 1][1] = lastData[1];
								}
							}

							if (graph_data.length > 2) {
								var last = graph_data[graph_data.length - 1][1], penult = graph_data[graph_data.length - 2][1];
								if (last > penult) {
									graph.set("tickdir", "up");
								} else if (last < penult) {
									graph.set("tickdir", "down");
								} else {
									graph.set("tickdir", "equal");
								}
							}
							graph.set("data", graph_data);

							//alert(lastData[1].toFixed(graph.get("tool").decimal_count));
							graph.changeParam("course", lastData[1].toFixed(graph.get("tool").decimal_count));

							if (graph.get("last_draw_time") == null || utcTime - graph.get("last_draw_time") > graphMaxDrawFreq) {
								if (partner_params.drawGraphProcess == true) {
									graph.set("needRedraw", true);
								} else {
									//setTimeout(chart.drawConsole(graph), 0);
								}
								graph.set("last_draw_time", utcTime);
							}
						} else {
							//TODO:повтор предыдущего значения
						}
					}
				}


			}


		}


		if (view.opened_options.models.length != 0) {
			var graph = null;
			var oldElement = null;
			var lastData = null;
			for (var i = 0; i < view.opened_options.models.length; i++) {
				graph = view.opened_options.models[i];
				if (graph != null) {
					var graph_tool = graph.get("tool").tool_name;
					var graph_data = graph.get("data") || [];


					//(["closed",graph.get("closed"),graph.get("closed") != true]);
					if (graph.get("closed") != true && graph.get("touch_win") != true) {

						if (convertedPlotData[graph_tool] != null) {
							lastData = convertedPlotData[graph_tool][0];
							if (graph_data.length == 0) {
								//console.log("lastData1: "+graph.get("id")+" "+Js([lastData[0],graph.get("start_price")]));
								graph_data.push([lastData[0], graph.get('start_course')]);
							} else {

								if (graph_data.length > 0
									&& graph_data[graph_data.length - 1] != null
									&& parseInt(graph_data[graph_data.length - 1][0]) < parseInt(lastData[0])
									&& lastData[0] <= (graph.get("end_time") * 1000)
								) {
									//console.log("lastData2: "+graph.get("id")+" "+Js(lastData));

									graph_data.push(lastData);

								} else {
									if (graph_data.length > 0) {
										oldElement = graph_data[graph_data.length - 1];
										if (oldElement[0] + js_params.quote_interval / 100 <= (graph.get("end_time") * 1000 - 1000)) {
											lastData = [oldElement[0] + js_params.quote_interval / 1000, oldElement[1]];
											//console.log("lastData3: "+graph.get("id")+" "+Js(lastData));
											graph_data.push(lastData);
										}

									}
								}
							}
							graph.changeParam("course", lastData[1].toFixed(graph.get("tool").decimal_count));
						} else {
							if (graph_data.length == 0) {
								//console.log("lastData4: "+graph.get("id")+" "+Js([lastData[0],graph.get("start_price")]));
								graph_data.push([utcTime, graph.get('start_course')]);
							}
							if (graph_data.length > 0) {
								oldElement = graph_data[graph_data.length - 1];
								if (oldElement[0] + js_params.quote_interval / 100 <= (graph.get("end_time") * 1000 - 1000)) {
									lastData = [oldElement[0] + js_params.quote_interval / 1000, oldElement[1]];
									//console.log("lastData5: "+graph.get("id")+" "+Js(lastData));
									graph_data.push(lastData);
								}
							}
						}
						graph.set("data", graph_data);
						if (partner_params.minDrawFrequencyOpened == 0 || graph.get("last_draw_time") == null || utcTime - graph.get("last_draw_time") > partner_params.minDrawFrequencyOpened) {
							//if (partner_params.drawGraphProcess == true) {
							//    graph.set("needRedraw", true);
							//} else {

							//chart.drawOpened(graph);
							//}
							graph.set("last_draw_time", utcTime);
						}

					}
				}

			}

		}


		if (view.checkIfWidgedExist("market_rates")) {
			widgets.updateMarketRates(convertedPlotData);
		}


		data = null;
		correction = null;
		correctionHistrory = null;
		plotData = null;
		parsedData = null;
		result = null;
		last = null;
	};

	var updateAllCharts = function () {


		var drawTime = microtime(true);


		if (settings_recieved) {
			if (view.opened_options != null) {
				var length = view.opened_options.models.length;
				if (length != 0) {
					for (var i = 0; i < length; i++) {
						var graph = view.opened_options.models[i];
						if (graph.get("data").length > 0 && graph.get("closed") != true) {
							//chart.drawOpened(graph);
						}
						graph = null;
					}
				}
				lenght = null;
			}

			if (view.consoles != null) {
				length = view.consoles.models.length;
				if (length != 0) {
					for (var i = 0; i < length; i++) {
						var graph = view.consoles.models[i];
						if (graph.get("data") != null && graph.get("data").length > 0) {
							chart.drawConsole(graph);
						}
						graph = null;
					}
				}
				length = null;
			}
		}


		drawTime = microtime(true) - drawTime;


		if (drawTime + 0.1 > graphMaxFrequency / 1000) {
			graphMaxFrequency += 10;
		} else {
			if (graphMaxFrequency > 100) {
				graphMaxFrequency -= 10;
			}
		}

		drawTime = null;
		setTimeout(updateAllCharts, graphMaxFrequency);
	};

	if (partner_params.drawGraphProcess) {
		setTimeout(updateAllCharts, graphMaxFrequency);
	}

	chart.getHistoryWss = function (params) {
		this.showLoading(params.request_id);
		var time = utcTime / 1000;

		if (params.count == null || params.count < 1) {
			params.count = 3600;
		}

		if (partner_params.use_candle == true) {
			params.time_size = "S1";
		}

		if (getHistoryMain) {
			wss_conn.send('{"command":"get_quotes_history","tool_id":"{tool_id}","time_size":"{time_size}","request_id":"{request_id}", "time_begin":"{start}", "time_end":"{finish}", "bo":"{bo}", "source": "crm"}'
				.replace("{tool_id}", params.tool_id)
				.replace("{start}", time - params.count)
				.replace("{finish}", time)
				.replace("{time_size}", params.time_size)
				.replace("{request_id}", params.request_id)
				.replace("{bo}", (account_type == '') ? 'demo' : account_type)
			);

			//(["get_quotes_history",params.tool_id,UTS2DateAndTime((time - params.count)*1000)]);
		}


		time = null;
	};

	chart.showLoading = function (id) {
		el = $('#' + id);
		el.find('.infoWindow').addClass('show');
		el.find(".popup").show();
		el.find(".bin_graph_range_line").css({"z-index": "-1"});
		el.find(".graph-mark").css({"z-index": "-1"});
	};

	chart.closeLoading = function () {
		$('.infoWindow').removeClass('show');
		$(".popup").hide();
		$(".bin_graph_range_line").css({"z-index": "3"});
		$(".graph-mark").css({"z-index": "3"});
	};
	chart.getTimeFormat = function (timeframe) {

		var timeformat = "%H:%M";
		timeframe = parseInt(timeframe);
		if (timeframe == 1 ||
			(timeframe > 12 && timeframe < 16)) {
			timeformat = "%H:%M:%S";
		}

		if (timeframe == 9 || timeframe == 10) {
			timeformat = "%d.%m %H:%M";
		}

		if (timeframe > 10 && timeframe < 13) {
			timeformat = "%d.%m";
		}
		return timeformat;
	},

		chart.getGraphPointLeftOffset = function (timeframe) {

			var offset = 6;
			timeframe = parseInt(timeframe);
			if (timeframe == 1 ||
				(timeframe > 12 && timeframe < 16)) {
				offset = 13;
			}

			if (timeframe == 9 || timeframe == 10) {
				offset= 19;
			}

			if (timeframe > 10 && timeframe < 13) {
				offset = 7;
			}
			return offset;
		},
		chart.setHistoryFromWss = function (json_data) {
//(json_data);
			var tool = get_tool(json_data.tool_id), newdata = [];

//    for (var i in json_data.quotes) {
//        newdata.push([parseInt(json_data.time[i]) * 1000+(isLondonInSummerTime?3600000:0), parseFloat(json_data.quotes[i])]);
//    }


			if (json_data.quotes == null)
				return;

			//var correction = isLondonInSummerTime ? 3600 : 0;
			var len = json_data.quotes.length, last_time, last_quote, skip_count, new_quote, new_time, delta;
			for (var i = 0; i < len; i++) {
				new_quote = parseFloat(json_data.quotes[i]);
				new_time = parseInt(json_data.time[i]);

				if (newdata.length > 0) {
					last_time = newdata[newdata.length - 1][0];
					last_quote = newdata[newdata.length - 1][1];
					skip_count = new_time - last_time / 1000;

					delta = 0;// (last_quote - new_quote) / skip_count;
					skip_count--;

					while (skip_count > 0) {
						last_time += 1000;

						if ((last_quote / 1000) % 10 == 0) {
							newdata.push([last_time, last_quote + delta]);
						}

						skip_count--;
					}
					last_time = null;
					last_quote = null;
				}

				if (newdata.length == 0 || new_time * 1000 > newdata[newdata.length - 1][0]
//                && new_quote!=newdata[newdata.length - 1][1]
				) {
					newdata.push([new_time * 1000, new_quote]);
				} else {
					if (parseInt(json_data.time[i]) * 1000 == newdata[newdata.length - 1][0]) {
						newdata[newdata.length - 1][1] = new_quote;
					}
				}


				new_quote = null;

			}

			view.setHistory({tool_id: json_data.tool_id, data: newdata, request_id: (json_data.request_id)});

			len = null;
			last_time = null;
			last_quote = null;
			skip_count = null;
			new_quote = null;
			new_time = null;
			delta = null;
			newdata = null;
			tool = null;
		};

	chart.drawConsole = function (graph, force) {
		if (graph == null || graph == undefined) {
			return;
		}
		var drawTime = microtime(true),
			force = force || false,
			data = graph.get("data");


		if (data != null && data.length > 10) {
			var currentLast = data[data.length - 1], iterator = 0, lastData = data.pop();

			while (data[data.length - 1][0] + 1000 < lastData[0]) {

				data.push([data[data.length - 1][0] + 1000, data[data.length - 1][1]]);
			}
			data.push(lastData);

		}


		if (graph.get("kind") == view.kind
			&& ( data == null
				|| data.length == 0
				|| graph.get("lastTime") == null
				|| data[data.length - 1][0] > graph.get("lastTime")
				|| data[data.length - 1][1] != graph.get("lastQuote")
				|| force
			)) {

			if (data != null && data.length > 0) {
				graph.set("lastTime", data[data.length - 1][0]);
				graph.set("lastQuote", data[data.length - 1][1]);
			}

			if (graph.get("candle") == true && partner_params.use_candle == true) {
				graph.set("timesize", "M1-300-14400");
				chart.drawConsoleWithCandle(graph);
			} else {
				//chart.drawConsoleWithChartsJS(graph);
				graph.set("timesize", "M1-300-14400");
				chart.drawConsoleWithGraph(graph);
			}

			drawTime = microtime(true) - drawTime;

			if (drawTime > 0) {
				if (drawTime > 0.5) {
					graphMaxDrawFreq = 3500;
				} else if (drawTime > 0.09) {
					graphMaxDrawFreq = 2000;
				} else {
					graphMaxDrawFreq = 1000;
				}
			}
		}
		drawTime = null;
		force = null;
		data = null;
		graph = null;
	};

	chart.isVisible = function (graph) {

		if (graph.el == null) {
			return false;
		}

		if (graph.get("type") == "history") {
			var $el = $("#plot-" + graph.get("id"));
		} else {
			var $el = $("#opened-" + graph.get("id"));
		}


		if ($el[0] == null || isIE) {
			return true;
		}

		if (graph.el.hasClass("mini")) {
			return false;
		}


		var graph_offset = $el.offset().top || 0,
			graph_height = $el.height() || null,
			body_offset = $('body').scrollTop() || $('html').scrollTop() || 0,
			body_height = $(window).height() || null
		;

		if (graph_offset == null
			|| body_offset == null
			|| graph_height == null
			|| body_height == null) {
			return true;
		}


		return !(graph_offset != null
		&& body_offset != null
		&& graph_height != null
		&& body_height != null
		&& (graph_offset + graph_height) < body_offset || graph_offset > (body_offset + body_height));
	};

	chart.drawConsoleWithGraph = function (graph) {
		var plot = "#plot-" + graph.get("id"),
			data = [],
			min_max_offset = 0,
			color = graph_style.globalToolColor,
			graph_data = graph.get("data");

		graph.prepare();
		data = graph.getFormattedData();


		graph.set("fill_range", false);
		graph.set("chart", null);


		var color_fill1 = color_green;
		var color_fill2 = color_red;
		var color_fill3 = color_red;
		var color_fill4 = color_red;

		if (data.length > 0 && data[0] != null) {
			var correction = 0;

			if (useDateHack) {
				if (dateHackCorrection == 0) {
					var t = new Date(data[0][0]);
					correction = (t.getUTCHours() - t.getHours()) * 3600000;
					dateHackCorrection = correction;
					t = null;
				} else {
					correction = dateHackCorrection;
				}

				var corrected_data = [];
				if (data != null) {
					for (var i = 0; i < data.length; i++) {
						corrected_data.push([data[i][0] + correction, data[i][1]]);
					}
				}
				data = null;
				data = corrected_data;
			}


			var tickDecimals = parseInt(graph.get("tool").decimal_count);
			var minVal = data[0][1];
			var maxVal = data[0][1];
			var points = 1 / Math.pow(10, tickDecimals);

			if (data != null) {
				for (var i = 0; i < data.length; i++) {
					if (data[i][1] > maxVal) {
						maxVal = data[i][1];
					}
					if (data[i][1] < minVal) {
						minVal = data[i][1];
					}
				}
			}
			graph.set("min", minVal);
			graph.set("max", maxVal);
			graph.set("points", points);


			graph.set("color_fill1", color_fill1);
			graph.set("color_fill2", color_fill2);
			graph.set("color_fill3", color_fill3);
			graph.set("color_fill4", color_fill4);

			graph.getAdditionalLines();

			minVal = graph.get("min");
			maxVal = graph.get("max");

			var optionLengthSec = 60000;
			var plotDataBeginTime = data[0][0];
			var plotDataEndTime = plotDataBeginTime + optionLengthSec;
			var plotDataChoosedVal = data[0][1];

			var lineWidth = 2;

			var markings = [], last_graph_point = data[data.length - 1][0] + 1;
			var lock_time = null;
			if (partner_params.use_markings_for_graph == true) {

				var id = view.option_kinds.getIdByName(graph.get("kind")) + "-" + graph.get("tool").tool_id + "-" + graph.get("timeframe");
				if (hook_timeframes_cache[id] != null) {
					last_graph_point = hook_timeframes_cache[id].date_close * 1000 + correction;

					lock_time = parseInt(graph.getTimeframe().lock_time);

					if (lock_time != 0 && lock_time != -1) {

						markings = [
							{
								color: '#FF0',
								lineWidth: 0,
								xaxis: {
									from: last_graph_point - lock_time * 1000,
									to: last_graph_point - lock_time * 1000
								}
							},
							{
								color: '#F00',
								lineWidth: 0,
								xaxis: {from: last_graph_point - 1, to: last_graph_point - 1}
							},
						]
					} else {
						markings = [
							{color: '#F00', lineWidth: 0, xaxis: {from: last_graph_point - 1, to: last_graph_point - 1}}
						]
					}
					markings = [];

				}
			} else {
				var corrOffset = 360000;
				/* switch (graph.get("timeframe")) {
				 case 1:
				 corrOffset = 90 * 1000;
				 break;
				 case 2:
				 corrOffset = 6 * 30 * 1000;
				 break;
				 case 3:
				 corrOffset = 9 * 60 * 1000;
				 break;
				 case 4:
				 corrOffset = 18 * 60 * 1000;
				 break;
				 case 5:
				 corrOffset = 2.8 * 30 * 60 * 1000;
				 break;
				 case 6:
				 corrOffset = 9 * 15 * 60 * 1000;
				 break;
				 case 7:
				 corrOffset = 4 * 60 * 60 * 1000;
				 break;
				 case 8:
				 corrOffset = 13 * 15 * 60 * 1000;
				 break;
				 case 9:
				 corrOffset = 9 * 60 * 60 * 1000;
				 break;
				 case 10:
				 corrOffset = 10 * 60 * 60 * 1000;
				 break;
				 case 11:
				 corrOffset = 40 * 7 * 60 * 60 * 1000;
				 break;
				 case 12:
				 corrOffset = 33 * 30 * 60 * 60 * 1000;
				 break;
				 case 13:
				 corrOffset = 3600;
				 break;
				 case 14:
				 corrOffset = 4500;
				 break;
				 case 15:
				 corrOffset = 5400;
				 break;
				 }*/
				last_graph_point = last_graph_point + (last_graph_point - plotDataBeginTime) * 0.25;
			}

			var lineWidth = 1;

			if (graph.get("kind") == "classic") {
				lineWidth = 0.1;
			}
			var addLineUp1 = graph.get("addLineUp1") != null ? {//горизонтальная прямая2
				data: [
					[data[0][0], graph.get("addLineUp1m")],
					[last_graph_point, graph.get("addLineUp1m")]
				],
				color: "rgb(0,100,0)",
				lines: {
					lineWidth: lineWidth,
					fill: graph.get("fill_range"),
					fillColor: graph.get("color_fill1")

				},
				id: "addLineUp1",
				fillBetween: "maxValLine",
				shadowSize: 0
			} : {};

			var addLineUp2 = graph.get("addLineUp2") != null ? {//горизонтальная прямая2
				data: [
					[data[0][0], graph.get("addLineUp2m")],
					[last_graph_point, graph.get("addLineUp2m")]
				],
				color: "rgb(0,100,0)",
				lines: {
					lineWidth: lineWidth,
					fill: graph.get("fill_range"),
					fillColor: graph.get("color_fill2")
				},
				id: "addLineUp2",
				fillBetween: "addLineUp1",
				shadowSize: 0
			} : {};

			var addLineUp3 = graph.get("addLineUp3") != null && !graph.get("use_one_tunnel") ? {//горизонтальная прямая2
				data: [
					[data[0][0], graph.get("addLineUp3m")],
					[last_graph_point, graph.get("addLineUp3m")]
				],
				color: "rgb(0,100,0)",
				lines: {
					lineWidth: lineWidth,
					fill: graph.get("fill_range"),
					fillColor: graph.get("color_fill2")
				},
				id: "addLineUp3",
				fillBetween: "addLineUp4",
				shadowSize: 0
			} : {};

			var addLineUp4 = graph.get("addLineUp4") != null && !graph.get("use_one_tunnel") ? {//горизонтальная прямая2
				data: [
					[data[0][0], graph.get("addLineUp4m")],
					[last_graph_point, graph.get("addLineUp4m")]
				],
				color: "rgb(0,100,0)",
				lines: {
					lineWidth: lineWidth,
					fill: graph.get("fill_range"),
					fillColor: graph.get("color_fill3")
				},
				id: "addLineUp4",
				fillBetween: "addLineUp2",
				shadowSize: 0
			} : {};


			if (graph.get("kind") == "touch" || graph.get("kind") == "touch_advanced") {
				color = graph_style.globalToolColorTouch;
				if (graph.get("direction") != null && graph.get("direction") != "TOUCH") {
					graph.get("addLineUp1") != null && (addLineUp1.lines.lineWidth = 2) && (addLineUp1.color = graph_style.touchLineUp);
					graph.get("addLineUp2") != null && (addLineUp2.lines.lineWidth = 2) && (addLineUp2.color = graph_style.touchLineDown);
				} else {
					graph.get("addLineUp1") != null && (addLineUp1.lines.lineWidth = 1) && (addLineUp1.color = "rgb(0,100,0)");
					graph.get("addLineUp2") != null && (addLineUp2.lines.lineWidth = 1) && (addLineUp2.color = "rgb(0,100,0)");
				}
			}


			if (graph.get("kind") == "range") {

				if (graph.el.find(".binsta_solo_range__top_value")[0] != null) {
					graph.el.find(".binsta_solo_range__top_value").text(filterNaN(graph.get("addLineUp1").toFixed(tickDecimals)));
				}
				if (graph.el.find(".binsta_solo_range__bottom_value")[0] != null) {
					graph.el.find(".binsta_solo_range__bottom_value").text(filterNaN(graph.get("addLineUp2").toFixed(tickDecimals)));
				}

				if (graph.el.find(".al_solo_range__top_value")[0] != null) {
					graph.el.find(".al_solo_range__top_value").text(filterNaN(graph.get("addLineUp1").toFixed(tickDecimals)));
				}
				if (graph.el.find(".al_solo_range__bottom_value")[0] != null) {
					graph.el.find(".al_solo_range__bottom_value").text(filterNaN(graph.get("addLineUp2").toFixed(tickDecimals)));
				}

			}

			var timeformat = chart.getTimeFormat(graph.get('timeframe'));

			var crosshair = {
				mode: "none",
				color: "gray",
				lineWidth: 1
			};
			if (partner_params.useCrosshair) {
				crosshair = {
					mode: "none",
					color: "gray",
					lineWidth: 1
				};
			}

			var dataObjects = [];

			dataObjects.push({
				data: chart.normalizeData(data),
				color: color,
				lines: {
					lineWidth: graph_style.globalToolLineWidth,
					fill: 0.2,
					fillColor: graph_style.globalToolFillColor
				},
				shadowSize: graph_style.globalToolShadowSize
			});

			dataObjects.push(
				{//горизонтальная прямая
					data: [
						[data[0][0], data[data.length - 1][1]],
						[last_graph_point, data[data.length - 1][1]]
					],
					color: color,
					lines: {
						lineWidth: graph_style.globalHorisontalLineWidth
					},
					shadowSize: 0
				});

			dataObjects.push(
				{//круг
					data: [
						[data[data.length - 1][0], data[data.length - 1][1]]
					],
					points: {
						show: graph_style.globalToolPointShow,
						symbol:function(ctx, x, y, radius, shadow) {
							var addRadius = 40;
							// Radius of the entire circle.
							var gradient = ctx.createRadialGradient(x, y, radius, x, y, radius+addRadius);
							gradient.addColorStop(0, "rgba(186,223,229,0.2)");
							gradient.addColorStop(1, "rgba(24,35,44,0.05)");
							ctx.beginPath();
							ctx.arc(x, y, radius+addRadius, 0, 2 * Math.PI, false);
							ctx.fillStyle = gradient;
							ctx.fill();
							ctx.beginPath();
							ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
							ctx.fillStyle = '#badfe5';
							ctx.fill();
						},
						fill:false,
						radius: graph_style.globalToolPointSize,
						lineWidth: 0

					},
					color: color,
					shadowSize: 0
				});

			dataObjects.push(addLineUp1);
			dataObjects.push(addLineUp2);
			dataObjects.push(addLineUp3);
			dataObjects.push(addLineUp4);

			dataObjects.push(
				{//горизонтальная прямая (максимум)
					data: [
						[data[0][0], maxVal + min_max_offset * points],
						[last_graph_point, maxVal + min_max_offset * points]
					],
					color: graph_style.globalToolMinMaxlineColor,
					lines: {
						lineWidth: graph_style.globalToolMinMaxHorizontalLineWidth
					},
					shadowSize: 0,
					id: "maxValLine"
				});

			dataObjects.push(
				{//горизонтальная прямая (минимум)
					data: [
						[data[0][0], minVal - min_max_offset * points],
						[last_graph_point, minVal - min_max_offset * points]
					],
					color: graph_style.globalToolMinMaxlineColor,
					lines: {
						lineWidth: graph_style.globalToolMinMaxHorizontalLineWidth,
						fill: graph.get("fill_range"),
						fillColor: graph.get("color_fill4")
					},
					fillBetween: graph.get("use_one_tunnel") ? "addLineUp2" : "addLineUp3",
					id: "minValLine",
					shadowSize: 0
				});
			//{ #region draw plot
			//if($(plot)[0]!=null)
			graph.plot = $.plot(plot, dataObjects, {
				xaxis: {
					font: {
						size: partner_params.consoleXAxisSize,
						color: "gray"
					},
					mode: "time",
					timeformat: timeformat,
					//ticks: 6
				},
				yaxis: {
					min: minVal - min_max_offset * points,
					max: maxVal + min_max_offset * points,
					position: partner_params.yMarksPosition,
					font: {
						size: partner_params.consoleYAxisSize,
						color: "gray"
					},
					tickDecimals: tickDecimals
				},
				"crosshair": crosshair,
				grid: {
					markings: markings,
					hoverable: false,
					clickable: false,
					autoHighlight: false,

					borderWidth: {
						top: graph_style.globalGridColorBorderWidth,
						right: graph_style.globalGridColorBorderWidth,
						bottom: graph_style.globalGridColorBorderWidth,
						left: graph_style.globalGridColorBorderWidth
					},
					borderColor: {
						top: graph_style.globalGridColorBorder,
						left: graph_style.globalGridColorBorder,
						right: graph_style.globalGridColorBorder,
						bottom: graph_style.globalGridColorBorder
					}
				}


			});
			//} #endregion draw plot
			//graph marks -----------------------------------------------------------------------------------------------------------------------------------------


			data = graph.plot.getData();

			var $obj = $(plot);
			var objOffset = $obj.offset();

			if (objOffset == null) {
				return;
			}

			var graphy = objOffset.top;
			$obj = null;
			var offset = data[2].yaxis.p2c(data[2].data[0][1]);
			var x_offset = data[2].xaxis.p2c(data[2].data[0][0]);
			graph.set("plotData", data[0]);
			graph.set("getAxes", graph.plot.getAxes());

			if (graph.el != null && data[2].data[0][1] != null) {

				var last_value = graph.mark_course;

				graph.mark_course.css({"top": offset + cource_padding_top}).show().css({"position": partner_params.markPosition}).text(data[2].data[0][1].toFixed(tickDecimals));
				//if(partner_params.use_markings_for_graph){
				last_value.css({"right": "auto"});
				if (partner_params.markPosition == "absolute") {
					last_value.css({"left": (cource_padding_left) + "px"});
				}
				//}

			}

			if (graph.el != null && data[2].data[0][1] != null && data[2].data[0][0] != null) {
				graph.graph_point
					.css({"top": offset + graph_style.graph_point_top_offset})
					.css({"left":x_offset+ chart.getGraphPointLeftOffset(graph.get('timeframe'))})
					.css({"position": partner_params.markPosition})
					.show();
			}

			var i = 5,
				offsets = [],
				top = 0;

			while (i > 1) {


				i--;
				var mark_line = graph.mark_lines[i];

				if (mark_line[0] != null) {
					if (graph.get("kind") != "classic" && graph.get("addLineUp" + i + "m") != null && graph.get("addLineUp" + i) != null && !isNaN(graph.get("addLineUp" + i).toFixed(tickDecimals))) {
						mark_line.show();
						top = data[2].yaxis.p2c(graph.get("addLineUp" + i + "m").toFixed(tickDecimals));

						offsets[i] = top;
						mark_line.css({"top": top + cource_padding_top});
						mark_line.text(graph.get("addLineUp" + i).toFixed(tickDecimals));
					} else {
						mark_line.hide();
					}
				}


			}


			if (offsets[2] - offsets[1] < 17) {
				graph.mark_lines[2].addClass("left2");
			} else {
				graph.mark_lines[2].removeClass("left2");
			}

			if (offsets[3] - offsets[4] < 17) {
				graph.mark_lines[4].addClass("left2");
			} else {
				graph.mark_lines[4].removeClass("left2");
			}

			if (graph.get("use_one_tunnel")) {
				graph.mark_lines[3].hide();
				graph.mark_lines[4].hide();
			}


			if (partner_params.use_markings_for_graph && hook_timeframes_cache[id] != null && last_graph_point != null && lock_time != null) {
				if (lock_time != 0 && lock_time != -1 && lock_time != null) {
					graph.allowed_line_txt.css({"left": (data[2].xaxis.p2c(last_graph_point - lock_time * 1000).toFixed(2) - 5)}).show();
					graph.end_line_txt.css({"left": (data[2].xaxis.p2c(last_graph_point - 1).toFixed(2) - 5)}).show();
				} else {
					graph.allowed_line_txt.hide();
					graph.end_line_txt.css({"left": (data[2].xaxis.p2c(last_graph_point - 1).toFixed(2) - 5)}).show();
				}
				if (data[2].xaxis.p2c(last_graph_point - 1) - data[2].xaxis.p2c(last_graph_point - lock_time * 1000) < 10) {
					graph.el.addClass("markings-overflow");
				} else {
					graph.el.removeClass("markings-overflow");
				}

			} else {
				graph.end_line_txt.hide();
				graph.allowed_line_txt.hide();
			}


			//graph marks -----------------------------------------------------------------------------------------------------------------------------------------


		}

		wipe(data);
		wipe(graphy);
		wipe(offset);
		wipe(addLineUp1);
		wipe(addLineUp2);
		wipe(lineWidth);
		wipe(tickDecimals);
		wipe(optionLengthSec);
		wipe(plotDataBeginTime);
		wipe(plotDataEndTime);
		wipe(plotDataChoosedVal);
		wipe(plot);
		wipe(color);
		wipe(maxVal);


		dataObjects = null;
		data = null;
		graphy = null;
		offset = null;
		addLineUp1 = null;
		addLineUp2 = null;
		lineWidth = null;
		tickDecimals = null;
		optionLengthSec = null;
		plotDataBeginTime = null;
		plotDataEndTime = null;
		plotDataChoosedVal = null;
		plot = null;
		color = null;
		minVal = null;
		maxVal = null;

	};

	chart.drawConsoleWithCandle = function (graph) {

		var plot = "#plot-" + graph.get("id"),
			data = [],
			data2 = [],
			color = 'rgba(0, 150, 0, 0.5)';


		data = graph.get("data");

		$(graph.el).find(".graph-mark").hide();

		graph.getAdditionalLines();

		if (data.length > 0) {
			var tickDecimals = parseInt(graph.get("tool").decimal_count);

			var minVal = data[0][1];
			var maxVal = data[0][1];

			for (var i in data) {
				if (data[i][1] > maxVal) {
					maxVal = data[i][1];
				}
				if (data[i][1] < minVal) {
					minVal = data[i][1];
				}
			}

			var points = 1 / Math.pow(10, tickDecimals);
			var optionLengthSec = 60000;
			var plotDataBeginTime = data[0][0];
			var plotDataEndTime = plotDataBeginTime + optionLengthSec;
			var plotDataChoosedVal = data[0][1];

			var candle_data = graph.candlise_data(data);
			//var data = google.visualization.arrayToDataTable(candle_data, true);

			if (typeof(google.visualization.DataTable) !== "undefined") {
				var dataTable = new google.visualization.DataTable();

				dataTable.addColumn('datetime', 'Time');
				//dataTable.addColumn('string', 'string');

				dataTable.addColumn('number', '');
				dataTable.addColumn('number', '');
				dataTable.addColumn('number', '');
				dataTable.addColumn('number', '');

				dataTable.addColumn({type: 'string', role: 'tooltip', 'p': {'html': false}});

				dataTable.addColumn('number', '1');
				dataTable.addColumn({type: 'string', role: 'tooltip', display: 'none'});
				dataTable.addColumn('number', '2');
				dataTable.addColumn({type: 'string', role: 'tooltip'});
				dataTable.addColumn('number', '3');
				dataTable.addColumn({type: 'string', role: 'tooltip'});
				dataTable.addColumn('number', '4');
				dataTable.addColumn({type: 'string', role: 'tooltip'});

				dataTable.addRows(candle_data);

				if (graph.get("chart") == null) {
					graph.set("chart", new google.visualization.CandlestickChart(document.getElementById(plot.substring(1))));
				}

				if (!real_margin_lines) {
					graph.set("addLineUp1m", graph.get("addLineUp1") > maxVal ? maxVal + 5 * points : graph.get("addLineUp1"));
					graph.set("addLineUp2m", graph.get("addLineUp2") > maxVal ? maxVal + 2 * points : graph.get("addLineUp2"));
					graph.set("addLineUp3m", graph.get("addLineUp3") < minVal ? minVal - 2 * points : graph.get("addLineUp3"));
					graph.set("addLineUp4m", graph.get("addLineUp4") < minVal ? minVal - 5 * points : graph.get("addLineUp4"));
				} else {

					graph.set("addLineUp1m", graph.get("addLineUp1"));
					graph.set("addLineUp2m", graph.get("addLineUp2"));
					graph.set("addLineUp3m", graph.get("addLineUp3"));
					graph.set("addLineUp4m", graph.get("addLineUp4"));

					if (graph.get("addLineUp1") != null) {
						maxVal = graph.get("addLineUp1") > maxVal ? graph.get("addLineUp1") : maxVal;
					}
					if (graph.get("addLineUp2") != null) {
						maxVal = graph.get("addLineUp2") > maxVal ? graph.get("addLineUp2") : maxVal;
					}
					if (graph.get("addLineUp3") != null) {
						maxVal = graph.get("addLineUp3") > maxVal ? graph.get("addLineUp3") : maxVal;
					}
					if (graph.get("addLineUp4") != null) {
						maxVal = graph.get("addLineUp4") > maxVal ? graph.get("addLineUp4") : maxVal;
					}

					if (graph.get("addLineUp1") != null) {
						minVal = graph.get("addLineUp1") < minVal ? graph.get("addLineUp1") : minVal;
					}
					if (graph.get("addLineUp2") != null) {
						minVal = graph.get("addLineUp2") < minVal ? graph.get("addLineUp2") : minVal;
					}
					if (graph.get("addLineUp3") != null) {
						minVal = graph.get("addLineUp3") < minVal ? graph.get("addLineUp3") : minVal;
					}
					if (graph.get("addLineUp4") != null) {
						minVal = graph.get("addLineUp4") < minVal ? graph.get("addLineUp4") : minVal;
					}

				}

				var deltaForTopAndBottom = 40 / Math.pow(10, graph.get("tool").decimal_count);

				maxVal += deltaForTopAndBottom;
				minVal -= deltaForTopAndBottom;
				deltaForTopAndBottom = null;


				window.onerror = function (e) {
					return true;
				};

				graph.get("chart").draw(dataTable, {
					legend: 'none',
					colors: ['black'],
					width: 317,
					//tooltip: { isHtml: true },
					height: 225,
					fontSize: 8,
					chartArea: {left: 50, top: 10, width: "90%", height: "85%"},
					bar: {groupWidth: "90%"},

					vAxis: {
						//  title: "Percentage Uptime",
						textStyle: {color: '#005500', fontSize: '10', paddingRight: '100', marginRight: '100'},
						viewWindowMode: 'explicit',
						viewWindow: {
							max: maxVal,
							min: minVal
						}
					},

					candlestick: {
						risingColor: {
							strokeWidth: 0,
							fill: "rgb(0,129,77)",
							Pfstroke: "rgb(0,129,77)"
						},
						fallingColor: {
							strokeWidth: 0,
							stroke: "rgb(177,44,45)",
							fill: "rgb(177,44,45)"
						}
					},
					series: {
						1: {type: "line", color: "green"},
						2: {type: "line", color: "green"},
						3: {type: "line", color: "green"},
						4: {type: "line", color: "green"}
					}
				});
			}


		}

		//wipe(data);
		wipe(points);
		wipe(candle_data);
		wipe(data2);
		wipe(tickDecimals);
		wipe(optionLengthSec);
		wipe(plotDataBeginTime);
		wipe(plotDataEndTime);
		wipe(plotDataChoosedVal);
		wipe(plot);
		wipe(dataTable);
		wipe(color);
		//wipe(chart1);
		wipe(maxVal);

		data = null;
		chart1 = null;
		dataTable = null;
		points = null;
		data2 = null;
		candle_data = null;
		tickDecimals = null;
		optionLengthSec = null;
		plotDataBeginTime = null;
		plotDataEndTime = null;
		plotDataChoosedVal = null;
		plot = null;
		color = null;
		minVal = null;
		maxVal = null;
	};

	chart.drawOpened = function (graph, force, forceLastPrice, forceLastTime) {




//for force close chart.drawOpened(view.opened_options.get(2),true,1.12345);
		var correction = isLondonInSummerTime ? 3600000 : 0,
			force = force || false,
			forceLastPrice = forceLastPrice || 0,
			forceLastTime = forceLastTime || 0,
			plot = "#plot-opened-" + graph.get("id"),
			directionUp = graph.get("direction") == "CALL",
			optionLengthSec = 60,
			startPrice = graph.get("start_course") || null,
			data = graph.get("data") || null,
			draw = true,
			endTime = parseInt(graph.get("end_time")),
			min_max_offset = 20,
			fill_range = false,
			tickDecimals = graph.get("tool").decimal_count,
			use_one_tunnel;

		use_one_tunnel = graph.get("kind") == view.option_kinds.getIdByName("range");

		if (graph.get("closed") == true && force == false) {
			return;
		}


		if (graph.get("use_one_tunnel") == null) {
			graph.set("use_one_tunnel", use_one_tunnel);
		}

		var points = 1 / Math.pow(10, tickDecimals);
		var real_margin_lines = true;

		if (graph.get("kind") != view.option_kinds.getIdByName("classic")) {
			min_max_offset = 30;
			if (graph.get("addLineUp1") != null) {
				var pointsToTopLine = Math.round((parseFloat(graph.get("addLineUp1")) - parseFloat(graph.get("start_course"))) / points);
				min_max_offset = pointsToTopLine / 2;
			}
			if (graph.get("addLineUp2") != null) {
				var pointsToTopLine = Math.abs(Math.round((parseFloat(graph.get("addLineUp2")) - parseFloat(graph.get("start_course"))) / points));
				min_max_offset = pointsToTopLine / 2;
			}
		}


		if (graph.el != null) {
			var last_value = graph.el.find(".graph-mark.course");
		} else {
			return;
		}
		if (!chart.isVisible(graph) || graph.el.hasClass("mini") || !graph.el.hasClass("open")) {
			graph.el.find(".graph-mark").hide();
		}

		if (!chart.isVisible(graph) && !force) {
			draw = false;
		}

		if (graph.get("kind") == "1") {
			$(graph.el).find(".bin_console_main_block__graph_block .graph-mark").hide();
		}

		if (graph.time < 300) {
			var timeformat = "%H:%M:%S";
		} else {
			var timeformat = "%H:%M";
		}

		if ($(plot)[0] == null)
			return;
		/*
		 if (data.length > 1 && graph.get("start_time") * 1000 - data[0][0] > 0) {
		 data = data.slice((graph.get("start_time") * 1000 - data[0][0]) / 1000);
		 }
		 */
		if (force == false && data.length > 2) {
			//data.pop();
		}


		if (!force) {
			if (data == null
				|| data.length == 0
				|| graph.get("lastTime") == null
				|| data[data.length - 1][0] > graph.get("lastTime")
				|| data[data.length - 1][1] != graph.get("lastQuote")

			) {

				if (data != null && data.length > 0) {
					graph.set("lastTime", data[data.length - 1][0]);
					graph.set("lastQuote", data[data.length - 1][1]);
				}

			} else {
				return;
			}
		}

		/*if (graph.get("touch_win") == true) {
		 graph.set("closed", true);
		 graph.el.find(".graph-mark").hide();
		 setTimeout(graph.moveToClosed(), 3000);
		 return;
		 }*/

		var color_fill1 = color_green;
		var color_fill2 = color_red;
		var color_fill3 = color_red;

		//var timeformat = "%H:%M";
		endTime *= 1000;

		if (data != null && data.length > 0) {

			//data[data.length-1][1]=data[data.length-1][1]-rand(0,100)/10000+rand(0,100)/10000;

			if (startPrice == null) {
				var plotDataChoosedVal = data[0][1];
			} else {
				var plotDataChoosedVal = parseFloat(startPrice);
				data[0][1] = parseFloat(startPrice);
			}

			var thresholdColorWin = graph_style.globalOptionColorUp;
			var thresholdColorLose = graph_style.globalOptionColorDown;

			if (directionUp == true) {
				var thresholdColorUp = thresholdColorWin;
				var thresholdColorDown = thresholdColorLose;
				var thresholdValCorrection = 0.000001;
			} else {
				var thresholdColorDown = thresholdColorWin;
				var thresholdColorUp = thresholdColorLose;
				var thresholdValCorrection = -0.000001;
			}

			optionLengthSec *= 1000;
			var plotDataBeginTime = data[0][0];
			var plotDataEndTime = endTime;
			//var plotDataEndTime = plotDataBeginTime + optionLengthSec;

			//(["plotDataEndTime",plotDataEndTime]);


			if (data.length == 1 || data[data.length - 1][0] < plotDataEndTime || force == true) {

				var iteratorData = data.length - 1, winInData = false;

				if (graph.get("kind") == view.option_kinds.getIdByName("touch") || graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {
					while (iteratorData > 0) {
						if (common.checkWinTouch({
								pC: data[iteratorData][1],
								p1: graph.get("addLineUp1"),
								p2: graph.get("addLineUp2")
							})) {

							winInData = true;
							iteratorData = 0;
						}
						iteratorData--;
					}
					if (winInData === true) {
						graph.set("touch_win", true);
					}
				}

				if (graph.get("kind") == view.option_kinds.getIdByName("classic")) {
					if (parseFloat(graph.get("start_course")) == parseFloat(forceLastPrice) || parseFloat(graph.get("start_course")) == parseFloat(data[data.length - 1][1]) && force == false) {
						graph.set("equal", true);
						graph.updatePayout();
					} else {
						graph.set("equal", false);
					}
				}

				if (force == true) {
					last_value.hide();

					if (graph.get("early_closed") == true) {

						data[data.length - 1][1] = forceLastPrice;

						graph.set("data", data);

						var correction2;
						if (useDateHack) {
							if (dateHackCorrection == 0) {
								var t = new Date(data[0][0]);
								correction2 = (t.getUTCHours() - t.getHours()) * 3600000;
								dateHackCorrection = correction2;
								t = null;
							} else {
								correction2 = dateHackCorrection;
							}
						}

						var time = utcTime;
						if (time > plotDataEndTime) {
							time = plotDataEndTime;
						}
						if (data[data.length - 1][0] < time) {
							data.push([time, forceLastPrice]);
						} else {
							while (data[data.length - 1][0] >= time) {
								if (data.length > 1) {
									data.pop();
								}
							}
							data.push([time, forceLastPrice]);
						}


					} else if (graph.get("kind") == view.option_kinds.getIdByName("touch") || graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {

						data[data.length - 1][1] = forceLastPrice;

						graph.set("data", data);

						var win = common.checkWinTouch({
							pC: forceLastPrice,
							p1: graph.get("addLineUp1"),
							p2: graph.get("addLineUp2")
						});

						if (graph.get("touch_win") == "true") {
							win = true;
						}

						if (win === true) {
							graph.set("touch_win", true);
						} else {

							var correction2;
							if (useDateHack) {
								if (dateHackCorrection == 0) {
									var t = new Date(data[0][0]);
									correction2 = (t.getUTCHours() - t.getHours()) * 3600000;
									dateHackCorrection = correction2;
									t = null;
								} else {
									correction2 = dateHackCorrection;
								}
							}


							time = plotDataEndTime;

							if (data[data.length - 1][0] < time) {
								data.push([time, forceLastPrice]);
							} else {
								while (data[data.length - 1][0] >= time) {
									if (data.length > 1) {
										data.pop();
									}
								}
								data.push([time, forceLastPrice]);
							}

						}

						graph.updatePayout();

						graph.set("closed", true);
						graph.sell_now.addClass("inactive");
						//hiddenHint("hint-sell-button");
						//("closed");

					} else {

						//здесь должна быть дата закрытия

						//plotDataEndTime = data[data.length - 1][0];

						var lastPrice = forceLastPrice;

						if (data[data.length - 1][0] < plotDataEndTime) {
							data.push([plotDataEndTime, forceLastPrice]);
						} else {

							while (data[data.length - 1][0] >= plotDataEndTime) {
								if (data.length > 1) {
									data.pop();
								}
							}
							data.push([plotDataEndTime, forceLastPrice]);
						}


					}


					// plotDataEndTime+=500;
					if (partner_params.setClosePriceNewBlock) {
						graph.open_options_bar_body_rate_num.text(parseFloat(forceLastPrice).toFixed(tickDecimals));
					} else {

						if (lastPrice == null) {
							lastPrice = data[data.length - 1][1];
						}
						graph.el.find(".price_close").text(lastPrice);
					}

				} else {
					var lastPrice = data[data.length - 1][1];
				}


				var minVal = data[0][1];
				var maxVal = data[0][1];

				for (var i in data) {
					if (data[i][1] > maxVal) {
						maxVal = data[i][1];
					}
					if (data[i][1] < minVal) {
						minVal = data[i][1];
					}
				}

				var obj = $(plot);

				var win = graph.getWin();

				//classic
				if (graph.get("kind") == "1") {
					if (graph.get("direction") == "CALL") {
						graph.call = true;
					}

					if (graph.call == true) {
						var payment_win = graph.get("payment_up");
						var payment_lose = graph.get("payment_down");
					} else {
						var payment_win = graph.get("payment_down");
						var payment_lose = graph.get("payment_up");
					}


				} else

				//touch opened
				if (graph.get("kind") == view.option_kinds.getIdByName("touch")
					|| graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {


					if (win === true) {
						graph.set("touch_win", true);
					}

					if (graph.get("touch_win") === true) {
						win = true;
					}

					var payment_win = graph.get("payment_win");
					var payment_lose = graph.get("payment_lose");
					// min_max_offset = 22;
				} else if (graph.get("kind") == view.option_kinds.getIdByName("range_classic")) {
					var payment_win = graph.get("payment_win");
					var payment_lose = graph.get("payment_lose");

				} else if (graph.get("kind") == view.option_kinds.getIdByName("range") || graph.get("kind") == view.option_kinds.getIdByName("range_advanced")) {
					var payment_win = graph.get("payment_win");
					var payment_lose = graph.get("payment_lose");

					// min_max_offset = 27;

					if (partner_params.fillOnlyChoosedDirection) {
						color_fill1 = graph.get("direction") == "IN" ? color_green : color_transparent;
						color_fill2 = graph.get("direction") == "IN" ? color_transparent : color_red;
						color_fill3 = color_transparent;
						color_fill4 = color_transparent;

					} else {
						color_fill1 = graph.get("direction") == "IN" ? color_green : color_red;
						color_fill2 = graph.get("direction") == "IN" ? color_red : color_green;
						color_fill3 = color_red;
					}


				} else {

					//for OptionBuilder
				}


				var payout_mini = $(graph.id + "payout");
				if (payout_mini != null) {
					payout_mini.text(win == true ? "$" + payment_win : "$" + payment_lose);
					payout_mini.removeClass("win");
					payout_mini.removeClass("lose");
					payout_mini.addClass(win == true ? "win" : "lose");
				}
				if (!graph.get("early_closed")) {
					graph.el.removeClass("win").removeClass("lose").addClass(win == true ? "win" : "lose");
				}

				if (true || obj.parents(".cd_opened_option_item").find(".open_close_indicator").hasClass("opened") || force == true) {

					var corrected_data = [];

					if (useDateHack) {
						if (dateHackCorrection == 0) {
							var t = new Date(data[0][0]);
							correction = (t.getUTCHours() - t.getHours()) * 3600000;
							dateHackCorrection = correction;
							t = null;
						} else {
							correction = dateHackCorrection;
						}

					}

					for (var i in data) {
						corrected_data.push([data[i][0] + correction, data[i][1]]);
					}


					plotDataEndTime = endTime + correction;
					if (endTime + correction < corrected_data[corrected_data.length - 1][0]) {
						endTime = corrected_data[corrected_data.length - 1][0];
						plotDataEndTime = corrected_data[corrected_data.length - 1][0];
					}
					plotDataBeginTime = corrected_data[0][0];


					if (graph.get("kind") == view.option_kinds.getIdByName("touch") || graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) {
						graph.set("addLineUp1", null);
						graph.set("addLineUp2", null);
						graph.set("addLineUp1m", null);
						graph.set("addLineUp2m", null);

						var special_params = (graph.get("special_params"));

						if (graph.get("direction") == "UP") {
							graph.set("addLineUp1", parseFloat(data[0][1]) + parseFloat(special_params.up_delta));

							if (real_margin_lines) {
								graph.set("addLineUp1m", graph.get("addLineUp1"));
							} else {
								graph.set("addLineUp1m", graph.get("addLineUp1") > maxVal ? maxVal + 20 * points : graph.get("addLineUp1"));
							}

						}
						if (graph.get("direction") == "DOWN") {
							graph.set("addLineUp2", parseFloat(data[0][1]) - parseFloat(special_params.down_delta));

							if (real_margin_lines) {
								graph.set("addLineUp2m", graph.get("addLineUp2"));
							} else {
								graph.set("addLineUp2m", graph.get("addLineUp2") < minVal ? minVal - 20 * points : graph.get("addLineUp2"));
							}
						}
						if (graph.get("direction") == "UP/DOWN") {


							graph.set("addLineUp1", parseFloat(data[0][1]) + parseFloat(special_params.updown_delta_up));
							graph.set("addLineUp2", parseFloat(data[0][1]) - parseFloat(special_params.updown_delta_down));

							if (real_margin_lines) {
								graph.set("addLineUp1m", graph.get("addLineUp1"));
								graph.set("addLineUp2m", graph.get("addLineUp2"));
							} else {
								graph.set("addLineUp1m", graph.get("addLineUp1") > maxVal ? maxVal + 20 * points : graph.get("addLineUp1"));
								graph.set("addLineUp2m", graph.get("addLineUp2") < minVal ? minVal - 20 * points : graph.get("addLineUp2"));
							}

						}
					} else if (graph.get("kind") == view.option_kinds.getIdByName("range") || graph.get("kind") == view.option_kinds.getIdByName("range_advanced")) {
						fill_range = true;

						var special_params = (graph.get("special_params"));

						if (graph.get("kind") == view.option_kinds.getIdByName("range")) {
							graph.set("addLineUp1", parseFloat(special_params.margin_top));
							graph.set("addLineUp2", parseFloat(special_params.margin_bottom));

						} else {
							graph.set("addLineUp1", parseFloat(special_params.margin_top_external));
							graph.set("addLineUp2", parseFloat(special_params.margin_top_internal));

							graph.set("addLineUp3", parseFloat(special_params.margin_bottom_internal));
							graph.set("addLineUp4", parseFloat(special_params.margin_bottom_external));

						}

						if (!real_margin_lines) {
							graph.set("addLineUp1m", graph.get("addLineUp1") > maxVal ? maxVal + 10 * points : graph.get("addLineUp1"));
							graph.set("addLineUp2m", graph.get("addLineUp2") > maxVal ? maxVal + 5 * points : graph.get("addLineUp2"));
							graph.set("addLineUp3m", graph.get("addLineUp3") < minVal ? minVal - 5 * points : graph.get("addLineUp3"));
							graph.set("addLineUp4m", graph.get("addLineUp4") < minVal ? minVal - 10 * points : graph.get("addLineUp4"));


						} else {

							graph.set("addLineUp1m", graph.get("addLineUp1"));
							graph.set("addLineUp2m", graph.get("addLineUp2"));
							graph.set("addLineUp3m", graph.get("addLineUp3"));
							graph.set("addLineUp4m", graph.get("addLineUp4"));

							maxVal = graph.get("addLineUp1") > maxVal ? graph.get("addLineUp1") : maxVal;
							maxVal = graph.get("addLineUp2") > maxVal ? graph.get("addLineUp2") : maxVal;
							if (!use_one_tunnel) {
								maxVal = graph.get("addLineUp3") > maxVal ? graph.get("addLineUp3") : maxVal;
								maxVal = graph.get("addLineUp4") > maxVal ? graph.get("addLineUp4") : maxVal;
							}

							minVal = graph.get("addLineUp1") < minVal ? graph.get("addLineUp1") : minVal;
							minVal = graph.get("addLineUp2") < minVal ? graph.get("addLineUp2") : minVal;
							if (!use_one_tunnel) {
								minVal = graph.get("addLineUp3") < minVal ? graph.get("addLineUp3") : minVal;
								minVal = graph.get("addLineUp4") < minVal ? graph.get("addLineUp4") : minVal;
							}
						}


					} else if (graph.get("kind") == view.option_kinds.getIdByName("range_classic")) {

						fill_range = true;
						color_fill1 = color_green;
						color_fill2 = color_green;

						graph.set("addLineUp1", null);
						graph.set("addLineUp2", null);
						graph.set("addLineUp1m", null);
						graph.set("addLineUp2m", null);

						var special_params = (graph.get("special_params"));

						if (graph.get("direction") == "UP") {
							graph.set("addLineUp1", parseFloat(special_params.margin_up));

							if (real_margin_lines) {
								graph.set("addLineUp1m", graph.get("addLineUp1"));
							} else {
								graph.set("addLineUp1m", graph.get("addLineUp1") > maxVal ? maxVal + 2 * points : graph.get("addLineUp1"));
							}

						}

						if (graph.get("direction") == "DOWN") {
							graph.set("addLineUp2", parseFloat(special_params.margin_down));

							if (real_margin_lines) {
								graph.set("addLineUp2m", graph.get("addLineUp2"));
							} else {
								graph.set("addLineUp2m", graph.get("addLineUp2") < minVal ? minVal - 2 * points : graph.get("addLineUp2"));
							}

							if (partner_params.fillOnlyChoosedDirection) {
								color_fill1 = color_red;
								color_fill2 = color_red;
							}
						}


						if (partner_params.fillOnlyChoosedDirection) {
							color_fill3 = color_transparent;
							color_fill4 = color_transparent;
						}

					}


					var addLineUp1 = graph.get("addLineUp1m") != null ? {//горизонтальная прямая2
						data: [
							[plotDataBeginTime, graph.get("addLineUp1m")],
							[plotDataEndTime, graph.get("addLineUp1m")]
						],
						color: "rgb(0,0,0)",
						lines: {
							lineWidth: 0.3,
							fill: fill_range,
							fillColor: color_fill2
						},
						fillBetween: "maxValLine",
						id: "addLineUp1",
						shadowSize: 0
					} : {};

					var addLineUp2 = graph.get("addLineUp2m") != null ? {//горизонтальная прямая2
						data: [
							[plotDataBeginTime, graph.get("addLineUp2m")],
							[plotDataEndTime, graph.get("addLineUp2m")]
						],
						color: "rgb(0,0,0)",
						lines: {
							lineWidth: 0.3,
							fill: fill_range,
							fillColor: color_fill1
						},
						fillBetween: "addLineUp1",
						id: "addLineUp2",
						shadowSize: 0
					} : {};

					var addLineUp3 = graph.get("addLineUp3m") != null && !use_one_tunnel ? {//горизонтальная прямая2
						data: [
							[plotDataBeginTime, graph.get("addLineUp3m")],
							[plotDataEndTime, graph.get("addLineUp3m")]
						],
						color: "rgb(0,0,0)",
						lines: {
							lineWidth: 0.3,
							fill: fill_range,
							fillColor: color_fill3
						},
						fillBetween: "addLineUp2",
						id: "addLineUp3",
						shadowSize: 0
					} : {};

					var addLineUp4 = graph.get("addLineUp4m") != null && !use_one_tunnel ? {//горизонтальная прямая2
						data: [
							[plotDataBeginTime, graph.get("addLineUp4m")],
							[plotDataEndTime, graph.get("addLineUp4m")]
						],
						color: "rgb(0,0,0)",
						lines: {
							lineWidth: 0.3,
							fill: fill_range,
							fillColor: color_fill1
						},
						fillBetween: "addLineUp3",
						id: "addLineUp4",
						shadowSize: 0
					} : {};


					var constraints = chart.getConstraints(graph, minVal, maxVal, thresholdColorUp, plotDataChoosedVal, thresholdValCorrection, thresholdColorDown);


					if (real_margin_lines) {

						if (graph.get("addLineUp1") != null)
							maxVal = graph.get("addLineUp1") > maxVal ? graph.get("addLineUp1") : maxVal;

						if (graph.get("addLineUp2") != null)
							maxVal = graph.get("addLineUp2") > maxVal ? graph.get("addLineUp2") : maxVal;

						if (!use_one_tunnel) {
							if (graph.get("addLineUp3") != null)
								maxVal = graph.get("addLineUp3") > maxVal ? graph.get("addLineUp3") : maxVal;
							if (graph.get("addLineUp4") != null)
								maxVal = graph.get("addLineUp4") > maxVal ? graph.get("addLineUp4") : maxVal;
						}


						if (graph.get("kind") != view.option_kinds.getIdByName("range_classic")) {
							if (graph.get("addLineUp1") != null)
								minVal = graph.get("addLineUp1") < minVal ? graph.get("addLineUp1") : minVal;
						}
						if (graph.get("addLineUp2") != null)
							minVal = graph.get("addLineUp2") < minVal ? graph.get("addLineUp2") : minVal;


						if (!use_one_tunnel) {
							if (graph.get("addLineUp3") != null)
								minVal = graph.get("addLineUp3") < minVal ? graph.get("addLineUp3") : minVal;
							if (graph.get("addLineUp4") != null)
								minVal = graph.get("addLineUp4") < minVal ? graph.get("addLineUp4") : minVal;
						}

					}

					if ((graph.get("kind") == view.option_kinds.getIdByName("touch") || graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) && graph.get("addLineUp1") != null && addLineUp1.lines != null) {
						addLineUp1.lines.lineWidth = 2;
						addLineUp1.color = graph_style.touchLineUp;
					}
					if ((graph.get("kind") == view.option_kinds.getIdByName("touch") || graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")) && graph.get("addLineUp2") != null && addLineUp2.lines != null) {
						addLineUp2.lines.lineWidth = 2;
						addLineUp2.color = graph_style.touchLineDown;
					}

					global_plot = null;

					timeformat = chart.getTimeFormat(graph.get('timeframe'));

					if (corrected_data.length > 0 && (draw == true || force == true))
						global_plot = $.plot(plot, [{
							data: [
								[plotDataBeginTime, plotDataChoosedVal],
								[plotDataEndTime, plotDataChoosedVal]
							],
							lines: {
								lineWidth: 1
							},
							id: "foo",
							shadowSize: 0
						}, {
							data: corrected_data,
							color: thresholdColorUp,
							constraints: constraints,
							lines: {
								lineWidth: 1
							},
							fillBetween: "foo",
							shadowSize: 0
						},
							addLineUp1,
							addLineUp2,
							addLineUp3,
							addLineUp4,
							{
								data: [
									[corrected_data[corrected_data.length - 1][0], corrected_data[corrected_data.length - 1][1]],
									[corrected_data[corrected_data.length - 1][0], corrected_data[corrected_data.length - 1][1]]
								],
								color: thresholdColorUp,
								lines: {
									lineWidth: 1
								},
								constraints: constraints,
								points: {
									show: graph_style.globalOptionPointShow,
									radius: graph_style.globalOptionPointSize

								}
							}, {//горизонтальная прямая
								data: [
									[corrected_data[0][0], corrected_data[corrected_data.length - 1][1]],
									[plotDataEndTime, corrected_data[corrected_data.length - 1][1]]
								],
								color: "#3b5998",
								lines: {
									lineWidth: 1
								},
								shadowSize: 0

							}, {//горизонтальная прямая (максимум)
								data: [
									[corrected_data[0][0], maxVal + min_max_offset / (Math.pow(10, tickDecimals))],
									[plotDataEndTime, maxVal + min_max_offset / (Math.pow(10, tickDecimals))]
								],
								color: graph_style.globalOptionMinMaxlineColor,
								lines: {
									lineWidth: graph_style.globalOptionMinMaxHorizontalLineWidth
								},
								shadowSize: 0,
								id: "maxValLine",
								fillBetween: "graph"
							}, {//горизонтальная прямая (минимум)
								data: [
									[corrected_data[0][0], minVal - min_max_offset / (Math.pow(10, tickDecimals))],
									[plotDataEndTime, minVal - min_max_offset / (Math.pow(10, tickDecimals))]
								],
								color: graph_style.globalOptionMinMaxlineColor,
								lines: {
									lineWidth: graph_style.globalOptionMinMaxHorizontalLineWidth,
									fill: fill_range,
									fillColor: color_fill2
								},
								shadowSize: 0,
								id: "minValLine",
								fillBetween: use_one_tunnel ? "addLineUp2" : "addLineUp4"
							}
						], {
							xaxis: {
								font: {
									size: partner_params.consoleXAxisSize,
									color: graph_style.globalGridColorText
								},
								mode: "time",
//                        ticks: 2,
								timeformat: timeformat
							},
							yaxis: {
								min: minVal - min_max_offset / (Math.pow(10, tickDecimals)),
								max: maxVal + min_max_offset / (Math.pow(10, tickDecimals)),
								position: 'right',
								font: {
									size: partner_params.consoleXAxisSize,
									color: "gray"
								},
								tickDecimals: tickDecimals
							}, grid: {
								borderWidth: {
									top: graph_style.globalGridColorBorderWidth,
									right: 1,
									bottom: graph_style.globalGridColorBorderWidth,
									left: graph_style.globalGridColorBorderWidth
								},
								borderColor: {
									top: graph_style.globalGridColorBorder,
									left: graph_style.globalGridColorBorder,
									right: graph_style.globalGridColorBorder,
									bottom: graph_style.globalGridColorBorder
								}
							}

						});


					try {
						if (global_plot != null) {
							data = global_plot.getData();
						}
					} catch (e) {
						log(e)
					}

					if (data != null && data[0] != null && data[0].data != null && data[0].data[0] != null) {

						var $obj = $(plot);
						var graphy = $obj.offset().top;
						$obj = null;
						var offset = data[0].yaxis.p2c(corrected_data[corrected_data.length - 1][1]);


						var commonOffset = $("#opened-" + graph.get("id")).offset().top - $(el).offset().top - $("#opened-" + graph.get("id")).height();
						if (last_value != null && corrected_data[corrected_data.length - 1][1] != null) {

							if (partner_params.openedMarksNew) {
								last_value.css({"top": offset + cource_opened_top});
							} else {
								last_value.css({"top": offset + cource_opened_top});
								last_value.css({"position": partner_params.markPositionOpened});
							}
							last_value.text(parseFloat(corrected_data[corrected_data.length - 1][1]).toFixed(tickDecimals));
							last_value.show();
						}
						var i = 4 + 1, offsets = [], top = 0;

						while (i > 1) {

							i--;

							var last_value1 = graph.el.find(".graph-mark.line" + i);

							if (last_value1[0] != null) {

								if (graph.get("addLineUp" + i) != null && !isNaN(graph.get("addLineUp" + i).toFixed(tickDecimals))) {
									last_value1.show();

									top = data[2].yaxis.p2c(graph.get("addLineUp" + i + "m").toFixed(tickDecimals));

									if (partner_params.openedMarksNew) {
										offsets[i] = top + cource_opened_top;
									} else {
										offsets[i] = top + cource_opened_top;
									}

									last_value1.css({"top": offsets[i]});
									last_value1.text(graph.get("addLineUp" + i).toFixed(tickDecimals));
								} else {
									last_value1.hide();
								}
							}
						}

					}


					if (use_one_tunnel) {
						graph.el.find(".graph-mark.line" + 3).hide();
						graph.el.find(".graph-mark.line" + 4).hide();
					}


				} else {
					obj.html("<div class='graph-off " + ((win == true) ? "win" : "") + "'></div>");
				}

			} else {
				if (graph.get("closed") == null) {
					graph.set("closed", true);
					//("waiting for last price");
				}
			}


			if (force == true) {
				if (lastPrice == null) {
					lastPrice = data[data.length - 1][1];
				}
				if (graph.el.find(".bin_open_options__close_rate")[0] != null) {
					graph.el.find(".bin_open_options__close_rate").text(lastPrice);
				}


				if (partner_params.setClosePriceNewBlock) {
					graph.el.find(".open_options_bar_header_item.n6").text(lastPrice);
					graph.open_options_bar_body_rate_num.text(lastPrice);
				} else {
					graph.el.find(".price_close").text(lastPrice);

				}

				//("Recieved last price");
				graph.updatePayout();
				graph.updateEndTime(true);
				setTimeout(function () {
					graph.updatePayout();
					graph.moveToClosed();
				}, 3000);

			}


		}

		graph.updatePayout();

		payout_mini = null;
		lastPrice = null;
		directionUp = null;
		tickDecimals = null;
		timeformat = null;
		constraints = null;
		plot = null;
		data = null;
		endTime = null;
		startPrice = null;
		optionLengthSec = null;
		plotDataChoosedVal = null;
		thresholdColorUp = null;
		thresholdValCorrection = null;
		plotDataBeginTime = null;
		plotDataEndTime = null;
		lastPrice = null;
		win = null;
		payment_win = null;
		payment_lose = null;
		obj = null;
	};

	chart.getConstraints = function (graph, minVal, maxVal, thresholdColorUp, plotDataChoosedVal, thresholdValCorrection, thresholdColorDown) {


		if (graph.get("kind") == "1") {

			var constraint1 = {
				threshold: plotDataChoosedVal + thresholdValCorrection,
				color: thresholdColorDown,
				evaluate: function (y, threshold) {
					return y < threshold;
				}
			};

			var constraints = [constraint1];
		} else if (
			graph.get("kind") == view.option_kinds.getIdByName("touch")
			|| graph.get("kind") == view.option_kinds.getIdByName("touch_advanced")
			|| graph.get("kind") == view.option_kinds.getIdByName("range_classic")
		) {

			if (graph.get("addLineUp1m") != null && graph.get("addLineUp2m") != null) {

				var constraint2 = {
					threshold: graph.get("addLineUp1m"),
					color: graph_style.globalOptionColorUpTouch,
					evaluate: function (y, threshold) {
						return y >= threshold;
					}
				};

				var constraint3 = {
					threshold: graph.get("addLineUp1m"),
					color: graph_style.globalOptionColorDownTouch,
					evaluate: function (y, threshold) {
						return y < threshold;
					}
				};

				var constraint4 = {
					threshold: graph.get("addLineUp2m"),
					color: graph_style.globalOptionColorUpTouch,
					evaluate: function (y, threshold) {
						return y <= threshold;
					}
				};

				thresholdColorUp = graph_style.globalOptionColorDownTouch;
				constraints = [constraint2, constraint3, constraint4];
			} else if (graph.get("addLineUp1m") != null) {
				var constraint2 = {
					threshold: graph.get("addLineUp1m"),
					color: graph_style.globalOptionColorUpTouch,
					evaluate: function (y, threshold) {
						return y >= threshold;
					}
				};

				var constraint3 = {
					threshold: graph.get("addLineUp1m"),
					color: graph_style.globalOptionColorDownTouch,
					evaluate: function (y, threshold) {
						return y < threshold;
					}
				};

				thresholdColorUp = "rgb(220,0,0)";
				constraints = [constraint2, constraint3];
			} else if (graph.get("addLineUp2m") != null) {
				var constraint2 = {
					threshold: graph.get("addLineUp2m"),
					color: graph_style.globalOptionColorDownTouch,
					evaluate: function (y, threshold) {
						return y > threshold;
					}
				};

				var constraint3 = {
					threshold: graph.get("addLineUp2m"),
					color: graph_style.globalOptionColorUpTouch,
					evaluate: function (y, threshold) {
						return y <= threshold;
					}
				};

				thresholdColorUp = graph_style.globalOptionColorDownTouch;
				constraints = [constraint2, constraint3];

			}


//                    if (graph.get("addLineUp1m") != null && addLineUp1.lines != null) {
//                        addLineUp1.lines.lineWidth = 1;
//                    }
//                    if (graph.get("addLineUp1m") != null && addLineUp2.lines != null) {
//                        addLineUp2.lines.lineWidth = 1;
//                    }


		} else if (graph.get("kind") == view.option_kinds.getIdByName("range") || graph.get("kind") == view.option_kinds.getIdByName("range_advanced")) {
			var color_win = graph_style.globalOptionColorUpRange;
			var color_lose = graph_style.globalOptionColorDownRange;

			if (graph.get("direction") == "OUT") {
				graph.invert = true;
			}

			var invert = graph.invert || false;
			if (invert) {
				var temp = color_win;
				color_win = color_lose;
				color_lose = temp;
				temp = null;
				thresholdColorUp = graph_style.globalOptionColorDownRange;
			} else {
				thresholdColorUp = color_lose;
			}

			graph.set("addLineUp1m", parseFloat(graph.get("addLineUp1m")) + 0.000001);
			graph.set("addLineUp2m", parseFloat(graph.get("addLineUp2m")) - 0.000001);
			graph.set("addLineUp3m", parseFloat(graph.get("addLineUp3m")) - 0.000001);
			graph.set("addLineUp4m", parseFloat(graph.get("addLineUp4m")) + 0.000001);

			constraints = [];

			if (!graph.get("use_one_tunnel")) { //4 lines, 2 tunnels
				var constraint2 = {
					threshold: graph.get("addLineUp3m"),
					color: graph_style.globalOptionColorUpRange,
					evaluate: function (y, threshold) {
						return y > threshold;
					}
				};
				var constraint3 = {
					threshold: graph.get("addLineUp4m"),
					color: graph_style.globalOptionColorDownRange,
					evaluate: function (y, threshold) {
						return y > threshold;
					}
				};
				var constraint4 = {
					threshold: graph.get("addLineUp2m"),
					color: graph_style.globalOptionColorUpRange,
					evaluate: function (y, threshold) {
						return y >= threshold;
					}
				};

				var constraint5 = {
					threshold: graph.get("addLineUp1m"),
					color: graph_style.globalOptionColorDownRange,
					evaluate: function (y, threshold) {
						return y > threshold;
					}
				};

				var constraint6 = {
					threshold: graph.get("addLineUp3m"),
					color: graph_style.globalOptionColorUpRange,
					evaluate: function (y, threshold) {
						return y <= threshold;
					}
				};

				var constraint7 = {
					threshold: graph.get("addLineUp4m"),
					color: graph_style.globalOptionColorDownRange,
					evaluate: function (y, threshold) {
						return y < threshold;
					}
				};

				if (graph.get("direction") == "OUT") {
					if (maxVal <= graph.get("addLineUp1m") && minVal > graph.get("addLineUp4m")) {
						constraints = [];
						//(1);
					} else if (maxVal <= graph.get("addLineUp1m") && minVal < graph.get("addLineUp4m")) {

						constraints = [{
							threshold: graph.get("addLineUp4m"),
							color: graph_style.globalOptionColorUpRange,
							evaluate: function (y, threshold) {
								return y <= threshold;
							}
						}];
						//(2);
					} else if (maxVal > graph.get("addLineUp1m") && minVal >= graph.get("addLineUp4m")) {
						constraints = [{
							threshold: graph.get("addLineUp1m"),
							color: graph_style.globalOptionColorUpRange,
							evaluate: function (y, threshold) {
								return y > threshold;
							}
						}];
						//(3);
					} else {
						constraints = [{
							threshold: graph.get("addLineUp1m"),
							color: graph_style.globalOptionColorUpRange,
							evaluate: function (y, threshold) {
								return y > threshold;
							}
						}, {
							threshold: graph.get("addLineUp4m"),
							color: graph_style.globalOptionColorUpRange,
							evaluate: function (y, threshold) {
								return y < threshold;
							}
						}];
						//(4);
					}
				} else {
					var min = minVal;
					var max = maxVal;
					var l1 = graph.get("addLineUp1m");
					var l2 = graph.get("addLineUp2m");
					var l3 = graph.get("addLineUp4m");
					var l4 = graph.get("addLineUp3m");


					if (min > l4 && max < l2) {
						//1
						constraints = [];
					} else if (min > l4 && max >= l2 && max < l1) {
						//2
						constraints = [constraint4];
					} else if (min > l4 && max > l1) {
						//3
						constraints = [constraint4, constraint5];
					} else if (min <= l4 && min > l3 && max < l2) {
						//4
						constraints = [constraint6];
					} else if (min < l3 && max < l2) {
						//5
						constraints = [constraint6, constraint7];
					} else if (min <= l4 && max >= l2 && max < l1 && min > l3) {
						//6
						constraints = [constraint6, constraint4];
					} else if (min < l3 && max >= l2 && max < l1) {
						//7
						constraints = [constraint6, constraint4, constraint7];
					} else if (min <= l4 && min > l3 && max > l1) {
						//8
						constraints = [constraint6, constraint4, constraint5];
					} else if (min < l3 && max > l1) {
						//9
						constraints = [constraint6, constraint4, constraint5, constraint7];
					}

				}
			} else { //2 lines, 1 tunnel


				if (graph.get("direction") == "OUT") {

					var constraint1 = {
						threshold: graph.get("addLineUp1m"),
						color: graph_style.globalOptionColorUpRange,
						evaluate: function (y, threshold) {
							return y > threshold;
						}
					};

					var constraint2 = {
						threshold: graph.get("addLineUp2m"),
						color: graph_style.globalOptionColorUpRange,
						evaluate: function (y, threshold) {
							return y < threshold;
						}
					};

					var min = minVal;
					var max = maxVal;
					var l1 = graph.get("addLineUp1m");
					var l2 = graph.get("addLineUp2m");
					var l3 = graph.get("addLineUp4m");
					var l4 = graph.get("addLineUp3m");


					constraints = [constraint1, constraint2];


				} else {

					var constraint1 = {
						threshold: graph.get("addLineUp1m"),
						color: graph_style.globalOptionColorUpRange,
						evaluate: function (y, threshold) {
							return y > 0;
						}
					};

					var constraint2 = {
						threshold: graph.get("addLineUp1m"),
						color: graph_style.globalOptionColorDownRange,
						evaluate: function (y, threshold) {
							return y > threshold;
						}
					};

					var constraint3 = {
						threshold: graph.get("addLineUp2m"),
						color: graph_style.globalOptionColorUpRange,
						evaluate: function (y, threshold) {
							return y > threshold;
						}
					};
					var constraint5 = {
						threshold: graph.get("addLineUp1m"),
						color: graph_style.globalOptionColorUpRange,
						evaluate: function (y, threshold) {
							return y <= threshold;
						}
					};

					var constraint4 = {
						threshold: graph.get("addLineUp2m"),
						color: graph_style.globalOptionColorDownRange,
						evaluate: function (y, threshold) {
							return y < threshold;
						}
					};

					var min = minVal;
					var max = maxVal;
					var l1 = graph.get("addLineUp1m");
					var l2 = graph.get("addLineUp2m");


					if (min > l2 && max < l1) {
						//1
						//("1 min > l2 && max < l1");
						constraints = [constraint1];
					} else if (min > l2 && max > l1) {
						//2
						//("2 min > l2 && max > l1");
						constraints = [constraint5];
					} else if (min < l2 && max < l1) {
						//3
						//("3 min < l2 && max < l1");
						constraints = [constraint3];
					} else if (min < l2 && max > l1) {
						//4
						//("4 min < l2 && max > l1");
						constraints = [constraint2, constraint3, constraint4];
					}
				}

			}
		} else {
			//for builder
		}
		return constraints;
	};

	function getTradeTimeBeforeEnd(time) {
		var beforeEnd;

		var day = parseInt(tradeTimes.begin.toString().substring(0, 1));
		var hour = parseInt(tradeTimes.begin.toString().substring(1, 3));
		var minutes = parseInt(tradeTimes.begin.toString().substring(3, 5));
		var seconds = parseInt(tradeTimes.begin.toString().substring(4, 6));

		var startDate = new Date(parseInt(time));
		var date = new Date(parseInt(time));

		startDate.setHours(hour, minutes, seconds);

		while (startDate.getDay() != day) {
			startDate = new Date(startDate.getTime() + 3600 * 24 * 1000);
		}

		//([date,startDate]);
		//([date.getTime(),startDate.getTime(),startDate.getTime() - date.getTime()]);

		beforeEnd = startDate.getTime() - date.getTime();

		return beforeEnd;
	}

	function remove_from_array(elem1, arr) {
		var val = elem1;
		return $.grep(arr, function (elem, index) {
			return elem !== val;
		});
	}

	widgets.onAddPromo = function () {
		var promo_widget_slides_length = $('#promo_widget').find('.promo_widget__slide').length;
		var promo_widget_slide_width = $('#promo_widget').find('.promo_widget__slide').width();
		var promo_widget_slide_change_time = 1000;

		$('#promo_widget__runner').width(promo_widget_slides_length * promo_widget_slide_width);
		if (promo_widget_slides_length > 1) {
			for (i = 0; i < promo_widget_slides_length; i++) {
				if (i < promo_widget_slides_length) {
					$('#promo_widget__pager').append('<div class="promo_widget__page ease" />');
				} else {
					break;
				}
			}
		}
		$('#promo_widget__pager').find('.promo_widget__page:first').addClass('active');

		$('#promo_widget__pager').find('.promo_widget__page').live('click', function () {
			var page_index = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('#promo_widget__runner').stop(1, 1).animate({left: -promo_widget_slide_width * page_index}, 600, 'easeInOutQuint');
		});

		var promo_widget_timeout;
		var promo_widget_time = 15000;
		var i = 0;

		function change_promo_slides() {
			i++;
			if (i >= promo_widget_slides_length) {
				i = 0;
			}
			$('#promo_widget__pager').find('.promo_widget__page').eq(i).addClass('active').siblings().removeClass('active');
			$('#promo_widget__runner').stop(1, 1).animate({left: -promo_widget_slide_width * i}, promo_widget_slide_change_time, 'easeInOutQuint');
		}

		promo_widget_timeout = setInterval(function () {
			change_promo_slides();
		}, promo_widget_time);

		$('#promo_widget')
			.mouseenter(function () {
				clearInterval(promo_widget_timeout);
			})
			.mouseleave(function () {
				i = $('#promo_widget__pager').find('.promo_widget__page.active').index();
				promo_widget_timeout = setInterval(function () {
					change_promo_slides();
				}, promo_widget_time);
			});
	};

	widgets.onAddCalc = function () {
		var i = 0, html = "", is_first = true;

		//{#region tools

		while (i < tools.length) {
			if (tools[i] != null) {
				html += "<option {selected} data-id='{tool_id}'>{tool_name}</option>"
					.replace("{selected}", is_first ? "selected" : "")
					.replace("{tool_id}", tools[i].tool_id)
					.replace("{tool_name}", tools[i].tool_view_name);

				if (is_first) {
					is_first = false;
				}
			}
			i++;
		}

		$("#calc_select_tools").html(html);

		//}#endregion


		//{#region option_kinds

		//}#endregion

	};

	function calcWidgetGetResult(sum, count, percent) {
		var tradingFirstSum = sum;
		var tradingCount = count;
		var result = 0;
		if (tradingCount > 9999)
			tradingCount = 9999;

		if (!isNaN(tradingCount) && tradingFirstSum > 0 && tradingCount > 0) {

			var tradingResult = tradingFirstSum;
			while (tradingCount > 0 && tradingCount < 10000) {
				tradingResult = tradingResult * percent;
				tradingCount--;
			}

			if (tradingResult.toFixed(2) < 1000000000.00) {
				var start = $("#trading-result2").val();
				var delta = (start < tradingResult) ? 0.01 : -0.01;
				result = tradingResult.toFixed(2);
			} else {
				result = "1000000000";
			}
		}

		return result;
	}

	widgets.onAddAutochartist = function () {
		if (common.checkPlugin("autochartist")) {
			wss_conn.send('{"command":"hook_signal","name":"autochartist","enable":"true"}');
		}

		$('#autochartist_widget').find('.widget_body_settings').on('click', function () {
			var autochartist = $('#autochartist_widget');
			if ($('#autochartist_widget_settings').is(':visible')) {
				$('#autochartist_widget_settings').slideUp(200);
			} else {
				$('#autochartist_widget_settings').slideDown(200);
			}
		});

		var $el1 = $("#autochartist_count");
		if ($el1[0] != null) {
			$el1.val(settings.getParam("autochartist_count") || 50);
		}
	};

	widgets.onAddMarketRates = function () {
		if (tools.length > 0) {
			widgets.loadMarketRates();
		} else {
			setTimeout(function () {
				widgets.onAddMarketRates();
			}, 100);
		}
	};

	widgets.loadMarketRates = function () {
		var i = tools.length;

		$(".market_rates_widget_row").each(function (key, elem) {
			$(elem).hide();
		});

		while (i >= 0) {
			if (tools[i] != null && tools[i].tool_name != null) {

				subscribeWSS(wss_conn, tools[i].tool_id);
				$("." + tools[i].tool_name.replace("$", "") + "-line").show();
			}
			i--;
		}
	};


	widgets.onAddOpenedOptions = function () {
		_(view.opened_options.models).each(function (elem) {
			var params = elem.toJSON();
			params.tool_name = params.tool.tool_view_name;
			params.direction_call_put = (elem.direction == "CALL" || elem.direction == "IN" || elem.direction == "UP" || elem.direction == "TOUCHUP") ? "call" : "put";

			var direction_text = "";
			switch (params.kind.toString()) {
				case "1":
					direction_text = "classic";
					break;

				case "2":
				case "4":
					direction_text = "touch";
					break;

				case "3":
				case "5":
					direction_text = "range";
					break;
				case "6":
					direction_text = "range_classic";
					break;
			}
			direction_text += "_" + (params.direction).toLowerCase();

			if (params.kind.toString() === "6") {
				direction_text = view.messages.find("." + direction_text.replace("/", "").replace("up", "in").replace("down", "out")).text();
			} else {
				direction_text = view.messages.find("." + direction_text.replace("/", "")).text();
			}

			params.direction_text = direction_text;
			view.addOptionToWidgetOpenedOptions(params);


		});

		if (global_button_pressed) {
			setTimeout(function () {
				$("#opened_options").prependTo("#sort2");
			}, 1000);
			global_button_pressed = false;
		}

	};

	widgets.onAddTradersChoice = function () {
		widgets.moodWidgetUpdate();
		setInterval(widgets.moodWidgetUpdate, 5000);
	};

	widgets.moodWidgetUpdate = function () {

		$(".traders_choice_widget__line").each(function (key, elem) {
			if (!$(elem).hasClass("ok")) {
				$(elem).hide();
			}
		});

		var $mood_widget = $("#traders_choice_widget"),
			items = [];

		if ($mood_widget[0] != null) {

			if (demo_mode == true) {
				var url = '/' + $("#messages .lang").html() + "/" + partner_hash + "/getMood";
			} else {
				var url = '/' + $("#messages .lang").html() + "/getMood";
			}

			$.getJSON(url, function (data) {
				//var template = $("#mood_template").html();
				if (data == null || data.length == 0) return;
				$.each(data, function (key) {
					line = $("#" + key.replace("$", "") + "-traders-choice-line");
					line.show();
					line.addClass("ok");
					line.find(".traders_choice_widget__line__values__percent.call").text(data[key].call);
					line.find(".traders_choice_widget__line__values__chart.call").css({width: data[key].call + "%"});
					line.find(".traders_choice_widget__line__values__percent.put").text(100 - data[key].call);
					line.find(".traders_choice_widget__line__values__chart.put").css({width: (100 - data[key].call) + "%"});
				});
			});
		}
	};

	widgets.getPercentMarketRates = function (open, close) {
		open = parseFloat(open);
		close = parseFloat(close);
		return ((open - close) / open).toFixed(2);
	};

	widgets.updateMarketRates = function (data) {

		var rate, el = $(".market_rates_widget__table"), close, line;

		for (var tool in data) {
			rate = data[tool][0][1].toFixed(get_tool(tool).decimal_count);
			line = el.find("." + tool.replace("$", "") + "-line");
			line.find(".rate").text(rate);
			close = el.find(".close_price").text();
			percent = widgets.getPercentMarketRates(rate, close);
			line.find(".percent").text(percent);

			if (parseFloat(percent) < 0) {
				line.find(".percent").addClass("minus");
			} else {
				line.find(".percent").removeClass("minus");
			}
		}

	};

	var money = function (obj) {
		if (obj == "-" || isNaN(parseFloat(obj.toString())))
			return "-";
		else
			return parseFloat(obj.toString()).formatMoney(globalParameters.decimalCount, globalParameters.decimalSeparator, globalParameters.thousandsSeparator);
	};

	var getForecast = function (dir, special_params, start_course, kind, tool) {
		var forecast = " ";

		if (special_params == null && kind != view.option_kinds.getIdByName("classic")) {
			return;
		}

		if (kind == view.option_kinds.getIdByName("classic")) {
			if (dir == "CALL") {
				forecast = ">" + (parseFloat(start_course).toFixed(tool.decimal_count));
			} else {
				forecast = "<" + (parseFloat(start_course).toFixed(tool.decimal_count));
			}
		} else if (kind == view.option_kinds.getIdByName("touch") || kind == view.option_kinds.getIdByName("touch_advanced")) {

			if (dir == "UP") {
				forecast = ">=" + (parseFloat(start_course) + parseFloat(special_params.up_delta)).toFixed(tool.decimal_count);
			} else if (dir == "DOWN") {
				forecast = "<=" + (parseFloat(start_course) - parseFloat(special_params.down_delta)).toFixed(tool.decimal_count);
			} else if (dir == "UP/DOWN" || dir == "UPDOWN") {

				forecast = "<=" + (parseFloat(start_course) + parseFloat(special_params.updown_delta_down)).toFixed(tool.decimal_count) + " " + view.messages.find(".label_or").text() + " " + ">=" + (parseFloat(start_course) - parseFloat(special_params.updown_delta_up)).toFixed(tool.decimal_count);
			}
		} else if (kind == view.option_kinds.getIdByName("range")) {
			if (dir == "IN") {
				forecast = ">" + (parseFloat(special_params.margin_bottom)).toFixed(tool.decimal_count) + " " + view.messages.find(".label_and").text() + " " + "<" + (parseFloat(special_params.margin_top)).toFixed(tool.decimal_count);
			} else {
				forecast = ">" + (parseFloat(special_params.margin_top)).toFixed(tool.decimal_count) + " " + view.messages.find(".label_or").text() + " " + "<" + (parseFloat(special_params.margin_bottom)).toFixed(tool.decimal_count);
			}
		} else if (kind == view.option_kinds.getIdByName("range_advanced")) {

			if (dir == "IN") {

				forecast = ">" + (parseFloat(special_params.margin_top_internal)).toFixed(tool.decimal_count) +
					" " + view.messages.find(".label_and").text() + " " + "<" + (parseFloat(special_params.margin_top_external)).toFixed(tool.decimal_count) +
					" " + view.messages.find(".label_or").text() + " " + "<" + (parseFloat(special_params.margin_bottom_internal)).toFixed(tool.decimal_count) +
					" " + view.messages.find(".label_and").text() + " " + ">" + (parseFloat(special_params.margin_bottom_external)).toFixed(tool.decimal_count);

				if (js_params.p == "9" || js_params.p == "12") {
				} else {
					forecast = '<div class="al_help hinted on_hover">' +
						'<div class="al_hint e-fst">' +
						'<div class="al_hint_close"></div>' +
						'<p class="">' + forecast + '</p>' +
						'</div>	' +
						'</div>';
				}
			} else {
				forecast = ">" + (parseFloat(special_params.margin_top_external)).toFixed(tool.decimal_count) + " " + view.messages.find(".label_or").text() + " " + "<" + (parseFloat(special_params.margin_bottom_external)).toFixed(tool.decimal_count);
			}
		} else if (kind == view.option_kinds.getIdByName("range_classic")) {
			if (dir == "UP") {
				forecast = ">" + parseFloat(special_params.margin_up).toFixed(tool.decimal_count);
			} else {
				forecast = "<" + parseFloat(special_params.margin_down).toFixed(tool.decimal_count);
			}
		}
		return forecast;
	};

	function checkLeftWidgetPayouts() {
		var console1 = view.getCurrentConsole();
		if (console1 == null) {
			return;
		}
		if (!use_left_widget) return;
		console1.el.find(".bin_instruments_list_table .percent").each(function (key, elem) {
			if ($(elem).text() == " - ") {
				subscribeWSSPayouts(wss_conn, $(elem).attr("data-value"), view.option_kinds.getIdByName(console1.get("kind")));
			}
		})
	}

	getCloseDate = function (timeframe_id) {
		if (timeframeLockTimes[timeframe_id] == null) return 0;

		var lockTime = timeframeLockTimes[timeframe_id];
		var curTime = utsTime;
		var duration = timeframesDuration[timeframe_id];

		if (lockTime == 0) {
			return utcTime + duration;
		} else {
			//найти ближайший интервал

			var diff = -new Date(utsTime).getUTCHours() + new Date(utsTime).getHours();
			if (timeframe_id < 10) {
				var startOfDay = new Date(utsTime);
				startOfDay.setHours(diff, 0, 0, 0);
				var dateClose = startOfDay.getTime();
				while (dateClose < curTime) {
					dateClose += duration;
				}
			}


			//для дневных брать окончание дня
			//для недельных окончание недели
			//для месячных начала следующего месяца

			return dateClose;


			//запустить обновление в цикле, для обновление date_close

		}
	};

//excanvas
	if (!document.createElement("canvas").getContext) {
		(function () {
			var z = Math;
			var K = z.round;
			var J = z.sin;
			var U = z.cos;
			var b = z.abs;
			var k = z.sqrt;
			var D = 10;
			var F = D / 2;

			function T() {
				return this.context_ || (this.context_ = new W(this))
			}

			var O = Array.prototype.slice;

			function G(i, j, m) {
				var Z = O.call(arguments, 2);
				return function () {
					return i.apply(j, Z.concat(O.call(arguments)))
				}
			}

			function AD(Z) {
				return String(Z).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
			}

			function r(i) {
				if (!i.namespaces.g_vml_) {
					i.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML")
				}
				if (!i.namespaces.g_o_) {
					i.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML")
				}
				if (!i.styleSheets.ex_canvas_) {
					var Z = i.createStyleSheet();
					Z.owningElement.id = "ex_canvas_";
					Z.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"
				}
			}

			r(document);
			var E = {
				init: function (Z) {
					if (/MSIE/.test(navigator.userAgent) && !window.opera) {
						var i = Z || document;
						i.createElement("canvas");
						i.attachEvent("onreadystatechange", G(this.init_, this, i))
					}
				}, init_: function (m) {
					var j = m.getElementsByTagName("canvas");
					for (var Z = 0; Z < j.length; Z++) {
						this.initElement(j[Z])
					}
				}, initElement: function (i) {
					if (!i.getContext) {
						i.getContext = T;
						r(i.ownerDocument);
						i.innerHTML = "";
						i.attachEvent("onpropertychange", S);
						i.attachEvent("onresize", w);
						var Z = i.attributes;
						if (Z.width && Z.width.specified) {
							i.style.width = Z.width.nodeValue + "px"
						} else {
							i.width = i.clientWidth
						}
						if (Z.height && Z.height.specified) {
							i.style.height = Z.height.nodeValue + "px"
						} else {
							i.height = i.clientHeight
						}
					}
					return i
				}
			};

			function S(i) {
				var Z = i.srcElement;
				switch (i.propertyName) {
					case"width":
						Z.getContext().clearRect();
						Z.style.width = Z.attributes.width.nodeValue + "px";
						Z.firstChild.style.width = Z.clientWidth + "px";
						break;
					case"height":
						Z.getContext().clearRect();
						Z.style.height = Z.attributes.height.nodeValue + "px";
						Z.firstChild.style.height = Z.clientHeight + "px";
						break
				}
			}

			function w(i) {
				var Z = i.srcElement;
				if (Z.firstChild) {
					Z.firstChild.style.width = Z.clientWidth + "px";
					Z.firstChild.style.height = Z.clientHeight + "px"
				}
			}

			E.init();
			var I = [];
			for (var AC = 0; AC < 16; AC++) {
				for (var AB = 0; AB < 16; AB++) {
					I[AC * 16 + AB] = AC.toString(16) + AB.toString(16)
				}
			}
			function V() {
				return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
			}

			function d(m, j) {
				var i = V();
				for (var Z = 0; Z < 3; Z++) {
					for (var AF = 0; AF < 3; AF++) {
						var p = 0;
						for (var AE = 0; AE < 3; AE++) {
							p += m[Z][AE] * j[AE][AF]
						}
						i[Z][AF] = p
					}
				}
				return i
			}

			function Q(i, Z) {
				Z.fillStyle = i.fillStyle;
				Z.lineCap = i.lineCap;
				Z.lineJoin = i.lineJoin;
				Z.lineWidth = i.lineWidth;
				Z.miterLimit = i.miterLimit;
				Z.shadowBlur = i.shadowBlur;
				Z.shadowColor = i.shadowColor;
				Z.shadowOffsetX = i.shadowOffsetX;
				Z.shadowOffsetY = i.shadowOffsetY;
				Z.strokeStyle = i.strokeStyle;
				Z.globalAlpha = i.globalAlpha;
				Z.font = i.font;
				Z.textAlign = i.textAlign;
				Z.textBaseline = i.textBaseline;
				Z.arcScaleX_ = i.arcScaleX_;
				Z.arcScaleY_ = i.arcScaleY_;
				Z.lineScale_ = i.lineScale_
			}

			var B = {
				aliceblue: "#F0F8FF",
				antiquewhite: "#FAEBD7",
				aquamarine: "#7FFFD4",
				azure: "#F0FFFF",
				beige: "#F5F5DC",
				bisque: "#FFE4C4",
				black: "#000000",
				blanchedalmond: "#FFEBCD",
				blueviolet: "#8A2BE2",
				brown: "#A52A2A",
				burlywood: "#DEB887",
				cadetblue: "#5F9EA0",
				chartreuse: "#7FFF00",
				chocolate: "#D2691E",
				coral: "#FF7F50",
				cornflowerblue: "#6495ED",
				cornsilk: "#FFF8DC",
				crimson: "#DC143C",
				cyan: "#00FFFF",
				darkblue: "#00008B",
				darkcyan: "#008B8B",
				darkgoldenrod: "#B8860B",
				darkgray: "#A9A9A9",
				darkgreen: "#006400",
				darkgrey: "#A9A9A9",
				darkkhaki: "#BDB76B",
				darkmagenta: "#8B008B",
				darkolivegreen: "#556B2F",
				darkorange: "#FF8C00",
				darkorchid: "#9932CC",
				darkred: "#8B0000",
				darksalmon: "#E9967A",
				darkseagreen: "#8FBC8F",
				darkslateblue: "#483D8B",
				darkslategray: "#2F4F4F",
				darkslategrey: "#2F4F4F",
				darkturquoise: "#00CED1",
				darkviolet: "#9400D3",
				deeppink: "#FF1493",
				deepskyblue: "#00BFFF",
				dimgray: "#696969",
				dimgrey: "#696969",
				dodgerblue: "#1E90FF",
				firebrick: "#B22222",
				floralwhite: "#FFFAF0",
				forestgreen: "#228B22",
				gainsboro: "#DCDCDC",
				ghostwhite: "#F8F8FF",
				gold: "#FFD700",
				goldenrod: "#DAA520",
				grey: "#808080",
				greenyellow: "#ADFF2F",
				honeydew: "#F0FFF0",
				hotpink: "#FF69B4",
				indianred: "#CD5C5C",
				indigo: "#4B0082",
				ivory: "#FFFFF0",
				khaki: "#F0E68C",
				lavender: "#E6E6FA",
				lavenderblush: "#FFF0F5",
				lawngreen: "#7CFC00",
				lemonchiffon: "#FFFACD",
				lightblue: "#ADD8E6",
				lightcoral: "#F08080",
				lightcyan: "#E0FFFF",
				lightgoldenrodyellow: "#FAFAD2",
				lightgreen: "#90EE90",
				lightgrey: "#D3D3D3",
				lightpink: "#FFB6C1",
				lightsalmon: "#FFA07A",
				lightseagreen: "#20B2AA",
				lightskyblue: "#87CEFA",
				lightslategray: "#778899",
				lightslategrey: "#778899",
				lightsteelblue: "#B0C4DE",
				lightyellow: "#FFFFE0",
				limegreen: "#32CD32",
				linen: "#FAF0E6",
				magenta: "#FF00FF",
				mediumaquamarine: "#66CDAA",
				mediumblue: "#0000CD",
				mediumorchid: "#BA55D3",
				mediumpurple: "#9370DB",
				mediumseagreen: "#3CB371",
				mediumslateblue: "#7B68EE",
				mediumspringgreen: "#00FA9A",
				mediumturquoise: "#48D1CC",
				mediumvioletred: "#C71585",
				midnightblue: "#191970",
				mintcream: "#F5FFFA",
				mistyrose: "#FFE4E1",
				moccasin: "#FFE4B5",
				navajowhite: "#FFDEAD",
				oldlace: "#FDF5E6",
				olivedrab: "#6B8E23",
				orange: "#FFA500",
				orangered: "#FF4500",
				orchid: "#DA70D6",
				palegoldenrod: "#EEE8AA",
				palegreen: "#98FB98",
				paleturquoise: "#AFEEEE",
				palevioletred: "#DB7093",
				papayawhip: "#FFEFD5",
				peachpuff: "#FFDAB9",
				peru: "#CD853F",
				pink: "#FFC0CB",
				plum: "#DDA0DD",
				powderblue: "#B0E0E6",
				rosybrown: "#BC8F8F",
				royalblue: "#4169E1",
				saddlebrown: "#8B4513",
				salmon: "#FA8072",
				sandybrown: "#F4A460",
				seagreen: "#2E8B57",
				seashell: "#FFF5EE",
				sienna: "#A0522D",
				skyblue: "#87CEEB",
				slateblue: "#6A5ACD",
				slategray: "#708090",
				slategrey: "#708090",
				snow: "#FFFAFA",
				springgreen: "#00FF7F",
				steelblue: "#4682B4",
				tan: "#D2B48C",
				thistle: "#D8BFD8",
				tomato: "#FF6347",
				turquoise: "#40E0D0",
				violet: "#EE82EE",
				wheat: "#F5DEB3",
				whitesmoke: "#F5F5F5",
				yellowgreen: "#9ACD32"
			};

			function g(i) {
				var m = i.indexOf("(", 3);
				var Z = i.indexOf(")", m + 1);
				var j = i.substring(m + 1, Z).split(",");
				if (j.length == 4 && i.substr(3, 1) == "a") {
					alpha = Number(j[3])
				} else {
					j[3] = 1
				}
				return j
			}

			function C(Z) {
				return parseFloat(Z) / 100
			}

			function N(i, j, Z) {
				return Math.min(Z, Math.max(j, i))
			}

			function c(AF) {
				var j, i, Z;
				h = parseFloat(AF[0]) / 360 % 360;
				if (h < 0) {
					h++
				}
				s = N(C(AF[1]), 0, 1);
				l = N(C(AF[2]), 0, 1);
				if (s == 0) {
					j = i = Z = l
				} else {
					var m = l < 0.5 ? l * (1 + s) : l + s - l * s;
					var AE = 2 * l - m;
					j = A(AE, m, h + 1 / 3);
					i = A(AE, m, h);
					Z = A(AE, m, h - 1 / 3)
				}
				return "#" + I[Math.floor(j * 255)] + I[Math.floor(i * 255)] + I[Math.floor(Z * 255)]
			}

			function A(i, Z, j) {
				if (j < 0) {
					j++
				}
				if (j > 1) {
					j--
				}
				if (6 * j < 1) {
					return i + (Z - i) * 6 * j
				} else {
					if (2 * j < 1) {
						return Z
					} else {
						if (3 * j < 2) {
							return i + (Z - i) * (2 / 3 - j) * 6
						} else {
							return i
						}
					}
				}
			}

			function Y(Z) {
				var AE, p = 1;
				Z = String(Z);
				if (Z.charAt(0) == "#") {
					AE = Z
				} else {
					if (/^rgb/.test(Z)) {
						var m = g(Z);
						var AE = "#", AF;
						for (var j = 0; j < 3; j++) {
							if (m[j] != null && m[j].indexOf("%") != -1) {
								AF = Math.floor(C(m[j]) * 255)
							} else {
								AF = Number(m[j])
							}
							AE += I[N(AF, 0, 255)]
						}
						p = m[3]
					} else {
						if (/^hsl/.test(Z)) {
							var m = g(Z);
							AE = c(m);
							p = m[3]
						} else {
							AE = B[Z] || Z
						}
					}
				}
				return {color: AE, alpha: p}
			}

			var L = {style: "normal", variant: "normal", weight: "normal", size: 10, family: "sans-serif"};
			var f = {};

			function X(Z) {
				if (f[Z]) {
					return f[Z]
				}
				var m = document.createElement("div");
				var j = m.style;
				try {
					j.font = Z
				} catch (i) {
				}
				return f[Z] = {
					style: j.fontStyle || L.style,
					variant: j.fontVariant || L.variant,
					weight: j.fontWeight || L.weight,
					size: j.fontSize || L.size,
					family: j.fontFamily || L.family
				}
			}

			function P(j, i) {
				var Z = {};
				for (var AF in j) {
					Z[AF] = j[AF]
				}
				var AE = parseFloat(i.currentStyle.fontSize), m = parseFloat(j.size);
				if (typeof j.size == "number") {
					Z.size = j.size
				} else {
					if (j.size.indexOf("px") != -1) {
						Z.size = m
					} else {
						if (j.size.indexOf("em") != -1) {
							Z.size = AE * m
						} else {
							if (j.size.indexOf("%") != -1) {
								Z.size = (AE / 100) * m
							} else {
								if (j.size.indexOf("pt") != -1) {
									Z.size = m / 0.75
								} else {
									Z.size = AE
								}
							}
						}
					}
				}
				Z.size *= 0.981;
				return Z
			}

			function AA(Z) {
				return Z.style + " " + Z.variant + " " + Z.weight + " " + Z.size + "px " + Z.family
			}

			function t(Z) {
				switch (Z) {
					case"butt":
						return "flat";
					case"round":
						return "round";
					case"square":
					default:
						return "square"
				}
			}

			function W(i) {
				this.m_ = V();
				this.mStack_ = [];
				this.aStack_ = [];
				this.currentPath_ = [];
				this.strokeStyle = "#000";
				this.fillStyle = "#000";
				this.lineWidth = 1;
				this.lineJoin = "miter";
				this.lineCap = "butt";
				this.miterLimit = D * 1;
				this.globalAlpha = 1;
				this.font = "10px sans-serif";
				this.textAlign = "left";
				this.textBaseline = "alphabetic";
				this.canvas = i;
				var Z = i.ownerDocument.createElement("div");
				Z.style.width = i.clientWidth + "px";
				Z.style.height = i.clientHeight + "px";
				Z.style.overflow = "hidden";
				Z.style.position = "absolute";
				i.appendChild(Z);
				this.element_ = Z;
				this.arcScaleX_ = 1;
				this.arcScaleY_ = 1;
				this.lineScale_ = 1
			}

			var M = W.prototype;
			M.clearRect = function () {
				if (this.textMeasureEl_) {
					this.textMeasureEl_.removeNode(true);
					this.textMeasureEl_ = null
				}
				this.element_.innerHTML = ""
			};
			M.beginPath = function () {
				this.currentPath_ = []
			};
			M.moveTo = function (i, Z) {
				var j = this.getCoords_(i, Z);
				this.currentPath_.push({type: "moveTo", x: j.x, y: j.y});
				this.currentX_ = j.x;
				this.currentY_ = j.y
			};
			M.lineTo = function (i, Z) {
				var j = this.getCoords_(i, Z);
				this.currentPath_.push({type: "lineTo", x: j.x, y: j.y});
				this.currentX_ = j.x;
				this.currentY_ = j.y
			};
			M.bezierCurveTo = function (j, i, AI, AH, AG, AE) {
				var Z = this.getCoords_(AG, AE);
				var AF = this.getCoords_(j, i);
				var m = this.getCoords_(AI, AH);
				e(this, AF, m, Z)
			};
			function e(Z, m, j, i) {
				Z.currentPath_.push({
					type: "bezierCurveTo",
					cp1x: m.x,
					cp1y: m.y,
					cp2x: j.x,
					cp2y: j.y,
					x: i.x,
					y: i.y
				});
				Z.currentX_ = i.x;
				Z.currentY_ = i.y
			}

			M.quadraticCurveTo = function (AG, j, i, Z) {
				var AF = this.getCoords_(AG, j);
				var AE = this.getCoords_(i, Z);
				var AH = {
					x: this.currentX_ + 2 / 3 * (AF.x - this.currentX_),
					y: this.currentY_ + 2 / 3 * (AF.y - this.currentY_)
				};
				var m = {x: AH.x + (AE.x - this.currentX_) / 3, y: AH.y + (AE.y - this.currentY_) / 3};
				e(this, AH, m, AE)
			};
			M.arc = function (AJ, AH, AI, AE, i, j) {
				AI *= D;
				var AN = j ? "at" : "wa";
				var AK = AJ + U(AE) * AI - F;
				var AM = AH + J(AE) * AI - F;
				var Z = AJ + U(i) * AI - F;
				var AL = AH + J(i) * AI - F;
				if (AK == Z && !j) {
					AK += 0.125
				}
				var m = this.getCoords_(AJ, AH);
				var AG = this.getCoords_(AK, AM);
				var AF = this.getCoords_(Z, AL);
				this.currentPath_.push({
					type: AN,
					x: m.x,
					y: m.y,
					radius: AI,
					xStart: AG.x,
					yStart: AG.y,
					xEnd: AF.x,
					yEnd: AF.y
				})
			};
			M.rect = function (j, i, Z, m) {
				this.moveTo(j, i);
				this.lineTo(j + Z, i);
				this.lineTo(j + Z, i + m);
				this.lineTo(j, i + m);
				this.closePath()
			};
			M.strokeRect = function (j, i, Z, m) {
				var p = this.currentPath_;
				this.beginPath();
				this.moveTo(j, i);
				this.lineTo(j + Z, i);
				this.lineTo(j + Z, i + m);
				this.lineTo(j, i + m);
				this.closePath();
				this.stroke();
				this.currentPath_ = p
			};
			M.fillRect = function (j, i, Z, m) {
				var p = this.currentPath_;
				this.beginPath();
				this.moveTo(j, i);
				this.lineTo(j + Z, i);
				this.lineTo(j + Z, i + m);
				this.lineTo(j, i + m);
				this.closePath();
				this.fill();
				this.currentPath_ = p
			};
			M.createLinearGradient = function (i, m, Z, j) {
				var p = new v("gradient");
				p.x0_ = i;
				p.y0_ = m;
				p.x1_ = Z;
				p.y1_ = j;
				return p
			};
			M.createRadialGradient = function (m, AE, j, i, p, Z) {
				var AF = new v("gradientradial");
				AF.x0_ = m;
				AF.y0_ = AE;
				AF.r0_ = j;
				AF.x1_ = i;
				AF.y1_ = p;
				AF.r1_ = Z;
				return AF
			};
			M.drawImage = function (AO, j) {
				var AH, AF, AJ, AV, AM, AK, AQ, AX;
				var AI = AO.runtimeStyle.width;
				var AN = AO.runtimeStyle.height;
				AO.runtimeStyle.width = "auto";
				AO.runtimeStyle.height = "auto";
				var AG = AO.width;
				var AT = AO.height;
				AO.runtimeStyle.width = AI;
				AO.runtimeStyle.height = AN;
				if (arguments.length == 3) {
					AH = arguments[1];
					AF = arguments[2];
					AM = AK = 0;
					AQ = AJ = AG;
					AX = AV = AT
				} else {
					if (arguments.length == 5) {
						AH = arguments[1];
						AF = arguments[2];
						AJ = arguments[3];
						AV = arguments[4];
						AM = AK = 0;
						AQ = AG;
						AX = AT
					} else {
						if (arguments.length == 9) {
							AM = arguments[1];
							AK = arguments[2];
							AQ = arguments[3];
							AX = arguments[4];
							AH = arguments[5];
							AF = arguments[6];
							AJ = arguments[7];
							AV = arguments[8]
						} else {
							throw Error("Invalid number of arguments")
						}
					}
				}
				var AW = this.getCoords_(AH, AF);
				var m = AQ / 2;
				var i = AX / 2;
				var AU = [];
				var Z = 10;
				var AE = 10;
				AU.push(" <g_vml_:group", ' coordsize="', D * Z, ",", D * AE, '"', ' coordorigin="0,0"', ' style="width:', Z, "px;height:", AE, "px;position:absolute;");
				if (this.m_[0][0] != 1 || this.m_[0][1] || this.m_[1][1] != 1 || this.m_[1][0]) {
					var p = [];
					p.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", K(AW.x / D), ",", "Dy=", K(AW.y / D), "");
					var AS = AW;
					var AR = this.getCoords_(AH + AJ, AF);
					var AP = this.getCoords_(AH, AF + AV);
					var AL = this.getCoords_(AH + AJ, AF + AV);
					AS.x = z.max(AS.x, AR.x, AP.x, AL.x);
					AS.y = z.max(AS.y, AR.y, AP.y, AL.y);
					AU.push("padding:0 ", K(AS.x / D), "px ", K(AS.y / D), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", p.join(""), ", sizingmethod='clip');")
				} else {
					AU.push("top:", K(AW.y / D), "px;left:", K(AW.x / D), "px;")
				}
				AU.push(' ">', '<g_vml_:image src="', AO.src, '"', ' style="width:', D * AJ, "px;", " height:", D * AV, 'px"', ' cropleft="', AM / AG, '"', ' croptop="', AK / AT, '"', ' cropright="', (AG - AM - AQ) / AG, '"', ' cropbottom="', (AT - AK - AX) / AT, '"', " />", "</g_vml_:group>");
				this.element_.insertAdjacentHTML("BeforeEnd", AU.join(""))
			};
			M.stroke = function (AM) {
				var m = 10;
				var AN = 10;
				var AE = 5000;
				var AG = {x: null, y: null};
				var AL = {x: null, y: null};
				for (var AH = 0; AH < this.currentPath_.length; AH += AE) {
					var AK = [];
					var AF = false;
					AK.push("<g_vml_:shape", ' filled="', !!AM, '"', ' style="position:absolute;width:', m, "px;height:", AN, 'px;"', ' coordorigin="0,0"', ' coordsize="', D * m, ",", D * AN, '"', ' stroked="', !AM, '"', ' path="');
					var AO = false;
					for (var AI = AH; AI < Math.min(AH + AE, this.currentPath_.length); AI++) {
						if (AI % AE == 0 && AI > 0) {
							AK.push(" m ", K(this.currentPath_[AI - 1].x), ",", K(this.currentPath_[AI - 1].y))
						}
						var Z = this.currentPath_[AI];
						var AJ;
						switch (Z.type) {
							case"moveTo":
								AJ = Z;
								AK.push(" m ", K(Z.x), ",", K(Z.y));
								break;
							case"lineTo":
								AK.push(" l ", K(Z.x), ",", K(Z.y));
								break;
							case"close":
								AK.push(" x ");
								Z = null;
								break;
							case"bezierCurveTo":
								AK.push(" c ", K(Z.cp1x), ",", K(Z.cp1y), ",", K(Z.cp2x), ",", K(Z.cp2y), ",", K(Z.x), ",", K(Z.y));
								break;
							case"at":
							case"wa":
								AK.push(" ", Z.type, " ", K(Z.x - this.arcScaleX_ * Z.radius), ",", K(Z.y - this.arcScaleY_ * Z.radius), " ", K(Z.x + this.arcScaleX_ * Z.radius), ",", K(Z.y + this.arcScaleY_ * Z.radius), " ", K(Z.xStart), ",", K(Z.yStart), " ", K(Z.xEnd), ",", K(Z.yEnd));
								break
						}
						if (Z) {
							if (AG.x == null || Z.x < AG.x) {
								AG.x = Z.x
							}
							if (AL.x == null || Z.x > AL.x) {
								AL.x = Z.x
							}
							if (AG.y == null || Z.y < AG.y) {
								AG.y = Z.y
							}
							if (AL.y == null || Z.y > AL.y) {
								AL.y = Z.y
							}
						}
					}
					AK.push(' ">');
					if (!AM) {
						R(this, AK)
					} else {
						a(this, AK, AG, AL)
					}
					AK.push("</g_vml_:shape>");
					this.element_.insertAdjacentHTML("beforeEnd", AK.join(""))
				}
			};
			function R(j, AE) {
				var i = Y(j.strokeStyle);
				var m = i.color;
				var p = i.alpha * j.globalAlpha;
				var Z = j.lineScale_ * j.lineWidth;
				if (Z < 1) {
					p *= Z
				}
				AE.push("<g_vml_:stroke", ' opacity="', p, '"', ' joinstyle="', j.lineJoin, '"', ' miterlimit="', j.miterLimit, '"', ' endcap="', t(j.lineCap), '"', ' weight="', Z, 'px"', ' color="', m, '" />')
			}

			function a(AO, AG, Ah, AP) {
				var AH = AO.fillStyle;
				var AY = AO.arcScaleX_;
				var AX = AO.arcScaleY_;
				var Z = AP.x - Ah.x;
				var m = AP.y - Ah.y;
				if (AH instanceof v) {
					var AL = 0;
					var Ac = {x: 0, y: 0};
					var AU = 0;
					var AK = 1;
					if (AH.type_ == "gradient") {
						var AJ = AH.x0_ / AY;
						var j = AH.y0_ / AX;
						var AI = AH.x1_ / AY;
						var Aj = AH.y1_ / AX;
						var Ag = AO.getCoords_(AJ, j);
						var Af = AO.getCoords_(AI, Aj);
						var AE = Af.x - Ag.x;
						var p = Af.y - Ag.y;
						AL = Math.atan2(AE, p) * 180 / Math.PI;
						if (AL < 0) {
							AL += 360
						}
						if (AL < 0.000001) {
							AL = 0
						}
					} else {
						var Ag = AO.getCoords_(AH.x0_, AH.y0_);
						Ac = {x: (Ag.x - Ah.x) / Z, y: (Ag.y - Ah.y) / m};
						Z /= AY * D;
						m /= AX * D;
						var Aa = z.max(Z, m);
						AU = 2 * AH.r0_ / Aa;
						AK = 2 * AH.r1_ / Aa - AU
					}
					var AS = AH.colors_;
					AS.sort(function (Ak, i) {
						return Ak.offset - i.offset
					});
					var AN = AS.length;
					var AR = AS[0].color;
					var AQ = AS[AN - 1].color;
					var AW = AS[0].alpha * AO.globalAlpha;
					var AV = AS[AN - 1].alpha * AO.globalAlpha;
					var Ab = [];
					for (var Ae = 0; Ae < AN; Ae++) {
						var AM = AS[Ae];
						Ab.push(AM.offset * AK + AU + " " + AM.color)
					}
					AG.push('<g_vml_:fill type="', AH.type_, '"', ' method="none" focus="100%"', ' color="', AR, '"', ' color2="', AQ, '"', ' colors="', Ab.join(","), '"', ' opacity="', AV, '"', ' g_o_:opacity2="', AW, '"', ' angle="', AL, '"', ' focusposition="', Ac.x, ",", Ac.y, '" />')
				} else {
					if (AH instanceof u) {
						if (Z && m) {
							var AF = -Ah.x;
							var AZ = -Ah.y;
							AG.push("<g_vml_:fill", ' position="', AF / Z * AY * AY, ",", AZ / m * AX * AX, '"', ' type="tile"', ' src="', AH.src_, '" />')
						}
					} else {
						var Ai = Y(AO.fillStyle);
						var AT = Ai.color;
						var Ad = Ai.alpha * AO.globalAlpha;
						AG.push('<g_vml_:fill color="', AT, '" opacity="', Ad, '" />')
					}
				}
			}

			M.fill = function () {
				this.stroke(true)
			};
			M.closePath = function () {
				this.currentPath_.push({type: "close"})
			};
			M.getCoords_ = function (j, i) {
				var Z = this.m_;
				return {
					x: D * (j * Z[0][0] + i * Z[1][0] + Z[2][0]) - F,
					y: D * (j * Z[0][1] + i * Z[1][1] + Z[2][1]) - F
				}
			};
			M.save = function () {
				var Z = {};
				Q(this, Z);
				this.aStack_.push(Z);
				this.mStack_.push(this.m_);
				this.m_ = d(V(), this.m_)
			};
			M.restore = function () {
				if (this.aStack_.length) {
					Q(this.aStack_.pop(), this);
					this.m_ = this.mStack_.pop()
				}
			};
			function H(Z) {
				return isFinite(Z[0][0]) && isFinite(Z[0][1]) && isFinite(Z[1][0]) && isFinite(Z[1][1]) && isFinite(Z[2][0]) && isFinite(Z[2][1])
			}

			function y(i, Z, j) {
				if (!H(Z)) {
					return
				}
				i.m_ = Z;
				if (j) {
					var p = Z[0][0] * Z[1][1] - Z[0][1] * Z[1][0];
					i.lineScale_ = k(b(p))
				}
			}

			M.translate = function (j, i) {
				var Z = [[1, 0, 0], [0, 1, 0], [j, i, 1]];
				y(this, d(Z, this.m_), false)
			};
			M.rotate = function (i) {
				var m = U(i);
				var j = J(i);
				var Z = [[m, j, 0], [-j, m, 0], [0, 0, 1]];
				y(this, d(Z, this.m_), false)
			};
			M.scale = function (j, i) {
				this.arcScaleX_ *= j;
				this.arcScaleY_ *= i;
				var Z = [[j, 0, 0], [0, i, 0], [0, 0, 1]];
				y(this, d(Z, this.m_), true)
			};
			M.transform = function (p, m, AF, AE, i, Z) {
				var j = [[p, m, 0], [AF, AE, 0], [i, Z, 1]];
				y(this, d(j, this.m_), true)
			};
			M.setTransform = function (AE, p, AG, AF, j, i) {
				var Z = [[AE, p, 0], [AG, AF, 0], [j, i, 1]];
				y(this, Z, true)
			};
			M.drawText_ = function (AK, AI, AH, AN, AG) {
				var AM = this.m_, AQ = 1000, i = 0, AP = AQ, AF = {x: 0, y: 0}, AE = [];
				var Z = P(X(this.font), this.element_);
				var j = AA(Z);
				var AR = this.element_.currentStyle;
				var p = this.textAlign.toLowerCase();
				switch (p) {
					case"left":
					case"center":
					case"right":
						break;
					case"end":
						p = AR.direction == "ltr" ? "right" : "left";
						break;
					case"start":
						p = AR.direction == "rtl" ? "right" : "left";
						break;
					default:
						p = "left"
				}
				switch (this.textBaseline) {
					case"hanging":
					case"top":
						AF.y = Z.size / 1.75;
						break;
					case"middle":
						break;
					default:
					case null:
					case"alphabetic":
					case"ideographic":
					case"bottom":
						AF.y = -Z.size / 2.25;
						break
				}
				switch (p) {
					case"right":
						i = AQ;
						AP = 0.05;
						break;
					case"center":
						i = AP = AQ / 2;
						break
				}
				var AO = this.getCoords_(AI + AF.x, AH + AF.y);
				AE.push('<g_vml_:line from="', -i, ' 0" to="', AP, ' 0.05" ', ' coordsize="100 100" coordorigin="0 0"', ' filled="', !AG, '" stroked="', !!AG, '" style="position:absolute;width:1px;height:1px;">');
				if (AG) {
					R(this, AE)
				} else {
					a(this, AE, {x: -i, y: 0}, {x: AP, y: Z.size})
				}
				var AL = AM[0][0].toFixed(3) + "," + AM[1][0].toFixed(3) + "," + AM[0][1].toFixed(3) + "," + AM[1][1].toFixed(3) + ",0,0";
				var AJ = K(AO.x / D) + "," + K(AO.y / D);
				AE.push('<g_vml_:skew on="t" matrix="', AL, '" ', ' offset="', AJ, '" origin="', i, ' 0" />', '<g_vml_:path textpathok="true" />', '<g_vml_:textpath on="true" string="', AD(AK), '" style="v-text-align:', p, ";font:", AD(j), '" /></g_vml_:line>');
				this.element_.insertAdjacentHTML("beforeEnd", AE.join(""))
			};
			M.fillText = function (j, Z, m, i) {
				this.drawText_(j, Z, m, i, false)
			};
			M.strokeText = function (j, Z, m, i) {
				this.drawText_(j, Z, m, i, true)
			};
			M.measureText = function (j) {
				if (!this.textMeasureEl_) {
					var Z = '<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';
					this.element_.insertAdjacentHTML("beforeEnd", Z);
					this.textMeasureEl_ = this.element_.lastChild
				}
				var i = this.element_.ownerDocument;
				this.textMeasureEl_.innerHTML = "";
				this.textMeasureEl_.style.font = this.font;
				this.textMeasureEl_.appendChild(i.createTextNode(j));
				return {width: this.textMeasureEl_.offsetWidth}
			};
			M.clip = function () {
			};
			M.arcTo = function () {
			};
			M.createPattern = function (i, Z) {
				return new u(i, Z)
			};
			function v(Z) {
				this.type_ = Z;
				this.x0_ = 0;
				this.y0_ = 0;
				this.r0_ = 0;
				this.x1_ = 0;
				this.y1_ = 0;
				this.r1_ = 0;
				this.colors_ = []
			}

			v.prototype.addColorStop = function (i, Z) {
				Z = Y(Z);
				this.colors_.push({offset: i, color: Z.color, alpha: Z.alpha})
			};
			function u(i, Z) {
				q(i);
				switch (Z) {
					case"repeat":
					case null:
					case"":
						this.repetition_ = "repeat";
						break;
					case"repeat-x":
					case"repeat-y":
					case"no-repeat":
						this.repetition_ = Z;
						break;
					default:
						n("SYNTAX_ERR")
				}
				this.src_ = i.src;
				this.width_ = i.width;
				this.height_ = i.height
			}

			function n(Z) {
				throw new o(Z)
			}

			function q(Z) {
				if (!Z || Z.nodeType != 1 || Z.tagName != "IMG") {
					n("TYPE_MISMATCH_ERR")
				}
				if (Z.readyState != "complete") {
					n("INVALID_STATE_ERR")
				}
			}

			function o(Z) {
				this.code = this[Z];
				this.message = Z + ": DOM Exception " + this.code
			}

			var x = o.prototype = new Error;
			x.INDEX_SIZE_ERR = 1;
			x.DOMSTRING_SIZE_ERR = 2;
			x.HIERARCHY_REQUEST_ERR = 3;
			x.WRONG_DOCUMENT_ERR = 4;
			x.INVALID_CHARACTER_ERR = 5;
			x.NO_DATA_ALLOWED_ERR = 6;
			x.NO_MODIFICATION_ALLOWED_ERR = 7;
			x.NOT_FOUND_ERR = 8;
			x.NOT_SUPPORTED_ERR = 9;
			x.INUSE_ATTRIBUTE_ERR = 10;
			x.INVALID_STATE_ERR = 11;
			x.SYNTAX_ERR = 12;
			x.INVALID_MODIFICATION_ERR = 13;
			x.NAMESPACE_ERR = 14;
			x.INVALID_ACCESS_ERR = 15;
			x.VALIDATION_ERR = 16;
			x.TYPE_MISMATCH_ERR = 17;
			G_vmlCanvasManager = E;
			CanvasRenderingContext2D = W;
			CanvasGradient = v;
			CanvasPattern = u;
			DOMException = o
		})()
	}

	var ac = new Autochartist(window.acConf);
	ac.start();

	var news = new News(window.language);

	var view = new PageView();
	view.kind = "classic";
	var interval, intervalCheckConnection;

	if (js_params.p == "6") {
		if (js_params.autoStart) {
			start();
		}
	} else {
		var AppRouter = Backbone.Router.extend({
			routes: {
				"*actions": "defaultRoute"
			}
		});

		// Instantiate the router
		var app_router = new AppRouter;


		app_router.on('route:defaultRoute', function (actions) {
			switch (actions) {
				case "binary":
				default:
					if (js_params.autoStart) {
						start();
					}
					break;
			}
		});

		Backbone.history.start();
	}

	$(window).on('beforeunload', function () {
		wss_conn.send('{"command":"disconnect"}');
		wss_conn.wss.close();
	});

	$(window).on('resize',function () {
		$("#widgets-" + view.kind + " .console").each(function () {
			var id = $(this).attr('data-id');
			var item = view.consoles.get(id);
			setTimeout(chart.drawConsole(item, true), 0);
		});
	});

	$('#trader-financial-control-panel').on('click', '.plus', function(){
		$('#trade-amount').val(parseInt($('#trade-amount').val()) + 10);
	});

	$('#trader-financial-control-panel').on('click', '.minus', function(){
		var amount = parseInt($('#trade-amount').val());
		if(amount > 10) {
			$('#trade-amount').val(amount - 10);
		}
	})


	var upd = "2015-02-10 17:45:27";
})
(window.js_params, $, _, Backbone, window.currency);