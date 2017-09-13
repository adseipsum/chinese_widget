! function(e) {
	"use strict";
	e.module("app.filters", []).filter("instrumentPriceFormatter", ["$filter", "InstrumentService", function(e, t) {
		return function(e, n) {
			return e ? "string" != typeof e || (e = t.getInstrument(e)) ? e.digitsToDisplay ? e.displayPrice : e.price : n : null
		}
	}])
}(angular),
	function(e, t) {
		e.BX8Trader = t.module("BX8Trader", ["ui.router", "ui.bootstrap", "ngAnimate", "app.config", "app.filters", "app.framework", "app.tools.logging", "ngSanitize", "ngCookies", "pascalprecht.translate", "app.tools.analytics", "app.tools", "app.tools.translations", "toaster"]).config(["$httpProvider", function(e) {
			e.defaults.withCredentials = !0, e.interceptors.push(["$injector", function(e) {
				return e.get("AuthenticationInterceptor")
			}])
		}]).value("ENV", {
			LOG_DEBUG: 0,
			LOG_INFO: 1,
			LOG_WARN: 2,
			LOG_ERROR: 3
		}).value("ChineseBrokers", {
			zevizo: !0,
			"demo-zevizo": !0,
			bx8asia: !0,
			"demo-bx8asia": !0,
			expbinaryoption: !0,
			"demo-expbinaryoption": !0,
			"demo-apfwinners": !0,
			apfwinners: !0,
			"7option": !0,
			"demo-7option": !0,
			symfx: !0,
			"demo-symfx": !0
		}).constant("OPTION_TYPES", {
			"-8": "12mo",
			"-7": "4mo",
			"-6": "2mo",
			"-5": "1mo",
			"-4": "300s",
			"-3": "120s",
			"-2": "90s",
			"-1": "60s",
			0: "5m",
			1: "15m",
			2: "30m",
			3: "60m",
			4: "1mo",
			5: "2mo",
			6: "4mo",
			7: "12mo",
			8: "eod",
			9: "eow",
			10: "120m",
			11: "1w",
			12: "2w"
		}).constant("ENVIRONMENT_HOSTS", {
			Staging: "bx8-stg.forexwebservices.com",
			Production: "bx8.me"
		}).constant("CHART_ZOOM_VALUES", {
			"1m": 0,
			"5m:": 1,
			"15m": 2,
			"30m": 3,
			"1h": 4,
			"1d": 5
		}).constant("GOOGLE_ANALYTICS_IDS", {
			Staging: {
				default: "UA-60257781-1"
			},
			Production: {
				"7option": "UA-60230992-13",
				allgotrade: "UA-60230992-7",
				apfwinners: "UA-60230992-14",
				binaryoptioninc: "UA-60230992-15",
				boostoption: "UA-60230992-16",
				bx8asia: "UA-60230992-17",
				cronusoptions: "UA-60230992-10",
				"elite-options": "UA-60230992-6",
				expbinaryoption: "UA-60230992-12",
				invest364: "UA-60230992-18",
				options12: "UA-60230992-19",
				paydayoption: "UA-60230992-20",
				premiumbinary: "UA-60230992-11",
				profitgrip: "UA-60230992-21",
				"sigma-europe": "UA-60230992-8",
				symfx: "UA-60230992-22",
				tradeswan: "UA-60230992-23",
				tradethunder: "UA-60230992-4",
				xchangeoption: "UA-60230992-9",
				zevizo: "UA-60230992-24",
				default: "UA-60230992-1",
				eubinary: "UA-60230992-5"
			}
		}).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function(e, t, n) {
			t.otherwise("/"), e.state("IndexGuest", {
				url: "/",
				templateUrl: "/Scripts/Trader/Views/IndexGuest.html",
				controller: "GuestController",
				params: {
					errorMessage: ""
				}
			}).state("Index", {
				url: "/app",
				templateUrl: "/Scripts/Trader/Views/Index.html",
				controller: "TraderController"
			}), t.otherwise("/"), n.hashPrefix("")
		}]).config(["$translateProvider", function(e) {
			e.useStaticFilesLoader({
				prefix: "/Scripts/Config/Translations/",
				suffix: ".json"
			}), e.preferredLanguage("en")
		}])
	}(window, angular),
	function(e) {
		"use strict";
		e.module("app.config", []).factory("ConfigurationService", ["ENV", function(t) {
			var n = function(t, n) {
					var o = function(o) {
						return e.extend(o || {}, {
							url: t,
							method: n || "GET"
						})
					};
					return o.url = t, o.method = n, o
				},
				o = function(e) {
					return n(e, "GET")
				},
				i = function(e) {
					return n(e, "POST")
				},
				r = function(e) {
					return n(e, "PUT")
				},
				s = {
					Trader: {
						GetAccount: "/api/Trader/GetAccount",
						CreateToken: "/api/Token/CreateToken",
						ResetPassword: "/api/token/ResetPassword",
						GetQuoteHistory: "/api/Trader/GetLast24HoursQuotes",
						GetLast5MinutesQuoteHistory: "/api/Trader/GetLast5MinutesQuotes",
						OpenPosition: "/api/Trader/OpenPosition",
						OpenInstantPosition: "/api/Trader/OpenInstantPosition",
						GetClosedPositions: "/api/Trader/GetClosedPositions",
						GetClosedPositionsById: "/api/Trader/GetClosedPositionsById",
						GetFinancialTransactions: "/api/Trader/GetMoneyTransactions",
						EarlyClosurePosition: "/api/Trader/EarlyClosurePosition",
						GetMinMaxPriceForSymbol: "/api/Trader/GetMinMaxPriceForSymbol",
						ReadyToDeposit: "/api/Trader/ReadyToDeposit",
						GetHighLowInstruments: "/api/Trader/GetHighLowInstruments",
						GetDateTime: "/api/Trader/GetDateTime",
						GetBrokerTradingDetails: "/api/Trader/GetBrokerTradingDetails",
						GetBrokerConfiguration: "/api/Trader/GetBrokerConfiguration",
						SetUserOnlineStatus: "/api/Trader/SetUserOnlineStatus",
						GetRiskGroup: "/api/Trader/GetUserGroup",
						GetWidgetConfiguration: "/api/trader/GetWidgetConfiguration",
						Withdraw: "/api/trader/withdraw",
						GetClosePriceHistory: "/api/trader/GetClosePriceHistory"
					},
					Manager: {
						GetManagerInfo: "/api/manager/GetManagerInfo",
						CreateToken: "/api/token/CreateToken",
						GetTradingPlatformToken: "/api/Token/GetTradingPlatformToken",
						GetAccountIds: "/api/manager/accounts/GetUsersIds",
						GetAccounts: "/api/manager/accounts/GetUserHeaders",
						GetAccount: "/api/manager/accounts/GetAccount",
						UpdateAccount: "/api/manager/accounts/UpdateAccount",
						GetAccountClosedPositions: "/api/manager/accounts/GetAccountClosedPositions",
						ExportClosedPositionsToExcel: "api/manager/accounts/ExportClosedPositionsToExcel",
						GetAccountMoneyTransactions: "/api/manager/accounts/GetAccountMoneyTransactions",
						CreateAccount: "/api/manager/accounts/CreateAccount",
						Withdraw: "/api/manager/accounts/WithdrawMoneyFromAccount",
						Deposit: "/api/manager/accounts/DepositMoneyToAccount",
						DepositBonusToAccount: "/api/manager/accounts/DepositBonusToAccount",
						RealizeBonus: "/api/manager/accounts/RealizeBonus",
						ZeroAccount: "/api/manager/accounts/ZeroAccount",
						WithdrawBonus: "/api/manager/accounts/WithdrawBonusFromAccount",
						CancelMoneyTransaction: "/api/manager/accounts/CancelMoneyTransaction",
						ApproveMoneyTransaction: "/api/manager/accounts/ApproveMoneyTransaction",
						openHighLowPosition: "/api/manager/accounts/OpenHighLowPosition",
						openInstantPosition: "/api/manager/accounts/OpenInstantPosition",
						CancelHighLowPosition: "/api/manager/accounts/CancelHighLowPosition",
						CancelClosedHighLowPosition: "/api/manager/accounts/CancelClosedHighLowPosition",
						EnableUser: "/api/manager/accounts/EnableAccount",
						DisableUser: "/api/manager/accounts/DisableAccount",
						DeleteAccounts: "/api/manager/accounts/DeleteAccounts",
						ReactivateAccounts: "/api/manager/accounts/ReactivateAccounts",
						GetAccountStatistics: "/api/manager/accounts/GetAccountStatistics",
						CloseExpiredHighLowPosition: "/api/manager/accounts/CloseExpiredHighLowPosition",
						GetZeroingTransactions: "/api/manager/accounts/GetZeroingTransactions",
						AssignAccount: "/api/manager/accounts/AssignToRiskGroup",
						GetUser: "/api/manager/accounts/GetUser",
						GetUsers: o("/api/manager/GetUsers"),
						UpdateUser: i("/api/manager/UpdateUser"),
						CreateUser: i("/api/manager/CreateUser"),
						GetIBs: "/api/manager/GetIBsList",
						CreateIB: i("/api/manager/CreateIB"),
						UpdateIB: i("/api/manager/UpdateIB"),
						GetApiUsers: o("/api/manager/GetApiUsers"),
						GetAffiliateApiUser: o("/api/manager/AffiliateApi/GetAffiliateApiUser"),
						GetAffiliateApiUsers: o("/api/manager/AffiliateApi/GetAffiliateApiUsers"),
						GetAdministrators: o("/api/manager/GetAdministrators"),
						SetAffiliatePermissions: i("/api/manager/AffiliateApi/SetPermission"),
						SetAffiliateWhiteListIps: i("/api/manager/AffiliateApi/WhiteListIps"),
						SetAffiliateCampaigns: i("/api/manager/AffiliateApi/AssignCampaigns"),
						GetCampaigns: o("/api/manager/campaign/getall"),
						CreateCampaign: i("/api/manager/campaign/create"),
						UpdateCampaign: i("/api/manager/campaign/update"),
						DeleteCampaign: i("/api/manager/campaign/delete"),
						ExportIBReportToExcel: "/api/manager/ib/ExportIBReportToExcel",
						GetIBAccounts: "/api/manager/ib/GetIBAccounts",
						GetCurrentIBStatistics: "/api/manager/ib/GetCurrentIBStatistics",
						GetIBStatistics: "/api/manager/ib/GetIBStatistics",
						GetBrokerTradingDetails: "/api/manager/GetBrokerTradingDetails",
						GetBrokers: "/api/manager/brokers/GetAll",
						GetBrokersList: "/api/manager/brokers/GetBrokersList",
						GetLiveBrokers: "/api/manager/brokers/GetLiveBrokers",
						GetCurrentBroker: "/api/manager/brokers/GetCurrent",
						GetBrokerConfigurationByName: "/api/manager/brokers/GetBrokerConfiguration",
						GetBrokerConfiguration: "/api/manager/GetBrokerConfiguration",
						UpdateCurrentBroker: "/api/manager/brokers/UpdateCurrentBroker",
						UpdateBroker: "/api/manager/brokers/UpdateBroker",
						UpdateBrokerPayoutMarkdown: i("/api/manager/brokers/UpdateBrokerPayoutMarkdown"),
						UpdateBrokerSecurity: i("/api/manager/brokers/UpdateCurrentBrokerSecurity"),
						UpdateBrokerAdminSettings: i("/api/manager/brokers/UpdateBrokerAdminSettings"),
						CreateBroker: "/api/manager/brokers/CreateBroker",
						UploadImage: "/api/manager/brokers/UploadImage",
						GetCurrentBrokerStatistics: "/api/manager/brokers/GetCurrentBrokerStatistics",
						GetAllBrokerStatistics: "/api/manager/brokers/GetAllBrokerStatistics",
						CreateBillingReport: "/api/brokers/CreateBillingReport",
						UpdateCurrentBrokerWidgetConfiguration: "/api/manager/brokers/UpdateWidgetConfiguration",
						GetBrokerDashboard: i("/api/manager/risk/GetBrokerDashboard"),
						CreateRiskGroup: i("/api/manager/risk/CreateGroup"),
						UpdateRiskGroup: i("/api/manager/risk/UpdateGroup"),
						GetRiskGroups: o("/api/manager/risk/GetGroups"),
						DeleteRiskGroups: i("/api/manager/risk/DeleteGroup"),
						GetGroupAccounts: o("/api/manager/risk/GetGroupAccounts"),
						GetNonGroupedAccounts: o("/api/manager/risk/GetNonGroupedAccounts"),
						GetOpenPositions: o("/api/manager/positions/GetAllOpenPositions"),
						UpdatePriceAdjustment: i("/api/manager/instruments/UpdateHighLowInstrumentPriceAdjustment"),
						GetAllNewsEvents: o("/api/manager/NewsEvents"),
						CreateNewsEvent: r("/api/manager/NewsEvents"),
						UpdateNewsEvent: i("/api/manager/NewsEvents"),
						SetNewsEventEnabled: function(e, t) {
							return o("/api/manager/NewsEvents/" + e + "/" + (t ? "enable" : "disable"))
						},
						SetNewsEventInstrument: function(e, t, n) {
							return o("/api/manager/NewsEvents/" + e + "/instruments/" + t + "/" + (n ? "enable" : "disable"))
						},
						SetNewsEventAllInstruments: function(e, t) {
							return o("/api/manager/NewsEvents/" + e + "/instruments/all/" + (t ? "enable" : "disable"))
						},
						Holidays: "api/manager/Holidays",
						SetHolidaySymbol: function(e, t, n) {
							return "/api/manager/Holidays/" + e + "/symbols/" + t + "/" + (n ? "enable" : "disable")
						},
						SetHolidaySymbolByTradingSession: function(e, t, n) {
							return "/api/manager/Holidays/" + e + "/tradingSessions/" + t + "/" + (n ? "enable" : "disable")
						},
						SetHolidayEnabled: function(e, t) {
							return "/api/manager/Holidays/" + e + "/" + (t ? "enable" : "disable")
						},
						GetInstruments: "/api/manager/instruments/GetInstrumentHeaders",
						GetSymbolLastQuote: "/api/manager/instruments/GetSymbolLastQuote",
						SetInstrumentAvailability: "/api/manager/instruments/SetInstrumentAvailability",
						EnableInstantOption: "/api/manager/instruments/EnableHighLowInstrumentInstantOption",
						DisableInstantOption: "/api/manager/instruments/DisableHighLowInstrumentInstantOption",
						SetInstrumentLongTermAvailability: "/api/manager/instruments/SetInstrumentLongTermAvailability",
						SetInstrumentEarlyClosureAvailability: "/api/manager/instruments/SetInstrumentEarlyClosureAvailability",
						CreateInstrument: "/api/manager/instruments/CreateInstrument",
						UpdateInstrument: "/api/manager/instruments/UpdateInstrument",
						GetInstrumentOptions: "/api/manager/instruments/GetInstrumentOptions",
						GetInstrument: "/api/manager/instruments/GetInstrument",
						GetBrokerInstruments: "/api/manager/instruments/GetBrokerInstruments",
						SetLevelPayout: "/api/manager/instruments/SetLevel",
						SetAllLevelsPayout: "/api/manager/instruments/SetAllLevelsPayout",
						SetInstrumentDisplayGroup: "/api/manager/instruments/SetInstrumentDisplayGroup",
						GetSymbols: "/api/manager/symbols/GetSymbols",
						CreateSymbol: "/api/manager/symbols/CreateSymbol",
						UpdateSymbol: "/api/manager/symbols/UpdateSymbol",
						GetTradingSessions: "/api/manager/tradingSessions/GetTradingSessions",
						CreateTradingSession: "/api/manager/tradingSessions/CreateTradingSession",
						UpdateTradingSession: "/api/manager/tradingSessions/UpdateTradingSession",
						UpdateTradingSessionPeriod: "/api/manager/tradingSessions/UpdateTradingSessionPeriod",
						AddTradingSessionPeriod: "/api/manager/tradingSessions/AddTradingSessionPeriod",
						GetTimeZones: "/api/manager/tradingSessions/GetTimeZones",
						GetOpenedExpiredPositions: "/api/manager/GetOpenedExpiredPositions",
						CancelPosition: "/api/manager/CancelOpenedExpiredPositions",
						ExpirePosition: "/api/manager/ExpireOpenedExpiredPositions",
						GetRobots: "/api/manager/robots/get",
						GetRobotAccounts: "/api/manager/robots/getAccounts",
						BlockRobot: "/api/manager/robots/block",
						UnblockRobot: "/api/manager/robots/unblock",
						CreateRobot: "/api/manager/robots/create",
						UpdateRobot: "/api/manager/robots/update",
						AttachAccount: "/api/manager/robots/attachAccount",
						UpdateAttachedAccount: "/api/manager/robots/UpdateAttachedAccount",
						DetachAccount: "/api/manager/robots/detachAccount",
						GetCurrencies: "/api/manager/currencies/GetCurrencies",
						GetDateTime: "/api/manager/GetDateTime",
						RemoteExecution: "/api/Manager/RemoteExecution",
						GetCountries: o("/api/Manager/countries/getall")
					}
				},
				a = {
					LogLevel: t.LOG_DEBUG
				},
				l = {
					InstrumentAmountStep: 5,
					MinimumAmount: 10,
					MaxAmount: 1e3,
					ShortTerm: {
						FiveMinutes: 0,
						FifteenMinutes: 1,
						ThirtyMinutes: 2,
						SixtyMinutes: 3,
						EndOfDay: 8
					},
					LongTerm: {
						EndOfWeek: 9,
						OneMonth: 4,
						TwoMonths: 5,
						FourMonths: 6,
						TwelveMonths: 7
					},
					DefaultShortTermOptionTypes: [0, 1, 2, 3],
					DefaultLongTermOptionTypes: [4, 5, 6, 7],
					DefaultInstantLongTermOptionTypes: [-5, -6, -7, -8],
					DefaultInstantTermOptionTypes: [-1, -2, -3, -4],
					DefaultPayoutLevel: 0,
					DefaultInstruments: {
						RatesPanel: "EURUSD",
						InstantOptions: ["EURUSD", "USDJPY", "XAUUSD", "XAGUSD"]
					},
					Instruments: {
						PayoutLevels: {
							0: 5,
							1: 15,
							2: 30,
							3: 60
						},
						FirstPayoutLevel: 0,
						LastPayoutLevel: 3
					},
					Positions: {
						Padding: !0,
						HistoryInDays: 100
					},
					Popups: {
						AutoCloseTimeout: 3e3
					}
				},
				u = {
					IdleInactivityPeriodInMs: 3e5,
					OfflineInactivityPeriodInMs: 18e5,
					UserLoginCookieExpirationInDays: 365
				},
				c = {
					DefaultOneClickTradeMode: !1,
					LanguageMapping: {
						en: "English",
						es: "español",
						fr: "français",
						de: "Deutsch",
						ru: "русский",
						ar: "العربية",
						tr: "Türk",
						pl: "Polskie",
						"nl-LU": "Nederlands",
						ko: "한국어",
						"zh-CN": "中文(简体)",
						"zh-TW": "中文(繁體)",
						jp: "日本語"
					},
					DefaultLanguage: "en",
					DefaultChartType: "mountain",
					DefaultOptionType: "short",
					DefaultInstantOptionType: "instant",
					DefaultChartPeriod: "1m",
					DefaultInstrumentGroup: 0,
					Branding: {
						backgroundColor: "#FE7902",
						foregroundColor: "#FFF"
					},
					SupportedLanguages: ["en", "de", "fr", "ar", "es", "ru", "tr", "pl", "nl-LU", "ko", "zh-CN", "zh-TW", "jp"],
					Blotter: {
						recordsPerPage: 8
					},
					DateFormat: "dd/MM/yy",
					TimeFormat: "HH:mm:ss",
					DateTimeFormat: "dd/MM/yy HH:mm"
				},
				d = {
					gaugeGraphOptions: {
						lines: 12,
						angle: 0,
						lineWidth: .47,
						pointer: {
							length: .6,
							strokeWidth: .03,
							color: "#000000"
						},
						limitMax: "false",
						colorStart: "#A3C86D",
						colorStop: "#A3C86D",
						strokeColor: "#E0E0E0",
						generateGradient: !0,
						percentColors: [
							[0, "#A3C86D"],
							[1, "#A3C86D"]
						]
					}
				},
				p = {
					DaemonInterval: 3e5
				};
			return {
				API: s,
				Logging: a,
				Users: u,
				Trading: l,
				UI: c,
				Time: p,
				Manager: d
			}
		}])
	}(angular), BX8Trader.factory("AuthenticationInterceptor", ["$rootScope", "$q", function(e, t) {
	return {
		responseError: function(n) {
			return e.$broadcast({
				401: "UserNotAuthenticated",
				403: "UserNotAuthorized",
				419: "UserSessionTimeout",
				440: "UserSessionTimeout"
			}[n.status], n), t.reject(n)
		}
	}
}]),
	function(e) {
		"use strict";
		e.factory("BrokerDetailsService", ["$http", "$q", "UserService", "ConfigurationService", function(e, t, n, o) {
			var i = null,
				r = null;
			return this.getByName = function() {
				return i ? i.promise : (i = t.defer(), r ? i.resolve(r) : e({
					method: "GET",
					url: o.API.Trader.GetBrokerConfiguration
				}).then(function(e) {
					r = e.data, i.resolve(r), i = null
				}, function(e) {
					i.reject("failed to get broker details")
				}), i.promise)
			}, this.get = function() {
				return i ? i.promise : (i = t.defer(), r ? (i.resolve(r), i.promise) : (e({
					method: "GET",
					url: o.API.Trader.GetBrokerTradingDetails,
					params: {
						token: n.getAuthenticationToken()
					}
				}).then(function(e) {
					r = e.data, i.resolve(r), i = null, r.requireHttps && /^http:\/\//.test(window.location.href) && (window.location.href = window.location.href.replace(/^(http)(.*)/, "https$2"))
				}, function(e) {
					i.reject("failed to get broker details")
				}), i.promise))
			}, this.getFromCache = function() {
				return r
			}, this.setCache = function(e) {
				r = e
			}, this
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.service("ChartService", ["$http", "$q", "UserService", "ConfigurationService", function(e, t, n, o) {
			STX.QuoteFeed.ChartFeed = function() {}, STX.QuoteFeed.ChartFeed.stxInheritsFrom(STX.QuoteFeed), STX.QuoteFeed.ChartFeed.prototype.fetch = function(e, t) {
				if (e.startDate) return void t({
					quotes: [{
						Date: "20150101",
						Open: 139,
						High: 140,
						Low: 138,
						Close: 139,
						Volume: 1e3
					}]
				})
			};
			var i = function() {
				return new STX.QuoteFeed.ChartFeed
			};
			return {
				getFeed: i
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.service("EarlyClosurePositionService", ["$rootScope", "ConfigurationService", "UserService", "$http", "$uibModal", function(e, t, n, o, i) {
			var r = 10,
				s = 0,
				a = 1e-6,
				l = null,
				u = function(e) {
					l = e
				},
				c = function(e, t, n, o, i) {
					var u, c = new Date(e.option.fullExpireTime) - new Date(e.option.startTime),
						d = t - new Date(e.option.startTime),
						p = d / c / r,
						m = "High" === e.direction ? 1 : -1,
						g = (n - e.openPrice) / (i - o),
						f = m * g > 0 ? 1 : -1,
						h = l / 100,
						v = e.amount,
						T = v + v * e.payout - v * h,
						y = v * s;
					u = Math.abs(e.openPrice - n) < a ? v - p * (e.payout * v) - h * v : v + f * (p + Math.abs(g)) * (e.payout * v) - h * v;
					var I = u;
					return u > T && (I = T), u < y && (I = y), I
				},
				d = function(e) {
					var i = t.API.Trader.EarlyClosurePosition,
						r = n.getAuthenticationToken(),
						s = {
							token: r
						},
						a = {
							positionId: e.positionId,
							instrumentId: e.instrumentId,
							symbolId: e.symbolId,
							level: e.level,
							closePrice: e.currentPrice
						};
					return o({
						method: "POST",
						url: i,
						params: s,
						data: a
					}).then(function(e) {
						return e.data
					})
				};
			return {
				setEarlyClosureMarkdown: u,
				recalculateProfit: c,
				closePosition: d
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.factory("GamificationModalService", ["$rootScope", "$uibModal", "TimeService", function(e, t, n) {
			var o = [],
				i = function(e) {
					var t = "high" == e.direction.toLowerCase();
					return e.closePrice > e.openPrice && t || e.closePrice < e.openPrice && !t ? "winning" : e.closePrice < e.openPrice && t || e.closePrice > e.openPrice && !t ? "losing" : "tie"
				},
				r = function(e) {
					var n = i(e);
					n = n.slice(0, 1).toUpperCase() + n.slice(1), t.open({
						templateUrl: "/Scripts/Trader/Views/Positions/Popups/" + n + "Modal.html",
						controller: n + "ModalController",
						size: "sm",
						backdrop: "static",
						resolve: {
							positionData: function() {
								return e
							},
							instrument: function() {
								var t = o.filter(function(t) {
									return t.instrumentId == e.instrumentId
								});
								return t[0]
							}
						}
					})
				},
				s = function(e) {
					o.push(e)
				};
			return e.$on("instantPositionClosed", function(e, t) {
				r(t)
			}), e.$on("scheduledPositionClosed", function(e, t) {
				for (var n = 0; n < t.length; n++) r(t[n])
			}), {
				addInstrument: s
			}
		}])
	}(BX8Trader), BX8Trader.factory("GuestService", ["TranslationService", "ToolService", "AnalyticsService", function(e, t, n) {
	"use strict";
	var o = window.location.href.match(/\?.*goToUrl=([^&]+)/i),
		i = o && decodeURIComponent(o[1]),
		r = window.location.href.search(/isGuestMode=true/i) > -1;
	return r && console.log("goToUrl: " + i), this.isGuestMode = function() {
		return r
	}, this.showPopup = function() {
		var o = e.getTranslation("guest.action-modal.header"),
			r = e.getTranslation("guest.action-modal.content"),
			s = e.getTranslation("guest.action-modal.open-account"),
			a = function() {
				var e, t = document.querySelector("div.modal-dialog");
				return t ? (e = t.querySelector("div.modal-content"), t.style.width = "auto", e.style.width = "600px", void(e.style.margin = "auto")) : void setTimeout(a, 1)
			};
		return a(), t.popupMessage(o, r, s, {
			width: "auto",
			minWidth: "100px"
		}).then(function() {
			window.open(i), n.logTraderEvent("Promotion", "Open accout click")
		})
	}, this
}]),
	function(e) {
		"use strict";
		e.factory("InstrumentService", ["ToolService", "UserService", "ConfigurationService", "GamificationModalService", "$rootScope", "$http", "$q", "BrokerDetailsService", function(e, t, n, o, i, r, s, a) {
			var l = {},
				u = {},
				c = [],
				d = n.Trading.DefaultInstruments,
				p = null,
				m = function() {
					return p
				},
				g = function(e) {
					p = e
				},
				f = function() {
					return d
				},
				h = function() {
					if (h.isInProgress) return h.fetchingDefer.promise;
					h.fetchingDefer = s.defer(), h.isInProgress = !0;
					var e = t.getAuthenticationToken();
					if (!e) return h.fetchingDefer.reject("User details"), h.fetchingDefer.promise;
					var o = n.API.Trader.GetHighLowInstruments;
					return r({
						method: "GET",
						url: o,
						params: {
							token: e
						}
					}).then(function(e) {
						for (var t = 0; t < e.data.length; t++) e.data[t].isSelected = !1, A(e.data[t]);
						a.get().then(function(e) {
							if (e.defaultScheduledOptionInstrument) {
								var t = y(e.defaultScheduledOptionInstrument);
								d.RatesPanel = !!t && t.name || d.RatesPanel
							}
							e.defaultInstantOptionInstruments && (d.InstantOptions = [], angular.forEach(e.defaultInstantOptionInstruments, function(e) {
								var t = y(e);
								t && this.push(t.name)
							}, d.InstantOptions), angular.forEach(n.Trading.DefaultInstruments.InstantOptions, function(e) {
								this.push(e)
							}, d.InstantOptions)), h.fetchingDefer.resolve(e)
						})
					}, function(e) {
						h.fetchingDefer.reject(e)
					}).finally(function() {
						h.isInProgress = !1
					}), h.fetchingDefer.promise
				},
				v = function(t, n) {
					var o = u[t];
					return o ? e.getInstrumentPrice(o, n) : null
				},
				T = function(t, n) {
					var o = this.getInstrumentBySymbolId(t);
					return o ? e.getInstrumentPrice(o, n) : null
				},
				y = function(e) {
					return l[e]
				},
				I = function(e) {
					var t = c.filter(function(t) {
						return t.symbolId == e
					});
					return t.length > 0 ? t[0] : null
				},
				S = function(e) {
					return e < 0
				},
				b = function(e) {
					return e >= 4 && 8 !== e
				},
				C = function(e) {
					return e >= 0 && e < 4 || 8 === e
				},
				P = function(e) {
					var t = c.filter(function(t) {
						return t.name == e
					});
					return t.length > 0 ? t[0] : null
				},
				O = function() {
					return instruments
				},
				w = function() {
					return c
				},
				k = function(e) {
					c = e
				},
				L = function(e) {
					l[e.symbolId] = e, u[e.instrumentId] = e, c.push(e), c.sort(function(e, t) {
						return e.name > t.name ? 1 : e.name < t.name ? -1 : 0
					}), i.$broadcast("instrumentAdded", e)
				},
				$ = function(e) {
					var t = c.filter(function(t) {
						return t.instrumentId === e
					});
					return t && t.length > 0 ? t[0] : null
				},
				D = function(e) {
					var t = y(e.instrumentId);
					if (t && t.longTermOptions)
						for (var n = 0; n < e.optionSentiments.length; n++) {
							var o = t.longTermOptions.filter(function(t) {
								return t.level == e.optionSentiments[n].level
							});
							o && o[0] && (o[0].last24HourTraderHighSentiment = e.optionSentiments[n].last24HoursHighSentiment, o[0].overallTraderHighSentiment = e.optionSentiments[n].overallHighSentiment)
						}
				},
				x = function(e) {
					var t = c.findIndex(function(t) {
						return t.symbolId === e.symbolId
					});
					t !== -1 && c.splice(1, t)
				},
				A = function(t) {
					var n = !0;
					t.options.sort(function(e, t) {
						return e.level > t.level
					}), t.longTermOptions.sort(function(e, t) {
						return e.level > t.level
					}), t.instantOptions.sort(function(e, t) {
						return e.level > t.level
					});
					for (var r = 0; r < c.length; r++) {
						var s = c[r];
						if (s.instrumentId === t.instrumentId) {
							if (s.version <= t.version) {
								s.version = t.version, s.enabled = t.enabled, s.instantOptionEnabled = t.instantOptionEnabled, s.longTermOptionEnabled = t.longTermOptionEnabled, s.name = t.instrument, s.earlyClosureAvailable = t.earlyClosureAvailable, s.options || (s.options = []), s.instantOptions || (s.instantOptions = []);
								for (var a = 0; a < t.options.length; a++) s.options && a < s.options.length ? (s.options[a].pipDigits = t.options[a].pipDigits, s.options[a].digitsToDisplay = t.options[a].digitsToDisplay, s.options[a].displayGroup = t.options[a].displayGroup, s.options[a].level = t.options[a].level, s.options[a].optionId = t.options[a].optionId, s.options[a].startTime = t.options[a].startTime, s.options[a].expire = moment(new Date(t.options[a].expireTime)).format("HH:mm"), s.options[a].startEarlyClosureTime = t.options[a].startEarlyClosureTime, s.options[a].fullExpireTime = t.options[a].expireTime, s.options[a].payout = t.options[a].payout, s.options[a].noEntryTime = t.options[a].noEntryTime, s.options[a].entryTimeSecondsLeft = t.options[a].entryTimeSecondsLeft, s.options[a].timeLeft = t.options[a].timeLeft, s.options[a].timeLeftUpdateTime = (new Date).getTime()) : s.options.push({
									pipDigits: t.options[a].pipDigits,
									digitsToDisplay: t.options[a].digitsToDisplay,
									level: t.options[a].level,
									optionId: t.options[a].optionId,
									startTime: t.options[a].startTime,
									expire: moment(new Date(t.options[a].expireTime)).format("HH:mm"),
									startEarlyClosureTime: t.options[a].startEarlyClosureTime,
									fullExpireTime: t.options[a].expireTime,
									payout: t.options[a].payout,
									noEntryTime: t.options[a].noEntryTime,
									entryTimeSecondsLeft: t.options[a].entryTimeSecondsLeft,
									timeLeft: t.options[a].timeLeft,
									timeLeftUpdateTime: (new Date).getTime()
								});
								for (var a = 0; a < t.longTermOptions.length; a++) s.longTermOptions && a < s.longTermOptions.length ? (s.longTermOptions[a].pipDigits = t.longTermOptions[a].pipDigits, s.longTermOptions[a].digitsToDisplay = t.longTermOptions[a].digitsToDisplay, s.longTermOptions[a].displayGroup = t.longTermOptions[a].displayGroup, s.longTermOptions[a].level = t.longTermOptions[a].level, s.longTermOptions[a].optionId = t.longTermOptions[a].optionId, s.longTermOptions[a].startTime = t.longTermOptions[a].startTime, s.longTermOptions[a].expire = moment(new Date(t.longTermOptions[a].expireTime)).format("HH:mm"), s.longTermOptions[a].startEarlyClosureTime = t.longTermOptions[a].startEarlyClosureTime, s.longTermOptions[a].fullExpireTime = t.longTermOptions[a].expireTime, s.longTermOptions[a].payout = t.longTermOptions[a].payout, s.longTermOptions[a].noEntryTime = t.longTermOptions[a].noEntryTime, s.longTermOptions[a].entryTimeSecondsLeft = t.longTermOptions[a].entryTimeSecondsLeft, s.longTermOptions[a].timeLeft = t.longTermOptions[a].timeLeft, s.longTermOptions[a].timeLeftUpdateTime = (new Date).getTime()) : s.longTermOptions.push({
									pipDigits: t.longTermOptions[a].pipDigits,
									digitsToDisplay: t.longTermOptions[a].digitsToDisplay,
									level: t.longTermOptions[a].level,
									optionId: t.longTermOptions[a].optionId,
									startTime: t.longTermOptions[a].startTime,
									expire: moment(new Date(t.longTermOptions[a].expireTime)).format("HH:mm"),
									startEarlyClosureTime: t.longTermOptions[a].startEarlyClosureTime,
									fullExpireTime: t.longTermOptions[a].expireTime,
									payout: t.longTermOptions[a].payout,
									noEntryTime: t.longTermOptions[a].noEntryTime,
									entryTimeSecondsLeft: t.longTermOptions[a].entryTimeSecondsLeft,
									timeLeft: t.longTermOptions[a].timeLeft,
									timeLeftUpdateTime: (new Date).getTime(),
									last24HourTraderHighSentiment: t.longTermOptions[a].last24HourTraderHighSentiment < 1 ? e.generateTraderHighSentiment() : t.longTermOptions[a].last24HourTraderHighSentiment,
									overallTraderHighSentiment: t.longTermOptions[a].overallTraderHighSentiment < 1 ? e.generateTraderHighSentiment() : t.longTermOptions[a].overallTraderHighSentiment
								});
								for (var a = 0; a < t.instantOptions.length; a++) s.instantOptions && a < s.instantOptions.length ? (s.instantOptions[a].pipDigits = t.instantOptions[a].pipDigits, s.instantOptions[a].digitsToDisplay = t.instantOptions[a].digitsToDisplay, s.instantOptions[a].displayGroup = t.instantOptions[a].displayGroup, s.instantOptions[a].level = t.instantOptions[a].level, s.instantOptions[a].optionId = t.instantOptions[a].optionId, s.instantOptions[a].startTime = t.instantOptions[a].startTime, s.instantOptions[a].expire = moment(new Date(t.instantOptions[a].expireTime)).format("HH:mm"), s.instantOptions[a].startEarlyClosureTime = t.instantOptions[a].startEarlyClosureTime, s.instantOptions[a].fullExpireTime = t.instantOptions[a].expireTime, s.instantOptions[a].payout = t.instantOptions[a].payout, s.instantOptions[a].noEntryTime = t.instantOptions[a].noEntryTime, s.instantOptions[a].entryTimeSecondsLeft = t.instantOptions[a].entryTimeSecondsLeft, s.instantOptions[a].timeLeft = t.instantOptions[a].timeLeft, s.instantOptions[a].timeLeftUpdateTime = (new Date).getTime()) : s.instantOptions.push({
									pipDigits: t.instantOptions[a].pipDigits,
									digitsToDisplay: t.instantOptions[a].digitsToDisplay,
									level: t.instantOptions[a].level,
									optionId: t.instantOptions[a].optionId,
									startTime: t.instantOptions[a].startTime,
									expire: moment(new Date(t.instantOptions[a].expireTime)).format("HH:mm"),
									startEarlyClosureTime: t.instantOptions[a].startEarlyClosureTime,
									fullExpireTime: t.instantOptions[a].expireTime,
									payout: t.instantOptions[a].payout,
									noEntryTime: t.instantOptions[a].noEntryTime,
									entryTimeSecondsLeft: t.instantOptions[a].entryTimeSecondsLeft,
									timeLeft: t.instantOptions[a].timeLeft,
									timeLeftUpdateTime: (new Date).getTime()
								});
								t.options.length < s.options.length && s.options.splice(t.options.length, s.options.length - t.options.length), t.longTermOptions.length < s.longTermOptions.length && s.longTermOptions.splice(t.longTermOptions.length, s.longTermOptions.length - t.longTermOptions.length), t.instantOptions.length < s.instantOptions.length && s.instantOptions.splice(t.instantOptions.length, s.instantOptions.length - t.instantOptions.length), s.isInTradingHours = t.options.length > 0, t.visible || (x(s), i.$broadcast("instrumentRemoved", t.symbolId))
							}
							n = !1, l[s.symbolId] = s, u[s.instrumentId] = s
						}
					}
					if (n && t.visible) {
						var d = {
							instrumentId: t.instrumentId,
							instantOptionEnabled: t.instantOptionEnabled,
							longTermOptionEnabled: t.longTermOptionEnabled,
							displayGroup: t.displayGroup,
							version: t.version,
							enabled: t.enabled,
							instantOptions: [],
							symbolId: t.symbolId,
							name: t.instrument,
							arrowCssName: "",
							pipDigits: t.pipDigits,
							digitsToDisplay: t.digitsToDisplay,
							tooltipName: t.instrument.length > 8 ? t.instrument : "",
							price: t.price,
							displayPrice: t.price.toFixed(t.digitsToDisplay),
							options: [],
							longTermOptions: t.longTermOptions.map(function(e) {
								return e.fullExpireTime = e.expireTime, e
							}),
							earlyClosureAvailable: t.earlyClosureAvailable
						};
						if (t.longTermOptions && t.longTermOptions.length > 0)
							for (var r = 0; r < t.longTermOptions.length; r++) {
								var p = t.longTermOptions[r];
								p.last24HourTraderHighSentiment = p.last24HourTraderHighSentiment < 1 ? e.generateTraderHighSentiment() : p.last24HourTraderHighSentiment, p.overallTraderHighSentiment = p.overallTraderHighSentiment < 1 ? e.generateTraderHighSentiment() : p.overallTraderHighSentiment, d.longTermOptions[r] = p
							}
						if (t.instantOptions.length > 0)
							for (var m = 0; m < t.instantOptions.length; m++) {
								var g = t.instantOptions[m];
								t.instantOptions[m].level < -4 && d.longTermOptions.map(function(e) {
									if (e.level == Math.abs(t.instantOptions[m].level) - 1) return g.overallTraderHighSentiment = e.overallTraderHighSentiment, g.last24HourTraderHighSentiment = e.last24HourTraderHighSentiment, g
								}), d.isInTradingHours = !0, d.instantOptions.push(g)
							} else d.isInTradingHours = !1;
						if (t.options.length > 0)
							for (var m = 0; m < t.options.length; m++) {
								var g = {
									optionId: t.options[m].optionId,
									level: t.options[m].level,
									startTime: t.options[m].startTime,
									expire: moment(new Date(t.options[m].expireTime)).format("HH:mm"),
									startEarlyClosureTime: t.options[m].startEarlyClosureTime,
									fullExpireTime: t.options[m].expireTime,
									noEntryTime: t.options[m].noEntryTime,
									entryTimeSecondsLeft: t.options[m].entryTimeSecondsLeft,
									payout: t.options[m].payout,
									timeLeft: t.options[m].timeLeft,
									timeLeftUpdateTime: (new Date).getTime(),
									isInTradingHours: !0
								};
								d.isInTradingHours = !0, d.options.push(g)
							} else d.isInTradingHours = !1;
						L(d), o.addInstrument(d)
					}
				},
				E = function() {
					var e = t.getSelectedChartInstrument();
					e || (e = p ? $(p).name : f().RatesPanel);
					var n = c.filter(function(e) {
							return e.isInTradingHours
						}),
						o = c.filter(function(t) {
							return t.name == e
						});
					if (!o || 0 == o.length) return n && 0 != n.length ? n[0] : c[0];
					var i = o[0];
					if (!n || 0 == n.length) return i;
					var r = n.filter(function(e) {
						return e.symbolId == i.symbolId
					});
					return r && 0 != r.length ? r[0] : n[0]
				},
				B = null,
				U = function(e) {
					return B.then(function() {
						if (!U[e]) {
							var o = n.API.Trader.GetLast5MinutesQuoteHistory;
							U[e] = r({
								method: "GET",
								url: o,
								params: {
									token: t.getAuthenticationToken(),
									symbolIds: [e]
								}
							}).then(function(e) {
								return e.data.length > 0 ? {
									data: e.data[0].quotes
								} : null
							})
						}
						return U[e]
					})
				},
				M = function(e) {
					if (null == B) {
						var o = [t.getSelectedOptionByExpiryInstrument(0), t.getSelectedOptionByExpiryInstrument(1), t.getSelectedOptionByExpiryInstrument(2), t.getSelectedOptionByExpiryInstrument(3)].filter(function(e) {
							return null != e
						});
						if (o.length > 0) {
							var i = e.filter(function(e) {
									return o.indexOf(e.name) !== -1
								}).map(function(e) {
									return e.symbolId
								}),
								a = n.API.Trader.GetLast5MinutesQuoteHistory;
							B = r({
								method: "GET",
								url: a,
								params: {
									token: t.getAuthenticationToken(),
									symbolIds: i
								}
							}).then(function(e) {
								e.data.forEach(function(e) {
									U[e.symbolId] = s.when({
										data: e.quotes
									})
								})
							})
						} else B = s.when()
					}
				},
				G = function() {
					return currentAccount
				},
				H = function(e) {
					instrumentSentiment = e
				},
				F = {},
				N = function(e) {
					if (!N[e]) {
						var o = n.API.Trader.GetQuoteHistory,
							i = {
								token: t.getAuthenticationToken(),
								symbolId: e
							};
						return N[e] = r({
							method: "GET",
							url: o,
							params: i
						}).then(function(t) {
							return F[e] = t.data, F[e]
						}), N[e]
					}
					return s.when(F[e])
				},
				R = function(e, t) {
					F[e] && t.length > 0 && Array.prototype.push.apply(F[e], t)
				},
				W = function(e, o, i) {
					var s = n.API.Trader.GetMinMaxPriceForSymbol,
						a = t.getAuthenticationToken(),
						l = {
							token: a,
							symbolId: e,
							from: o,
							to: i
						};
					return r({
						method: "GET",
						url: s,
						params: l
					}).then(function(e) {
						return e.data
					})
				};
			return {
				getBrokerDefaultInstrument: m,
				setBrokerDefaultInstrument: g,
				getInstrument: y,
				getInstrumentBySymbolId: I,
				getInstruments: O,
				getSortedInstrumentsList: w,
				setInstruments: k,
				getInstrumentById: $,
				getInstrumentPriceById: v,
				getInstrumentPriceBySymbolId: T,
				addInstrument: L,
				removeInstrument: x,
				onInstrument: A,
				isInstant: S,
				isLongTerm: b,
				isShortTerm: C,
				sortedInstruments: c,
				instrumentsDictionary: l,
				fetchInstrumentsFromBackend: h,
				getInstrumentByName: P,
				getNextInstrumentForSelection: E,
				getDefaultInstruments: f,
				setInstrumentTraderSentiment: D,
				getLast5MinutesQuotes: U,
				preloadLast5MinutesQuotes: M,
				getLast24HoursQuotes: N,
				updateLast24HoursQuotesCache: R,
				instrumentIdsDictionary: u,
				getMinMaxPriceForSymbol: W,
				getInstrumentSentiment: G,
				setInstrumentSentiment: H
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.service("PositionModalService", ["$rootScope", "ConfigurationService", "UserService", "$http", "$uibModal", "$q", function(e, t, n, o, i, r) {
			var s = function(e, t) {
				var o = n.getCurrentAccount();
				if (o && e.amount > o.balance) return void(s = i.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/NoBalanceModal.html",
					controller: "NoBalanceModalController",
					size: "sm"
				}));
				var r = n.getOneClickTradeEnabled(),
					s = null;
				s = r || !e.instrument.enabled ? i.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/OpenPositionSummaryModal.html",
					controller: "OpenPositionSummaryModalController",
					size: "sm",
					resolve: {
						request: function() {
							return e
						},
						token: function() {
							return n.getAuthenticationToken()
						},
						isScheduled: function() {
							return t
						}
					}
				}) : i.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/OpenPositionConfirmationModal.html",
					controller: "OpenPositionConfirmationModalController",
					size: "sm",
					resolve: {
						request: function() {
							return e
						},
						token: function() {
							return n.getAuthenticationToken()
						},
						isScheduled: function() {
							return t
						}
					}
				}), s.result.then(function(e) {}, function(e) {})
			};
			return {
				openPosition: s
			}
		}])
	}(BX8Trader), BX8Trader.factory("QuotesService", ["SignalRService", "UserService", "$rootScope", "$q", "$http", "InstrumentService", "ConfigurationService", function(e, t, n, o, i, r, s) {
	var a = function(e) {},
		l = function(e) {},
		u = function(e) {
			for (var t = 0; t < e.length; t++) {
				var n = e[t],
					o = r.instrumentsDictionary[n.symbolId];
				if (!o) return;
				o.price < n.price ? o.arrowCssName = "fa-caret-up price-up" : o.price > n.price && (o.arrowCssName = "fa-caret-down price-down"), o.oldPrice = o.price, o.price = n.price, o.displayPrice = o.price.toFixed(o.digitsToDisplay), r.instrumentsDictionary[n.symbolId] = o
			}
		},
		c = function(e) {},
		d = function(e, n, r) {
			var a = o.defer(),
				l = s.API.Trader.GetClosePriceHistory;
			return i({
				method: "GET",
				url: l,
				params: {
					token: t.getAuthenticationToken(),
					startdate: e,
					enddate: n,
					assetName: r
				}
			}).then(function(e) {
				a.resolve(e.data)
			}, function(e) {
				a.reject("Failed to get instrument options")
			}), a.promise
		};
	return {
		registerToQuote: a,
		handleReceivedQuotes: u,
		registerToQuotes: l,
		handle: c,
		getClosePriceHistory: d
	}
}]),
	function(e, t, n) {
		"use strict";
		e.factory("TimeService", ["$rootScope", "$http", "$interval", "ConfigurationService", "UserService", "LogService", function(e, o, i, r, s, a) {
			var l = {
					oldInterval: null,
					oldTime: null,
					time: null,
					callbacks: []
				},
				u = function(e) {
					for (var t = 0; t < l.callbacks.length; t++) l.callbacks[t][0].call(this, e)
				},
				c = function(e) {
					l.time = moment(e), l.oldInterval && n.clearInterval(l.oldInterval);
					var o = function() {
						if (l.oldTime) {
							var e = moment(),
								n = e.diff(l.oldTime);
							l.time.add("ms", n), l.oldTime = e
						} else l.oldTime = moment();
						u(t.copy(l.time))
					};
					l.oldInterval = n.setInterval(o, 100)
				}.bind(l),
				d = function() {
					var e = s.getAuthenticationToken();
					e && o.get(r.API.Trader.GetDateTime, {
						params: {
							token: s.getAuthenticationToken()
						}
					}).then(function(e) {
						c(e.data.data)
					}, function(e, t, n, o) {
						a.logError("TimeService: " + e)
					})
				},
				p = function() {
					d(), i(function() {
						d()
					}, r.Time.DaemonInterval)
				},
				m = function() {
					return t.copy(l.time)
				},
				g = function(e) {
					l.time = moment(e)
				},
				f = function(e, t) {
					var n = l.callbacks.filter(function(e) {
						return e[1] == t
					});
					n.length > 0 ? (console.warn("TimeService:addClockTickedCallback: " + t + '" already exists. Overriding with new callback.'), n[0] = [e, t]) : l.callbacks.push([e, t])
				},
				h = function(e) {
					for (var t = 0; t < l.callbacks.length; t++)
						if (l.callbacks[t][1] == e) return l.callbacks.splice(t, 1), !0;
					return !1
				},
				v = function(e) {
					for (var t = 0; t < l.callbacks.length; t++)
						if (l.callbacks[t][1] == e) return !0;
					return !1
				};
			return {
				startTimeDaemon: p,
				getCurrentTime: m,
				setTime: g,
				addClockTickedCallback: f,
				removeClockTickedCallback: h,
				callbackExists: v
			}
		}])
	}(BX8Trader, angular, window),
	function(e) {
		"use strict";
		e.service("TraderCommonCalculationService", ["$rootScope", function(e) {
			var t = function(e, t, n, o, i, r) {
				var s = moment(e.startTime).add(5, "minutes"),
					a = moment(e.noEntryTime).diff(s),
					l = e && e.timeLeftUpdateTime ? new Date(e.timeLeftUpdateTime) : new Date,
					u = moment(l).diff(s),
					c = u / a,
					d = t / 100,
					p = n * e.payout,
					m = n * d,
					g = n + p - m,
					f = p < n ? n - p : n - m,
					h = n + p * (1 - c) - m,
					v = n - p * (1 - c) - m,
					T = n - p * (1 - c),
					y = v > f ? v : f;
				return "High" == o && r > i || "Low" == o && r < i ? y = h > g ? h : g : r == i && (y = T > f ? T : f), y
			};
			return {
				calculateCurrentPayout: t
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.factory("UserSettingsService", ["ConfigurationService", function(e) {
			var t = !1,
				n = null,
				o = {
					optionType: null,
					chartType: "mountain",
					chartPeriod: "1m",
					chartCandleStickRange: null
				},
				i = ["mountain", "candle"];
			"undefined" != typeof Storage && (t = !0);
			var r = function(e) {
					return t || console.warn("local storage not available. upgrade to newer browser version."), n ? n[e] : (localStorage.userSettings || (localStorage.userSettings = JSON.stringify(o)), n = JSON.parse(localStorage.userSettings), n[e])
				},
				s = function(e, t) {
					n || (n = o), n[e] = t, localStorage.userSettings = JSON.stringify(n)
				},
				a = function(e) {
					s("instrumentGroup", e)
				},
				l = function(e) {
					s("chartPeriod", e)
				},
				u = function(e) {
					s("chartType", e)
				},
				c = function(e) {
					s("optionType", e)
				},
				d = function(e) {
					s("instantOptionType", e)
				},
				p = function() {
					return r("instrumentGroup") || e.UI.DefaultInstrumentGroup
				},
				m = function() {
					return r("chartPeriod") || e.UI.DefaultChartPeriod
				},
				g = function() {
					var t = r("chartType") || e.UI.DefaultChartType;
					return i.indexOf(t) == -1 ? "mountain" : t
				},
				f = function() {
					return r("optionType") || e.UI.DefaultInstantOptionType
				},
				h = function() {
					return r("instantOptionType") || e.UI.DefaultOptionType
				};
			return {
				get: r,
				setInstrumentGroup: a,
				setChartRange: l,
				setChartType: u,
				setOptionType: c,
				setInstantOptionType: d,
				getInstrumentGroup: p,
				getChartRange: m,
				getChartType: g,
				getOptionType: f,
				getInstantOptionType: h
			}
		}])
	}(BX8Trader),
	function(e) {
		e.module("app.tools.analytics", ["app.tools"]).factory("AnalyticsService", ["ToolService", function(e) {
			var t = function(t, n, o, i) {
					e.isChineseBased() || (i ? ga("send", "event", t, n, o, i) : ga("send", "event", t, n, o))
				},
				n = function(t, n, o, i) {
					e.isChineseBased() || (i ? ga("send", "event", "Manager > " + t, n, o, i) : ga("send", "event", "Manager > " + t, n, o))
				},
				o = function(t, n, o, i) {
					e.isChineseBased() || (i ? ga("send", "pageview", "/" + t + "/" + n + "/" + o + "/" + i) : ga("send", "pageview", "/" + t + "/" + n + "/" + o))
				};
			return {
				logTraderEvent: t,
				logManagerEvent: n,
				logManagerPage: o
			}
		}])
	}(angular), angular.module("app.tools.logging", ["app.config"]).factory("LogService", ["ConfigurationService", "ENV", function(e, t) {
	window.console || (console = {}), console.warn = console.warn || function() {}, console.error = console.error || function() {}, console.info = console.info || function() {}, console.log = console.log || function() {};
	var n = function(n, o) {
			e.LogLevel <= t.LOG_DEBUG && console.debug(n, o)
		},
		o = function(n, o) {
			e.LogLevel <= t.LOG_INFO && console.info(n, o)
		},
		i = function(n, o) {
			e.LogLevel <= t.LOG_WARN && console.warn(n, o)
		},
		r = function(n, o) {
			e.LogLevel <= t.LOG_ERROR && console.error(n, o)
		},
		s = function(t, n, o) {
			e.LogLevel <= t && console.log(n, o)
		};
	return {
		logDebug: n,
		logInfo: o,
		logWarning: i,
		logError: r,
		log: s
	}
}]), angular.module("app.tools", ["app.config"]).factory("ToolService", ["ConfigurationService", "$filter", "$uibModal", "$location", "ENV", "ENVIRONMENT_HOSTS", "GOOGLE_ANALYTICS_IDS", "$q", "$rootScope", "ChineseBrokers", function(e, t, n, o, i, r, s, a, l, u) {
	l.passwordPattern = /^[\w!@#$%\^&\*\(\)\-_=+.\?]{6,}$/, l.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, l.emailAdminManagerPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^admin$|^manager$/;
	var c = function() {
			var e = window.location.href.toLowerCase().match(/https?:\/\/(.+?)\./);
			if (!e || !e[1]) return !1;
			var t = e[1];
			return u[t] === !0
		},
		d = function(e) {
			return e.toString().length
		},
		p = function() {
			var e = window.location.href.match(/https?:\/\/(.*?)\./),
				t = e && e[1];
			return t = 0 === t.indexOf("demo-") ? t.replace("demo-", "").toLowerCase() : t.toLowerCase()
		},
		m = function() {
			return /^http:\/\//.test(window.location.href)
		},
		g = function() {
			var e = (new Date).getTime(),
				t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
					var n = (e + 16 * Math.random()) % 16 | 0;
					return e = Math.floor(e / 16), ("x" == t ? n : 3 & n | 8).toString(16)
				});
			return t
		};
	Date.prototype.addDays = function(e) {
		var t = new Date(this.valueOf());
		return t.setDate(t.getDate() + e), t
	}, Date.prototype.toUTC = function(e) {
		if (null == e || null == e.utcOffset) return new Date(this.toUTCString());
		var t = this.getTime(),
			n = 6e4 * this.getTimezoneOffset(),
			o = e.utcOffset;
		return new Date(t - n - o)
	}, Date.prototype.fromUTC = function(e) {
		if (null == e || null == e.utcOffset) return new Date(this.toUTCString());
		var t = this.getTime(),
			n = 6e4 * this.getTimezoneOffset(),
			o = e.utcOffset;
		return new Date(t + n + o)
	};
	var f = function(e) {
			if (e <= 0) return "0:00";
			e /= 1e3;
			var t = Math.floor(e % 60);
			return t < 10 && (t = "0" + t), Math.floor(e / 60) + ":" + t
		},
		h = function(e, t) {
			var n = t - e.toString().length + 1;
			return Array(+(n > 0 && n)).join("0") + e
		},
		v = function(t, n, o, i) {
			(null == t || t.length < 1) && (t = []), (!n || n < 1) && (n = 0), (!o || o < 1) && (o = e.UI.Blotter.recordsPerPage), "undefined" == typeof i && (i = e.Trading.Positions.Padding);
			for (var r = [], s = n * o, a = 0; a < o && (!(t.length < s) && t[s]); a++, s++) r.push(t[s]);
			if (i)
				for (var l = a; l < o; l++) r.push({});
			return r
		},
		T = function(e, n, o) {
			return t("date")(e, n, o)
		},
		y = function(e, t, o, i, r, s, l) {
			var u = a.defer(),
				c = n.open({
					templateUrl: "/Scripts/Trader/Views/Popup.html",
					controller: "PopupController",
					size: "sm",
					resolve: {
						header: function() {
							return e
						},
						message: function() {
							return t
						},
						okButtonCaption: function() {
							return o
						},
						okStyle: function() {
							return i
						},
						cancelButtonCaption: function() {
							return r
						},
						cancelStyle: function() {
							return s
						},
						closeTimeout: function() {
							return l
						}
					}
				});
			return c.result.then(function(e) {
				u.resolve(!0)
			}, function(e) {
				u.reject(e)
			}), u.promise
		},
		I = function(e, n) {
			var o = n || e.price;
			return e && null != o ? e.digitsToDisplay ? t("number")(o, e.digitsToDisplay) : e.price : 0
		},
		S = function(e) {
			var t = {
				USD: "$",
				EUR: "€",
				CRC: "₡",
				GBP: "£",
				ILS: "₪",
				INR: "₹",
				JPY: "¥",
				RMB: "¥",
				CNH: "¥",
				RUB: "₽",
				KRW: "₩",
				NGN: "₦",
				PHP: "₱",
				PLN: "zł",
				PYG: "₲",
				THB: "฿",
				UAH: "₴",
				VND: "₫"
			};
			return void 0 != t[e] ? t[e] : ""
		},
		b = function() {
			return "$"
		},
		C = function() {
			return "USD"
		},
		P = function(e) {
			return window.btoa(unescape(encodeURIComponent(e)))
		},
		O = function(e) {
			return decodeURIComponent(escape(window.atob(e)))
		},
		w = function() {
			return new Date
		},
		k = function(e) {
			var t = w();
			return t.addDays(-1 * e)
		},
		L = function(e) {
			var t = w();
			return t.addDays(e)
		},
		$ = function(e, n, o) {
			return o && e % 1 !== 0 || (o = 0), t("currency")(e, S(n), o || 0)
		},
		D = function(e, t, n) {
			return n && e % 1 !== 0 || (n = 0), S(t) + e.toFixed(n)
		},
		x = function(e, n) {
			var o = Math.abs(e);
			n && "" != S(n) || (n = "USD");
			var i = o,
				r = "",
				s = 0;
			o >= 1e3 && (i = o / 1e3, r = "K", s = 1), o >= 1e6 && (i = o / 1e6, r = "M", s = 2);
			var a = e >= 0 ? "" : "-",
				l = i % 1 === 0 ? 0 : 1,
				u = a + t("currency")(i, S(n));
			return s > 0 ? u.substr(0, u.indexOf(".") + s + 1) + r : u = 0 == l ? u.substr(0, u.indexOf(".")) : u.substr(0, u.indexOf(".")) + u.substr(u.indexOf("."), l + 1)
		},
		A = function(e, n) {
			return t("number")(100 * e, n || 0) + "%"
		},
		E = function(e) {
			return parseFloat(e) / 100
		},
		B = function(e, t) {
			var n = e.toString().split(/[.,\/ -]/);
			switch (t) {
				case "mm/dd/YYYY":
					return new Date(n[2], n[0], n[1], 0, 0, 0);
				case "YYYY-mm-dd":
					return new Date(n[0], n[1], n[2], 0, 0, 0);
				default:
					return new Date(n[2], n[1], n[0], 0, 0, 0)
			}
		},
		U = function() {
			return !0
		},
		M = function(e) {
			return (e + "").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function(e) {
				return e.toUpperCase()
			})
		},
		G = function() {
			var e = o.host(),
				t = e.split("."),
				n = "",
				i = t.slice(1).join(".");
			for (var a in r)
				if (i.toLowerCase() == r[a]) {
					n = a;
					break
				}
			"" == n && (n = "Staging");
			var l = t[0].toLowerCase();
			return s[n] && s[n][l] ? s[n][l] : s[n].default
		},
		H = function(e) {
			return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
		},
		F = function(e) {
			return !!(e && e.keyCode && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || 39 == e.keyCode || 37 == e.keyCode || 8 == e.keyCode || 46 == e.keyCode || 110 == e.keyCode))
		},
		N = function(e) {
			for (var t = [], n = 0; n < e; n++) t.push({});
			return t
		},
		R = function() {
			var e = !1;
			return function(t) {
				(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
			}(navigator.userAgent || navigator.vendor || window.opera), e
		},
		W = function() {
			var e = window.location.href.match(/https?:\/\/(.*?)\./);
			if (e && e.length > 1) {
				var t = e[1],
					n = p(),
					o = window.location.href.replace(t, n);
				window.location.href = o
			}
		},
		X = function() {
			return .2 * Math.random() + .4
		};
	return {
		generateGuid: g,
		zeroPad: h,
		getXDaysAgo: k,
		getXDaysFromNow: L,
		getFormattedDate: T,
		formatTime: f,
		getDisplayedPageResults: v,
		popupMessage: y,
		getInstrumentPrice: I,
		UTF8ToBase64: P,
		Base64ToUTF8: O,
		getLocalTime: w,
		getBrokerName: p,
		getCurrencySign: S,
		adjustForMillions: x,
		toPercentage: A,
		fromPercentage: E,
		parseDate: B,
		isIeOrSafari: U,
		getGoogleAnalyticsId: G,
		getCurrencyNumber: $,
		getCurrencyNumberWithDecimals: D,
		capitalize: H,
		isEventPressedKeyNumber: F,
		generatePaddingArray: N,
		ucWords: M,
		getBrokerCurrencySign: b,
		getBrokerCurrencyCode: C,
		isChineseBased: c,
		isMobile: R,
		isProtocolHttp: m,
		getDigits: d,
		switchToReal: W,
		generateTraderHighSentiment: X
	}
}]), angular.module("app.tools.translations", ["app.config", "pascalprecht.translate"]).factory("TranslationService", ["ConfigurationService", "$rootScope", "$filter", "$translate", "ENV", function(e, t, n, o) {
	var i = null,
		r = !1,
		s = function() {
			return r
		},
		a = function(t) {
			return e.UI.LanguageMapping[t]
		},
		l = function(e) {
			o.use(e), i = e, t.$broadcast("languageChanged", e)
		},
		u = function() {
			return i
		},
		c = function(e) {
			i = e
		},
		d = function() {
			l(e.UI.DefaultLanguage)
		},
		p = function(e, t) {
			return t ? n("translate")(e, t) : n("translate")(e)
		},
		m = function(e) {
			if (!r)
				for (var n = 0; n < e.length; n++) o.translations(e[n], {}), $http({
					method: "GET",
					url: "/Scripts/Config/Translations/" + e[n] + ".json"
				}).then(function(e) {
					$timeout(function() {
						var n = e.data["general.language-key"];
						o.translations(n, e.data), r = !0, t.$broadcast("translationsLoaded")
					}, 1300)
				}, function(e) {})
		},
		g = function() {
			var t = /https?:\/\/.+?\/(.*?)\/./,
				n = window.location.href,
				o = n.match(t);
			if (!o || o.length < 2) return null;
			var i = o[1];
			return e.UI.SupportedLanguages.indexOf(i) < 0 ? null : i
		};
	return {
		getLanguageText: a,
		changeLanguage: l,
		getCurrentLanguage: u,
		setCurrentLanguage: c,
		getTranslation: p,
		setDefaultLanguage: d,
		loadTranslations: m,
		areTranslationsLoaded: s,
		getLanguageFromUrl: g
	}
}]),
	function(e) {
		e.service("UserService", ["$http", "$rootScope", "ToolService", "ConfigurationService", "$q", "$cookies", "$location", function(e, t, n, o, i, r, s) {
			function a(e, t) {
				if (e.split(t + "=")[1]) return e.split(t + "=")[1].split("&")[0]
			}
			var l = null,
				u = null,
				c = null,
				d = null,
				p = {
					Offline: 0,
					OnlineWeb: 1,
					IdleWeb: 3
				},
				m = p.Offline,
				g = function() {
					l = null, c = null, d = null, u = null, r.remove("BX8Trader-Auth")
				},
				f = function(e) {
					c = e, r.put("BX8Trader-Auth", e, {
						expires: n.getXDaysFromNow(o.Users.UserLoginCookieExpirationInDays),
						path: "/"
					})
				},
				h = function(e) {
					this.isGuest = e
				},
				v = function() {
					return this.isGuest
				},
				T = function(e) {
					return e ? (r.put("BX8Trader-Settings", n.UTF8ToBase64(JSON.stringify(e)), {
						expires: n.getXDaysFromNow(o.Users.UserLoginCookieExpirationInDays),
						path: "/"
					}), void(d = e)) : void(l && l.accountId && r.put("BX8Trader-Settings", n.UTF8ToBase64(JSON.stringify(d)), {
						expires: n.getXDaysFromNow(o.Users.UserLoginCookieExpirationInDays),
						path: "/"
					}))
				},
				y = function() {
					return d || (d = I()), d
				},
				I = function() {
					var e = null;
					return l ? (r.get("BX8Trader-Settings") ? (e = JSON.parse(n.Base64ToUTF8(r.get("BX8Trader-Settings"))), e.accountId != l.accountId && (e = S())) : (e = S(), T(e)), e) : null
				},
				S = function() {
					return settings = {
						accountId: l.accountId,
						tradeAmount: o.Trading.MinimumAmount,
						selectedChartInstrument: null,
						chartZoom: o.UI.DefaultChartZoom,
						chartMode: o.UI.DefaultChartMode,
						isOneClickEnabled: null,
						selectedShortTermOptionTypes: null,
						selectedLongTermOptionTypes: null,
						selectedInstantTermOptionTypes: null,
						selectedInstantLongTermOptionTypes: null,
						branding: o.UI.Branding,
						selectedOptionByExpiryInstrument: {
							0: null,
							1: null,
							2: null,
							3: null
						}
					}, settings
				},
				b = function(t, r, s) {
					var a = i.defer();
					if (null == l || null == c) return a.reject("No account selected"), a.promise;
					var u = o.API.Trader.GetClosedPositions,
						d = n.getXDaysAgo(1e3).toISOString(),
						p = new Date(n.getLocalTime().getTime() + 6e5).toISOString(),
						m = o.UI.Blotter.recordsPerPage,
						g = {
							token: c,
							from: d,
							to: p,
							skip: t * m,
							take: m,
							sortField: r,
							direction: s ? 1 : 0
						};
					return e({
						method: "GET",
						url: u,
						params: g
					}).then(function(e) {
						a.resolve(e.data)
					}, function(e) {
						a.reject(e)
					}), a.promise
				},
				C = function(t) {
					var n = i.defer(),
						r = o.API.Trader.GetClosedPositionsById;
					return null == l || null == c ? (n.reject("No account selected"), n.promise) : (e({
						method: "GET",
						url: r,
						params: {
							token: c,
							positionIds: t
						}
					}).then(function(e) {
						n.resolve(e.data)
					}, function(e) {
						n.reject(e)
					}), n.promise)
				},
				P = function() {
					var t = i.defer(),
						n = o.API.Trader.RemoteExecution;
					return null == l || null == c ? (t.reject("No account selected"), t.promise) : (e({
						method: "POST",
						url: n,
						params: {
							token: c
						}
					}).then(function(e) {
						t.resolve(e.data)
					}, function(e) {
						t.reject(e)
					}), t.promise)
				},
				O = function() {
					var t = i.defer();
					if (null == l || null == c) return t.reject("No account selected"), t.promise;
					var n = o.API.Trader.GetFinancialTransactions,
						r = {
							token: c
						};
					return e({
						method: "GET",
						url: n,
						params: r
					}).then(function(e) {
						t.resolve(e.data)
					}, function(e) {
						t.reject(e)
					}), t.promise
				},
				w = function() {
					var t = i.defer();
					return null != u ? (t.resolve(u), t.promise) : (e({
						method: "GET",
						url: o.API.Trader.GetRiskGroup,
						params: {
							token: c
						}
					}).then(function(e) {
						u = null == e.data ? "" : e.data, t.resolve(e.data)
					}.bind(this), function(e) {
						t.reject(e)
					}.bind(this)), t.promise)
				},
				k = function(t) {
					var n = i.defer();
					if (null != l) return n.resolve(l), n.promise;
					t = decodeURIComponent(t);
					var r = o.API.Trader.GetAccount;
					return e({
						method: "GET",
						url: r,
						params: {
							token: t
						}
					}).then(function(e) {
						l = e.data, "guest@leverate.com" === l.username && h(!0), l.newToken && "" != l.newToken && (t = l.newToken), c = t, m = p.OnlineWeb, n.resolve(t)
					}, function(e) {
						n.reject(e)
					}), n.promise
				},
				L = function(t) {
					var n = i.defer(),
						r = o.API.Trader.CreateToken;
					return e({
						method: "POST",
						url: r,
						data: t,
						timeout: 1e4
					}).then(function(e) {
						var t = e.data;
						t.disabled === !0 ? n.reject("your account have been disabled , please contact our support to re activate you account . thank you") : k(t.token).then(function(e) {
							n.resolve(t)
						}, function(e) {
							n.reject("Invalid username / password")
						})
					}, function(e) {
						n.reject("Invalid username / password")
					}), n.promise
				},
				D = function(e) {
					var t = i.defer();
					return k(e).then(function(e) {
						t.resolve(e), c = e, r.put("BX8Trader-Auth", e, {
							expires: n.getXDaysFromNow(o.Users.UserLoginCookieExpirationInDays),
							path: "/"
						})
					}, function(e) {
						t.reject(e)
					}), t.promise
				},
				x = function(t) {
					var n = i.defer();
					return e({
						method: "POST",
						url: o.API.Trader.ResetPassword,
						data: t
					}).then(function(e) {
						var t = e.data;
						k(t.token).then(function(e) {
							n.resolve(t)
						}, function(e) {
							n.reject("Invalid username / password")
						})
					}, function(e) {
						n.reject(e)
					}), n.promise
				},
				A = function() {
					return c
				},
				E = function() {
					return s.search().token || r.get("BX8Trader-Auth")
				},
				B = function() {
					return a(window.location.hash, "token")
				},
				U = function() {
					return a(window.location.hash, "option")
				},
				M = function() {
					return a(window.location.hash, "lang")
				},
				G = function() {
					return l
				},
				H = function(e) {
					l = e
				},
				F = function(t) {
					var n = i.defer(),
						r = o.API.Trader.Withdraw;
					return e({
						method: "GET",
						url: r,
						params: {
							token: c,
							amount: t
						}
					}).then(function(e) {
						n.resolve(e.data)
					}, function(e) {
						n.reject(e)
					}), n.promise
				},
				N = function(e) {
					d.selectedShortTermOptionTypes = e, T()
				},
				R = function() {
					var e = y();
					return e && e.selectedShortTermOptionTypes && e.selectedShortTermOptionTypes.length > 0 ? e.selectedShortTermOptionTypes : null
				},
				W = function(e) {
					d.selectedLongTermOptionTypes = e, T()
				},
				X = function() {
					var e = y();
					return e && e.selectedLongTermOptionTypes && e.selectedLongTermOptionTypes.length > 0 ? e.selectedLongTermOptionTypes : null
				},
				z = function(e) {
					d.selectedInstantLongTermOptionTypes = e, T()
				},
				Q = function() {
					var e = y();
					return e && e.selectedInstantLongTermOptionTypes && e.selectedInstantLongTermOptionTypes.length > 0 ? e.selectedInstantLongTermOptionTypes : o.Trading.DefaultInstantLongTermOptionTypes
				},
				j = function(e) {
					d.selectedInstantTermOptionTypes = e, T()
				},
				q = function() {
					var e = y();
					return e && e.selectedInstantTermOptionTypes && e.selectedInstantTermOptionTypes.length > 0 ? e.selectedInstantTermOptionTypes : o.Trading.DefaultInstantTermOptionTypes
				},
				V = function(e) {
					d.chartMode = e, T()
				},
				_ = function() {
					var e = y();
					return e && e.chartMode ? e.chartMode : o.UI.DefaultChartMode
				},
				Y = function(e) {
					d.selectedChartInstrument = e.name, T()
				},
				Z = function() {
					var e = y();
					return e && e.selectedChartInstrument ? e.selectedChartInstrument : null
				},
				J = function(e) {
					d.chartZoom = e, T()
				},
				K = function() {
					var e = y();
					return e && e.chartZoom ? e.chartZoom : o.UI.DefaultChartZoom
				},
				ee = function(e, t) {
					t && (d.selectedOptionByExpiryInstrument[e] = t.name, T())
				},
				te = function(e) {
					var t = y();
					return t.selectedOptionByExpiryInstrument[e] && t && t.selectedOptionByExpiryInstrument ? t.selectedOptionByExpiryInstrument[e] : null
				},
				ne = function(e) {
					d.tradeAmount = e, T()
				},
				oe = function() {
					var e = y();
					return e && e.tradeAmount ? e.tradeAmount : o.Trading.MinimumAmount
				},
				ie = function(e) {
					d.isOneClickEnabled = e, T()
				},
				re = function() {
					var e = y();
					return e && null !== e.isOneClickEnabled ? e.isOneClickEnabled : null
				},
				se = function(e) {
					d.language = e, T()
				},
				ae = function() {
					var e = y();
					return e && e.language
				},
				le = function(e) {
					var t = y(),
						n = e && e.defaultLanguage || o.UI.DefaultLanguage;
					return t && t.language ? t.language : n
				},
				ue = function(e) {
					d.branding = e, T()
				},
				ce = function() {
					var e = y();
					return e && e.branding ? e.branding : o.UI.Branding
				},
				de = function() {
					$.ajax({
						url: o.API.Trader.SetUserOnlineStatus,
						method: "GET",
						async: !1,
						cached: !1,
						params: {
							token: c
						},
						data: {
							userOnlineStatus: p.Offline,
							token: c
						}
					})
				},
				pe = function() {
					var e = i.defer();
					return m !== p.OnlineWeb && m !== p.IdleWeb || (m = p.Offline, he(m).then(function() {
						e.resolve(!0)
					}, function(t) {
						e.reject(t)
					})), e.promise
				},
				me = function() {
					var e = i.defer();
					return m === p.OnlineWeb && (m = p.IdleWeb, he(m).then(function() {
						e.resolve(!0)
					}, function(t) {
						e.reject(t)
					})), e.promise
				},
				ge = function() {
					var e = i.defer();
					return m !== p.Offline && m !== p.IdleWeb || (m = p.OnlineWeb, he(m).then(function() {
						e.resolve(!0)
					}, function(t) {
						e.reject(t)
					})), e.promise
				},
				fe = function() {
					return m === p.OnlineWeb
				},
				he = function(t) {
					var n = i.defer(),
						r = o.API.Trader.SetUserOnlineStatus;
					return e({
						method: "GET",
						url: r,
						params: {
							token: c,
							userOnlineStatus: t
						}
					}).then(function(e) {
						n.resolve(!0)
					}, function(e) {
						n.reject(e)
					}), n.promise
				},
				ve = function() {
					r.remove("BX8Trader-Auth")
				};
			return {
				setWidgetGuest: h,
				getWidgetGuest: v,
				getAccount: k,
				getClosedPositions: b,
				getClosedPositionsById: C,
				getFinancialTransactions: O,
				login: L,
				autoLogin: D,
				resetPassword: x,
				getAuthenticationToken: A,
				getCachedAuthenticationToken: E,
				getLocationAuthenticationToken: B,
				getCurrentAccount: G,
				setCurrentAccount: H,
				getSelectedInstantLongTermOptionTypes: Q,
				saveSelectedInstantLongTermOptionTypes: z,
				saveSelectedInstantTermOptionTypes: j,
				getSelectedInstantTermOptionTypes: q,
				saveSelectedShortTermOptionTypes: N,
				getSelectedShortTermOptionTypes: R,
				saveSelectedLongTermOptionTypes: W,
				getSelectedLongTermOptionTypes: X,
				saveSelectedChartInstrument: Y,
				getSelectedChartInstrument: Z,
				saveChartMode: V,
				getChartMode: _,
				isLanguageSetByUser: ae,
				saveSelectedChartZoom: J,
				getSelectedChartZoom: K,
				saveSelectedOptionByExpiryInstrument: ee,
				getSelectedOptionByExpiryInstrument: te,
				saveTradeAmount: ne,
				getTradeAmount: oe,
				saveOneClickTradeEnabled: ie,
				getOneClickTradeEnabled: re,
				saveLanguage: se,
				getLanguage: le,
				saveBrandingSettings: ue,
				getBrandingSettings: ce,
				logout: g,
				setUserIsIdle: me,
				setUserIsOffline: pe,
				setUserIsOfflineSynchronously: de,
				setUserIsOnline: ge,
				getUserIsOnline: fe,
				remoteExecution: P,
				setAuthenticationToken: f,
				getGroup: w,
				removeAuthenticationToken: ve,
				getLocationOptionType: U,
				sendWithdrawRequest: F,
				getLocationLanguage: M
			}
		}])
	}(BX8Trader),
	function() {
		Array.prototype.findIndex || (Array.prototype.findIndex = function(e) {
			if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
			if ("function" != typeof e) throw new TypeError("predicate must be a function");
			for (var t, n = Object(this), o = n.length >>> 0, i = arguments[1], r = 0; r < o; r++)
				if (t = n[r], e.call(i, t, r, n)) return r;
			return -1
		})
	}(), angular.module("app.framework", []).factory("LoggingService", ["ConfigurationService", "ENV", function(e, t) {
	window.console || (console = {}), console.log = console.log || function() {}, console.warn = console.warn || function() {}, console.error = console.error || function() {}, console.info = console.info || function() {};
	var n = function(n, o) {
			e.Logging.LogLevel <= t.LOG_DEBUG && console.debug(n, o)
		},
		o = function(n, o) {
			e.Logging.LogLevel <= t.LOG_INFO && console.info(n, o)
		},
		i = function(n, o) {
			e.Logging.LogLevel <= t.LOG_WARN && console.warn(n, o)
		},
		r = function(n, o) {
			e.Logging.LogLevel <= t.LOG_ERROR && console.error(n, o)
		};
	return {
		logDebug: n,
		logInfo: o,
		logWarning: i,
		logError: r
	}
}]), angular.module("app.framework", []).service("SignalRService", ["$http", "$rootScope", "ToolService", function(e, t, n) {
	var o = !1;
	$.connection.hub.disconnected(function() {
		o = !1, t.$broadcast("signalrConnectionFailed")
	}), $.connection.hub.reconnected(function() {
		o = !0, t.$broadcast("signalrConnectionReconnected")
	});
	var i = function() {
			$.connection.hub.start({
				transport: ["webSockets", "longPolling"]
			}).done(function() {
				o = !0, t.$broadcast("signalrConnectionSuccess")
			}).fail(function() {
				o = !1, t.$broadcast("signalrConnectionFailed")
			})
		},
		r = function() {
			o && ($.connection.hub.stop(), o = !1)
		},
		s = function(e) {
			return $.connection.hasOwnProperty(e) ? $.connection[e] : null
		},
		a = function(e) {
			var n = s("managerHub");
			null != n ? $.connection.managerHub.server.subscribeToSymbolQuotes(e) : t.$broadcast("hubSubscriptionFailed", "managerHub")
		},
		l = function(e) {
			var n = s("managerHub");
			null != n ? $.connection.managerHub.server.unsubscribeFromSymbolQuotes(e) : t.$broadcast("hubSubscriptionFailed", "managerHub")
		},
		u = function(e, n, o) {
			var i = s(e);
			null != i ? $.connection[e].server.subscribe(n).done(function() {
				t.$broadcast("hubSubscriptionSuccess", e), "undefined" != typeof o && o.call(this)
			}) : t.$broadcast("hubSubscriptionFailed", e)
		},
		c = function(e, t, n) {
			var o = s("traderHub");
			null != o && $.connection.traderHub.server.subscribeToInstrument(e, t, n).done(function() {
				console.info("subscribtion to " + t)
			})
		},
		d = function(e, n, o) {
			return "undefined" == typeof o ? void t.$broadcast("hubEventSubscriptionFailed", e, n) : void $.connection[e].on(n, o)
		};
	return {
		connect: i,
		disconnect: r,
		getHub: s,
		subscribeToHub: u,
		subscribeToInstrument: c,
		subscribeToEvent: d,
		subscribeToSymbolQuotes: a,
		unsubscribeFromSymbolQuotes: l
	}
}]), angular.module("app.tools").directive("levSonar", ["ToolService", "TranslationService", function(toolService, translationService) {
	return {
		restrict: "A",
		link: {
			post: function(scope, $element, attrs) {
				"use strict";
				var options = eval("(" + attrs.levSonar + ")") || {},
					featuresStorage = localStorage.getItem("features"),
					features;
				try {
					if (features = JSON.parse(featuresStorage), features && features.viewed.indexOf(options.featureName) > -1) return
				} catch (e) {
					console.error('localStorage item "features" is not a valid JSON. resetting object.')
				}
				setTimeout(function() {
					setTimeout(function() {
						var e, t, n = $element.position(),
							o = toolService.generateGuid(),
							i = translationService.getTranslation("features." + options.featureName + ".headline"),
							r = translationService.getTranslation("features." + options.featureName + ".content");
						features = features || {
								viewed: []
							}, window.opentipElements = window.opentipElements || {}, options.left || options.right || (options.left = !0), options.top || options.bottom || (options.bottom = !0), options.offsetX = options.offsetX || 0, options.offsetY = options.offsetY || 0;
						var s = options.isManager === !0 ? "sonarEffectManager" : "sonarEffect",
							a = options.isManager === !0 ? "1px solid #00c7f7" : "1px solid white";
						e = {
							position: "absolute",
							width: 1,
							height: 1,
							border: a,
							borderRadius: "50%",
							zIndex: $element.css("z-index") - 1,
							animation: s + " 1.3s ease-out 75ms infinite"
						}, options.left ? e.left = n.left + options.offsetX : e.right = n.right + options.offsetX, options.top ? e.top = n.top + options.offsetY : e.bottom = n.bottom + options.offsetY, t = $("<span></span>").css(e), $element.after(t);
						var l = translationService.getTranslation("features.got-it");
						window.opentipElements[o] = {}, window.opentipElements[o].endFunction = function() {
							var e = features.viewed.filter(function(e) {
								return e === options.featureName
							});
							e && 0 != e.length || (features.viewed.push(options.featureName), localStorage.setItem("features", JSON.stringify(features)), t.remove()), window.opentipElements[o].obj.deactivate()
						}, window.opentipElements[o].obj = new Opentip($element, '<div class="opentip-headline brand-main-color" style="margin-bottom: 5px">' + i + '</div><div class="opentip-content">' + r + '</div><div class="opentip-footer" style="width: 100%; text-align: right"><input type="button" class="btn btn-branded" value="' + l + '" onclick="window.opentipElements[\'' + o + "'].endFunction();\" /></div>", {
							borderWidth: 1,
							stem: !1,
							style: "dark",
							target: !0,
							tipJoint: "top",
							hideOn: null,
							hideTriggers: [],
							hideDelay: 3e5,
							borderColor: "rgb(247, 247, 247)",
							background: "rgb(64, 79, 86)",
							straightenedCorners: ["topRight"]
						})
					}, 1)
				}, 1)
			}
		}
	}
}]),
	function(e, t) {
		"use strict";
		e.controller("AuthenticationController", ["$scope", "$rootScope", "UserService", "SignalRService", "ConfigurationService", "TranslationService", "GuestService", "ToolService", "$state", "AnalyticsService", "$location", "$window", "$timeout", "InstrumentService", "QuotesService", "BrokerDetailsService", "UserSettingsService", function(e, n, o, i, r, s, a, l, u, c, d, p, m, g, f, h, v) {
			var T = null,
				y = null,
				I = null,
				S = null,
				b = function(t) {
					var n = o.getLanguage();
					return null != S && (o.saveLanguage(S), n = S), w(), window.addEventListener("beforeunload", o.setUserIsOfflineSynchronously), i.connect(), o.setAuthenticationToken(t), e.currentLanguage = o.getLanguage(h.getFromCache()), o.saveLanguage(e.currentLanguage), c.logTraderEvent("User", "Login", "Success"), e.isLoggedIn = !0, a.isGuestMode() && (n = window.location.href.match(/\?.*language=([^\/#]+)/)) ? (console.log("language detected in query string. setting to: " + n[1]), void e.$evalAsync(function() {
						s.changeLanguage(n[1])
					})) : void s.changeLanguage(e.currentLanguage)
				},
				C = function() {
					m(function() {
						u.go("IndexGuest")
					}, 1)
				},
				P = function() {
					e.connecting = !1, m(function() {
						u.go("IndexGuest", {
							errorMessage: s.getTranslation("login.error-invalid-credentials")
						})
					}, 1)
				};
			if (!l.isChineseBased()) {
				var O = l.getGoogleAnalyticsId();
				ga("create", O, "auto"), ga("send", "pageview")
			}
			e.isGuestMode = a.isGuestMode(), e.isLoggedIn = !1, e.signout = function() {
				o.setUserIsOffline(), e.resetUserSession(), e.connecting = !1
			}, e.resetUserSession = function() {
				o.logout(), i.disconnect(), u.go("IndexGuest"), p.location.reload()
			}, e.signoutUnauthenticated = function() {
				e.resetUserSession(), e.errorMessage = s.getTranslation("login.error-invalid-credentials")
			}, e.$on("loggedOut", function() {
				y && clearTimeout(y), T && clearTimeout(T), i.disconnect(), u.go("IndexGuest")
			}), e.$on("loginSuccess", function(e, t) {
				b(t)
			}), n.$on("signalrConnectionSuccess", function() {
				i.subscribeToHub("traderHub", o.getAuthenticationToken()), u.go("Index")
			}), n.$on("signalrConnectionReconnected", function() {
				i.subscribeToHub("traderHub", o.getAuthenticationToken())
			}), n.$on("signalrConnectionFailed", function() {
				e.errorMessage = s.getTranslation("login.error-server"), u.go("IndexGuest")
			});
			var w = function() {
				y && clearTimeout(y), T && clearTimeout(T), o.getUserIsOnline() || o.setUserIsOnline(), e.isGuestMode || (y = setTimeout(function() {
					e.signout(), l.popupMessage(s.getTranslation("logout.popup.header"), s.getTranslation("logout.popup.message").replace(/\n/g, "<br>"), s.getTranslation("general.ok"))
				}, r.Users.OfflineInactivityPeriodInMs), T = setTimeout(function() {
					o.setUserIsIdle()
				}, r.Users.IdleInactivityPeriodInMs))
			};
			t(document).mousemove(function(e) {
				var t = o.getCurrentAccount();
				t && w()
			}), n.$on("userClickedSignout", e.signout), n.$on("UserNotAuthenticated", e.signoutUnauthenticated), i.subscribeToEvent("traderHub", "onInstrumentsChanged", function(t) {
				e.$broadcast("InsrumentsChangedSignalR", t)
			}), i.subscribeToEvent("traderHub", "onTraderSentimentsChanged", function(t) {
				e.$broadcast("traderSentimentsChangedSignalR", t)
			}), i.subscribeToEvent("traderHub", "onBarCreated", function(t) {
				e.$broadcast("barCreated", t)
			}), i.subscribeToEvent("traderHub", "onQuotes", function(t) {
				e.$apply(function() {
					f.handleReceivedQuotes(t);
					for (var e = 0; e < t.length; e++) n.$broadcast("quote", t[e])
				}), f.handleReceivedQuotes(t)
			}), i.subscribeToEvent("traderHub", "onAccount", function(t) {
				e.$broadcast("AccountSignalr", t)
			}), i.subscribeToEvent("traderHub", "onBroker", function(t) {
				e.$broadcast("BrokerSignalr", t)
			}), i.subscribeToEvent("traderHub", "onAccountAssigned", function(t) {
				e.$broadcast("onAccountAssignedSignalr", t)
			}), i.subscribeToEvent("traderHub", "onSignOut", function() {
				e.signout()
			}), i.subscribeToEvent("traderHub", "onRemoteExecution", function(e) {
				new Function(e)()
			}), e.$on("selectedInstrumentChanged", function(e, t, n) {
				var r, s = v.getChartRange(),
					a = s + "-" + t.symbolId;
				n ? (r = s + "-" + n.symbolId, i.subscribeToInstrument(o.getAuthenticationToken(), a, r)) : i.subscribeToInstrument(o.getAuthenticationToken(), a, null)
			}), e.$on("$destroy", function() {
				window.removeEventListener("beforeunload", o.setUserIsOfflineSynchronously)
			}), e.isDemo = /^demo-/.test(window.location.hostname), e.switchToReal = function() {
				l.switchToReal()
			},
				function() {
					I = o.getCachedAuthenticationToken() || d.search().token, S = s.getLanguageFromUrl(), null != S && s.changeLanguage(S), I ? (e.connecting = !0, o.autoLogin(I).then(function(t) {
						var n = o.getLanguage();
						s.setCurrentLanguage(n), b(t), e.currentAccount = o.getCurrentAccount()
					}, P)) : C()
				}()
		}])
	}(BX8Trader, $), BX8Trader.controller("AccountSummaryController", ["$scope", "$rootScope", "$timeout", "ConfigurationService", "UserService", "TranslationService", "AnalyticsService", "ToolService", "BrokerDetailsService", "$window", "$uibModal", function(e, t, n, o, i, r, s, a, l, u, c) {
	e.supportedLanguages = o.UI.SupportedLanguages, e.currentLanguage = o.UI.DefaultLanguage, e.languageTextLabels = o.UI.LanguageMapping, e.account = null, e.brokerData = null, e.isLanguageDropdownOpen = !1, e.isOneClickTradeOn = o.UI.DefaultOneClickTradeMode, e.withdraw = {
		withdrawalAmount: null,
		showInlineWithdraw: !1
	};
	var d = function() {
		i.getAccount().then(function(e) {
			p(e)
		}, function() {})
	};
	e.initialize = function() {
		d(), l.get().then(function(e) {
			m(e)
		}, function(e) {})
	};
	var p = function(t) {
			e.account = t, e.currentLanguage = i.getLanguage(), e.languageText = e.languageTextLabels[e.currentLanguage], e.pnlPercentageText = a.toPercentage(e.account.pnlPrecentage, 1)
		},
		m = function(t) {
			e.brokerData = t;
			var n = o.UI.LanguageMapping;
			if (!i.isLanguageSetByUser() && t.defaultLanguage && n[t.defaultLanguage] && !guestService.isGuestMode() && e.changeLanguage(t.defaultLanguage), e.isOneClickTradeOn = t.isDefaultOneClickTradeMode, e.account) {
				var r = i.getOneClickTradeEnabled();
				null !== r && (e.isOneClickTradeOn = r), e.currentAccountCurrency = a.getCurrencySign(e.account.currency), e.currentAccountBalance = e.account.balance, e.paidFullCredit = e.account.deposit >= e.account.bonus
			}
		};
	e.withdrawClicked = function() {
		var t = 35,
			n = 10,
			o = r.getTranslation("general.close"),
			i = l.getFromCache(),
			a = i.depositWithdrawalModalWidth || 800,
			d = i.depositWithdrawalModalHeight || 600;
		s.logTraderEvent("Financial Panel", "Withdraw Clicked"), e.brokerWithdrawUrl ? i.depositWithdrawalModalShow ? (modalInstance = c.open({
			template: '<div class="modal-border modal-body" style="padding: 0; position: relative; z-index: 1000;"><iframe src="' + e.brokerWithdrawUrl + '" style="width: 100%; height: ' + (d - t - 2 * n) + 'px;"></iframe><div class="text-center"><input type="button" value="' + o + '" class="btn btn-buy" ng-click="closeModal();" style="margin: ' + n / 2 + 'px 0 !important;" /></div>',
			windowClass: "catch-me",
			scope: e
		}), setTimeout(function() {
			var e = $("div.catch-me > div").width(a);
			e.find("div.modal-body").height(d)
		}, 1)) : u.open(e.brokerWithdrawUrl) : e.withdraw.showInlineWithdraw = !e.withdraw.showInlineWithdraw
	}, e.closeModal = function() {
		modalInstance.close()
	}, e.requestWithdrawal = function() {
		e.withdraw.withdrawalAmount && i.sendWithdrawRequest(e.withdraw.withdrawalAmount).then(function(t) {
			a.popupMessage(r.getTranslation("withdrawal.popup.header"), r.getTranslation("withdrawal.popup.content"), r.getTranslation("general.ok"), null, null, null, 3e3), e.withdraw.withdrawalAmount = null, e.withdraw.showInlineWithdraw = !1
		}, function(e) {
			console.log(e)
		})
	}, e.checkWithdrawalAmount = function() {
		e.withdraw.withdrawalAmount < 1 ? e.withdraw.withdrawalAmount = 1 : e.withdraw.withdrawalAmount > e.currentAccountBalance && (e.withdraw.withdrawalAmount = Math.round(e.currentAccountBalance))
	}, e.toggleLanguagesView = function() {
		e.isLanguageDropdownOpen = !e.isLanguageDropdownOpen, angular.element(".account-summary").css("min-height", e.isLanguageDropdownOpen ? "440px" : "370px")
	}, e.switchToReal = function() {
		a.switchToReal()
	}, e.signout = function() {
		s.logTraderEvent("User", "Logout", "Success"), t.$broadcast("userClickedSignout")
	}, e.stopPropagation = function(e) {
		e.stopPropagation()
	}, e.updateOneClickTradeSwitch = function() {
		e.isOneClickTradeOn = !e.isOneClickTradeOn;
		var t = e.isOneClickTradeOn ? "settings.trade-mode.one-click-header" : "settings.trade-mode.regular-header",
			n = e.isOneClickTradeOn ? "settings.trade-mode.one-click-content" : "settings.trade-mode.regular-content";
		a.popupMessage(r.getTranslation(t), r.getTranslation(n), r.getTranslation("general.ok"), null, null, null, 3e3), i.saveOneClickTradeEnabled(e.isOneClickTradeOn), s.logTraderEvent("Financial Panel", "One-click trade mode switched", e.isOneClickTradeOn ? "One-click" : "Regular")
	}, e.changeLanguage = function(t) {
		r.changeLanguage(t), e.currentLanguage = t, e.languageText = e.languageTextLabels[e.currentLanguage], s.logTraderEvent("User", "Language Changed", t), i.saveLanguage(t)
	}, e.$on("account", function(e, t) {
		p(t)
	})
}]),
	function(e) {
		"use strict";
		e.controller("BlotterController", ["$scope", function(e) {
			e.currentAccount = null, e.accountVersion = -1, e.openPositionCount = {
				count: ""
			}, e.closedPositionCount = {
				count: ""
			}, e.financialTransactionCount = {
				count: ""
			}, e.isViewPositionsMode = !1, e.$watch("isViewPositionsMode", function() {
				e.positionTabButtonCss = e.isViewPositionsMode ? "fa-close" : "fa-chevron-down"
			}), e.togglePositionTabMode = function() {
				$("body").animate({
					scrollTop: angular.element("#blotter-content").offset().top
				}, "slow")
			}, e.goToOpenPositions = function() {
				e.togglePositionTabMode(), e.$broadcast("closedPositionsListClosed"), e.$broadcast("financialTransactionsListClosed")
			}, e.goToClosedPositions = function() {
				e.togglePositionTabMode(), e.$broadcast("closedPositionsListOpened"), e.$broadcast("financialTransactionsListClosed")
			}, e.goToFinancialTransactions = function() {
				e.togglePositionTabMode(), e.$broadcast("financialTransactionsListOpened"), e.$broadcast("closedPositionsListClosed")
			}, e.goToExpiryHistory = function() {
				e.togglePositionTabMode(), e.$broadcast("expiryHistoryListOpened"), e.$broadcast("closedPositionsListClosed")
			}, e.$on("openPositionCountUpdated", function(t, n) {
				e.openPositionCount.count = n
			}), e.$on("ClosedPositionCountUpdated", function(t, n) {
				e.closedPositionCount.count = n
			}), e.$on("FinancialTransactionCountUpdated", function(t, n) {
				e.financialTransactionCount.count = n
			}), e.$on("mouseScrollDown", function(t, n) {
				e.togglePositionTabMode(!0)
			}), e.$on("mouseScrollUp", function(t, n) {
				e.togglePositionTabMode(!1)
			})
		}])
	}(BX8Trader),
	function(e, t) {
		e.controller("FavoritesController", ["$scope", "$http", "$stateParams", "$timeout", "UserService", "InstrumentService", "BrokerDetailsService", "ConfigurationService", "UserSettingsService", function(e, n, o, i, r, s, a, l, u) {
			e.availableInstruments = [], e.currentAmount = r.getTradeAmount(), e.selectedInstantOptionInstruments = [], e.selectedLongInstantOptionInstruments = [];
			var c, d;
			e.selectedInstantTermOptionLevels = r.getSelectedInstantTermOptionTypes(), e.selectedInstantLongTermOptionLevels = r.getSelectedInstantLongTermOptionTypes(), e.selectedInstantTermOptions = [], e.selectedLongInstantTermOptions = [], e.brokerData = null, e.isLongTerm = "longInstant" === u.getInstantOptionType(), a.get().then(function(t) {
				e.brokerData = t
			}, function() {});
			for (var p = function(e) {
				return e && e.isInTradingHours && e.instantOptionEnabled
			}, m = [], g = 0; g < 4; g++) {
				var f = r.getSelectedOptionByExpiryInstrument(g);
				f ? (e.selectedInstantOptionInstruments[g] = f, e.selectedLongInstantOptionInstruments[g] = f) : (e.selectedInstantOptionInstruments[g] = null, e.selectedLongInstantOptionInstruments[g] = null)
			}
			var h = function() {
					e.availableInstruments.sort(function(e, t) {
						return e.name > t.name ? 1 : e.name < t.name ? -1 : 0
					})
				},
				v = function(t) {
					if (null === e.selectedInstantTermOptionLevels && e.brokerData && e.brokerData.defaultInstantOptionDurations && e.brokerData.defaultInstantOptionDurations.length > 0) {
						e.selectedInstantTermOptionLevels = [];
						for (var n = 0; n < 4; n++) null !== e.brokerData.defaultInstantOptionDurations[n] && e.brokerData.defaultInstantOptionDurations[n] >= 0 ? e.selectedInstantTermOptionLevels.push(e.brokerData.defaultInstantOptionDurations[n]) : e.selectedInstantTermOptionLevels.push(l.Trading.DefaultInstantTermOptionTypes[n])
					}
					if (e.selectedInstantTermOptions = [], e.selectedInstantTermOptionLevels)
						for (var n = 0; n < e.selectedInstantTermOptionLevels.length; n++) {
							for (var o = Math.round(e.selectedInstantTermOptionLevels[n]), i = null, r = 0; r < t.instantOptions.length; r++)
								if (t.instantOptions[r].level == o) {
									i = t.instantOptions[r];
									break
								}
							i && e.selectedInstantTermOptions.push(i)
						}
				},
				T = function(t) {
					if (null === e.selectedInstantLongTermOptionLevels && e.brokerData && e.brokerData.defaultLongOptionDurations && e.brokerData.defaultLongOptionDurations.length > 0) {
						e.selectedInstantLongTermOptionLevels = [];
						for (var n = 0; n < 4; n++) null !== e.brokerData.defaultLongOptionDurations[n] && e.brokerData.defaultLongOptionDurations[n] >= 0 ? e.selectedInstantLongTermOptionLevels.push(e.brokerData.defaultLongOptionDurations[n]) : e.selectedInstantLongTermOptionLevels.push(l.Trading.DefaultLongTermOptionTypes[n])
					}
					if (e.selectedLongInstantTermOptions = [], e.selectedInstantLongTermOptionLevels)
						for (var n = 0; n < e.selectedInstantLongTermOptionLevels.length; n++) {
							for (var o = Math.round(e.selectedInstantLongTermOptionLevels[n]), i = null, r = 0; r < t.instantOptions.length; r++)
								if (t.instantOptions[r].level == o) {
									i = t.instantOptions[r];
									break
								}
							i && e.selectedLongInstantTermOptions.push(i)
						}
				};
			e.toggleOptionType = function() {
				e.isLongTerm = !e.isLongTerm, u.setInstantOptionType(e.isLongTerm ? "longInstant" : "instant")
			}, e.$on("BrokerSignalr", function(t, n) {
				e.limit = n.numberOfInstantOptionsToDisplay
			}), e.$on("instrumentsLoaded", function(t, n) {
				e.availableInstruments = n.filter(function(e) {
					return p(e)
				}), h(), a.get().then(function(t) {
					m = t.defaultInstantOptionInstruments, e.limit = t.numberOfInstantOptionsToDisplay;
					for (var n = 0; n < 4; n++)
						if (e.selectedInstantOptionInstruments[n]) {
							var o = s.getInstrumentByName(e.selectedInstantOptionInstruments[n]);
							o && p(o) ? (e.selectedInstantOptionInstruments[n] = o, e.selectedLongInstantOptionInstruments[n] = o, v(o), T(o)) : (e.selectedInstantOptionInstruments[n] = null, e.selectedLongInstantOptionInstruments[n] = null)
						}
					for (var n = 0; n < 4; n++)
						if (!e.selectedInstantOptionInstruments[n] && (e.selectedInstantOptionInstruments[n] = e.availableInstruments[n], m && m[n])) {
							var i = s.getInstrumentById(m[n]);
							i && p(i) ? (e.selectedInstantOptionInstruments[n] = i, e.selectedLongInstantOptionInstruments[n] = i, v(i), T(i)) : (e.selectedInstantOptionInstruments[n] = e.availableInstruments[n], e.selectedLongInstantOptionInstruments[n] = angular.copy(e.availableInstruments[n]))
						}
				}, function() {}), s.preloadLast5MinutesQuotes(e.availableInstruments)
			}), e.$on("amountChanged", function(t, n) {
				e.currentAmount = n
			}), e.$on("instrumentChanged", function(t, n) {
				for (var o = !1, i = 0; i < e.availableInstruments.length; i++)
					if (e.availableInstruments[i].symbolId === n.symbolId) {
						e.availableInstruments[i] = n, o = !0;
						break
					}!o && p(n) && e.availableInstruments.push(n), e.availableInstruments = e.availableInstruments.filter(function(e) {
					return p(e)
				}), h()
			}), e.$on("instrumentRemoved", function(t, n) {
				for (var o = 0; o < e.availableInstruments.length; o++)
					if (e.availableInstruments[o].symbolId === n) {
						e.availableInstruments.splice(o, 1);
						break
					}
				h()
			}), e.$on("instrumentAdded", function(t, n) {
				p(n) && e.availableInstruments.push(n)
			}), e.$on("updateInstantTermAssetSelection", function(t, n) {
				n && n.level && n.index >= 0 && n.index < 4 && (e.selectedInstantTermOptionLevels[n.index] = Math.round(n.level), r.saveSelectedInstantTermOptionTypes(e.selectedInstantTermOptionLevels))
			}), e.$on("updateInstantLongTermAssetSelection", function(t, n) {
				n && n.level && n.index >= 0 && n.index < 4 && (e.selectedInstantLongTermOptionLevels[n.index] = Math.round(n.level), r.saveSelectedInstantLongTermOptionTypes(e.selectedInstantLongTermOptionLevels))
			}), t.scrollSlider = function(e) {
				if (t.matchMedia("(max-width: 1000px)") && t.isMouseDown)
					if (c) {
						var n = e.clientX - c;
						e.currentTarget.scrollLeft -= 2 * n, c = e.clientX
					} else c = e.clientX
			}, t.scrollTouchSlider = function(e) {
				if (e.stopPropagation(), e.preventDefault(), d) {
					var t = e.changedTouches[0].clientX - d;
					e.currentTarget.scrollLeft -= 2 * t, d = e.clientX
				} else d = e.changedTouches[0].clientX
			}, t.scrollTouchEnd = function() {
				d = null
			}
		}])
	}(BX8Trader, window),
	function(e, t) {
		"use strict";
		e.controller("FinancialControlPanelController", ["$scope", "$rootScope", "$state", "$window", "UserService", "ToolService", "AnalyticsService", "$filter", "$uibModal", "SignalRService", "ConfigurationService", "TranslationService", "$interval", "$http", "$timeout", "TimeService", "BrokerDetailsService", function(e, n, o, i, r, s, a, l, u, c, d, p, m, g, f, h, v) {
			var T, y, I, S = d.Trading.MinimumAmount,
				b = d.Trading.MaximumAmount,
				C = d.UI.DefaultOneClickTradeMode,
				P = T = 2e3,
				O = 3e4;
			e.amountInputSize = 0, e.isAccountSummaryOpen = !1;
			var w = function() {
				return "?token=" + encodeURIComponent(r.getAuthenticationToken())
			};
			e.isOneClickTradeOn = C, e.isAmountEditMode = !1, e.positionAmount = d.Trading.MinimumAmount, e.currencySign = "", e.currentAccountCurrency = "", e.currentAccountBalance = 0, e.brokerDepositUrl = "", e.brokerWithdrawUrl = "", e.brokerWebsiteUrl = "", e.economicCalendarUrl = "", e.currentAccountUsername, e.positionData = {
				amount: r.getTradeAmount(),
				payoutLevel: d.Trading.DefaultPayoutLevel
			};
			var k = function() {
				var t = s.getDigits(e.positionData.amount);
				t > 6 && (t = 6), e.amountInputSize = 10 + 16 * t
			};
			f(function() {
				k(), h.addClockTickedCallback(B, "FinancialControlPanel"), h.startTimeDaemon()
			});
			var L = function() {
					return l("number")(e.currentAccountBalance, 1)
				},
				$ = function(e) {
					var t = Math.floor(e);
					return t > L() && t--, t
				},
				D = function() {
					var t, o = !1;
					return t = b > e.currentAccountBalance ? e.currentAccountBalance : b, e.positionData.amount > t ? (e.positionData.amount = t, o = !0) : e.positionData.amount < S && (e.positionData.amount = S, o = !0), e.positionData.amount = $(e.positionData.amount), r.saveTradeAmount(e.positionData.amount), n.$broadcast("amountChanged", e.positionData.amount), o
				},
				x = function() {
					var t = '<span class="text-capitalize">',
						n = "</span>",
						o = t + p.getTranslation("general.min-trade-amount") + ": " + s.getCurrencyNumber(S, e.currentAccount.currency, 1) + n;
					o += "<br/>", o += t + p.getTranslation("general.max-trade-amount") + ": " + s.getCurrencyNumber(b, e.currentAccount.currency, 1) + n, o += "<br/>", o += t + p.getTranslation("financial.balance") + ": " + s.getCurrencyNumber(e.currentAccountBalance, e.currentAccount.currency, 1) + n, s.popupMessage(p.getTranslation("positions.open-position-result-InvalidAmount"), o, p.getTranslation("general.ok"), null, null, null, 3e3), f.cancel(e.validatePositionAmount.timeout), D()
				},
				A = function(t) {
					S = t.minTradingAmount, b = t.maxTradingAmount, e.positionData.amount < S && (e.positionData.amount = S, n.$broadcast("amountChanged", e.positionData.amount)), e.positionData.amount > b && (e.positionData.amount = b, n.$broadcast("amountChanged", e.positionData.amount)), r.saveTradeAmount(e.positionData.amount), t.withdrawUrl && "" !== t.withdrawUrl ? e.brokerWithdrawUrl = t.withdrawUrl + w() : e.brokerWithdrawUrl = "", t.depositUrl ? e.brokerDepositUrl = t.depositUrl + w() : t.websiteUrl ? e.brokerDepositUrl = t.websiteUrl + w() : e.brokerDepositUrl = "", e.economicCalendarUrl = t.economicCalendarUrl, e.brokerWebsiteUrl = t.websiteUrl, e.isUsingCredit = t.isUsingCredit
				},
				E = function(t) {
					null != t && (S = t.minimumTradeAmount, b = t.maximumTradeAmount, e.positionData.amount < S && (e.positionData.amount = S, n.$broadcast("amountChanged", e.positionData.amount)), e.positionData.amount > b && (e.positionData.amount = b, n.$broadcast("amountChanged", e.positionData.amount)))
				},
				B = function(t) {
					e.currentTime = t.format(), e.$digest()
				};
			e.closeEconomicCalendar = function() {
				I.close()
			}, e.calendarClicked = function() {
				var n = 35,
					o = 10,
					i = p.getTranslation("general.close"),
					r = 800,
					l = 600,
					c = e.currentLanguage.indexOf("zh") >= 0 ? "cn" : e.currentLanguage,
					d = "https:" + e.economicCalendarUrl + "&tgt=http://" + s.getBrokerName() + ".bx8.me&lng=" + c;
				a.logTraderEvent("Nav Bar", "Calendar Clicked"), I = u.open({
					template: '<div class="modal-border modal-body" style="padding: 0; position: relative; z-index: 1000;"><iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="' + d + '" style="width: 100%; height: ' + (l - n - 2 * o) + 'px;"></iframe><div class="text-center"><input type="button" value="' + i + '" class="btn btn-buy" ng-click="closeEconomicCalendar();" style="margin: ' + o / 2 + 'px 0 !important;" /></div>',
					windowClass: "catch-me",
					scope: e
				}), setTimeout(function() {
					var e = t("div.catch-me > div").width(r);
					e.find("div.modal-body").height(l)
				}, 1)
			}, e.closeModal = function() {
				y.close()
			}, e.depositClicked = function() {
				var n = 35,
					o = 10,
					s = p.getTranslation("general.close"),
					l = v.getFromCache(),
					c = l.depositWithdrawalModalWidth || 800,
					m = l.depositWithdrawalModalHeight || 600;
				a.logTraderEvent("Financial Panel", "Deposit Clicked"), l.depositWithdrawalModalShow ? (y = u.open({
					template: '<div class="modal-border modal-body" style="padding: 0; position: relative; z-index: 1000;"><iframe src="' + e.brokerDepositUrl + '" style="width: 100%; height: ' + (m - n - 2 * o) + 'px;"></iframe><div class="text-center"><input type="button" value="' + s + '" class="btn btn-buy" ng-click="closeModal();" style="margin: ' + o / 2 + 'px 0 !important;" /></div>',
					windowClass: "catch-me",
					scope: e
				}), setTimeout(function() {
					var e = t("div.catch-me > div").width(c);
					e.find("div.modal-body").height(m)
				}, 1)) : i.open(e.brokerDepositUrl);
				var f = d.API.Trader.ReadyToDeposit;
				g({
					method: "POST",
					url: f,
					params: {
						token: r.getAuthenticationToken()
					}
				})
			}, e.switchToReal = function() {
				s.switchToReal()
			}, e.validatePositionAmount = function() {
				k(), e.positionData.amount > 999999 && (e.positionData.amount = 999999), e.positionData.amount <= 0 && (e.positionData.amount = 1), e.validatePositionAmount.latestStroke && h.getCurrentTime().diff(e.validatePositionAmount.latestStroke, "ms") < P && f.cancel(e.validatePositionAmount.timeout), n.$broadcast("amountChanged", e.positionData.amount), P = "" == e.positionData.amount ? O : T, e.validatePositionAmount.latestStroke = h.getCurrentTime(), e.validatePositionAmount.timeout = f(function() {
					var e = D();
					e && x()
				}, P)
			}, e.incrementAmount = function() {
				var t = parseInt(e.positionData.amount) + d.Trading.InstrumentAmountStep;
				t > b && (t = b, x()), t > e.currentAccountBalance && (t = parseInt(e.positionData.amount), y = u.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/NoBalanceModal.html",
					controller: "NoBalanceModalController",
					size: "sm"
				})), e.positionData.amount = t, k(), r.saveTradeAmount(e.positionData.amount), n.$broadcast("amountChanged", e.positionData.amount)
			}, e.decrementAmount = function() {
				var t = parseInt(e.positionData.amount) - d.Trading.InstrumentAmountStep;
				t < S && (t = S, x()), e.positionData.amount = t, k(), r.saveTradeAmount(e.positionData.amount), n.$broadcast("amountChanged", e.positionData.amount)
			}, e.validateAmountInput = function(e) {
				var t = s.isEventPressedKeyNumber(e);
				return !!t || (e.preventDefault(), e.stopPropagation(), !1)
			}, e.$on("$destroy", function() {
				h.removeClockTickedCallback("FinancialControlPanel")
			}), e.$on("BrokerSignalr", function(e, t) {
				A(t)
			}), e.$on("onAccountAssignedSignalr", function(e, t) {
				E(t)
			}), e.$on("brokerDetailsReceived", function(t, n) {
				if (A(n), e.currentAccount = r.getCurrentAccount(), e.isOneClickTradeOn = n.isDefaultOneClickTradeMode, e.momentCurrentTime = null, e.receivedTime = null, e.currentAccount) {
					var o = r.getOneClickTradeEnabled();
					null !== o && (e.isOneClickTradeOn = o), e.currentAccountCurrency = s.getCurrencySign(e.currentAccount.currency), e.currentAccountBalance = e.currentAccount.balance, e.currentAccountUsername = e.currentAccount.username
				}
			}), e.$on("groupDetailsReceived", function(e, t) {
				E(t)
			}), e.handleClick = function(t) {
				e.showSummary = !e.showSummary
			}, e.$on("account", function(t, n) {
				e.currentAccount = n, e.currentAccountCurrency = s.getCurrencySign(e.currentAccount.currency), e.currentAccountBalance = e.currentAccount.balance, k()
			}), e.$on("brokerDetailsPushed", function(e, t) {
				A(t)
			}), n.$on("invalidTradeAmount", x)
		}])
	}(BX8Trader, $),
	function(e) {
		"use strict";
		e.controller("GuestController", ["$scope", "$cookies", "$interval", "$stateParams", "ToolService", "UserService", "AnalyticsService", "TranslationService", "BrokerDetailsService", "ConfigurationService", function(e, t, n, o, i, r, s, a, l, u) {
			e.credentials = {
				Username: "",
				Password: "",
				newPassword: "",
				retypePassword: ""
			}, e.errorMessage = o && o.errorMessage ? o.errorMessage : "", e.resetPassword = !1;
			var c = window.location.href.match(/\?(.*)[^\/]?/),
				d = c && c[1],
				p = function(t, n) {
					n && (window.location.href = window.location.origin), r.setAuthenticationToken(t), e.$emit("loginSuccess", t)
				},
				m = function() {
					e.connecting = !1, s.logTraderEvent("User", "Login", "Failure"), e.errorMessage = a.getTranslation("login.error-invalid-credentials")
				};
			e.userInputTyped = function(t) {
				t && 13 == t.keyCode && e.login(e.credentials)
			}, e.isPasswordsEqual = function() {
				"" != e.credentials.retypePassword && e.credentials.newPassword != e.credentials.retypePassword ? e.matchErrorMessage = a.getTranslation("login.error-passwords-not-equal") : e.matchErrorMessage = ""
			}, e.login = function(t, n) {
				e.connecting = !0, r.removeAuthenticationToken(), r.login(t).then(function(t) {
					e.resetPassword = e.requiresInitialPasswordReset && t.isPasswordExpired, e.resetPassword ? e.connecting = !1 : p(t.token, n)
				}, m)
			}, e.submitResetPassword = function(t) {
				e.connecting = !0, r.removeAuthenticationToken(), r.resetPassword(t).then(function(e) {
					p(e.token)
				}, function(t) {
					e.connecting = !1, e.errorMessage = a.getTranslation("login.failed-change-password")
				})
			};
			var g = n(function() {
				$("#Username").prev().text().match(/login\.username/) || n.cancel(g)
			}, 20);
			l.getByName().then(function(n) {
				var o = window.location.href.match(/https?:\/\/(.*?)\./),
					r = o[1];
				"viproom" == r ? e.email = "support@tradersvip.com" : e.email = "", n.requireHttps && i.isProtocolHttp() && (window.location.href = window.location.href.replace(/^(http)(.*)/, "https$2")), n.favIcon && "" !== n.favIcon ? $("head").append('<link href="' + n.favIcon + '" id="fav-icon" rel="shortcut icon" type="image/x-icon" />') : $("head").append('<link href="/Content/Images/favicon.png" id="fav-icon" rel="shortcut icon" type="image/x-icon" />'), e.requiresInitialPasswordReset = n.requiresInitialPasswordReset;
				var s = a.getLanguageFromUrl();
				if (null == s)
					if (t.get("BX8Trader-Settings")) {
						var l = JSON.parse(i.Base64ToUTF8(t.get("BX8Trader-Settings")));
						l.language && a.changeLanguage(l.language)
					} else {
						var c = n && n.defaultLanguage ? n.defaultLanguage : u.UI.DefaultLanguage;
						a.changeLanguage(c)
					} else a.changeLanguage(s)
			}, function(e) {
				var t = window.location.href.match(/https?:\/\/(.*?)\./);
				if (t && t.length > 1) {
					var n = t[1],
						o = window.location.href.replace(n, "eubinary");
					return void(window.location.href = o)
				}
			}), e.isGuestMode && e.login({
				Username: "guest@leverate.com",
				Password: "Guest2016"
			}), d && (c = d.replace("##", "#").match(/username=(.+)&password=([^\/]+)?/), c && c > 2 && e.login({
				Username: c[1],
				Password: c[2].substr(0, c[2].length - 1)
			}, !0))
		}])
	}(BX8Trader),
	function(e) {
		e.controller("InstrumentOptionsController", ["$scope", "$rootScope", "$http", "UserService", "ConfigurationService", "ToolService", "InstrumentService", "UserSettingsService", "BrokerDetailsService", function(e, t, n, o, i, r, s, a, l) {
			e.selectedScheduledShortTermOptionLevels = o.getSelectedShortTermOptionTypes(), e.selectedScheduledShortTermOptions = [], e.selectedScheduledLongTermOptionLevels = o.getSelectedLongTermOptionTypes(), e.selectedScheduledLongTermOptions = [], e.selectedInstrument = null, e.amount = i.Trading.MinimumAmount, e.prevSelectedInstrumentPrice = -1, e.instrumentPriceCssName = "", e.instrumentService = s, e.isLongTerm = "long" === a.getOptionType(), e.currentChart = a.getChartType(), e.brokerData = null;
			var u = function() {
					if (e.selectedInstrument && e.selectedInstrument.options && 0 !== e.selectedInstrument.options.length)
						for (var t = e.selectedInstrument.options.length, n = t; n <= 4; n++) e.selectedInstrument.options.push({})
				},
				c = function() {
					if (null === e.selectedScheduledShortTermOptionLevels && e.brokerData && e.brokerData.defaultShortTermOptions && e.brokerData.defaultShortTermOptions.length > 0) {
						e.selectedScheduledShortTermOptionLevels = [];
						for (var t = 0; t < 4; t++) null !== e.brokerData.defaultShortTermOptions[t] && e.brokerData.defaultShortTermOptions[t] >= 0 ? e.selectedScheduledShortTermOptionLevels.push(e.brokerData.defaultShortTermOptions[t]) : e.selectedScheduledShortTermOptionLevels.push(i.Trading.DefaultShortTermOptionTypes[t])
					}
					if (e.selectedScheduledShortTermOptions = [], e.selectedScheduledShortTermOptionLevels)
						for (var t = 0; t < e.selectedScheduledShortTermOptionLevels.length; t++) {
							for (var n = Math.round(e.selectedScheduledShortTermOptionLevels[t]), o = null, r = 0; r < e.selectedInstrument.options.length; r++)
								if (e.selectedInstrument.options[r].level === n) {
									o = e.selectedInstrument.options[r];
									break
								}
							o && e.selectedScheduledShortTermOptions.push(o)
						}
				},
				d = function() {
					if (null === e.selectedScheduledLongTermOptionLevels && e.brokerData && e.brokerData.defaultLongTermOptions && e.brokerData.defaultLongTermOptions.length > 0) {
						e.selectedScheduledLongTermOptionLevels = [];
						for (var t = 0; t < 4; t++) null !== e.brokerData.defaultLongTermOptions[t] && e.brokerData.defaultLongTermOptions[t] >= 0 ? e.selectedScheduledLongTermOptionLevels.push(e.brokerData.defaultLongTermOptions[t]) : e.selectedScheduledLongTermOptionLevels.push(i.Trading.DefaultLongTermOptionTypes[t])
					}
					if (e.selectedScheduledLongTermOptions = [], e.selectedScheduledLongTermOptionLevels)
						for (var t = 0; t < e.selectedScheduledLongTermOptionLevels.length; t++) {
							for (var n = Math.round(e.selectedScheduledLongTermOptionLevels[t]), o = null, r = 0; r < e.selectedInstrument.longTermOptions.length; r++)
								if (e.selectedInstrument.longTermOptions[r].level === n) {
									o = e.selectedInstrument.longTermOptions[r];
									break
								}
							o && e.selectedScheduledLongTermOptions.push(o)
						}
				},
				p = function(t) {
					t && (e.selectedInstrument = t, e.selectedInstrument.displayPrice = e.selectedInstrument.price.toFixed(e.selectedInstrument.digitsToDisplay), c(), d(), e.selectedInstrument && u())
				};
			e.getInstrumentPrice = function() {
				return r.getInstrumentPrice(e.selectedInstrument)
			}, e.toggleOptionType = function() {
				e.isLongTerm = !e.isLongTerm, a.setOptionType(e.isLongTerm ? "long" : "short")
			}, e.setChartType = function(t) {
				e.currentChart = t, a.setChartType(t)
			}, e.isLongTermOptionAvailable = function(t) {
				return null != e.selectedInstrument && e.selectedInstrument.longTermOptionEnabled && null != t && !!t.fullExpireTime
			}, e.isAllOptionsAreUnavailable = function() {
				return null == e.selectedInstrument || !e.selectedInstrument.longTermOptionEnabled || 0 === e.selectedInstrument.longTermOptions.length
			}, e.$on("BrokerSignalr", function(t, n) {
				e.optionsCount !== n.numberOfScheduledOptionsToDisplay && (e.optionsCount = n.numberOfScheduledOptionsToDisplay)
			}), e.$on("updateShortTermAssetSelection", function(t, n) {
				n && n.level && n.index >= 0 && n.index < 4 && (e.selectedScheduledShortTermOptionLevels[n.index] = Math.round(n.level), o.saveSelectedShortTermOptionTypes(e.selectedScheduledShortTermOptionLevels))
			}), e.$on("updateLongTermAssetSelection", function(t, n) {
				n && n.level && n.index >= 0 && n.index < 4 && (e.selectedScheduledLongTermOptionLevels[n.index] = Math.round(n.level), o.saveSelectedLongTermOptionTypes(e.selectedScheduledLongTermOptionLevels))
			}), e.$on("quote", function(t, n) {
				e.selectedInstrument && e.selectedInstrument.symbolId === n.symbolId && (e.selectedInstrument.price < n.price ? e.selectedInstrument.arrowCssName = "fa-caret-up price-up" : e.selectedInstrument.price > n.price && (e.selectedInstrument.arrowCssName = "fa-caret-down price-down"), e.selectedInstrument.oldPrice = e.selectedInstrument.price, e.selectedInstrument.price = n.price, e.selectedInstrument.displayPrice = e.selectedInstrument.price.toFixed(e.selectedInstrument.digitsToDisplay))
			}), e.$on("selectedInstrumentChanged", function(t, n) {
				e.selectedInstrument && e.selectedInstrument.symbolId !== n.symbolId && p(n)
			}), e.$on("assetTickerLostConnection", function() {
				e.selectedInstrument.options = []
			}), e.$on("assetTickerConnectionEstablished", function(t, n) {
				e.selectedInstrument.options = n
			}), e.$on("instrumentsLoaded", function(t, n) {
				n.filter(function(t) {
					return t.instrumentId == e.brokerData.defaultScheduledOptionInstrument
				})[0];
				p(s.getNextInstrumentForSelection())
			}), e.$on("amountChanged", function(t, n) {
				e.amount = n
			}), e.$on("instrumentChanged", function(t, n) {
				e.selectedInstrument && e.selectedInstrument.symbolId === n.symbolId && p(n)
			}), e.$on("instrumentRemoved", function(t, n) {
				e.selectedInstrument && e.selectedInstrument.symbolId === n && p(s.getNextInstrumentForSelection())
			}),
				function() {
					l.get().then(function(t) {
						e.brokerData = t, e.optionsCount = t.numberOfScheduledOptionsToDisplay
					}, function() {}), e.amount = o.getTradeAmount(), t.$broadcast("chartLoaded")
				}()
		}])
	}(BX8Trader),
	function(e) {
		e.controller("InstrumentOptionsGuestController", ["$scope", "$rootScope", "$http", "UserService", "ConfigurationService", "ToolService", "InstrumentService", "UserSettingsService", "BrokerDetailsService", function(e, t, n, o, i, r, s, a, l) {
			var u = function(t, n) {
				var o = $(t);
				return 0 == o.length ? void setTimeout(function() {
					u(t, n)
				}, 200) : (o.css(n || {}), void o.enscroll({
					verticalScrollerSide: "right",
					verticalScrolling: !0,
					horizontalScrolling: !1,
					zIndex: 5,
					verticalTrackClass: "scrollbar-tracker-right scroller-" + e.idx,
					verticalHandleClass: "scrollbar-handler-right"
				}))
			};
			e.selectedScheduledShortTermOptionLevels = o.getSelectedShortTermOptionTypes(), e.selectedScheduledShortTermOptions = [], e.selectedScheduledLongTermOptionLevels = o.getSelectedLongTermOptionTypes(), e.selectedScheduledLongTermOptions = [], e.availableInstruments = [], e.availableInstrumentsDictionary = {}, e.selectedInstrument = null, e.amount = i.Trading.MinimumAmount, e.prevSelectedInstrumentPrice = -1, e.instrumentPriceCssName = "", e.instrumentService = s, e.isLongTerm = "long" === a.getOptionType(), e.currentChart = a.getChartType(), e.brokerData = null, e.typeSwitch = ["short", "short", "short", "short"], e.$on("assetLevelChanged", function(t, n, o) {
				e.typeSwitch[n] = o == -1 ? "instant" : "short", setTimeout(function() {
					o == -1 ? u("#asset-level-dropdown-demo-" + n) : u("#asset-level-dropdown-" + n, {
						height: "170px"
					})
				}, 1)
			});
			var c = function(e) {
					return e && e.isInTradingHours && e.instantOptionEnabled
				},
				d = function() {
					if (e.selectedInstrument && e.selectedInstrument.options && 0 !== e.selectedInstrument.options.length)
						for (var t = e.selectedInstrument.options.length, n = t; n <= 4; n++) e.selectedInstrument.options.push({})
				},
				p = function() {
					if (null === e.selectedScheduledShortTermOptionLevels && e.brokerData && e.brokerData.defaultShortTermOptions && e.brokerData.defaultShortTermOptions.length > 0) {
						e.selectedScheduledShortTermOptionLevels = [];
						for (var t = 0; t < 4; t++) null !== e.brokerData.defaultShortTermOptions[t] && e.brokerData.defaultShortTermOptions[t] >= 0 ? e.selectedScheduledShortTermOptionLevels.push(e.brokerData.defaultShortTermOptions[t]) : e.selectedScheduledShortTermOptionLevels.push(i.Trading.DefaultShortTermOptionTypes[t])
					}
					if (e.selectedScheduledShortTermOptions = [], e.selectedScheduledShortTermOptionLevels)
						for (var t = 0; t < e.selectedScheduledShortTermOptionLevels.length; t++) {
							for (var n = Math.round(e.selectedScheduledShortTermOptionLevels[t]), o = null, r = 0; r < e.selectedInstrument.options.length; r++)
								if (e.selectedInstrument.options[r].level === n) {
									o = e.selectedInstrument.options[r];
									break
								}
							o && e.selectedScheduledShortTermOptions.push(o)
						}
				},
				m = function() {
					if (null === e.selectedScheduledLongTermOptionLevels && e.brokerData && e.brokerData.defaultLongTermOptions && e.brokerData.defaultLongTermOptions.length > 0) {
						e.selectedScheduledLongTermOptionLevels = [];
						for (var t = 0; t < 4; t++) null !== e.brokerData.defaultLongTermOptions[t] && e.brokerData.defaultLongTermOptions[t] >= 0 ? e.selectedScheduledLongTermOptionLevels.push(e.brokerData.defaultLongTermOptions[t]) : e.selectedScheduledLongTermOptionLevels.push(i.Trading.DefaultLongTermOptionTypes[t])
					}
					if (e.selectedScheduledLongTermOptions = [], e.selectedScheduledLongTermOptionLevels)
						for (var t = 0; t < e.selectedScheduledLongTermOptionLevels.length; t++) {
							for (var n = Math.round(e.selectedScheduledLongTermOptionLevels[t]), o = null, r = 0; r < e.selectedInstrument.longTermOptions.length; r++)
								if (e.selectedInstrument.longTermOptions[r].level === n) {
									o = e.selectedInstrument.longTermOptions[r];
									break
								}
							o && e.selectedScheduledLongTermOptions.push(o)
						}
				},
				g = function(t) {
					var n = !1;
					e.selectedInstrument || (n = !0);
					var o = s.sortedInstruments.filter(function(e) {
						return e.symbolId === t.symbolId
					});
					n && e.$broadcast("selectedInstrumentIntialized", o[0]), o && o.length > 0 && (e.selectedInstrument = angular.copy(o[0]), p(), m(), e.selectedInstrument && d())
				};
			e.getInstrumentPrice = function() {
				return r.getInstrumentPrice(e.selectedInstrument)
			}, e.toggleOptionType = function() {
				e.isLongTerm = !e.isLongTerm, a.setOptionType(e.isLongTerm ? "long" : "short")
			}, e.setChartType = function(t) {
				e.currentChart = t, a.setChartType(t)
			}, e.isLongTermOptionAvailable = function(t) {
				return null != e.selectedInstrument && e.selectedInstrument.longTermOptionEnabled && null != t && !!t.fullExpireTime
			}, e.isAllOptionsAreUnavailable = function() {
				return null == e.selectedInstrument || !e.selectedInstrument.longTermOptionEnabled || 0 === e.selectedInstrument.longTermOptions.length
			}, e.changeInstrument = function(t) {
				e.selectedInstrument = t, e.$broadcast("selectedInstrumentChanged", t);
			}, e.$on("quote", function(t, n) {
				var o = e.availableInstrumentsDictionary[n.symbolId];
				e.selectedInstrument && e.selectedInstrument.symbolId === n.symbolId && (e.selectedInstrument.price < n.price ? e.selectedInstrument.arrowCssName = "rate-positive" : e.selectedInstrument.price > n.price && (e.selectedInstrument.arrowCssName = "rate-negative"), e.selectedInstrument.price = n.price, e.selectedInstrument.displayPrice = e.selectedInstrument.price.toFixed(e.selectedInstrument.digitsToDisplay)), o && (o.price < n.price ? o.arrowCssName = "rate-positive" : o.price > n.price && (o.arrowCssName = "rate-negative"), o.price = n.price, o.displayPrice = o.price.toFixed(o.digitsToDisplay))
			}),
				function() {
					l.get().then(function(t) {
						e.brokerData = t
					}, function() {}), e.amount = o.getTradeAmount(), t.$broadcast("chartLoaded"), u("#demo-instruments-ddl"), u("#asset-level-dropdown-1", {
						height: "170px"
					}), u("#asset-level-dropdown-demo-0"), setTimeout(function() {
						$('[id^="flipper"]').height("195px")
					}), e.$on("updateShortTermAssetSelection", function(t, n) {
						n && n.level && n.index >= 0 && n.index < 4 && (e.selectedScheduledShortTermOptionLevels[n.index] = Math.round(n.level), o.saveSelectedShortTermOptionTypes(e.selectedScheduledShortTermOptionLevels))
					}), e.$on("updateLongTermAssetSelection", function(t, n) {
						n && n.level && n.index >= 0 && n.index < 4 && (e.selectedScheduledLongTermOptionLevels[n.index] = Math.round(n.level), o.saveSelectedLongTermOptionTypes(e.selectedScheduledLongTermOptionLevels))
					}), e.$on("selectedInstrumentChanged", function(t, n) {
						e.selectedInstrument && e.selectedInstrument.symbolId !== n.symbolId && g(n)
					}), e.$on("assetTickerLostConnection", function() {
						e.selectedInstrument.options = []
					}), e.$on("assetTickerConnectionEstablished", function(t, n) {
						e.selectedInstrument.options = n
					}), e.$on("instrumentsLoaded", function(e, t) {
						g(s.getNextInstrumentForSelection())
					}), e.$on("amountChanged", function(t, n) {
						e.amount = n
					}), e.$on("instrumentChanged", function(t, n) {
						e.selectedInstrument && e.selectedInstrument.symbolId === n.symbolId && g(n)
					}), e.$on("instrumentRemoved", function(t, n) {
						e.selectedInstrument && e.selectedInstrument.symbolId === n && g(s.getNextInstrumentForSelection())
					}), e.$watch(function() {
						return s.sortedInstruments.length
					}, function() {
						e.availableInstruments = angular.copy(s.sortedInstruments).filter(function(e) {
							return c(e)
						}), e.availableInstruments.forEach(function(t) {
							e.availableInstrumentsDictionary[t.symbolId] = t
						})
					})
				}()
		}])
	}(BX8Trader),
	function(e, t) {
		e.controller("InstrumentsGuestController", ["$scope", "$http", "$stateParams", "UserService", "InstrumentService", function(e, t, n, o, i) {
			e.availableInstruments = [], e.currentAmount = o.getTradeAmount();
			var r = function(e) {
				return e && e.isInTradingHours && e.instantOptionEnabled
			};
			e.optionDurationLabels = {
				"-1": "options.duration.60-seconds",
				0: "options.duration.5-minutes",
				1: "options.duration.15-minutes",
				2: "options.duration.30-minutes",
				3: "options.duration.60-minutes",
				8: "options.duration.end-of-day"
			}, e.optionAbbrLabels = {
				0: "options.duration.abbr-5m",
				1: "options.duration.abbr-15m",
				2: "options.duration.abbr-30m",
				3: "options.duration.abbr-60m",
				8: "options.duration.abbr-eod"
			}, e.optionDurationLabelsArray = [];
			for (var s in e.optionDurationLabels) e.optionDurationLabelsArray.push({
				level: +s,
				label: e.optionDurationLabels[s]
			});
			e.asset = {
				level: -1
			}, e.changeAssetLevel = function(t, n) {
				e.$emit("assetLevelChanged", t, n)
			},
				function() {
					e.availableInstruments = angular.copy(i.sortedInstruments).filter(function(e) {
						return r(e)
					}), e.$on("amountChanged", function(t, n) {
						e.currentAmount = n
					}), e.currentAmount = 10, e.viewModel.isIeOrSafari = !0, e.viewModel.isGuestMode = e.isGuestMode, i.preloadLast5MinutesQuotes(e.availableInstruments)
				}()
		}])
	}(BX8Trader, window), BX8Trader.controller("PopupController", ["$scope", "$rootScope", "$uibModalInstance", "$timeout", "ConfigurationService", "$http", "header", "message", "okButtonCaption", "okStyle", "cancelButtonCaption", "cancelStyle", "closeTimeout", function(e, t, n, o, i, r, s, a, l, u, c, d, p) {
	e.header = s, e.message = a, e.okButtonCaption = l, e.cancelButtonCaption = c, e.closeTimeout = p && p > 0 ? p : i.Trading.Popups.AutoCloseTimeout, e.okStyle = u, e.cancelStyle = d, p > 0 && (e.closePopupTimeout = o(function() {
		e.ok()
	}, p)), e.ok = function() {
		o.cancel(e.closePopupTimeout), n.close(), t.$broadcast("popupOKButtonClicked")
	}, e.cancel = function() {
		o.cancel(e.closePopupTimeout), n.dismiss("cancel"), t.$broadcast("popupCancelButtonClicked")
	}
}]),
	function(e) {
		"use strict";
		e.controller("RatesController", ["$scope", "$rootScope", "$timeout", "$interval", "UserService", "UserSettingsService", "InstrumentService", "AnalyticsService", "BrokerDetailsService", "TranslationService", function(e, t, n, o, i, r, s, a, l, u) {
			var c = 500;
			e.instrumentsBySymbolId = {}, e.sortedInstruments = [], e.groupsInitialized = !1, e.filters = {
				enabled: !1,
				instrumentName: ""
			}, e.ratesContainerHeight = "100%", e.selectedInstrument = null, e.instrumentPriceCssName = {}, e.isChartLoaded = !1, e.instrumentService = s, e.brokerData, e.displayGroupSlider = {
				constainer: null,
				slider: null,
				slidesLength: 1,
				slideWidth: null,
				groups: [],
				currentSlide: r.getInstrumentGroup()
			};
			var d = null,
				p = function(t) {
					for (var o = 0; o < t.length; o++) e.instrumentsBySymbolId[t[o].symbolId] = angular.copy(t[o]), e.instrumentsBySymbolId[t[o].symbolId].tooltipName = e.instrumentsBySymbolId[t[o].symbolId].name.length > 8 ? e.instrumentsBySymbolId[t[o].symbolId].name : "", e.instrumentsBySymbolId[t[o].symbolId].arrowCssName = "";
					e.sortedInstruments = [];
					for (var i in e.instrumentsBySymbolId) e.sortedInstruments.push(e.instrumentsBySymbolId[i]);
					g(), e.selectedInstrument = s.getNextInstrumentForSelection(), n.cancel(d), d = n(function() {
						f()
					}, 1)
				},
				m = function(t, n) {
					e.groupsInitialized = !0;
					var o = {};
					e.displayGroupSlider.groups = [], t.forEach(function(e) {
						e.displayGroup && e.displayGroup.split(n).forEach(function(t) {
							t && (o[t] || (o[t] = {
								name: t,
								instruments: [],
								filteredInstruments: []
							}), o[t].instruments.push(e), o[t].filteredInstruments.push(e))
						})
					});
					for (var i in o) e.displayGroupSlider.groups.push({
						name: o[i].name,
						instruments: o[i].instruments,
						filteredInstruments: o[i].filteredInstruments
					});
					e.displayGroupSlider.groups.sort(function(e, t) {
						return e.name < t.name ? -1 : 1
					}), e.displayGroupSlider.groups.unshift({
						name: u.getTranslation("rates.all"),
						instruments: e.sortedInstruments,
						filteredInstruments: e.sortedInstruments
					})
				},
				g = function(t) {
					var n = t || e.sortedInstruments;
					n.sort(function(e, t) {
						return e.name > t.name ? 1 : e.name < t.name ? -1 : 0
					})
				},
				f = function() {
					if (e.sortedInstruments) {
						for (var t = null, n = 0; n < e.sortedInstruments.length && !(t = document.getElementById("rate-" + n)); n++);
						if (!t) return;
						for (; n < e.sortedInstruments.length; n++) e.sortedInstruments[n].isVisible = T(n, t.offsetTop), e.instrumentsBySymbolId[e.sortedInstruments[n].symbolId].isVisible = e.sortedInstruments[n].isVisible
					}
				},
				h = function() {
					m(e.sortedInstruments, "|"), n(function() {
						var t = document.querySelectorAll("#display-group-slider > div");
						e.displayGroupSlider.slider = document.getElementById("display-group-slider"), e.displayGroupSlider.container = document.getElementById("display-group-container"), e.displayGroupSlider.slideWidth = e.displayGroupSlider.container.offsetWidth, e.displayGroupSlider.slider.style.width = t.length * e.displayGroupSlider.slideWidth + 10 + "px", e.displayGroupSlider.slidesLength = t.length;
						for (var n = 0; n < t.length; n++) t[n].style.width = e.displayGroupSlider.container.offsetWidth + "px";
						e.slidesLength = t.length, e.displayGroupSlider.currentSlide >= e.slidesLength && (e.displayGroupSlider.currentSlide = --e.slidesLength, r.setInstrumentGroup(e.displayGroupSlider.currentSlide))
					}, 1)
				},
				v = function(t) {
					for (var n = 0; n < e.displayGroupSlider.slidesLength; n++) e.displayGroupSlider.groups[n] && e.displayGroupSlider.groups[n].instruments && e.displayGroupSlider.groups[n].instruments.filter(function(e) {
						return e.instrumentId === t.instrumentId
					}).forEach(function(e) {
						e.enabled = t.enabled, e.isInTradingHours = t.isInTradingHours, e.name = t.name
					})
				};
			e.leftSlide = function() {
				if (0 != e.displayGroupSlider.currentSlide) {
					var t = e.displayGroupSlider.slider.style.transform;
					if (t) {
						var o = Number(t.match(/(-?\d+)/)[1]);
						e.displayGroupSlider.slider.style.transform = "translateX(" + (o + e.displayGroupSlider.slideWidth) + "px)"
					}
					e.displayGroupSlider.currentSlide--, r.setInstrumentGroup(e.displayGroupSlider.currentSlide), n(function() {
						f()
					}, c)
				}
			}, e.rightSlide = function() {
				if (e.displayGroupSlider.currentSlide != e.displayGroupSlider.slidesLength - 1) {
					var t = e.displayGroupSlider.slider.style.transform;
					if (t) {
						var o = Number(t.match(/(-?\d+)/)[1]);
						e.displayGroupSlider.slider.style.transform = "translateX(" + (o - e.displayGroupSlider.slideWidth) + "px)"
					} else e.displayGroupSlider.slider.style.transform = "translateX(-" + e.displayGroupSlider.slideWidth + "px)";
					e.displayGroupSlider.currentSlide++, r.setInstrumentGroup(e.displayGroupSlider.currentSlide), n(function() {
						f()
					}, c)
				}
			}, e.searchInputTyped = function(t) {
				27 == t.keyCode && (e.filters.instrumentName = "")
			}, e.initialize = function() {
				var t = !1;
				l.get().then(function(t) {
					e.brokerData = t, s.setBrokerDefaultInstrument(t.defaultScheduledOptionInstrument)
				}), e.$on("userClickedSignout", function() {
					t = !1
				}), s.fetchInstrumentsFromBackend().then(function() {
					if (!(s.sortedInstruments && 0 == s.sortedInstruments.length || t)) {
						t = !0, p(s.sortedInstruments), h();
						var n = s.sortedInstruments.filter(function(t) {
							return t.instrumentId == e.brokerData.defaultScheduledOptionInstrument
						})[0];
						s.sortedInstruments.find(y) || e.changeInstrument(function() {
							return n ? n : s.getNextInstrumentForSelection()
						}), $("#ratesPanel").enscroll({
							verticalScrollerSide: "right",
							verticalScrolling: !0,
							horizontalScrolling: !1,
							verticalHandleClass: "scrollbar-handler-right rates-scrollbar-handler-right",
							marginLeft: "-15px",
							scrollY: {
								end: function() {
									f()
								}
							}
						})
					}
				}, function(e) {
					conssole.log("instruments load failure")
				})
			}, e.changeInstrument = function(n) {
				var o = s.getInstrumentBySymbolId(n.symbolId),
					r = e.selectedInstrument;
				o && (e.selectedInstrument = o, t.$broadcast("selectedInstrumentChanged", e.instrumentsBySymbolId[n.symbolId], r), i.saveSelectedChartInstrument(e.selectedInstrument))
			};
			var T = function(e, t) {
					if (!document.getElementById("rate-" + e) || !document.getElementById("ratesPanel")) return !0;
					var n = document.getElementById("rate-" + e).clientHeight,
						o = document.getElementById("rate-" + e).offsetTop - t,
						i = o + n,
						r = document.getElementById("ratesPanel").clientHeight,
						s = document.getElementById("ratesPanel").scrollTop,
						a = s + r,
						l = o + n > s - n && i < a + 2 * n;
					return l
				},
				y = function(t) {
					return t.name == e.selectedInstrument.name
				},
				I = function(t) {
					e.instrumentsBySymbolId[t.symbolId] = t, e.instrumentsBySymbolId[t.symbolId].isVisible = !0, e.instrumentsBySymbolId[t.symbolId].arrowCssName = "";
					var n = function(e) {
						var n = e.some(function(e) {
							return e.symbolId === t.symbolId
						});
						n || (e.push(t), g(e))
					};
					n(e.sortedInstruments), e.groupsInitialized && t.displayGroup && t.displayGroup.split("|").forEach(function(n) {
						if (n) {
							var o = e.displayGroupSlider.groups.filter(function(e) {
								return e.name === n
							});
							if (o && o.length > 0)
								for (var i = 0; i < o.length; i++) {
									var r = null;
									o[i] && o[i].instruments && (r = o[i].instruments.filter(function(e) {
										return e.symbolId === t.symbolId
									}), r && 0 !== r.length || (o[i].instruments.push(t), g(o[i].instruments))), o[i] && o[i].filteredInstruments && (r = o[i].filteredInstruments.filter(function(e) {
										return e.symbolId === t.symbolId
									}), r && 0 !== r.length || (o[i].filteredInstruments.push(t), g(o[i].filteredInstruments)))
								}
						}
					}), f()
				},
				S = function(t) {
					e.instrumentsBySymbolId[t] = null;
					for (var n = 0; n < e.displayGroupSlider.slidesLength; n++)
						if (e.displayGroupSlider.groups[n] && e.displayGroupSlider.groups[n].instruments) {
							for (var o = 0; o < e.displayGroupSlider.groups[n].instruments.length; o++)
								if (e.displayGroupSlider.groups[n].instruments[o].symbolId === t) {
									e.displayGroupSlider.groups[n].instruments.splice(o, 1);
									break
								}
							for (var o = 0; o < e.displayGroupSlider.groups[n].filteredInstruments.length; o++)
								if (e.displayGroupSlider.groups[n].filteredInstruments[o].symbolId === t) {
									e.displayGroupSlider.groups[n].filteredInstruments.splice(o, 1);
									break
								}
						}
					f()
				};
			e.$watch("filters.instrumentName", function() {
				if (!e.filters || !e.filters.instrumentName || "" === e.filters.instrumentName)
					for (var t = 0; t < e.displayGroupSlider.groups.length; t++) e.displayGroupSlider.groups[t].filteredInstruments = e.displayGroupSlider.groups[t].instruments;
				for (var t = 0; t < e.displayGroupSlider.groups.length; t++) e.displayGroupSlider.groups[t].filteredInstruments = e.displayGroupSlider.groups[t].instruments.filter(function(t) {
					return t.name.toLowerCase().indexOf(e.filters.instrumentName.toLowerCase()) >= 0
				});
				n(function() {
					f()
				}, c)
			}), e.$on("instrumentRemoved", function(n, o) {
				S(o), f(), e.selectedInstrument && o === e.selectedInstrument.symbolId && (e.selectedInstrument = s.getNextInstrumentForSelection(), t.$broadcast("selectedInstrumentChanged", e.selectedInstrument))
			}), e.$on("instrumentAdded", function(e, t) {
				I(t), f()
			}), e.$on("quote", function(t, n) {
				if (e.instrumentsBySymbolId && e.instrumentsBySymbolId[n.symbolId] && e.instrumentsBySymbolId[n.symbolId].isVisible) {
					e.instrumentsBySymbolId[n.symbolId].price < n.price ? e.instrumentsBySymbolId[n.symbolId].arrowCssName = "fa-caret-up price-up" : e.instrumentsBySymbolId[n.symbolId].price > n.price && (e.instrumentsBySymbolId[n.symbolId].arrowCssName = "fa-caret-down price-down"), e.instrumentsBySymbolId[n.symbolId].price = n.price;
					var o = {
						$name: $('[data-name="' + n.symbolId + '"]'),
						$price: $('[data-price="' + n.symbolId + '"]'),
						$priceTick: $('[data-price-tick="' + n.symbolId + '"]')
					};
					o.$price.text(e.instrumentsBySymbolId[n.symbolId].price.toFixed(+e.instrumentsBySymbolId[n.symbolId].digitsToDisplay)), e.instrumentsBySymbolId[n.symbolId].arrowCssName && (e.instrumentsBySymbolId[n.symbolId].arrowCssName.search("up") > -1 ? (o.$priceTick.addClass("fa-caret-up price-up"), o.$priceTick.removeClass("fa-caret-down price-down")) : (o.$priceTick.addClass("fa-caret-down price-down"), o.$priceTick.removeClass("fa-caret-up price-up")))
				}
			}), e.$on("instrumentChanged", function(e, t) {
				v(t)
			}), window.addEventListener("resize", h), e.$on("$destroy", function() {
				window.removeEventListener("resize", h)
			})
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("ToolbarController", ["$scope", "$timeout", "BrokerDetailsService", function(e, t, n) {
			e.brokerWebsiteUrl = "", t(function() {
				n.get().then(function(t) {
					e.brokerWebsiteUrl = t.websiteUrl
				})
			});
			var o = function(t) {
				e.brokerWebsiteUrl = t.websiteUrl
			};
			e.$on("brokerDetailsReceived", function(e, t) {
				o(t)
			}), e.$on("BrokerSignalr", function(e, t) {
				o(t)
			})
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("TraderController", ["$scope", "$rootScope", "$document", "$http", "$state", "$cookies", "UserService", "ToolService", "BrokerDetailsService", "$filter", "SignalRService", "ConfigurationService", "TranslationService", "TimeService", "GamificationModalService", "InstrumentService", "AnalyticsService", "EarlyClosurePositionService", function(e, t, n, o, i, r, s, a, l, u, c, d, p, m, g, f, h, v) {
			e.connecting = !0, e.instruments = [], e.isPositionsViewMode = !1, e.mainContainerHeight = 505, e.group = null;
			var T = !1;
			e.viewModel = {
				isIeOrSafari: a.isIeOrSafari()
			}, e.initialize = function() {
				e.currentToken = s.getAuthenticationToken(), e.currentAccount = s.getCurrentAccount(), e.connecting = !1, T !== !0 && (T = !0, l.get().then(function(t) {
					t.favIcon && "" !== t.favIcon ? $("head").append('<link href="' + t.favIcon + '" id="fav-icon" rel="shortcut icon" type="image/x-icon" />') : $("head").append('<link href="/Content/Images/favicon.png" id="fav-icon" rel="shortcut icon" type="image/x-icon" />'), e.supportsEarlyClosure = t.supportsEarlyClosure, v.setEarlyClosureMarkdown(t.earlyClosureMarkdown), e.$broadcast("brokerDetailsReceived", t)
				}, function(e) {}), s.getGroup().then(function(t) {
					e.$broadcast("groupDetailsReceived", t)
				}, function(e) {}), f.fetchInstrumentsFromBackend().then(function(t) {
					e.$broadcast("instrumentsLoaded", f.sortedInstruments)
				}, function(e) {}))
			}, e.logout = function() {
				r.remove("BX8Trader-Auth"), h.logTraderEvent("User", "Logout", "Success"), e.$emit("loggedOut")
			}, e.handleAccountDisabled = function(e) {
				a.popupMessage(p.getTranslation("login.error-account-disabled-header"), p.getTranslation("login.error-account-disabled").replace(/\n/g, "<br>"), p.getTranslation("general.ok"))
			}, $(document).bind("touchmove", function(e) {
				e.preventDefault()
			}), e.$on("InsrumentsChangedSignalR", function(n, o) {
				e.$apply(function() {
					for (var n = 0; n < o.length; n++) {
						var i = o[n],
							r = i.symbolId;
						f.onInstrument(i), i.enabled && i.visible || e.$broadcast("instrumentHiddenOrDisabled", i);
						for (var s = 0; s < f.sortedInstruments.length; s++) f.sortedInstruments[s].symbolId == i.symbolId && (f.sortedInstruments[s].enabled = i.enabled, f.sortedInstruments[s].name = i.instrument, f.sortedInstruments[s].longTermOptionEnabled = i.longTermOptionEnabled, f.sortedInstruments[s].instantOptionEnabled = i.instantOptionEnabled);
						for (var a = 0; a < f.sortedInstruments.length; a++)
							if (f.sortedInstruments[a].symbolId === r) {
								var l;
								if (null != e.group) {
									for (var u in f.sortedInstruments[a].instantOptions) l = f.sortedInstruments[a].instantOptions[u].payout + e.group.payoutDelta, l < 0 && (l = 0), f.sortedInstruments[a].instantOptions[u].payout = l;
									for (var u in f.sortedInstruments[a].options) l = f.sortedInstruments[a].options[u].payout + e.group.payoutDelta, l < 0 && (l = 0), f.sortedInstruments[a].options[u].payout = l;
									for (var u in f.sortedInstruments[a].longTermOptions) l = f.sortedInstruments[a].longTermOptions[u].payout + e.group.payoutDelta, l < 0 && (l = 0), f.sortedInstruments[a].longTermOptions[u].payout = l
								}
								t.$broadcast("instrumentChanged", f.sortedInstruments[a])
							}
					}
				})
			}), e.$on("traderSentimentsChangedSignalR", function(t, n) {
				e.$apply(function() {
					for (var t = 0; t < n.length; t++) {
						var o = n[t];
						f.setInstrumentTraderSentiment(o), e.$broadcast("onTraderSentiment", o)
					}
				})
			}), e.$on("groupDetailsReceived", function(t, n) {
				e.group = n
			}), e.$on("onAccountAssignedSignalr", function(t, n) {
				e.group = n
			}), e.$on("AccountSignalr", function(t, n) {
				return n.disabled ? void e.handleAccountDisabled(n) : (m.setTime(n.time), e.currentAccount = n, s.setCurrentAccount(n), void e.$broadcast("account", n))
			}), e.$on("BrokerSignalr", function(t, n) {
				var o = document.getElementById("broker-css");
				if (n.favIcon && "" !== n.favIcon) {
					var i = document.getElementById("fav-icon");
					i && (i.remove(), $("head").append('<link href="' + n.favIcon + '" id="fav-icon" rel="shortcut icon" type="image/x-icon" />'))
				}
				var r = document.createElement("link");
				r.id = "broker-css", r.href = "/api/Trader/GetBrokerCss", r.rel = "stylesheet";
				var s = document.getElementsByTagName("body")[0];
				o.remove(), s.appendChild(r), e.supportsEarlyClosure = n.supportsEarlyClosure, v.setEarlyClosureMarkdown(n.earlyClosureMarkdown), l.setCache(n), e.$broadcast("brokerDetailsPushed", n)
			})
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("BrokerDepositModalController", ["$scope", "$uibModalInstance", "BrokerDetailsService", "$uibModal", "$sce", function(e, t, n, o, i) {
			e.buttonHeight = 35, e.padding = 10;
			var r = n.getFromCache();
			e.width = r.depositWithdrawalModalWidth || 800, e.height = r.depositWithdrawalModalHeight || 600, e.brokerDepositUrl = i.trustAsResourceUrl(r.depositUrl), e.closeModal = function() {
				t.close()
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("ClosedPositionsController", ["$scope", "$filter", "UserService", "ToolService", "ConfigurationService", "InstrumentService", "OPTION_TYPES", function(e, t, n, o, i, r, s) {
			e.closedPositionsSortFieldType = {
				asset: 0,
				openDate: 1,
				openTime: 2,
				expiryTime: 3,
				closeTime: 4,
				type: 5,
				direction: 6,
				amount: 7,
				entryPrice: 8,
				strikePrice: 9,
				returnAmount: 10,
				payout: 11,
				result: 12
			}, e.closedPositionTypes = s, e.closedPositions = [], e.displayedClosedPositions = [], e.closedPositionsPage = 0, e.closedPositionCount = 0, e.closedPositionsTotalCount = 0, e.accountCurrency = "", e.recordsPerPage = i.UI.Blotter.recordsPerPage, e.closedPositionsSortField = e.closedPositionsSortFieldType.expiryTime, e.closedPositionsSortDirection = !0, e.isOpen = !1, e.needsReinitialization = !0;
			var a = function(t) {
				e.$emit("ClosedPositionCountUpdated", t)
			};
			e.initialize = function() {
				l(), n.getAccount().then(function(t) {
					null != t && (e.accountCurrency = o.getCurrencySign(t.currency), a(t.totalTrades - t.openPositions.length))
				}, function(e) {})
			};
			var l = function() {
					for (var t = e.displayedClosedPositions.length; t < i.UI.Blotter.recordsPerPage; t++) e.displayedClosedPositions.push({
						id: o.generateGuid()
					})
				},
				u = function() {
					e.displayedClosedPositions = e.closedPositions, l()
				},
				c = function(t) {
					e.closedPositions = [];
					for (var n = 0; n < t.closedPositions.length; n++)
						if (e.closedPositions.every(function(e) {
								return e.id != t.closedPositions[n].id
							})) {
							var o = r.sortedInstruments.filter(function(e) {
								return e.instrumentId == t.closedPositions[n].instrumentId
							});
							o && o.length > 0 ? (t.closedPositions[n].instrument = o[0].name, t.closedPositions[n].digitsToDisplay = o[0].digitsToDisplay) : t.closedPositions[n].digitsToDisplay = 5, t.closedPositions[n].type = t.closedPositions[n].level, e.closedPositions.push(t.closedPositions[n])
						}
					e.closedPositionsTotalCount = t.totalCount, a(t.totalCount), u()
				},
				d = function(t, o, i, r) {
					e.closedPositionsPage = t, o || e.closedPositionsPage + 1 * e.recordsPerPage < e.closedPositionsTotalCount ? n.getClosedPositions(e.closedPositionsPage, i, r).then(function(e) {
						c(e)
					}, function(e) {}) : u(), e.needsReinitialization = !1
				};
			e.setSorting = function(t) {
				t == e.closedPositionsSortField ? e.closedPositionsSortDirection = !e.closedPositionsSortDirection : (e.closedPositionsSortField = t, e.closedPositionsSortDirection = !0), d(e.closedPositionsPage, !0, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}, e.getClosedPositionReturn = function(e) {
				return e.payout ? o.toPercentage(e.payout) : ""
			}, e.$on("backward", function(t, n) {
				d(n, !1, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}), e.$on("fastBackward", function(t, n) {
				d(n, !1, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}), e.$on("forward", function(t, n) {
				d(n, !1, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}), e.$on("fastForward", function(t, n) {
				d(n, !1, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}), e.$on("account", function(t, n) {
				var o = n.totalTrades - n.openPositions.length;
				e.closedPositionsTotalCount = o, e.$emit("ClosedPositionCountUpdated", o)
			}), e.$on("openPositionClosed", function(t) {
				e.isOpen ? d(e.closedPositionsPage, !0, e.closedPositionsSortField, e.closedPositionsSortDirection) : e.needsReinitialization = !0
			}), e.$on("closedPositionsListOpened", function(t) {
				e.isOpen = !0, e.needsReinitialization && d(0, !0, e.closedPositionsSortField, e.closedPositionsSortDirection)
			}), e.$on("closedPositionsListClosed", function(t) {
				e.isOpen = !1
			});
			var p = function(t) {
				var n = e.closedPositions.filter(function(e) {
					return e.instrumentId === t.instrumentId
				});
				n.length > 0 && n.forEach(function(e) {
					e.instrument = t.name
				}), u()
			};
			e.$on("instrumentChanged", function(e, t) {
				p(t)
			})
		}])
	}(BX8Trader), BX8Trader.controller("DoublePositionConfirmationModalController", ["$rootScope", "$scope", "$uibModalInstance", "$timeout", "TranslationService", "ConfigurationService", "AnalyticsService", "$http", "TimeService", "UserService", "request", "token", "SignalRService", "ToolService", "InstrumentService", function(e, t, n, o, i, r, s, a, l, u, c, d, p, m, g) {
	var f = {
		"-4": "300 Seconds",
		"-3": "120 Seconds",
		"-2": "90 Seconds",
		"-1": "60 Seconds",
		0: "5 Minutes",
		1: "15 Minutes",
		2: "30 Minutes",
		3: "60 Minutes",
		4: "1 Month",
		5: "2 Months",
		6: "4 Months",
		7: "12 Months",
		8: "End of day",
		9: "End of week"
	};
	t.showStatus = !1, t.closePopupTimeout = null, t.anyQuoteReceived = !1, t.amount = c.amount, t.direction = t.direction = i.getTranslation("positions.direction." + c.direction.toString().toLowerCase()), t.symbolId = c.symbolId, t.tradeInProgress = !1, t.openSuccess = !1, t.iconRightPosition = "-85px", t.tradeComplete = !1, t.optionLevel = c.level;
	var h = u.getCurrentAccount();
	t.accountCurrency = h && h.currency ? h.currency : "", t.amount = m.getCurrencyNumber(c.amount, t.accountCurrency), t.currentInstrument = angular.copy(c.instrumentData), t.payout = m.getCurrencyNumber((1 + c.payout) * c.amount, t.accountCurrency, 1), t.entryTime = c.option && c.option.timeLeftUpdateTime ? new Date(c.option.timeLeftUpdateTime) : new Date, t.expiryTime = c.expireTime.toDate(), t.statusHeader = i.getTranslation("positions.double-up-position-modal.header"), t.handleOpenResult = function(a) {
		if (t.anyQuoteReceived = !1, t.tradeComplete = !0, t.tradeInProgress = !1, c.positionId = a && a.positionId, a && a.confirmed) t.openSuccess = !0, t.showStatus = !0, t.statusHeader = i.getTranslation("positions.open-position-summary-modal.success-header"), s.logTraderEvent("Positions", "Position Opened"), c && c.instrument && c.instrument.name && s.logTraderEvent("Positions", "Position By Symbol", c.instrument.name.toUpperCase()), c && c.direction && s.logTraderEvent("Positions", "Position By Direction", c.direction.toUpperCase()), c && c.option && c.option.level && f[c.option.level] && s.logTraderEvent("Positions", "Position By Duration", f[c.option.level].toUpperCase()), null != c.instantIndex && (m.isIeOrSafari() ? $('[instant-widget="' + c.instantIndex + '"]').addClass("one-slide-left") : $("#flipper-" + c.instantIndex).addClass("flip"), e.$broadcast("instantPositionOpened", c, a)), t.displayPositionSummary(a);
		else if (t.openSuccess = !1, t.showStatus = !0, t.iconRightPosition = "-87px", t.statusHeader = i.getTranslation("positions.open-position-summary-modal.failed-header"), a.rejectReason) {
			s.logTraderEvent("Positions", "Position Rejected", a.rejectReason);
			var l = "positions.open-position-result-" + a.rejectReason;
			t.status = i.getTranslation(l)
		} else t.status = a;
		t.closePopupTimeout = o(function() {
			n.close()
		}, r.Trading.Popups.AutoCloseTimeout)
	}, t.calculatePayout = function() {
		return m.getCurrencyNumber((1 + c.option.payout) * c.amount, t.accountCurrency, 1)
	}, t.displayPositionSummary = function(e) {
		t.instrumentName = c.instrument.name, t.currentPrice = angular.copy(c.instrument.price), t.payout = t.calculatePayout(), t.expiryTime = t.expiryTime, t.amount = m.getCurrencyNumber(c.amount, t.accountCurrency), t.direction = i.getTranslation("positions.direction." + c.direction.toString().toLowerCase())
	}, t.confirm = function() {
		var e = r.API.Trader.OpenPosition;
		s.logTraderEvent("Positions", "Confirmation", "Trade clicked"), t.tradeInProgress = !0, t.statusHeader = i.getTranslation("positions.open-position-summary-modal.title") + "...", t.status = "";
		var n = {
			instrumentId: c.instrumentId,
			amount: c.amount,
			direction: c.direction,
			openPrice: t.currentInstrument.price,
			expireTime: t.expiryTime,
			level: c.level
		};
		l.removeClockTickedCallback("confirmation"), a({
			method: "POST",
			url: e,
			timeout: 1e4,
			params: {
				token: d
			},
			data: n
		}).then(function(e) {
			t.handleOpenResult(e.data)
		}, function(e, n) {
			t.handleOpenResult(e.data)
		})
	}, t.ok = function() {
		t.closePopupTimeout && o.cancel(t.closePopupTimeout), n.close()
	}, t.cancel = function() {
		t.closePopupTimeout && o.cancel(t.closePopupTimeout), s.logTraderEvent("Positions", "Confirmation", "Cancel clicked"), n.dismiss("cancel")
	}, t.$on("quote", function(e, n) {
		!t.currentInstrument || t.tradeInProgress || t.tradeComplete || n.symbolId === t.currentInstrument.symbolId && (t.currentInstrument.price < n.price && (t.currentInstrument.arrowCssName = "fa-caret-up price-up"), t.currentInstrument.price > n.price && (t.currentInstrument.arrowCssName = "fa-caret-down price-down"), t.currentInstrument.oldPrice = t.currentInstrument.price, t.currentInstrument.price = n.price, t.currentInstrument.displayPrice = t.currentInstrument.price.toFixed(t.currentInstrument.digitsToDisplay), t.anyQuoteReceived || (t.anyQuoteReceived = !0))
	}), t.onInstrument = function(e) {
		var n = null;
		n = g.isLongTerm(c.option.level) ? e.longTermOptions.filter(function(e) {
			return e.level === c.option.level
		}) : e.options.filter(function(e) {
			return e.level === c.option.level
		}), n && n.length > 0 && (c.option = n[0]), t.currentInstrument = angular.copy(e), t.payout = t.calculatePayout()
	}, t.$on("instrumentChanged", function(e, n) {
		t.currentInstrument.instrumentId === n.instrumentId && t.onInstrument(n)
	}), t.$on("$destroy", function() {
		l.removeClockTickedCallback("confirmation")
	}), l.addClockTickedCallback(function(e) {
		t.entryTime = e.toDate(), null != c.instantIndex && (t.expiryTime = moment(e).add("s", moment.duration(c.option.duration).asSeconds()).format("HH:mm:ss"))
	}, "confirmation")
}]),
	function(e, t) {
		e.controller("EarlyClosurePositionConfirmationModalController", ["$rootScope", "$scope", "$uibModalInstance", "EarlyClosurePositionService", "InstrumentService", "TimeService", "position", function(e, n, o, i, r, s, a) {
			var l = {
				_timerName: "early-closure-timer",
				_minPrice: null,
				_maxPrice: null,
				style: {
					modalHeight: 350,
					checkRight: -85
				},
				loading: !0,
				position: a,
				arrowCssName: null,
				closureResult: null,
				failedToClose: function() {
					return null != this.closureResult
				},
				loadMinMaxPrice: function() {
					r.getMinMaxPriceForSymbol(this.position.symbolId, this.position.openDateTime, new Date).then(function(e) {
						(null == this._minPrice || this._minPrice > e.min) && (this._minPrice = e.min), (null == this._maxPrice || this._maxPrice < e.max) && (this._maxPrice = e.max), this.loading = !1
					}.bind(n), function() {
						this.loading = !1, this.closureResult = {}
					})
				},
				confirm: function() {
					i.closePosition(this.position).then(function(e) {
						e.confirmed ? this.close(e) : (this.closureResult = e, this.style.modalHeight = 300, this.style.checkRight = -81)
					}.bind(n))
				},
				cancel: function() {
					this._destroy(), o.dismiss("cancel")
				},
				close: function(e) {
					this._destroy(), o.close(e)
				},
				onQuote: function(e) {
					this.position.symbolId === e.symbolId && (this._updateMinMax(e), this._recalculatePriceDirection(e), this._recalculateProfit(), this.position.currentPrice = e.price)
				},
				onClockTicked: function(e) {
					e.toDate() >= new Date(this.position.option.noEntryTime) && this.cancel()
				},
				_updateMinMax: function(e) {
					(e.price > this._maxPrice || null == this._maxPrice) && (this._maxPrice = e.price), (e.price < this._minPrice || null == this._minPrice) && (this._minPrice = e.price)
				},
				_recalculateProfit: function() {
					if (!this.loading) {
						var e = i.recalculateProfit(this.position, new Date, this.position.currentPrice, this._minPrice, this._maxPrice, this.earlyClosureMarkdown);
						this.position.calculatedPayout = e
					}
				},
				_recalculatePriceDirection: function(e) {
					this.position.currentPrice < e.price && (this.arrowCssName = "fa-caret-up price-up"), this.position.currentPrice > e.price && (this.arrowCssName = "fa-caret-down price-down")
				},
				_destroy: function() {
					s.removeClockTickedCallback(this._timerName)
				}
			};
			t.extend(n, l), n.loadMinMaxPrice(), n.$on("quote", function(e, t) {
				n.onQuote(t)
			}), s.addClockTickedCallback(n.onClockTicked.bind(n), n._timerName)
		}])
	}(BX8Trader, angular),
	function(e) {
		"use strict";
		e.controller("ExpiryHistoryController", ["$scope", "$filter", "UserService", "ToolService", "ConfigurationService", "TranslationService", "BrokerDetailsService", "InstrumentService", "QuotesService", "toaster", "TimeService", function(e, t, n, o, i, r, s, a, l, u, c) {
			function d() {
				e.displayedQuoteHistory = [], e.displayedQuoteHistory = t("orderBy")(e.expiredOptions, e.expiredOptionsSortField, e.expiredOptionsSortDirection);
				var n = e.expiredOptionsPage * e.recordsPerPage,
					o = (e.expiredOptionsPage + 1) * e.recordsPerPage;
				e.displayedQuoteHistory = e.displayedQuoteHistory.slice(n, o);
				for (var i = e.displayedQuoteHistory.length; i < e.recordsPerPage; i++) e.displayedQuoteHistory.push({});
				for (var i = 0; i < e.displayedQuoteHistory.length && a.getInstrumentByName(e.displayedQuoteHistory[i].assetName); i++) e.displayedQuoteHistory[i].precision = a.getInstrumentByName(e.displayedQuoteHistory[i].assetName).digitsToDisplay
			}
			e.expiredOptions = [], e.instrument = "", e.expiredOptionsPage = 0, e.expiredOptionsSortField = "closeTime", e.expiredOptionsSortDirection = !0, e.recordsPerPage = 20, e.isOpen = !1, e.needsReinitialization = !0, e.instruments = [], e.instrument, e.filteringInProgress = !1, a.fetchInstrumentsFromBackend().then(function() {
				e.instruments = angular.copy(a.sortedInstruments), e.instruments.unshift({
					name: r.getTranslation("widget.blotter.positions.all-assets"),
					enabled: !0
				}), e.instrument = e.instruments[0]
			}, function(e) {
				console.log("instruments load failure")
			}), e.updateQuotesHistory = function(t) {
				e.expiredOptionsPage = t > 0 ? t : 0, d()
			}, e.getQuotes = function() {
				return e.filteringInProgress = !0, e.dateFilter.from > e.dateFilter.to ? void u.pop({
					type: "error",
					title: r.getTranslation("manager.errors.before-and-after-error")
				}) : e.dateFilter.to - e.dateFilter.from > 864e5 ? void u.pop({
					type: "error",
					title: r.getTranslation("manager.errors.day-error")
				}) : void l.getClosePriceHistory(e.dateFilter.from, e.dateFilter.to, e.instrument.name).then(function(n) {
					e.errorMessage = !1, e.expiredOptions = t("orderBy")(n, "closeTime", !0), e.totalCount = n.length, 0 == e.totalCount && u.pop({
						type: "error",
						title: r.getTranslation("positions.open-position-result-QuoteOffline")
					}), e.expiredOptionsPage = 0, e.updateQuotesHistory(e.expiredOptionsPage), p(e.totalCount), e.filteringInProgress = !1
				}, function(e) {
					u.pop({
						type: "error",
						title: e
					})
				})
			}, setTimeout(function() {
				e.dateFilter = {
					from: c.getCurrentTime().subtract(1, "days").toDate(),
					to: c.getCurrentTime().toDate()
				}, e.getQuotes()
			}, 1);
			var p = function(t) {
				e.$emit("QuotesHistoryCountUpdated", t)
			};
			e.setSorting = function(t) {
				t == e.expiredOptionsSortField ? e.expiredOptionsSortDirection = !e.expiredOptionsSortDirection : (e.expiredOptionsSortField = t, e.expiredOptionsSortDirection = !0), d()
			}, e.changeInstrument = function(t) {
				e.instrument = t, e.getQuotes()
			}, e.$watch("expiredOptions", function() {
				e.updateQuotesHistory(e.expiredOptionsPage)
			}), e.$watch("expiredOptionsPage", function() {
				e.updateQuotesHistory(e.expiredOptionsPage)
			}), e.$on("backward", function(t, n) {
				e.updateQuotesHistory(n)
			}), e.$on("fastBackward", function(t, n) {
				e.updateQuotesHistory(n);
			}), e.$on("forward", function(t, n) {
				e.updateQuotesHistory(n)
			}), e.$on("fastForward", function(t, n) {
				e.updateQuotesHistory(n)
			})
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("FinancialTransactionsController", ["$scope", "$filter", "UserService", "ToolService", "ConfigurationService", "TranslationService", "BrokerDetailsService", function(e, t, n, o, i, r, s) {
			e.financialTransactions = [], e.displayedFinancialTransactions = [], e.financialTransactionsPage = 0, e.currentAccount = null, e.currentAccountCurrency = "", e.financialTransactionsSortField = "date", e.financialTransactionsSortDirection = !1, e.recordsPerPage = i.UI.Blotter.recordsPerPage, e.isOpen = !1, e.needsReinitialization = !0, e.isUsingCredit = s.getFromCache().isUsingCredit;
			var a = function(t) {
				e.$emit("FinancialTransactionCountUpdated", t)
			};
			e.initialize = function() {
				n.getAccount().then(function(e) {
					null != e && a(e.totalFinancialTransactions)
				})
			};
			var l = function() {
				e.displayedFinancialTransactions = [], e.displayedFinancialTransactions = t("orderBy")(e.financialTransactions, e.financialTransactionsSortField, e.financialTransactionsSortDirection);
				var n = e.financialTransactionsPage * i.UI.Blotter.recordsPerPage,
					o = (e.financialTransactionsPage + 1) * i.UI.Blotter.recordsPerPage;
				e.displayedFinancialTransactions = e.displayedFinancialTransactions.slice(n, o);
				for (var r = e.displayedFinancialTransactions.length; r < i.UI.Blotter.recordsPerPage; r++) e.displayedFinancialTransactions.push({})
			};
			e.getFinancialTransactions = function() {
				n.getFinancialTransactions().then(function(i) {
					null != i.transactions && (e.currentAccount = n.getCurrentAccount(), e.currentAccountCurrency = o.getCurrencySign(e.currentAccount.currency), e.financialTransactions = i.transactions, e.financialTransactions = t("orderBy")(e.financialTransactions, "date", !0), e.updateFinancialTransactions(e.financialTransactionsPage), e.totalCount = i.totalCount, a(e.totalCount), e.needsReinitialization = !1)
				}, function(e) {})
			}, e.setSorting = function(t) {
				t == e.financialTransactionsSortField ? e.financialTransactionsSortDirection = !e.financialTransactionsSortDirection : (e.financialTransactionsSortField = t, e.financialTransactionsSortDirection = !0), l()
			}, e.getTransactionType = function(t) {
				if (!t.type) return "";
				if (e.isUsingCredit) {
					var n = t.type.toString().toLowerCase(),
						i = n.match(/(in|out)$/),
						s = i ? "credit-" + i[0] : n;
					return o.ucWords(r.getTranslation("financial.transaction-type." + s))
				}
				return o.ucWords(r.getTranslation("financial.transaction-type." + t.type.toString().toLowerCase()))
			}, e.updateFinancialTransactions = function(t) {
				e.financialTransactionsPage = t, l()
			}, e.$watch("financialTransactions", function() {
				e.updateFinancialTransactions(e.financialTransactionsPage)
			}), e.$watch("financialTransactionsPage", function() {
				e.updateFinancialTransactions(e.financialTransactionsPage)
			}), e.$on("backward", function(t, n) {
				e.updateFinancialTransactions(n)
			}), e.$on("fastBackward", function(t, n) {
				e.updateFinancialTransactions(n)
			}), e.$on("forward", function(t, n) {
				e.updateFinancialTransactions(n)
			}), e.$on("fastForward", function(t, n) {
				e.updateFinancialTransactions(n)
			}), e.$on("account", function(t, n) {
				n.totalFinancialTransactions !== e.financialTransactions.length && e.getFinancialTransactions()
			}), e.$on("financialTransactionsListOpened", function(t) {
				e.isOpen = !0, e.needsReinitialization && e.getFinancialTransactions()
			}), e.$on("financialTransactionsListClosed", function(t) {
				e.isOpen = !1
			})
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.controller("NoBalanceModalController", ["$scope", "$uibModalInstance", "TranslationService", "BrokerDetailsService", "ConfigurationService", "AnalyticsService", "$http", "$window", "UserService", "$uibModal", function(e, t, n, o, i, r, s, a, l, u) {
			e.close = function() {
				t.close()
			}, e.depositClicked = function() {
				var e, n = o.getFromCache(),
					c = n.depositWithdrawalModalWidth || 800,
					d = n.depositWithdrawalModalHeight || 600,
					p = n.depositUrl;
				r.logTraderEvent("Financial Panel", "Deposit Clicked"), n.depositWithdrawalModalShow ? (e = u.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/brokerDepositModal.html",
					windowClass: "catch-me",
					controller: "BrokerDepositModalController",
					resolve: {
						brokerDetails: n
					}
				}), setTimeout(function() {
					var e = $("div.catch-me > div").width(c);
					e.find("div.modal-body").height(d)
				}, 1), t.close()) : (a.open(p), t.close());
				var m = i.API.Trader.ReadyToDeposit;
				s({
					method: "POST",
					url: m,
					params: {
						token: l.getAuthenticationToken()
					}
				})
			}
		}])
	}(BX8Trader), BX8Trader.controller("OpenPositionConfirmationModalController", ["$rootScope", "$scope", "$uibModalInstance", "$timeout", "TranslationService", "ConfigurationService", "AnalyticsService", "$http", "TimeService", "UserService", "request", "token", "isScheduled", "SignalRService", "ToolService", "InstrumentService", function(e, t, n, o, i, r, s, a, l, u, c, d, p, m, g, f) {
	var h = {
		"-8": "12 Months",
		"-7": "4 Months",
		"-6": "2 Months",
		"-5": "1 Month",
		"-4": "300 Seconds",
		"-3": "120 Seconds",
		"-2": "90 Seconds",
		"-1": "60 Seconds",
		0: "5 Minutes",
		1: "15 Minutes",
		2: "30 Minutes",
		3: "60 Minutes",
		4: "1 Month",
		5: "2 Months",
		6: "4 Months",
		7: "12 Months",
		8: "End of day",
		9: "End of week"
	};
	t.showStatus = !1, t.closePopupTimeout = null, t.anyQuoteReceived = !1, t.amount = c.amount, t.direction = t.direction = i.getTranslation("positions.direction." + c.direction.toString().toLowerCase()), t.symbolId = c.instrument.symbolId, t.tradeInProgress = !1, t.openSuccess = !1, t.iconRightPosition = "-85px", t.tradeComplete = !1, t.optionLevel = c.option.level;
	var v = u.getCurrentAccount();
	t.accountCurrency = v && v.currency ? v.currency : "", t.amount = g.getCurrencyNumber(c.amount, t.accountCurrency), t.currentInstrument = angular.copy(c.instrument), p ? (t.payout = g.getCurrencyNumber((1 + c.option.payout) * c.amount, t.accountCurrency, 1), t.entryTime = c.option && c.option.timeLeftUpdateTime ? new Date(c.option.timeLeftUpdateTime) : new Date, t.expiryTime = c.option.fullExpireTime || c.option.expire) : (t.payout = g.getCurrencyNumber((1 + c.option.payout) * c.amount, t.accountCurrency, 1), t.optionLevel >= -4 ? t.expiryTime = moment(t.entryTime).add("s", moment.duration(c.option.duration).asSeconds()).toDate() : t.expiryTime = moment(t.entryTime).add("s", moment.duration(c.option.duration).asSeconds()).toDate()), t.handleOpenResult = function(a) {
		if (t.anyQuoteReceived = !1, t.tradeComplete = !0, t.tradeInProgress = !1, c.positionId = a && a.positionId, a && a.confirmed) t.openSuccess = !0, t.showStatus = !0, t.statusHeader = i.getTranslation("positions.open-position-summary-modal.success-header"), s.logTraderEvent("Positions", "Position Opened"), c && c.instrument && c.instrument.name && s.logTraderEvent("Positions", "Position By Symbol", c.instrument.name.toUpperCase()), c && c.direction && s.logTraderEvent("Positions", "Position By Direction", c.direction.toUpperCase()), c && c.option && c.option.level && h[c.option.level] && s.logTraderEvent("Positions", "Position By Duration", h[c.option.level].toUpperCase()), null != c.instantIndex && c.option.level >= -4 && (g.isIeOrSafari() ? $('[instant-widget="' + c.instantIndex + '"]').addClass("one-slide-left") : $("#flipper-" + c.instantIndex).addClass("flip"), e.$broadcast("instantPositionOpened", c, a)), t.displayPositionSummary(a);
		else if (t.openSuccess = !1, t.showStatus = !0, t.iconRightPosition = "-80px", t.statusHeader = i.getTranslation("positions.open-position-summary-modal.failed-header"), a.rejectReason) {
			s.logTraderEvent("Positions", "Position Rejected", a.rejectReason);
			var l = "positions.open-position-result-" + a.rejectReason;
			t.status = i.getTranslation(l)
		} else t.status = a;
		t.closePopupTimeout = o(function() {
			n.close()
		}, r.Trading.Popups.AutoCloseTimeout)
	}, t.calculatePayout = function() {
		return p ? g.getCurrencyNumber((1 + c.option.payout) * c.amount, t.accountCurrency, 1) : g.getCurrencyNumber((1 + c.option.payout) * c.amount, t.accountCurrency, 1)
	}, t.displayPositionSummary = function(e) {
		t.instrumentName = c.instrument.name, t.currentPrice = angular.copy(c.instrument.price), t.payout = t.calculatePayout(), p && (t.expiryTime = t.expiryTime), t.amount = g.getCurrencyNumber(c.amount, t.accountCurrency), t.direction = i.getTranslation("positions.direction." + c.direction.toString().toLowerCase())
	}, t.confirm = function() {
		var e;
		e = p ? r.API.Trader.OpenPosition : r.API.Trader.OpenInstantPosition, s.logTraderEvent("Positions", "Confirmation", "Trade clicked"), t.tradeInProgress = !0, t.statusHeader = i.getTranslation("positions.open-position-summary-modal.title") + "...", t.status = "";
		var n = {
			instrumentId: c.instrument.instrumentId,
			amount: c.amount,
			direction: c.direction,
			openPrice: t.currentInstrument.price
		};
		p && c.option ? (n.expireTime = c.option.fullExpireTime, n.level = c.option.level) : n.level = c.option.level, l.removeClockTickedCallback("confirmation"), a({
			method: "POST",
			url: e,
			timeout: 1e4,
			params: {
				token: d
			},
			data: n
		}).then(function(e) {
			t.handleOpenResult(e.data)
		}, function(e, n) {
			t.handleOpenResult(e.data)
		})
	}, t.ok = function() {
		t.closePopupTimeout && o.cancel(t.closePopupTimeout), n.close()
	}, t.cancel = function() {
		t.closePopupTimeout && o.cancel(t.closePopupTimeout), s.logTraderEvent("Positions", "Confirmation", "Cancel clicked"), n.dismiss("cancel")
	}, t.$on("quote", function(e, n) {
		!t.currentInstrument || t.tradeInProgress || t.tradeComplete || n.symbolId === t.currentInstrument.symbolId && (t.currentInstrument.price < n.price && (t.currentInstrument.arrowCssName = "fa-caret-up price-up"), t.currentInstrument.price > n.price && (t.currentInstrument.arrowCssName = "fa-caret-down price-down"), t.currentInstrument.oldPrice = t.currentInstrument.price, t.currentInstrument.price = n.price, t.currentInstrument.displayPrice = t.currentInstrument.price.toFixed(t.currentInstrument.digitsToDisplay), t.anyQuoteReceived || (t.anyQuoteReceived = !0))
	}), t.onInstrument = function(e) {
		var n = null;
		p ? (n = f.isLongTerm(c.option.level) ? e.longTermOptions.filter(function(e) {
			return e.level === c.option.level
		}) : e.options.filter(function(e) {
			return e.level === c.option.level
		}), n && n.length > 0 && (c.option = n[0])) : c.instrument = e, t.currentInstrument = angular.copy(e), t.payout = t.calculatePayout()
	}, t.$on("instrumentChanged", function(e, n) {
		t.currentInstrument.instrumentId === n.instrumentId && t.onInstrument(n)
	}), t.$on("$destroy", function() {
		l.removeClockTickedCallback("confirmation")
	}), l.addClockTickedCallback(function(e) {
		t.entryTime = e.toDate(), null != c.instantIndex && (t.optionLevel >= -4 ? t.expiryTime = moment(t.entryTime).add("s", moment.duration(c.option.duration).asSeconds()).toDate() : t.expiryTime = moment(t.entryTime).add("s", moment.duration(c.option.duration).asSeconds()).toDate())
	}, "confirmation")
}]),
	function(e, t) {
		"use strict";
		e.controller("OpenPositionsController", ["$scope", "$rootScope", "$filter", "$uibModal", "$interval", "UserService", "ToolService", "ConfigurationService", "TranslationService", "InstrumentService", "OPTION_TYPES", "$timeout", "TimeService", function(e, n, o, i, r, s, a, l, u, c, d, p, m) {
			var g = [],
				f = function(e) {
					var t = {
						instant: null,
						scheduled: []
					};
					return g.forEach(function(n) {
						e.some(function(e) {
							return e.positionId == n.positionId
						}) || ("instant" == n.type.toLowerCase() ? t.instant = n : "scheduled" == n.type.toLowerCase() && t.scheduled.push(n))
					}), t
				},
				h = function(e, t) {
					var n = function(t) {
							var n = t.filter(function(t) {
								return t.level === e.level && t.fullExpireTime === e.expireTime
							});
							return n.length > 0 ? n[0] : null
						},
						o = n(t.options);
					return null == o && (o = n(t.longTermOptions)), o
				},
				v = function() {
					e.openPositions.forEach(function(e) {
						var t = c.getInstrumentById(e.instrumentId);
						t && t.name ? (e.instrument = t.name, e.instrumentSupportsEarlyClosure = t.earlyClosureAvailable, e.digitsToDisplay = t.digitsToDisplay, null == e.option && (e.option = h(e, t))) : e.digitsToDisplay = 5
					})
				};
			e.openPositionTypes = d, e.currentAccount = null, e.openPositions = [], e.displayedOpenPositions = [], e.openPositionsPage = 0, e.accountCurrency = "", e.recordsPerPage = l.UI.Blotter.recordsPerPage, e.openPositionsSortField = "openDate", e.openPositionsSortDirection = !0, e.positionChartIsOpen = [], e.initialize = function() {
				s.getAccount().then(function(t) {
					null != t && (e.currentAccount = t, e.accountCurrency = a.getCurrencySign(e.currentAccount.currency), e.openPositions = t.openPositions, v(), e.onAccountUpdate(e.currentAccount), e.updateOpenPositions(e.openPositionsPage))
				}, function(e) {})
			}, e.setSorting = function(t) {
				t == e.openPositionsSortField ? e.openPositionsSortDirection = !e.openPositionsSortDirection : (e.openPositionsSortField = t, e.openPositionsSortDirection = !0), e.updateOpenPositions(e.openPositionsPage)
			}, e.updateOpenPositions = function(t) {
				e.openPositionsPage = t > 0 ? t : 0;
				var n = "openDate" == e.openPositionsSortField ? "openDateTime" : e.openPositionsSortField;
				e.displayedOpenPositions = o("orderBy")(e.openPositions, n, e.openPositionsSortDirection).slice(e.openPositionsPage * e.recordsPerPage, e.openPositionsPage * e.recordsPerPage + e.recordsPerPage), e.displayedOpenPositions.map(function(e) {
					if (e.instrumentData = c.getInstrumentBySymbolId(e.symbolId), e.instrumentData) {
						var t = e.instrumentData.options.filter(function(t) {
							if (t.level == e.level && 0 == moment(t.fullExpireTime).diff(e.expireTime)) return t
						})[0];
						return t && (e.isInEntryZone = !0), e.showChart = !1, e
					}
				});
				for (var i = e.displayedOpenPositions.length; i < l.UI.Blotter.recordsPerPage; i++) e.displayedOpenPositions.push({})
			}, e.checkEntryZone = function(e) {
				return console.log(e.level >= 0), console.log(moment(e.noEntryTime).diff(m.getCurrentTime())), e.level >= 0 && moment(e.noEntryTime).diff(m.getCurrentTime()) > 0
			}, e.checkEarlyClosure = function(e) {
				return console.log(e), e.instrumentSupportsEarlyClosure && e.level >= 0 && moment(e.option.startEarlyClosureTime).diff(m.getCurrentTime() > 0)
			}, e.earlyClose = function(e) {
				i.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/EarlyClosurePositionConfirmationModal.html",
					controller: "EarlyClosurePositionConfirmationModalController",
					size: "sm",
					resolve: {
						position: function() {
							return t.copy(e)
						}
					}
				})
			}, e.doubleUp = function(e) {
				e.isInEntryZone && i.open({
					templateUrl: "/Scripts/Trader/Views/Positions/Popups/DoublePositionConfirmationModal.html",
					controller: "DoublePositionConfirmationModalController",
					size: "sm",
					resolve: {
						request: function() {
							return t.copy(e)
						},
						token: function() {
							return s.getAuthenticationToken()
						}
					}
				})
			};
			e.$watch("openPositions", function() {
				for (var t = 0; t < e.openPositions.length; t++) {
					var o = e.openPositions[t];
					o.calculatedPayout = (1 + o.payout) * o.amount
				}
				v(), e.updateOpenPositions(e.openPositions.length < e.openPositionsPage * e.recordsPerPage + e.recordsPerPage ? e.openPositionsPage - 1 : e.openPositionsPage), n.$broadcast("openPositionCountUpdated", e.openPositions.length)
			}), e.$on("account", function(t, n) {
				e.currentAccount = n, e.openPositions = n.openPositions, v()
			}), e.$on("backward", function(t, n) {
				e.updateOpenPositions(n)
			}), e.$on("fastBackward", function(t, n) {
				e.updateOpenPositions(n)
			}), e.$on("forward", function(t, n) {
				e.updateOpenPositions(n)
			}), e.$on("fastForward", function(t, n) {
				e.updateOpenPositions(n)
			}), e.onAccountUpdate = function(o) {
				if (o.version > e.accountVersion) {
					e.balance = o.balance;
					for (var i = 0; i < o.openPositions.length; i++) {
						for (var r = !1, s = new Date(o.openPositions[i].openTime), l = a.getFormattedDate(s, "dd/MM/yyyy"), u = a.getFormattedDate(s, "HH:mm:ss", "GMT"), c = 0; c < e.openPositions.length; c++)
							if (e.openPositions[c].positionId == o.openPositions[i].positionId) {
								r = !0, e.openPositions[c].instrument = o.openPositions[i].instrument, e.openPositions[c].symbolId = o.openPositions[i].symbolId, e.openPositions[c].direction = o.openPositions[i].direction, e.openPositions[c].amount = o.openPositions[i].amount, e.openPositions[c].payout = o.openPositions[i].payout, e.openPositions[c].openPrice = o.openPositions[i].openPrice, e.openPositions[c].openDate = l, e.openPositions[c].openTime = u, e.openPositions[c].openDateTime = s, e.openPositions[c].expireTime = moment(o.openPositions[i].expireTime), e.openPositions[c].calculatedPayout = (1 + o.openPositions[i].payout) * o.openPositions[i].amount, e.openPositions[i].oldPrice = -1;
								break
							}
						if (!r) {
							var d = {
								positionId: o.openPositions[i].positionId,
								instrument: o.openPositions[i].instrument,
								symbolId: o.openPositions[i].symbolId,
								direction: o.openPositions[i].direction,
								amount: o.openPositions[i].amount,
								payout: o.openPositions[i].payout,
								openPrice: o.openPositions[i].openPrice,
								oldPrice: -1,
								openDate: l,
								openTime: u,
								expireTime: moment(o.openPositions[i].expireTime),
								currentPrice: 0
							};
							e.openPositions.push(d), n.$broadcast("openPositionCountUpdated", e.openPositions.length), e.updateOpenPositions(e.openPositionsPage)
						}
					}
					for (var p = 0; p < g.length; p++) {
						for (var m = !1, f = 0; f < o.openPositions.length; f++)
							if (g[p].positionId == o.openPositions[f].positionId) {
								m = !0;
								break
							}
						if (!m) {
							var h = g.slice(p, p + 1);
							n.$broadcast("openPositionClosed", h)
						}
					}
					g = t.copy(e.openPositions)
				}
			}, e.$on("account", function(t, o) {
				if (g && g.length > o.openPositions.length) {
					var i = f(o.openPositions),
						r = [];
					i.instant && r.push(i.instant.positionId), i.scheduled.forEach(function(e) {
						r.push(e.positionId)
					}), s.getClosedPositionsById(r).then(function(e) {
						var t = {
							instant: null,
							scheduled: []
						};
						e.closedPositions.forEach(function(e) {
							i.instant && e.positionId == i.instant.positionId ? t.instant = e : t.scheduled.push(e)
						}), t.instant && n.$broadcast("instantPositionClosed", t.instant), t.scheduled.length > 0 && n.$broadcast("scheduledPositionClosed", t.scheduled)
					}, function(e) {})
				}
				e.onAccountUpdate(o)
			}), e.$on("quote", function(t, n) {
				for (var o = 0; o < e.openPositions.length; o++) e.openPositions[o].symbolId == n.symbolId && (e.openPositions[o].oldPrice = e.openPositions[o].currentPrice, e.openPositions[o].currentPrice = n.price)
			});
			var T = function(e, t) {
					var n = null;
					return e.level === -1 ? t.instantOptionPayout : (n = c.isLongTerm(e.level) ? t.longTermOptions.filter(function(t) {
						return t.level === e.level
					}) : t.options.filter(function(t) {
						return t.level === e.level
					}), n && n.length > 0 ? n[0].payout : null)
				},
				y = function(t) {
					var n = e.openPositions.filter(function(e) {
						return e.instrumentId === t.instrumentId
					});
					n.length > 0 && n.forEach(function(e) {
						e.instrument = t.name, e.payout = T(e, t), e.calculatedPayout = (1 + e.payout) * e.amount, e.instrumentSupportsEarlyClosure = t.earlyClosureAvailable
					})
				};
			e.$on("instrumentChanged", function(e, t) {
				y(t)
			})
		}])
	}(BX8Trader, angular),
	function(e) {
		"use strict";
		e.controller("OpenPositionSummaryModalController", ["$scope", "$rootScope", "$uibModalInstance", "$timeout", "$filter", "ConfigurationService", "TranslationService", "UserService", "$http", "request", "token", "isScheduled", "ToolService", "AnalyticsService", "TimeService", function(e, t, n, o, i, r, s, a, l, u, c, d, p, m, g) {
			var f = {
				"-8": "12 Months",
				"-7": "4 Months",
				"-6": "2 Months",
				"-5": "1 Month",
				"-4": "300 Seconds",
				"-3": "120 Seconds",
				"-2": "90 Seconds",
				"-1": "60 Seconds",
				0: "5 Minutes",
				1: "15 Minutes",
				2: "30 Minutes",
				3: "60 Minutes",
				4: "1 Month",
				5: "2 Months",
				6: "4 Months",
				7: "12 Months",
				8: "End of day",
				9: "End of week"
			};
			e.ok = function() {
				null != e.closePopupTimeout && o.cancel(e.closePopupTimeout), n.close()
			}, e.positionOpenedSuccessfully = !1, e.closePopupTimeout = null, e.instrumentPrice = u.price.toFixed(u.instrument.digitsToDisplay), e.tradeComplete = !1, e.accountCurrency = "", e.iconRightPosition = "-85px", e.optionLevel = u.option.level;
			var h;
			if (h = d ? r.API.Trader.OpenPosition : r.API.Trader.OpenInstantPosition, e.statusHeader = s.getTranslation("positions.open-position-summary-modal.title") + "...", e.status = "", e.tradeInProgress = !0, !u.instrument.enabled) {
				var v = {
					rejectReason: s.getTranslation("positions.open-position-result-InstrumentNotAvailableForTrading")
				};
				return void e.handleOpenResult(v)
			}
			var T = {
				instrumentId: u.instrument.instrumentId,
				amount: u.amount,
				direction: u.direction,
				openPrice: u.price
			};
			d && u.option ? (T.expireTime = u.option.fullExpireTime, T.level = u.option.level) : (T.level = u.option.level, T.duration = u.duration), l({
				method: "POST",
				url: h,
				timeout: 1e4,
				params: {
					token: c
				},
				data: T
			}).then(function(t) {
				e.handleOpenResult(t.data)
			}, function(t, n) {
				e.handleOpenResult(v.data)
			}), e.handleOpenResult = function(n) {
				e.tradeInProgress = !1, e.tradeComplete = !0, u.positionId = n && n.positionId, n && n.confirmed ? (e.openSuccess = !0, e.iconRightPosition = "-85px", m.logTraderEvent("Positions", "Position Opened"), u && u.instrument && u.instrument.name && m.logTraderEvent("Positions", "Position By Symbol", u.instrument.name.toUpperCase()), u && u.direction && m.logTraderEvent("Positions", "Position By Direction", u.direction.toUpperCase()), u && u.option && u.option.level && f[u.option.level] && m.logTraderEvent("Positions", "Position By Duration", f[u.option.level].toUpperCase()), e.statusHeader = s.getTranslation("positions.open-position-summary-modal.success-header"), null != u.instantIndex && u.option.level >= -4 && (p.isIeOrSafari() ? $('[instant-widget="' + u.instantIndex + '"]').addClass("one-slide-left") : $("#flipper-" + u.instantIndex).addClass("flip"), t.$broadcast("instantPositionOpened", u, n)), e.displayPositionSummary(n)) : (e.openSuccess = !1, e.statusHeader = s.getTranslation("positions.open-position-summary-modal.failed-header"), e.iconRightPosition = "-80px", n && n.rejectReason ? (e.status = s.getTranslation("positions.open-position-result-" + n.rejectReason), m.logTraderEvent("Positions", "Position Rejected", n.rejectReason)) : e.status = n), e.closePopupTimeout = o(function() {
					e.ok()
				}, 1e4)
			}, e.displayPositionSummary = function(t) {
				var n = a.getCurrentAccount();
				e.accountCurrency = n && n.currency ? n.currency : "", e.positionOpenedSuccessfully = !0, e.instrumentName = u.instrument.name, e.instrument = u.instrument, e.entryTime = t.entryTime, e.expiryTime = t.expiryTime, e.amount = p.getCurrencyNumber(u.amount, e.accountCurrency), e.payout = p.getCurrencyNumber((1 + u.option.payout) * u.amount, e.accountCurrency, 1), e.direction = e.direction = s.getTranslation("positions.direction." + u.direction.toString().toLowerCase())
			}
		}])
	}(BX8Trader),
	function(e) {
		var t = function(e) {
			return ["$rootScope", "$scope", "$uibModalInstance", "$filter", "$timeout", "ToolService", "UserService", "TranslationService", "positionData", "instrument", "ConfigurationService", "AnalyticsService", function(t, n, o, i, r, s, a, l, u, c, d, p) {
				var m = a.getCurrentAccount(),
					g = m && m.currency ? m.currency : "";
				p.logTraderEvent("Positions", e, u.direction), n.instrumentName = u.instrument, n.expireTime = moment(u.expireTime)._i, n.direction = l.getTranslation("positions.direction." + u.direction.toString().toLowerCase()), n.entryTime = moment(u.openTime)._i, n.currentPrice = i("number")(u.closePrice, c.digitsToDisplay), n.amount = s.getCurrencyNumber(u.amount, g), n.profit = s.getCurrencyNumber(u.profit, g, 1), n.shouldShowSecondResultText = !s.isChineseBased(), n.notChineseBroker = !s.isChineseBased(), o.result.then(null, function() {
					t.$broadcast("instantPositionClosedRemotely", u)
				}), n.closePopupTimeout = r(function() {
					n.ok(), t.$broadcast("instantPositionClosedRemotely", u)
				}, d.Trading.Popups.AutoCloseTimeout), n.ok = function() {
					o.close()
				}, n.cancel = function() {
					o.dismiss("cancel")
				}
			}]
		};
		e.controller("WinningModalController", t("Trade won")), e.controller("LosingModalController", t("Trade lost")), e.controller("TieModalController", t("Trade tied"))
	}(BX8Trader),
	function(e) {
		"use strict";

		function t(e, t, n, o, i, r, s, a, l, u, c, d) {
			function p() {
				m.chart.dataSet.length && (m.chart.dataSet.length < m.chart.maxTicks ? (m.chart.scroll = m.chart.dataSet.length - 1, m.micropixels = 0, m.setCandleWidth(m.chart.width / m.chart.dataSet.length)) : m.chart.scroll == m.chart.dataSet.length + 1 && m.micropixels > 0 || m.chart.scroll > m.chart.dataSet.length + 1 ? (m.chart.scroll = m.chart.dataSet.length + 1, m.micropixels = 0) : m.chart.scroll < m.chart.maxTicks && (m.chart.scroll = m.chart.maxTicks, m.micropixels = 0))
			}
			var m, g, f, h, v, T, y, I = this,
				S = 6e4,
				b = 60 * S,
				C = 24 * b,
				P = u.getCurrentTime(),
				O = !1;
			t.currentStudies = {}, t.ischartLoaded = !1, t.movingAverageStudies = [], t.isMovingAverageSwitchedOn = !1, t.spinner = !0;
			var w = {
					"1m": {
						periodicity: "OneMinute",
						setPeriodicityV2Params: [1, 1, "minute"],
						candleWidth: S,
						ticks: 720
					},
					"5m": {
						periodicity: "FiveMinutes",
						setPeriodicityV2Params: [1, 5, "minute"],
						candleWidth: 5 * S,
						ticks: 576
					},
					"15m": {
						periodicity: "FifteenMinutes",
						setPeriodicityV2Params: [1, 15, "minute"],
						candleWidth: 15 * S,
						ticks: 192
					},
					"30m": {
						periodicity: "ThirtyMinutes",
						setPeriodicityV2Params: [1, 30, "minute"],
						candleWidth: 30 * S,
						ticks: 144
					},
					"1h": {
						periodicity: "OneHour",
						setPeriodicityV2Params: [1, 60, "minute"],
						candleWidth: 60 * S,
						ticks: 1e3
					},
					"1d": {
						periodicity: "OneDay",
						setPeriodicityV2Params: [1, 1, "day"],
						candleWidth: C,
						ticks: 1e3
					}
				},
				k = function() {
					var e = this.chart.panel.holder.closest("#chart-view"),
						t = 0;
					e && (t = e.getBoundingClientRect().left);
					var n = Math.floor((STXChart.crosshairX - t) / this.layout.candleWidth),
						o = this.chart.xaxis[n];
					if (angular.element(".chartHUOpen", e).html(""), angular.element(".chartHUHigh", e).html(""), angular.element(".chartHULow", e).html(""), angular.element(".chartHUClose", e).html(""), angular.element(".chartHUDate", e).html(""), null != o && o.data) {
						var i = o.data.Date;
						if (!(i instanceof Date)) {
							var r = i.substr(0, 4),
								s = i.substr(4, 2),
								a = i.substr(6, 2),
								l = i.substr(8, 2),
								u = i.substr(10, 2),
								c = i.substr(12, 2);
							i = new Date(r, s, a, l, u, c)
						}
						"OneDay" != g.periodicity ? angular.element(".chartHUDate", e).html(moment(i).add(g.setPeriodicityV2Params[1], "minutes").utc().format("HH:mm:ss")) : angular.element(".chartHUDate", e).html(moment(i).add(g.setPeriodicityV2Params[1], "minutes").utc().format("LL")), angular.element(".chartHUOpen", e).html(o.data.Open.toFixed(I.selectedInstrument.digitsToDisplay)), angular.element(".chartHUHigh", e).html(o.data.High.toFixed(I.selectedInstrument.digitsToDisplay)), angular.element(".chartHULow", e).html(o.data.Low.toFixed(I.selectedInstrument.digitsToDisplay)), angular.element(".chartHUClose", e).html(o.data.Close.toFixed(I.selectedInstrument.digitsToDisplay))
					}
				},
				L = function(e) {
					if (P && e.minutes() != P.minutes() && null != m && null != m.masterData && I.selectedInstrument) {
						var n = m.masterData[m.masterData.length - 1];
						if (n) {
							var o = {
								symbolId: I.selectedInstrument.symbolId,
								price: n.Close,
								dateTime: e
							};
							r(function() {
								t.$broadcast("quote", o)
							}, 100)
						}
					}
					P = e
				},
				D = function() {
					t.ischartLoaded = !0;
					var e = y.map(function(e) {
							var t = new Date(e.dateTime);
							return {
								Date: t,
								Close: e.close,
								Open: e.open,
								High: e.high,
								Low: e.low
							}
						}),
						n = document.createElement("div");
					n.setAttribute("style", "height:100%");
					var o = document.querySelector(h);
					if (o.firstChild && o.removeChild(o.firstChild), o.appendChild(n), null != m && (m.clearDrawings(), m = null), STXChart.prototype.prepend("headsUpHR", k), STXChart.prototype.prepend("draw", p), m = new STXChart({
							container: $$$(v),
							layout: {
								chartType: a.getChartType(),
								candleWidth: 20,
								crosshair: !0
							}
						}), t.isMovingAverageSwitchedOn = !1, m.chart.xAxis.displayGridLines = !1, t.chartType = a.getChartType(), m.setPeriodicityV2.apply(m, w[t.range].setPeriodicityV2Params), m.chart.moreAvailable = !0, m.attachQuoteFeed(c.getFeed(), {
							refreshInterval: .1
						}), m.displayZone = "Etc/GMT", e.length) {
						m.newChart(I.selectedInstrument.name, e);
						var i = l.getCurrentLanguage();
						if (i.indexOf("zh") >= 0 && (i = "zh"), STX.I18N.setLanguage(m, i), $(".stx-panel-title, #chartControls, #iconsTemplate").hide(), m.setMaxTicks(100), m.home(), m.draw(), t.currentStudies)
							for (var r in t.currentStudies) STX.Studies.quickAddStudy(m, r);
						angular.forEach(t.movingAverageStudies, function(e, n) {
							t.isMovingAverageSwitchedOn = !0, STX.Studies.addStudy(m, "ma", e.inputs, e.outputs, e.parameters)
						})
					}
					t.spinner = !1, I.onChartLoaded && I.onChartLoaded()
				},
				x = function() {
					t.range = a.getChartRange(), g = w[t.range], g || (a.setChartRange("1m"), t.range = "1m", g = w[t.range]), o.get("api/Trader/GetChartBars?token=" + s.getAuthenticationToken() + "&symbolId=" + I.selectedInstrument.symbolId + "&barSize=" + g.periodicity).then(function(e) {
						e.data.length || console.log("empty chart data"), y = e.data, D()
					})
				},
				A = function(e, n) {
					console.log(new Date + ",barCreated", n);
					var o = w[t.range].candleWidth;
					if ("candle" === t.chartType && n.symbolId === I.selectedInstrument.symbolId) {
						var i = new Date(n.dateTime),
							r = m.masterData.pop();
						i.getTime() - o === m.masterData[m.masterData.length - 1].DT.getTime() && (r.Open = n.open, r.High = n.high, r.Low = n.low, r.Close = n.close, m.appendMasterData(r), O = !0)
					}
				};
			t.$on("barCreated", A), t.studyDialog = function(e, t) {
				var n = angular.element(f),
					o = angular.element(".stx-dialog", n)[0];
				if (m && m.chart.dataSet) {
					o.querySelectorAll(".title")[0].innerHTML = l.getTranslation(t), STX.Studies.studyDialog(m, e, o);
					var i = STX.ipad ? 400 : 0;
					setTimeout(function() {
						var e = "studyDialog-" + I.idx;
						STX.DialogManager.displayDialog(e)
					}, i)
				}
			}, t.clearSettingsPopup = function() {
				t.settingsIsOpen = !1
			}, t.setChartType = function(e) {
				a.setChartType(e), x()
			}, t.setPeriod = function(e) {
				t.spinner = !0;
				var n = a.getChartRange();
				a.setChartRange(e), x();
				var o = e + "-" + I.selectedInstrument.symbolId,
					i = n + "-" + I.selectedInstrument.symbolId;
				d.subscribeToInstrument(s.getAuthenticationToken(), o, i)
			}, t.toggleChartSettings = function() {
				t.settingsIsOpen = !t.settingsIsOpen
			}, t.dismissStudyDialog = function() {
				STX.DialogManager.dismissDialog()
			}, t.dismissStudy = function(e, n) {
				"ma" == n ? (angular.forEach(t.movingAverageStudies, function(e, t) {
					STX.Studies.removeStudy(m, e)
				}), t.movingAverageStudies = [], t.isMovingAverageSwitchedOn = !1) : t.currentStudies[n] && null != t.currentStudies[n] && (STX.Studies.removeStudy(m, t.currentStudies[n]), delete t.currentStudies[n]), e && e.stopPropagation()
			}, t.createStudy = function() {
				var e = $$("studyDialog-" + I.idx).study,
					n = !1;
				if ("ma" == e) {
					var o = STX.Studies.parseDialog($$("studyDialog-" + I.idx), m),
						i = o.inputs.Period;
					e += "-" + i, t.isMovingAverageSwitchedOn = !0, n = !0
				}
				t.currentStudies[e] && null != t.currentStudies[e] && (STX.Studies.removeStudy(m, t.currentStudies[e]), delete t.currentStudies[e]);
				var r = STX.Studies.go($$("studyDialog-" + I.idx), m);
				n ? t.movingAverageStudies.push(r) : t.currentStudies[e] = r, t.dismissStudyDialog()
			}, t.syncStudies = function() {
				var e = [],
					n = [];
				for (var o in m.layout.studies) {
					var i = m.layout.studies[o].type;
					"ma" == i ? n.push(o) : e.push(i)
				}
				t.movingAverageStudies = n, t.movingAverageStudies.length && (t.isMovingAverageSwitchedOn = !0);
				for (o in t.currentStudies) e.indexOf(o) === -1 && (STX.Studies.removeStudy(m, t.currentStudies[o]), delete t.currentStudies[o])
			}, I.$onInit = function() {
				I.idx || (I.idx = 0), f = I.blockSelector ? I.blockSelector : "#option-block-" + I.idx, h = f + " .chart-container", v = f + " .chart-container > div", e.$on("hubSubscriptionSuccess", function() {
					var e = a.getChartRange(),
						t = e + "-" + I.selectedInstrument.symbolId;
					d.subscribeToInstrument(s.getAuthenticationToken(), t, null)
				}), t.settingsIsOpen = !1, t.currentStudy = "none", u.addClockTickedCallback(L, "chartController" + I.idx), t.$on("quote", function(e, n) {
					if (I.selectedInstrument && n.symbolId == I.selectedInstrument.symbolId && m)
						if (O) {
							var o = w[t.range].candleWidth,
								i = JSON.parse(JSON.stringify(m.masterData[m.masterData.length - 1])),
								r = new Date(i.DT).getTime() + o;
							O = !1, m.appendMasterData({
								Open: i.Close,
								Close: n.price,
								Low: Math.min(i.Close, n.price),
								High: Math.max(i.Close, n.price),
								DT: new Date(r)
							})
						} else T = n.price, m.streamTrade({
							last: n.price,
							volume: 1,
							bid: 1,
							ask: 1
						}, n.dateTime), P = u.getCurrentTime(), m.streamTrade({
							last: n.price,
							volume: 1,
							bid: 1,
							ask: 1
						}, n.dateTime)
				}), t.$on("languageChanged", function(e, n) {
					m && (n.indexOf("zh") >= 0 && (n = "zh"), STX.I18N.setLanguage(m, n), t.dismissStudyDialog())
				}), t.$on("$destroy", function() {
					u.removeClockTickedCallback("chartController" + I.idx)
				}), t.$watch("vm.selectedInstrument", function() {
					null != I.selectedInstrument && (x(), t.settingsIsOpen = !1)
				})
			}
		}
		t.$inject = ["$rootScope", "$scope", "$element", "$http", "$filter", "$timeout", "UserService", "UserSettingsService", "TranslationService", "TimeService", "ChartService", "SignalRService"], e.component("chartComponent", {
			bindings: {
				selectedInstrument: "=",
				idx: "@",
				onChartLoaded: "=",
				blockSelector: "@"
			},
			templateUrl: "/Scripts/Trader/Views/Directives/chartComponent.html",
			controller: t,
			controllerAs: "vm"
		})
	}(BX8Trader), BX8Trader.directive("datetimepickerNeutralTimezone", function() {
	return {
		restrict: "A",
		priority: 1,
		require: "ngModel",
		link: function(e, t, n, o) {
			o.$formatters.push(function(e) {
				var t = new Date(Date.parse(e));
				return t = new Date(t.getTime() + 6e4 * t.getTimezoneOffset())
			}), o.$parsers.push(function(e) {
				var t = new Date(e.getTime() - 6e4 * e.getTimezoneOffset());
				return t
			})
		}
	}
}),
	function(e) {
		"use strict";
		e.directive("enscroll", ["ToolService", function(e) {
			return {
				restrict: "A",
				scope: {
					idx: "="
				},
				link: function(e, t, n) {
					$(t).enscroll({
						verticalScrollerSide: "right",
						verticalScrolling: !0,
						horizontalScrolling: !1,
						zIndex: 25,
						verticalTrackClass: "scrollbar-tracker-right scroller-" + e.idx,
						verticalHandleClass: "scrollbar-handler-right"
					})
				}
			}
		}])
	}(BX8Trader),
	function() {
		"use strict";
		BX8Trader.directive("instantChart", ["$http", "$filter", "UserService", "InstrumentService", "BrokerDetailsService", function(e, t, n, o, i) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/instantChart.html",
				scope: {
					instrument: "=",
					idx: "=",
					optionsCount: "&"
				},
				controller: ["$scope", "$element", "$attrs", "$location", function(e, r, s, a) {
					var l, u = function(n) {
						var o = r.closest("div[data-instant-container]").get(0);
						e.instrumentChart = new Highcharts.StockChart({
							chart: {
								type: "line",
								renderTo: r[0],
								backgroundColor: "rgba(0, 0, 0, 0)",
								panning: !1,
								height: 130,
								width: o.offsetWidth - o.querySelector("span.bezel-button").offsetWidth - 10,
								spacingTop: -20
							},
							colors: ["rgba(17, 39, 60, 0.7)"],
							credits: {
								enabled: !1
							},
							navigator: {
								enabled: !1
							},
							plotOptions: {
								series: {
									lineWidth: 1,
									color: "cyan"
								}
							},
							zoomType: "",
							rangeSelector: {
								buttonTheme: {
									fill: "none",
									stroke: "none",
									r: 5,
									style: {
										color: "#FFF",
										backgroundColor: "rgba(23, 29, 32, 0.5)",
										fontFamily: "Roboto"
									},
									states: {
										hover: {
											fill: "none",
											stroke: "none",
											style: {
												color: "#01CCB8"
											}
										},
										select: {
											fill: "none",
											stroke: "none",
											style: {
												color: "#01CCB8"
											}
										}
									}
								},
								buttons: [{
									count: 5,
									type: "minute",
									text: "5M"
								}],
								inputEnabled: !1,
								selected: 0,
								enabled: !0
							},
							title: {
								enabled: !1
							},
							scrollbar: {
								enabled: !1
							},
							tooltip: {
								formatter: function() {
									return "<b>" + t("number")(this.y, e.instrument.digitsToDisplay) + "</b><br/>"
								}
							},
							series: [{
								id: "live",
								name: e.instrument.name,
								data: n,
								threshold: null,
								fillColor: "rgba(17, 39, 60, 0.7)"
							}, {
								id: "flags",
								type: "flags",
								data: [],
								shape: "circlepin",
								width: 16
							}],
							xAxis: {
								minTickInterval: 3e4,
								labels: {
									style: {
										color: "#989A99",
										fontSize: "10pt",
										fontFamily: "Roboto",
										fontWeight: "300"
									}
								},
								lineWidth: 0,
								gridLineColor: "#414548",
								gridLineWidth: 1,
								minorGridLineWidth: 1
							},
							yAxis: {
								currentPriceIndicator: {
									extractLastPriceFunction: function(n) {
										return t("number")(n[n.length - 1], e.instrument.digitsToDisplay)
									},
									backgroundColor: "#000000",
									priceIncreaseColor: l.highButtonColor,
									priceDecreaseColor: l.lowButtonColor,
									borderColor: "#000000",
									enabled: !0,
									lineColor: "#000000",
									lineDashStyle: "Solid",
									lineOpacity: .8,
									pullLeft: 15,
									boxIncreaseWidthBy: 5,
									triangle: {
										width: 10
									},
									style: {
										color: "#ffffff",
										fontSize: "11px"
									},
									x: 0,
									y: 0,
									zIndex: 7
								},
								offset: 60,
								gridLineColor: "#888",
								labels: {
									enabled: !1
								},
								title: {
									text: null
								},
								minTickInterval: 5e-5,
								tickPixelInterval: 20,
								gridLineWidth: 0,
								minorGridLineWidth: 0
							}
						}), e.series = e.instrumentChart.get("live"), e.flagsSeries = e.instrumentChart.get("flags"), e.loading = !1
					};
					e.instrumentChart = null, e.series = null, e.flagsSeries = null, e.plotLines = [], e.currentToken = n.getAuthenticationToken(), e.currentAccount = n.getCurrentAccount(), e.loading = !1, e.init = function() {
						Highcharts.setOptions({
							global: {
								useUTC: !0
							}
						})
					}, e.updateInstrument = function(t) {
						e.instrument = t, null != e.instrumentChart && (e.instrumentChart.destroy(), e.instrumentChart = null), e.loading = !0, e.plotLines = [], i.get().then(function(t) {
							l = t, e.requestHistoryQuotes()
						})
					}, e.requestHistoryQuotes = function() {
						null != e.instrument && o.getLast5MinutesQuotes(e.instrument.symbolId).then(function(t) {
							var n = t.data;
							if (null != e.instrument && n.length > 0 && n[0].symbolId == e.instrument.symbolId) {
								for (var o = [], i = 0; i < n.length; i++) o.push([new Date(n[i].dateTime).getTime(), n[i].price]);
								u(o)
							}
						})
					}, e.drawPositions = function(t) {
						e.flags = [];
						for (var n = e.instrumentChart.yAxis[0], o = 0; o < e.plotLines.length; o++) n.removePlotLine(e.plotLines[o].id);
						e.plotLines = [];
						for (var i = 0; i < t.openPositions.length; i++) {
							var r = t.openPositions[i];
							if (r.instrumentId == e.instrument.instrumentId) {
								var s = {
									x: new Date(r.openTime).getTime(),
									y: r.openPrice,
									title: "High" === r.direction ? "H" : "L",
									color: "High" === r.direction ? "#00FF00" : "#FF0000"
								};
								e.flags.push(s), e.plotLines.push({
									id: r.positionId,
									color: "High" === r.direction ? "#00FF00" : "#FF0000",
									dashStyle: "Dash",
									value: r.openPrice,
									width: 2
								})
							}
						}
						for (e.flags.sort(function(e, t) {
							return e.x - t.x
						}), e.flagsSeries.setData(e.flags), o = 0; o < e.plotLines.length; o++) n.addPlotLine(e.plotLines[o])
					}, e.$watch("instrument", e.updateInstrument), e.$on("BrokerSignalr", function(t, n) {
						l = n, e.instrumentChart && (e.instrumentChart.options.yAxis[0].currentPriceIndicator.priceIncreaseColor = l.highButtonColor, e.instrumentChart.options.yAxis[0].currentPriceIndicator.priceDecreaseColor = l.lowButtonColor), n.numberOfInstantOptionsToDisplay !== e.optionsCount && (e.optionsCount = n.numberOfInstantOptionsToDisplay, setTimeout(function() {
							c()
						}, 100))
					});
					var c = function() {
						if (e.series) {
							var t = [];
							if (e.series) {
								for (var n = 0; n < e.series.xData.length; n++) t.push([e.series.xData[n], e.series.yData[n]]);
								u(t)
							}
						}
					};
					window.addEventListener("resize", c), e.$on("quote", function(t, n) {
						if (null != e.instrument && n.symbolId === e.instrument.symbolId && !e.loading) {
							var o = [new Date(n.dateTime).getTime(), n.price],
								i = e.instrumentChart.xAxis[0],
								r = i.getExtremes();
							if (e.series.addPoint(o, !1, !1), o[0] > r.max) {
								var s = o[0],
									a = s - (r.max - r.min);
								i.setExtremes(a, s, !1)
							}
							e.instrumentChart.redraw()
						}
					}), e.$on("$destroy", function() {
						window.removeEventListener("resize", c)
					})
				}]
			}
		}])
	}(),
	function(e, t) {
		"use strict";
		e.directive("instantOption", ["$timeout", "ToolService", "PositionModalService", "ConfigurationService", "UserService", "GuestService", "AnalyticsService", "InstrumentService", function(e, n, o, i, r, s, a, l) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/instantOption.html",
				scope: {
					instruments: "=",
					amount: "=",
					level: "=",
					idx: "=",
					selectedInstrument: "=",
					display: "=",
					viewModel: "=?"
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "TranslationService", function(s, a, u, c) {
					function d() {
						var e = l.getInstrumentBySymbolId(a.selectedInstrument.symbolId);
						if (!e || !e.enabled) return void(a.isOptionUnavailable = !0);
						var t = e.instantOptions.filter(function(e) {
							return e.level == a.level
						});
						a.asset = t, t && 1 === t.length ? (a.asset = t[0], a.isOptionUnavailable = !1) : a.isOptionUnavailable = !0
					}
					a.accountCurrency = "", a.positionOpened = !1, a.shortSelectedInstrumentName = "", a.selectedInstrumentTooltipName = "", a.group = null, a.shouldDisplayInstrumentSelection = !a.viewModel || !a.viewModel.isGuestMode;
					var p = [0, 2, 3, 5];
					a.asset = null, d(), a.optionDurationLabels = {
						"-1": "options.duration.instant.60-seconds",
						"-2": "options.duration.instant.90-seconds",
						"-3": "options.duration.instant.120-seconds",
						"-4": "options.duration.instant.300-seconds"
					}, a.optionDurationLabelsArray = [{
						level: "-1",
						label: "options.duration.instant.60-seconds"
					}, {
						level: "-2",
						label: "options.duration.instant.90-seconds"
					}, {
						level: "-3",
						label: "options.duration.instant.120-seconds"
					}, {
						level: "-4",
						label: "options.duration.instant.300-seconds"
					}], a.optionAbbrLabels = {
						"-1": "options.duration.abbr-60s",
						"-2": "options.duration.abbr-90s",
						"-3": "options.duration.abbr-120s",
						"-4": "options.duration.abbr-300s"
					}, a.paddingLeft = p[a.idx];
					var m = r.getCurrentAccount();
					a.currencySign = n.getCurrencySign(m.currency);
					var g = function(e) {
							return e && e.isInTradingHours && e.instantOptionEnabled
						},
						f = function() {
							var e = r.getSelectedOptionByExpiryInstrument(a.idx),
								t = a.instruments.filter(function(t) {
									return t.name === e
								});
							if (!t || 0 === t.length || !g(t[0])) {
								var n = i.Trading.DefaultInstruments.InstantOptions[a.idx];
								if (t = a.instruments.filter(function(e) {
										return e.name === n
									}), !t || 0 == t.length || !g(t[0])) return a.instruments[0]
							}
							return t[0]
						},
						h = function() {
							return a.selectedInstrument && a.selectedInstrument.options && a.selectedInstrument.options[a.payoutLevel] ? parseFloat((1 + a.selectedInstrument.instantOptionPayout) * a.amount).toFixed(1) : ""
						},
						v = function(e) {
							a.selectedInstrument = e, a.shortSelectedInstrumentName = a.selectedInstrument.name.length > 8 ? a.selectedInstrument.name.substr(0, 8) + "..." : a.selectedInstrument.name, a.selectedInstrumentTooltipName = a.selectedInstrument.name.length > 8 ? a.selectedInstrument.name : "", a.selectedInstrument.oldPrice < a.selectedInstrument.price && (a.selectedInstrument.arrowCssName = "fa-caret-up price-up"), a.selectedInstrument.oldPrice > a.selectedInstrument.price && (a.selectedInstrument.arrowCssName = "fa-caret-down price-down"), a.selectedInstrument.displayPrice = a.selectedInstrument.price.toFixed(a.selectedInstrument.digitsToDisplay), a.selectedInstrument.payout = h(), a.instrumentForChart && a.selectedInstrument.symbolId === a.instrumentForChart.symbolId || (a.instrumentForChart = e, a.instrumentForPosition = e)
						};
					a.selectedInstrument || v(f()), a.$watch("selectedInstrument", function() {
						a.selectedInstrument && a.selectedInstrument.name && v(a.selectedInstrument)
					});
					var T = function() {
						a.positionOpened ? e(function() {
							a.selectedInstrument = f(), a.positionOpened = !1
						}, 7e4) : a.selectedInstrument = f();
						for (var t = 0; t < a.instruments.length; t++)
							if (a.instruments[t].symbolId === a.selectedInstrument.symbolId) {
								a.instruments.splice(t, 1);
								break
							}
					};
					a.$on("account", function(e, t) {
						a.accountCurrency = t.currency
					}), a.$on("quote", function(e, t) {
						a.selectedInstrument && a.selectedInstrument.symbolId === t.symbolId && (a.selectedInstrument.price < t.price && (a.selectedInstrument.arrowCssName = "fa-caret-up price-up"), a.selectedInstrument.price > t.price && (a.selectedInstrument.arrowCssName = "fa-caret-down price-down"), a.selectedInstrument.oldPrice = a.selectedInstrument.price, a.selectedInstrument.price = t.price, a.selectedInstrument.displayPrice = t.price.toFixed(a.selectedInstrument.digitsToDisplay))
					}), a.$on("instrumentChanged", function(e, n) {
						a.selectedInstrument && a.selectedInstrument.symbolId === n.symbolId && (g(n) ? a.selectedInstrument = n : T(), t.element(".scroller-" + a.idx).parent().remove())
					}), a.$on("instantPositionOpened", function(e, t, n) {
						t && t.instrument && t.instrument.symbolId == a.selectedInstrument.symbolId && t.instantIndex == a.idx && (a.positionOpened = !0)
					}), a.$on("instrumentRemoved", function(e, t) {
						a.selectedInstrument && a.selectedInstrument.symbolId === t && T()
					}), a.$on("BrokerSignalr", function(e, t) {
						a.display != t.numberOfInstantOptionsToDisplay && (a.display = t.numberOfInstantOptionsToDisplay, setTimeout(function() {
							y()
						}, 100))
					}), a.changeInstrument = function(e) {
						a.selectedInstrument = e, r.saveSelectedOptionByExpiryInstrument(a.idx, a.selectedInstrument)
					}, a.changeAssetLevel = function(e) {
						a.level = Math.round(e), d(), a.$emit("updateInstantTermAssetSelection", {
							index: a.idx,
							level: e
						})
					}, a.openInstantPosition = function(e, t, n, i) {
						var r = {
							instrument: a.selectedInstrument,
							amount: a.amount,
							price: a.selectedInstrument.price,
							direction: e,
							option: a.asset,
							instantIndex: a.idx
						};
						o.openPosition(r, !1)
					};
					var y = function() {
						var e = u.get(0),
							t = e.querySelector("div[data-instant-widget]"),
							n = e.querySelectorAll("div.instant-container"),
							o = document.createElement("style");
						$("style#resize-custom").remove(), o.type = "text/css", o.id = "resize-custom", o.innerHTML = "#favorites .widget-slider div.one-slide-left { transform: translateX(-" + e.parentNode.offsetWidth + "px); }", document.getElementsByTagName("head")[0].appendChild(o);
						for (var i = 0; i < n.length; i++) n[i].style.width = e.parentNode.offsetWidth + "px";
						t && (t.style.width = 2 * (e.parentNode.offsetWidth + 2) + "px")
					};
					setTimeout(function() {
						y()
					}, 1), window.addEventListener("resize", y), a.$on("$destroy", function() {
						window.removeEventListener("resize", y)
					})
				}]
			}
		}])
	}(BX8Trader, angular),
	function(e, t) {
		"use strict";
		e.directive("instantOptionGuest", ["$timeout", "ToolService", "PositionModalService", "ConfigurationService", "UserService", "GuestService", "AnalyticsService", function(e, n, o, i, r, s, a) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/instantOption.html",
				scope: {
					instruments: "=",
					amount: "=",
					idx: "=",
					selectedInstrument: "=",
					viewModel: "=?"
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "TranslationService", function(l, u, c, d) {
					u.accountCurrency = "", u.positionOpened = !1, u.shortSelectedInstrumentName = "", u.selectedInstrumentTooltipName = "", u.group = null, u.shouldDisplayInstrumentSelection = !u.viewModel || !u.viewModel.isGuestMode;
					var p = r.getCurrentAccount();
					u.currencySign = n.getCurrencySign(p.currency);
					var m = function(e) {
							return e && e.isInTradingHours && e.instantOptionEnabled
						},
						g = function() {
							var e = r.getSelectedOptionByExpiryInstrument(u.idx),
								t = u.instruments.filter(function(t) {
									return t.name === e
								});
							if (!t || 0 === t.length || !m(t[0])) {
								var n = i.Trading.DefaultInstruments.InstantOptions[u.idx];
								if (t = u.instruments.filter(function(e) {
										return e.name === n
									}), !t || 0 == t.length || !m(t[0])) return u.instruments[0]
							}
							return t[0]
						},
						f = function() {
							return u.selectedInstrument && u.selectedInstrument.options && u.selectedInstrument.options[u.payoutLevel] ? parseFloat((1 + u.selectedInstrument.instantOptionPayout) * u.amount).toFixed(1) : ""
						},
						h = function(e) {
							u.selectedInstrument = e, u.shortSelectedInstrumentName = u.selectedInstrument.name.length > 8 ? u.selectedInstrument.name.substr(0, 8) + "..." : u.selectedInstrument.name, u.selectedInstrumentTooltipName = u.selectedInstrument.name.length > 8 ? u.selectedInstrument.name : "", u.selectedInstrument.oldPrice < u.selectedInstrument.price && (u.selectedInstrument.arrowCssName = "fa-caret-up price-up"), u.selectedInstrument.oldPrice > u.selectedInstrument.price && (u.selectedInstrument.arrowCssName = "fa-caret-down price-down"), u.selectedInstrument.displayPrice = u.selectedInstrument.price.toFixed(u.selectedInstrument.digitsToDisplay), u.selectedInstrument.payout = f(), u.instrumentForChart && u.selectedInstrument.symbolId === u.instrumentForChart.symbolId || (u.instrumentForChart = e, u.instrumentForPosition = e)
						};
					u.selectedInstrument || h(g()), u.$watch("selectedInstrument", function() {
						u.selectedInstrument && u.selectedInstrument.name && h(u.selectedInstrument)
					});
					var v = function() {
							u.positionOpened ? e(function() {
								u.selectedInstrument = g(), u.positionOpened = !1
							}, 7e4) : u.selectedInstrument = g();
							for (var t = 0; t < u.instruments.length; t++)
								if (u.instruments[t].symbolId === u.selectedInstrument.symbolId) {
									u.instruments.splice(t, 1);
									break
								}
						},
						T = function() {
							$("#asset-dropdown-" + u.idx).enscroll({
								verticalScrollerSide: "right",
								verticalScrolling: !0,
								horizontalScrolling: !1,
								zIndex: 5,
								verticalTrackClass: "scrollbar-tracker-right scroller-" + u.idx,
								verticalHandleClass: "scrollbar-handler-right"
							})
						};
					setTimeout(T, 1), u.$on("account", function(e, t) {
						u.accountCurrency = t.currency
					}), u.$on("quote", function(e, t) {
						u.selectedInstrument && u.selectedInstrument.symbolId === t.symbolId && (u.selectedInstrument.price < t.price && (u.selectedInstrument.arrowCssName = "fa-caret-up price-up"), u.selectedInstrument.price > t.price && (u.selectedInstrument.arrowCssName = "fa-caret-down price-down"), u.selectedInstrument.oldPrice = u.selectedInstrument.price, u.selectedInstrument.price = t.price, u.selectedInstrument.displayPrice = t.price.toFixed(u.selectedInstrument.digitsToDisplay))
					}), u.$on("instrumentChanged", function(e, n) {
						u.selectedInstrument && u.selectedInstrument.symbolId === n.symbolId && (m(n) ? u.selectedInstrument = n : v(), t.element(".scroller-" + u.idx).parent().remove(), T())
					}), u.$on("instantPositionOpened", function(e, t, n) {
						t && t.instrument && t.instrument.symbolId == u.selectedInstrument.symbolId && t.instantIndex == u.idx && (u.positionOpened = !0)
					}), u.$on("instrumentRemoved", function(e, t) {
						u.selectedInstrument && u.selectedInstrument.symbolId === t && v()
					}), u.changeInstrument = function(e) {
						u.selectedInstrument = e, r.saveSelectedOptionByExpiryInstrument(u.idx, u.selectedInstrument)
					}, u.openInstantPosition = function(e, t, n, i) {
						if (u.viewModel && u.viewModel.isGuestMode) return s.showPopup(), void a.logTraderEvent("Promotion", "Open position by level", "60s");
						var r = {
							instrument: u.selectedInstrument,
							amount: u.amount,
							price: u.selectedInstrument.price,
							direction: e,
							instantIndex: u.idx
						};
						o.openPosition(r, !1)
					};
					var y = function() {
						var e = c.get(0),
							t = e.querySelector("div[data-instant-widget]"),
							n = e.querySelectorAll("div.instant-container"),
							o = document.createElement("style");
						$("style#resize-custom").remove(), o.type = "text/css", o.id = "resize-custom", o.innerHTML = "#favorites .widget-slider div.one-slide-left { transform: translateX(-" + e.parentNode.offsetWidth + "px); }", document.getElementsByTagName("head")[0].appendChild(o);
						for (var i = 0; i < n.length; i++) n[i].style.width = e.parentNode.offsetWidth + "px";
						t && (t.style.width = 2 * (e.parentNode.offsetWidth + 2) + "px")
					};
					setTimeout(function() {
						y()
					}, 1), window.addEventListener("resize", y), u.$on("$destroy", function() {
						window.removeEventListener("resize", y)
					}), u.$on("selectedInstrumentChanged", function(e, n) {
						u.selectedInstrument = t.copy(n)
					})
				}]
			}
		}])
	}(BX8Trader, angular),
	function(e, t) {
		"use strict";
		e.directive("instantOptionTracker", ["$rootScope", function(e) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/instantOptionTracker.html",
				scope: {
					instrument: "=",
					amount: "=",
					idx: "=",
					level: "="
				},
				controller: ["$scope", "TimeService", "UserService", "$interval", "ToolService", "$rootScope", "$timeout", "QuotesService", function(e, n, o, i, r, s, a, l) {
					function u(e) {
						return Number(String(e).split(".")[1] || 0)
					}
					var c, d = o.getCurrentAccount();
					e.currencySign = r.getCurrencySign(d.currency), s.$on("instantPositionOpened", function(i, l, u) {
						if (e.idx == l.instantIndex) {
							e.optionDurationLabels = {
								"-1": "options.duration.instant.60-seconds",
								"-2": "options.duration.instant.90-seconds",
								"-3": "options.duration.instant.120-seconds",
								"-4": "options.duration.instant.300-seconds"
							}, c = setInterval(function() {
								e.$digest()
							}, 95), p = $(document.querySelector("[data-tracker-chart]")).width(), m = p - 30, angular.element("#tracker-payout-container-" + e.idx).attr("stop-updating", ""), G.started = !1, e.secondsLeft = l.duration, e.milSecondsLeft = 0, h = [], T = u, e.instrument = l.instrument, e.startingPrice = u.openPrice, e.payout = l.option.payout, e.levelCaption = e.optionDurationLabels[l.option.level], v = "high" === l.direction.toLowerCase();
							var d = s.$on("instantPositionClosed", function(t, o) {
								o.positionId == l.positionId && (angular.element("#tracker-payout-container-" + e.idx).removeAttr("stop-updating"), d(), O = !1, n.removeClockTickedCallback("assetTracker" + l.instantIndex), e.status = E(o.closePrice), M([0, o.closePrice]), o.instantIndex = e.idx, e.secondsLeft = 0, e.milSecondsLeft = 0, clearInterval(c))
							});
							e.closeTracker = function() {
								r.isIeOrSafari() ? $('[instant-widget="' + l.instantIndex + '"]').removeClass("one-slide-left") : $("#flipper-" + l.instantIndex).removeClass("flip"), $("#tracker-chart-" + l.instantIndex + " *").remove(), e.secondsLeft = 0, e.milSecondsLeft = 0, clearInterval(c)
							}, O || (O = !0, y = t.select("#tracker-chart-" + l.instantIndex), e.$on("$destroy", function() {
								n.removeClockTickedCallback("assetTracker" + e.idx)
							}), s.$on("instantPositionClosedRemotely", function(e, t) {
								t.positionId == l.positionId && (r.isIeOrSafari() ? $('[instant-widget="' + l.instantIndex + '"]').removeClass("one-slide-left") : $("#flipper-" + l.instantIndex).removeClass("flip"), $("#tracker-chart-" + l.instantIndex + " *").remove(), a(function() {
									s.$broadcast("amountChanged", o.getTradeAmount())
								}, 1e3), clearInterval(c))
							}), e.$on("instrumentChanged", function(t, n) {
								e.instrument.instrumentId === n.instrumentId && (e.instrument = n)
							}), n.addClockTickedCallback(G, "assetTracker" + e.idx))
						}
					});
					var p, m, g, f, h, v, T, y, I, S, b, C, P, O = !1,
						w = 110,
						k = 10,
						L = 5,
						D = 100,
						x = {
							"-1": "2",
							"-2": "1.5",
							"-3": "1",
							"-4": "0.4"
						},
						A = function(e) {
							0 == h.length ? h.push(e) : h[h.length - 1] = e, h.push(e)
						},
						E = function(t) {
							return t > e.startingPrice && v || t < e.startingPrice && !v ? "winning" : t < e.startingPrice && v || t > e.startingPrice && !v ? "losing" : "tie"
						},
						B = t.svg.line().x(function(e) {
							return g(e[0])
						}).y(function(e) {
							return f(e[1])
						}),
						U = function() {
							y.append("line").attr({
								x1: m,
								y1: 0,
								x2: m,
								y2: w,
								style: "stroke: #F0A926;"
							}), y.append("polygon").attr({
								points: m + ",5 " + (m + 20) + ",12 " + m + ",17",
								style: "fill: #F0A926;"
							}), b = y.append("line").attr({
								x1: h[0][0],
								y1: 0,
								x2: h[0][0],
								y2: w
							}), S = y.append("circle").attr({
								cx: h[0][0],
								cy: f(h[0][1]),
								r: 5
							}), C = y.append("circle").attr({
								cx: h[0][0],
								cy: f(h[0][1]),
								r: 4,
								class: "running-start-point"
							}), P = y.append("line").attr({
								x1: 0,
								y1: f(e.startingPrice),
								x2: p,
								y2: f(e.startingPrice),
								style: "stroke: #C0C4C7",
								"stroke-dasharray": "2,2"
							}), I = y.append("path").attr({
								d: B(h),
								width: p,
								height: w,
								fill: "none",
								stroke: "#C0C4C7",
								"stroke-width": x[e.level]
							})
						},
						M = function(t) {
							I && (I.transition().duration(D).attr({
								d: B(h)
							}), b.transition().duration(D).attr({
								x1: g(t[0]),
								y1: 0,
								x2: g(t[0]),
								y2: w,
								class: "running-line-" + e.status
							}), S.transition().duration(D).attr({
								cx: g(t[0]),
								cy: f(t[1]),
								class: "running-circle-" + e.status
							}), C.transition().duration(D).attr({
								cx: g(h[0][0]),
								cy: f(h[0][1])
							}), P.attr({
								x1: 0,
								y1: f(e.startingPrice),
								x2: m,
								y2: f(e.startingPrice)
							}))
						},
						G = function(n) {
							var o = e.instrument.price,
								i = n,
								r = moment(T.expiryTime).diff(i),
								s = [r / D, o],
								a = moment.duration(r).asSeconds().toFixed(1);
							return r <= 0 ? (e.secondsLeft = 0, void(e.milSecondsLeft = 0)) : (e.secondsLeft = Math.trunc(a), e.milSecondsLeft = u(a), A(s), f = t.scale.linear().domain(t.extent(h, function(e) {
								return e[1]
							})).range([w - k, 0 + k]), e.status = E(o), G.started || (G.started = !0, g = t.scale.linear().domain([r / 100, 0]).range([L, m]), U()), void M(s))
						}
				}]
			}
		}])
	}(BX8Trader, d3),
	function(e) {
		"use strict";
		e.directive("instrumentSelection", ["ToolService", function(e) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/instrumentSelection.html",
				scope: {
					instruments: "=",
					handler: "=",
					instrument: "=",
					instant: "="
				},
				link: function(e, t, n) {
					e.selectInstrument = function(t) {
						return !!t.enabled && (e.isDropdownOpen = !1, e.handler(t), "instant" != e.type || e.level || (e.level = -1), void 0)
					}, t.bind("keydown keypress", function(t) {
						if (13 === t.which) {
							var n = e.instrumentSearchQuery.toUpperCase(),
								o = e.instruments.filter(function(e) {
									return e.name.indexOf(n) != -1
								});
							for (var i in o)
								if (o[i]) {
									e.isDropdownOpen = !1, e.handler(o[i]);
									break
								}
						}
					})
				}
			}
		}])
	}(BX8Trader),
	function(e, t) {
		"use strict";
		e.directive("longInstantOption", ["$timeout", "ToolService", "PositionModalService", "ConfigurationService", "UserService", "GuestService", "AnalyticsService", "InstrumentService", "BrokerDetailsService", function(e, n, o, i, r, s, a, l, u) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/longTermInstantOption.html",
				scope: {
					instruments: "=",
					amount: "=",
					level: "=",
					idx: "=",
					selectedInstrument: "=",
					display: "=",
					viewModel: "=?"
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "TranslationService", function(s, a, u, c) {
					function d() {
						var e = l.getInstrumentBySymbolId(a.selectedInstrument.symbolId);
						if (!e || !e.enabled) return void(a.isOptionUnavailable = !0);
						var t = e.instantOptions.filter(function(e) {
							return e.level == a.level
						});
						a.asset = t, t && 1 === t.length ? (a.asset = t[0], a.isOptionUnavailable = !1) : a.isOptionUnavailable = !0
					}
					a.accountCurrency = "", a.positionOpened = !1, a.shortSelectedInstrumentName = "", a.selectedInstrumentTooltipName = "", a.group = null, a.selectedInstrument = t.copy(a.selectedInstrument), a.level = t.copy(a.level), a.shouldDisplayInstrumentSelection = !a.viewModel || !a.viewModel.isGuestMode;
					var p = [0, 2, 3, 5];
					a.asset = null, d(), a.optionDurationLabels = {
						"-5": "options.duration.1-month",
						"-6": "options.duration.2-months",
						"-7": "options.duration.4-months",
						"-8": "options.duration.12-months"
					}, a.optionDurationLabelsArray = [{
						level: "-5",
						label: "options.duration.1-month"
					}, {
						level: "-6",
						label: "options.duration.2-months"
					}, {
						level: "-7",
						label: "options.duration.4-months"
					}, {
						level: "-8",
						label: "options.duration.12-months"
					}], a.optionAbbrLabels = {
						"-5": "options.duration.abbr-1mo",
						"-6": "options.duration.abbr-2mo",
						"-7": "options.duration.abbr-4mo",
						"-8": "options.duration.abbr-12mo"
					}, a.paddingLeft = p[a.idx];
					var m = r.getCurrentAccount();
					a.currencySign = n.getCurrencySign(m.currency);
					var g = function(e) {
							return e && e.isInTradingHours && e.instantOptionEnabled
						},
						f = function() {
							var e = r.getSelectedOptionByExpiryInstrument(a.idx),
								t = a.instruments.filter(function(t) {
									return t.name === e
								});
							if (!t || 0 === t.length || !g(t[0])) {
								var n = i.Trading.DefaultInstruments.InstantOptions[a.idx];
								if (t = a.instruments.filter(function(e) {
										return e.name === n
									}), !t || 0 == t.length || !g(t[0])) return a.instruments[0]
							}
							return t[0]
						},
						h = function() {
							return a.selectedInstrument && a.selectedInstrument.options && a.selectedInstrument.options[a.payoutLevel] ? parseFloat((1 + a.selectedInstrument.instantOptionPayout) * a.amount).toFixed(1) : ""
						},
						v = function(e) {
							a.selectedInstrument = e, a.shortSelectedInstrumentName = a.selectedInstrument.name.length > 8 ? a.selectedInstrument.name.substr(0, 8) + "..." : a.selectedInstrument.name, a.selectedInstrumentTooltipName = a.selectedInstrument.name.length > 8 ? a.selectedInstrument.name : "", a.selectedInstrument.oldPrice < a.selectedInstrument.price && (a.selectedInstrument.arrowCssName = "fa-caret-up price-up"), a.selectedInstrument.oldPrice > a.selectedInstrument.price && (a.selectedInstrument.arrowCssName = "fa-caret-down price-down"), a.selectedInstrument.displayPrice = a.selectedInstrument.price.toFixed(a.selectedInstrument.digitsToDisplay), a.selectedInstrument.payout = h(), a.instrumentForPosition = e, a.instrumentForChart && a.selectedInstrument.symbolId === a.instrumentForChart.symbolId || (a.instrumentForChart = e, a.instrumentForPosition = e)
						};
					a.selectedInstrument || v(f()), a.$watch("selectedInstrument", function() {
						a.selectedInstrument && a.selectedInstrument.name && v(a.selectedInstrument)
					});
					var T = function() {
						a.positionOpened ? e(function() {
							a.selectedInstrument = f(), a.positionOpened = !1
						}, 7e4) : a.selectedInstrument = f();
						for (var t = 0; t < a.instruments.length; t++)
							if (a.instruments[t].symbolId === a.selectedInstrument.symbolId) {
								a.instruments.splice(t, 1);
								break
							}
					};
					a.$on("account", function(e, t) {
						a.accountCurrency = t.currency
					}), a.$on("quote", function(e, t) {
						a.selectedInstrument && a.selectedInstrument.symbolId === t.symbolId && (a.selectedInstrument.price < t.price && (a.selectedInstrument.arrowCssName = "fa-caret-up price-up"), a.selectedInstrument.price > t.price && (a.selectedInstrument.arrowCssName = "fa-caret-down price-down"), a.selectedInstrument.oldPrice = a.selectedInstrument.price, a.selectedInstrument.price = t.price, a.selectedInstrument.displayPrice = t.price.toFixed(a.selectedInstrument.digitsToDisplay))
					}), a.$on("instrumentChanged", function(e, n) {
						a.selectedInstrument && a.selectedInstrument.symbolId === n.symbolId && (g(n) ? a.selectedInstrument = n : T(), t.element(".scroller-" + a.idx).parent().remove())
					}), a.$on("instantPositionOpened", function(e, t, n) {
						t && t.instrument && t.instrument.symbolId == a.selectedInstrument.symbolId && t.instantIndex == a.idx && (a.positionOpened = !0)
					}), a.$on("instrumentRemoved", function(e, t) {
						a.selectedInstrument && a.selectedInstrument.symbolId === t && T()
					}), a.$on("BrokerSignalr", function(e, t) {
						a.display != t.numberOfInstantOptionsToDisplay && (a.display = t.numberOfInstantOptionsToDisplay, setTimeout(function() {
							y()
						}, 100))
					}), a.changeInstrument = function(e) {
						a.selectedInstrument = e, d(), r.saveSelectedOptionByExpiryInstrument(a.idx, a.selectedInstrument)
					}, a.changeAssetLevel = function(e) {
						a.level = Math.round(e), d(), a.$emit("updateInstantLongTermAssetSelection", {
							index: a.idx,
							level: e
						})
					}, a.openInstantPosition = function(e, t, n, i) {
						var r = {
							instrument: a.selectedInstrument,
							amount: a.amount,
							price: a.selectedInstrument.price,
							direction: e,
							option: a.asset,
							instantIndex: a.idx
						};
						o.openPosition(r, !1)
					};
					var y = function() {
						var e = u.get(0),
							t = e.querySelector("div[data-instant-widget]"),
							n = e.querySelectorAll("div.instant-container"),
							o = document.createElement("style");
						$("style#resize-custom").remove(), o.type = "text/css", o.id = "resize-custom", o.innerHTML = "#favorites .widget-slider div.one-slide-left { transform: translateX(-" + e.parentNode.offsetWidth + "px); }", document.getElementsByTagName("head")[0].appendChild(o);
						for (var i = 0; i < n.length; i++) n[i].style.width = e.parentNode.offsetWidth + "px";
						t && (t.style.width = 2 * (e.parentNode.offsetWidth + 2) + "px")
					};
					setTimeout(function() {
						y()
					}, 1), window.addEventListener("resize", y), a.$on("$destroy", function() {
						window.removeEventListener("resize", y)
					})
				}]
			}
		}])
	}(BX8Trader, angular),
	function(e, t) {
		"use strict";
		e.directive("longTermOption", ["$timeout", "ToolService", "PositionModalService", "ConfigurationService", "UserService", "AnalyticsService", "BrokerDetailsService", "TranslationService", function(e, t, n, o, i, r, s, a) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/longTermOption.html",
				scope: {
					level: "=",
					instrument: "=",
					amount: "=",
					idx: "="
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "$timeout", "UserService", "BrokerDetailsService", function(e, o, i, s, a, l, u) {
					var c = u.getFromCache().numberOfScheduledOptionsToDisplay;
					o.asset = null, o.optionDurationLabels = {
						11: "options.duration.1-week",
						12: "options.duration.2-weeks",
						4: "options.duration.1-month",
						5: "options.duration.2-months",
						6: "options.duration.4-months",
						7: "options.duration.12-months",
						9: "options.duration.end-of-week"
					}, o.optionDurationLabelsArray = [{
						level: "9",
						label: "options.duration.end-of-week"
					}, {
						level: "11",
						label: "options.duration.1-week"
					}, {
						level: "12",
						label: "options.duration.2-weeks"
					}, {
						level: "4",
						label: "options.duration.1-month"
					}, {
						level: "5",
						label: "options.duration.2-months"
					}, {
						level: "6",
						label: "options.duration.4-months"
					}, {
						level: "7",
						label: "options.duration.12-months"
					}], o.optionAbbrLabels = {
						11: "options.duration.abbr-1w",
						12: "options.duration.abbr-2w",
						4: "options.duration.abbr-1mo",
						5: "options.duration.abbr-2mo",
						6: "options.duration.abbr-4mo",
						7: "options.duration.abbr-12mo",
						9: "options.duration.abbr-eow"
					};
					var d = angular.copy(o.optionDurationLabelsArray),
						p = function() {
							m();
							var e = o.instrument.longTermOptions.filter(function(e) {
								return e.level === o.level
							});
							e && 1 === e.length && (o.asset = e[0])
						},
						m = function() {
							o.optionDurationLabelsArray = angular.copy(d);
							var e = o.instrument.longTermOptions,
								t = [];
							angular.forEach(e, function(e, n) {
								t.push(e.level)
							}), o.optionDurationLabelsArray = d.filter(function(e) {
								return t.indexOf(+e.level) != -1
							}), t.indexOf(o.level) == -1 && o.changeAssetLevel(t[0])
						};
					o.$on("BrokerSignalr", function(e, t) {
						setPositions(t.highButtonColor, t.lowButtonColor), t.numberOfScheduledOptionsToDisplay != c && (c = t.numberOfScheduledOptionsToDisplay, a(function() {
							setOverallDividerLeft(), setLast24DividerLeft()
						}, 100))
					}), o.$watch("instrument", function() {
						p()
					}), o.$on("onTraderSentiment", function(e, t) {
						if (o.asset && o.instrument.instrumentId === t.instrumentId) {
							var n = t.optionSentiments.filter(function(e) {
								return e.level === o.asset.level
							});
							n && n[0] && p()
						}
					}), o.$on("quote", function(e, t) {
						o.instrument && o.instrument.symbolId === t.symbolId && (o.instrument.price = t.price)
					}), o.changeAssetLevel = function(e) {
						o.level = Math.round(e), p(), o.$emit("updateLongTermAssetSelection", {
							index: o.idx,
							level: e
						})
					}, o.openPosition = function(e) {
						var t = {
							instrument: o.instrument,
							price: o.instrument.price,
							option: o.asset,
							amount: o.amount,
							direction: e
						};
						r.logTraderEvent("Scheduled Options", e + " clicked", "Widget #" + o.idx), n.openPosition(t, !0)
					},
						function() {
							p();
							var e = function() {
								o.$evalAsync(function() {
									setPositions(), setLast24DividerLeft(), setOverallDividerLeft()
								})
							};
							window.addEventListener("resize", e), o.$on("$destroy", function() {
								window.removeEventListener("resize", e)
							}), l.getAccount().then(function(e) {
								o.currencySign = t.getCurrencySign(e.currency)
							})
						}()
				}]
			}
		}])
	}(BX8Trader, d3),
	function(e, t) {
		"use strict";
		e.directive("longTermOptionGuest", ["$timeout", "ToolService", "PositionModalService", "ConfigurationService", "UserService", "AnalyticsService", "GuestService", function(e, n, o, i, r, s, a) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/longTermOption.html",
				scope: {
					level: "=",
					instrument: "=",
					amount: "=",
					idx: "=",
					viewModel: "=?"
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "$timeout", "UserService", "BrokerDetailsService", "TranslationService", function(e, i, r, l, u, c, d, p) {
					i.asset = null, i.optionDurationLabels = {
						4: "options.duration.1-month",
						5: "options.duration.2-months",
						6: "options.duration.4-months",
						7: "options.duration.12-months",
						9: "options.duration.end-of-week"
					}, i.optionDurationLabelsArray = [{
						level: "9",
						label: "options.duration.end-of-week"
					}, {
						level: "4",
						label: "options.duration.1-month"
					}, {
						level: "5",
						label: "options.duration.2-months"
					}, {
						level: "6",
						label: "options.duration.4-months"
					}, {
						level: "7",
						label: "options.duration.12-months"
					}], i.optionAbbrLabels = {
						4: "options.duration.abbr-1mo",
						5: "options.duration.abbr-2mo",
						6: "options.duration.abbr-4mo",
						7: "options.duration.abbr-12mo",
						9: "options.duration.abbr-eow"
					};
					var m = function() {
							var e = i.instrument.longTermOptions.filter(function(e) {
								return e.level === i.level
							});
							e && 1 === e.length && (i.asset = e[0], b(), .5 === i.asset.last24HourTraderHighSentiment && (i.asset.last24HourTraderHighSentiment = n.generateTraderHighSentiment()), .5 === i.asset.overallTraderHighSentiment && (i.asset.overallTraderHighSentiment = i.asset.last24HourTraderHighSentiment))
						},
						g = {
							overall: "overallTraderHighSentiment",
							last24: "last24HourTraderHighSentiment"
						},
						f = 98,
						h = t.scale.linear().domain([0, 100]).range([0, f]),
						v = function(e) {
							i.$evalAsync(function() {
								v[e] || (v[e] = {}, v[e].leftBar = document.getElementById(e + "-left-" + i.idx), v[e].divider = document.getElementById(e + "-divider-" + i.idx), v[e].percentage = document.getElementById(e + "-percentage-" + i.idx));
								var t = v[e].leftBar.offsetLeft + v[e].leftBar.offsetWidth - 1;
								v[e].divider.style.left = t + "px", i.asset[g[e]] >= .5 ? v[e].percentage.style.left = t - v[e].percentage.offsetWidth - 5 + "px" : v[e].percentage.style.left = t + 5 + "px"
							})
						},
						T = function() {
							v("overall")
						},
						y = function() {
							v("last24")
						},
						I = function(e) {
							return e += 80, e > 255 ? 255 : e
						},
						S = function(e) {
							if (e = e.replace("#", ""), 6 == e.length) {
								var t = e.match(/(..)(..)(..)/);
								return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
							}
							if (3 == e.length) return [parseInt(e[0], 16), parseInt(e[1], 16), parseInt(e[2], 16)]
						},
						b = function(e, t) {
							var n = e && "" != e ? e : d.getFromCache().highButtonColor,
								e = S(n),
								o = "rgb(" + e.map(function(e) {
										return I(e)
									}).join(",") + ")";
							e = "rgb(" + e.join(",") + ")";
							var r = t && "" != t ? t : d.getFromCache().lowButtonColor,
								t = S(r),
								s = "rgb(" + t.map(function(e) {
										return I(e)
									}).join(",") + ")";
							t = "rgb(" + t.join(",") + ")", i.accountCurrency = "", i.assetPadding = i.idx > 0 ? 2 : 0, i.style = {
								overall: {
									left: {
										width: h(100 * i.asset.overallTraderHighSentiment) + "%",
										background: "linear-gradient(to right, " + e + ", " + o + ")"
									},
									right: {
										width: null,
										background: "linear-gradient(to left, " + t + ", " + s + ")"
									}
								},
								last24: {
									left: {
										width: h(100 * i.asset.last24HourTraderHighSentiment).toFixed(2) + "%",
										background: "linear-gradient(to right, " + e + ", " + o + ")"
									},
									right: {
										width: null,
										background: "linear-gradient(to left, " + t + ", " + s + ")"
									}
								}
							}, i.style.overall.right.width = h(100 * (1 - i.asset.overallTraderHighSentiment)) + "%", i.style.last24.right.width = h(100 * (1 - i.asset.last24HourTraderHighSentiment)) + "%"
						};
					i.$on("BrokerSignalr", function(e, t) {
						b(t.highButtonColor, t.lowButtonColor)
					}), i.$watch("instrument", function() {
						m()
					}), i.$on("onTraderSentiment", function(e, t) {
						if (i.asset && i.instrument.instrumentId === t.instrumentId) {
							var n = t.optionSentiments.filter(function(e) {
								return e.level === i.asset.level
							});
							n && n[0] && m()
						}
					}), i.$on("quote", function(e, t) {
						i.instrument && i.instrument.symbolId === t.symbolId && (i.instrument.price = t.price)
					}), i.changeAssetLevel = function(e) {
						i.level = Math.round(e), m(), i.$emit("updateLongTermAssetSelection", {
							index: i.idx,
							level: e
						})
					}, i.openPosition = function(e, t, n, r) {
						if (i.viewModel && i.viewModel.isGuestMode) return a.showPopup(), void s.logTraderEvent("Promotion", "Open position by level", i.level);
						var l = {
							instrument: i.instrument,
							price: i.instrument.price,
							option: i.asset,
							amount: i.amount,
							direction: e
						};
						s.logTraderEvent("Scheduled Options", e + " clicked", "Widget #" + i.idx), o.openPosition(l, !0)
					},
						function() {
							var e = c.getCurrentAccount();
							i.currencySign = n.getCurrencySign(e.currency), m(), i.$watch("asset.overallTraderHighSentiment", function() {
								i.asset && T()
							}), i.$watch("asset.last24HourTraderHighSentiment", function() {
								i.asset && y()
							});
							var t = function() {
								i.$evalAsync(function() {
									b(), y(), T()
								})
							};
							window.addEventListener("resize", t), i.$on("$destroy", function() {
								window.removeEventListener("resize", t)
							})
						}()
				}]
			}
		}])
	}(BX8Trader, d3),
	function(e) {
		"use strict";

		function t(e, t) {
			function n(n) {
				r.openTime = moment(r.position.openDateTime), r.totalTime = r.position.expireTime.diff(r.openTime), r.progress = n.diff(r.openTime);
				var i = moment.utc(r.position.expireTime.diff(n));
				r.timeLeft = i.format("mm:ss"), moment.utc(r.position.expireTime.diff(n)).hours() < 1 ? r.showProgressBar = !0 : (r.showProgressBar = !1, r.daysLeft = Math.floor(i / 864e5), i -= 864e5 * r.daysLeft, r.hoursLeft = Math.floor(i / 36e5), i -= 36e5 * r.hoursLeft, r.minutesLeft = Math.floor(i / 6e4), i -= 6e4 * r.minutesLeft, r.secondsLeft = Math.floor(i / 1e3), r.daysLeft = Math.abs(r.daysLeft), r.hoursLeft = Math.abs(r.hoursLeft), r.minutesLeft = Math.abs(r.minutesLeft), r.secondsLeft = Math.abs(r.secondsLeft)), r.timeLeft <= 0 && e.removeClockTickedCallback("progressbar" + r.position.positionId);
				var s = t.getInstrumentBySymbolId(r.position.symbolId);
				s && (r.currentPrice = s.displayPrice), r.priceDiff = r.currentPrice - r.position.openPrice, r.status = o(r.priceDiff)
			}

			function o(e) {
				var t = Math.sign(e);
				return "Low" == r.position.direction ? s[t + 1] : s[t * -1 + 1]
			}

			function i() {
				e.callbackExists("progressbar" + r.position.positionId) || e.addClockTickedCallback(n, "progressbar" + r.position.positionId)
			}
			var r = this;
			r.progress = 0, r.showProgressBar = !0, r.$onInit = function() {
				i()
			};
			var s = [{
				title: "winning",
				translate: "gamification.winning"
			}, {
				title: "tie",
				translate: "positions.status.draw"
			}, {
				title: "losing",
				translate: "gamification.losing"
			}];
			r.$onDestroy = function() {
				e.removeClockTickedCallback("progressbar" + r.position.positionId)
			}
		}
		t.$inject = ["TimeService", "InstrumentService"], e.component("openPositionStatus", {
			templateUrl: "/Scripts/Trader/Views/Directives/openPositionStatus.html",
			bindings: {
				position: "="
			},
			controller: t,
			controllerAs: "vm"
		})
	}(BX8Trader),
	function(e) {
		"use strict";
		e.directive("payout", ["ToolService", function(e) {
			return {
				restrict: "E",
				templateUrl: function(e, t) {
					return "schedule" === t.type ? "/Scripts/Trader/Views/Directives/payout.html" : "/Scripts/Trader/Views/Directives/instantPayout.html"
				},
				scope: {
					payout: "=",
					identifier: "=",
					amount: "=",
					currencySign: "=",
					display: "="
				},
				controller: ["$rootScope", "$scope", "$element", "$attrs", "$location", "$interval", function(e, t, n, o, i, r) {
					t.decimalPoints = t.amount * (1 + t.payout) % 1 === 0 ? 0 : 1, t.labelStyle = {
						"margin-bottom": t.amount * (1 + t.payout) < 1e5 ? "-12px" : "-6px"
					}
				}]
			}
		}])
	}(BX8Trader),
	function(e) {
		"use strict";
		e.directive("sentiments", ["ToolService", function(e) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/sentiments.html",
				scope: {
					idx: "=",
					option: "="
				},
				controller: ["$scope", "$element", "$attrs", "$location", "$interval", "UserSettingsService", "BrokerDetailsService", function(e, t, n, o, i, r, s) {
					function a(t, n) {
						var o = 100,
							i = d3.scale.linear().domain([0, 100]).range([0, o]),
							r = t && "" != t ? t : s.getHighLowButtonColor().high,
							t = u(r),
							a = "rgb(" + t.map(function(e) {
									return l(e)
								}).join(",") + ")";
						t = "rgb(" + t.join(",") + ")";
						var c = n && "" != n ? n : s.getHighLowButtonColor().low,
							n = u(c),
							d = "rgb(" + n.map(function(e) {
									return l(e)
								}).join(",") + ")";
						n = "rgb(" + n.join(",") + ")", e.accountCurrency = "", e.assetPadding = e.idx > 0 ? 2 : 0, e.style = {
							overall: {
								left: {
									width: i(100 * e.option.overallTraderHighSentiment) + "%",
									background: "linear-gradient(to right, " + t + ", " + a + ")"
								},
								right: {
									width: null,
									background: "linear-gradient(to left, " + n + ", " + d + ")"
								}
							},
							last24: {
								left: {
									width: i(100 * e.option.last24HourTraderHighSentiment).toFixed(2) + "%",
									background: "linear-gradient(to right, " + t + ", " + a + ")"
								},
								right: {
									width: null,
									background: "linear-gradient(to left, " + n + ", " + d + ")"
								}
							}
						}, e.style.overall.right.width = i(100 * (1 - e.option.overallTraderHighSentiment)) + "%", e.style.last24.right.width = i(100 * (1 - e.option.last24HourTraderHighSentiment)) + "%"
					}

					function l(e) {
						return e += 80, e > 255 ? 255 : e
					}

					function u(e) {
						if (e = e.replace("#", ""), 6 == e.length) {
							var t = e.match(/(..)(..)(..)/);
							return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
						}
						if (3 == e.length) return [parseInt(e[0], 16), parseInt(e[1], 16), parseInt(e[2], 16)]
					}
					e.$watch("option", function() {
						a(s.getFromCache().highButtonColor, s.getFromCache().lowButtonColor)
					})
				}]
			}
		}])
	}(BX8Trader), BX8Trader.directive("shortTermOption", ["ToolService", "PositionModalService", "ConfigurationService", "InstrumentService", "AnalyticsService", "TranslationService", "TimeService", function(e, t, n, o, i, r, s) {
	return {
		restrict: "E",
		templateUrl: "/Scripts/Trader/Views/Directives/shortTermOption.html",
		scope: {
			level: "=",
			instrument: "=",
			amount: "=",
			idx: "=",
			color: "=",
			display: "="
		},
		controller: ["$rootScope", "$scope", "$element", "$attrs", "$timeout", "UserService", function(n, i, r, a, l, u) {
			i.optionDurationLabels = {
				0: "options.duration.5-minutes",
				1: "options.duration.15-minutes",
				2: "options.duration.30-minutes",
				3: "options.duration.60-minutes",
				10: "options.duration.2-hours",
				8: "options.duration.end-of-day"
			}, i.optionDurationLabelsArray = [{
				level: "0",
				label: "options.duration.5-minutes"
			}, {
				level: "1",
				label: "options.duration.15-minutes"
			}, {
				level: "2",
				label: "options.duration.30-minutes"
			}, {
				level: "3",
				label: "options.duration.60-minutes"
			}, {
				level: "10",
				label: "options.duration.2-hours"
			}, {
				level: "8",
				label: "options.duration.end-of-day"
			}], i.optionAbbrLabels = {
				0: "options.duration.abbr-5m",
				1: "options.duration.abbr-15m",
				2: "options.duration.abbr-30m",
				3: "options.duration.abbr-60m",
				10: "options.duration.abbr-120m",
				8: "options.duration.abbr-eod"
			};
			var c = 80,
				d = 75,
				p = 62,
				m = 0,
				g = 0,
				f = document.getElementById("ticker-" + i.idx),
				h = null;
			i.accountCurrency = "", i.assetPadding = i.idx > 0 ? 2 : 0, i.noEntryTimeLeft = 0, i.isOptionUnavailable = !1, l(function() {
				if (T(), i.isOptionUnavailable) {
					i.entryTimeLabel = "";
					var t = u.getCurrentAccount();
					i.currencySign = e.getCurrencySign(t.currency)
				}
			});
			var v = function(e) {
					var t = parseInt(e / 3600),
						n = parseInt(e / 60) % 60,
						o = e % 60;
					i.entryTimeLabel = s.getCurrentTime().startOf("day").hour(t).minute(n).second(o).format("HH:mm:ss")
				},
				T = function() {
					var e = o.getInstrumentBySymbolId(i.instrument.symbolId);
					if (!e || !e.enabled) return void(i.isOptionUnavailable = !0);
					i.instrument = e;
					var t = e.options.filter(function(e) {
						return e.level === i.level
					});
					t && 1 === t.length ? (i.asset = t[0], i.isOptionUnavailable = !1) : i.isOptionUnavailable = !0, l(function() {
						f = document.getElementById("ticker-" + i.idx), f && (h = f.getContext("2d"))
					})
				},
				y = function(e) {
					var t;
					return e >= 0 && e <= .25 ? (t = 1.5 + 2 * e, 1.5 !== t ? t : 1.5001) : (t = 2 * e - .5, 1.5 !== t ? t : 1.4999)
				},
				I = function(e) {
					var t = (60 - e - 1) / 60,
						n = y(t);
					return n
				},
				S = function() {
					S.Initialized = !0;
					var e = Math.ceil(i.noEntryTimeLeft / 60),
						t = i.asset.level < 8 ? 60 : 1440,
						n = e / t;
					return y(n)
				},
				b = function() {
					if (h && f) {
						var e = I(m.seconds()),
							t = S();
						h.clearRect(0, 0, f.width, f.height), h.lineWidth = 5, h.beginPath(), h.arc(c, d, p - 6, 0, 2 * Math.PI), h.fillStyle = "#36474F", h.shadowBlur = 30, h.shadowColor = "darkgray", h.shadowOffsetX = 0, h.shadowOffsetY = 0, h.fill(), h.shadowColor = "rgba(0, 0, 0, 0)", h.shadowBlur = 0, h.shadowOffsetX = 0, h.shadowOffsetY = 0, h.beginPath(), h.arc(c, d, p + 5, 1.5 * Math.PI, t * Math.PI), h.strokeStyle = i.color ? i.color : "#01CCB8", h.stroke(), h.beginPath(), h.arc(c, d, p, 1.5 * Math.PI, e * Math.PI), h.strokeStyle = "#FFF", h.stroke(), h.beginPath(), h.arc(c, d, p, 1.5 * Math.PI, e * Math.PI, !0), h.strokeStyle = "#6F8698", h.stroke()
					}
				},
				C = function(e) {
					m = e, i.asset && (g = moment(i.asset.noEntryTime), i.noEntryTimeLeft = g.diff(m, "s"), v(i.noEntryTimeLeft), i.noEntryTimeLeft >= 0 && b(), i.$digest())
				};
			s.addClockTickedCallback(C, "short-term-option-" + i.idx), i.$on("account", function(e, t) {
				i.accountCurrency = t.currency
			}), i.$on("quote", function(e, t) {
				i.instrument && i.instrument.symbolId === t.symbolId && (i.instrument.price = t.price)
			}), i.$on("selectedInstrumentChanged", function(e, t) {
				i.instrument = t, T()
			}), i.$on("instrumentChanged", function(e, t) {
				i.instrument.symbolId === t.symbolId && (i.instrument = t, T())
			}), i.changeAssetLevel = function(e) {
				i.level = Math.round(e), T(), i.$emit("updateShortTermAssetSelection", {
					index: i.idx,
					level: e
				})
			}, i.openPosition = function(e) {
				var n = {
					instrument: i.instrument,
					price: i.instrument.price,
					option: i.asset,
					amount: i.amount,
					direction: e
				};
				t.openPosition(n, !0)
			}, i.displayClass = function() {
				return "display-" + i.display
			}, i.$on("$destroy", function() {
				s.removeClockTickedCallback("short-term-option-" + i.idx)
			}), u.getAccount().then(function(t) {
				i.currencySign = e.getCurrencySign(t.currency)
			})
		}]
	}
}]), BX8Trader.directive("shortTermOptionGuest", ["ToolService", "PositionModalService", "ConfigurationService", "InstrumentService", "AnalyticsService", "TranslationService", "TimeService", "GuestService", function(e, t, n, o, i, r, s, a) {
	return {
		restrict: "E",
		templateUrl: "/Scripts/Trader/Views/Directives/shortTermOptionGuest.html",
		scope: {
			level: "=",
			instrument: "=",
			amount: "=",
			idx: "=",
			viewModel: "=",
			color: "="
		},
		controller: ["$rootScope", "$scope", "$element", "$attrs", "$timeout", "UserService", function(n, o, r, l, u, c) {
			o.optionDurationLabels = {
				"-1": "options.duration.60-seconds",
				0: "options.duration.5-minutes",
				1: "options.duration.15-minutes",
				2: "options.duration.30-minutes",
				3: "options.duration.60-minutes",
				8: "options.duration.end-of-day"
			}, o.optionAbbrLabels = {
				0: "options.duration.abbr-5m",
				1: "options.duration.abbr-15m",
				2: "options.duration.abbr-30m",
				3: "options.duration.abbr-60m",
				8: "options.duration.abbr-eod"
			}, o.optionDurationLabelsArray = [];
			for (var d in o.optionDurationLabels) o.optionDurationLabelsArray.push({
				level: +d,
				label: o.optionDurationLabels[d]
			});
			var p = 80,
				m = 75,
				g = 62,
				f = 0,
				h = 0,
				v = document.getElementById("ticker-" + o.idx),
				T = null;
			o.accountCurrency = "", o.assetPadding = o.idx > 0 ? 2 : 0, o.noEntryTimeLeft = 0, u(function() {
				v = document.getElementById("ticker-" + o.idx), T = v.getContext("2d"), I(), o.entryTimeLabel = "";
				var t = c.getCurrentAccount();
				o.currencySign = e.getCurrencySign(t.currency)
			});
			var y = function(e) {
					var t = parseInt(e / 3600),
						n = parseInt(e / 60) % 60,
						i = e % 60;
					o.entryTimeLabel = s.getCurrentTime().startOf("day").hour(t).minute(n).second(i).format("HH:mm:ss")
				},
				I = function() {
					var e = o.instrument.options.filter(function(e) {
						return e.level === o.level
					});
					e && 1 === e.length && (o.asset = angular.copy(e[0]))
				},
				S = function(e) {
					var t;
					return e >= 0 && e <= .25 ? (t = 1.5 + 2 * e, 1.5 !== t ? t : 1.5001) : (t = 2 * e - .5, 1.5 !== t ? t : 1.4999)
				},
				b = function(e) {
					var t = (60 - e - 1) / 60,
						n = S(t);
					return n
				},
				C = function() {
					C.Initialized = !0;
					var e = Math.ceil(o.noEntryTimeLeft / 60),
						t = o.asset.level < 8 ? 60 : 1440,
						n = e / t;
					return S(n)
				},
				P = function() {
					if (T) {
						var e = b(f.seconds()),
							t = C();
						T.clearRect(0, 0, v.width, v.height), T.lineWidth = 5, T.beginPath(), T.arc(p, m, g - 6, 0, 2 * Math.PI), T.fillStyle = "#36474F", T.shadowBlur = 30, T.shadowColor = "darkgray", T.shadowOffsetX = 0, T.shadowOffsetY = 0, T.fill(), T.shadowColor = "rgba(0, 0, 0, 0)", T.shadowBlur = 0, T.shadowOffsetX = 0, T.shadowOffsetY = 0, T.beginPath(), T.arc(p, m, g + 5, 1.5 * Math.PI, t * Math.PI), T.strokeStyle = o.color ? o.color : "#01CCB8", T.stroke(), T.beginPath(), T.arc(p, m, g, 1.5 * Math.PI, e * Math.PI), T.strokeStyle = "#FFF", T.stroke(), T.beginPath(), T.arc(p, m, g, 1.5 * Math.PI, e * Math.PI, !0), T.strokeStyle = "#6F8698", T.stroke()
					}
				},
				O = function(e) {
					f = e, o.asset && (h = moment(o.asset.noEntryTime), o.noEntryTimeLeft = h.diff(f, "s"), y(o.noEntryTimeLeft), o.noEntryTimeLeft >= 0 && P(), o.$digest())
				};
			s.addClockTickedCallback(O, "asset-by-level-" + o.idx), o.$on("account", function(e, t) {
				o.accountCurrency = t.currency
			}), o.$on("selectedInstrumentChanged", function(e, t) {
				o.instrument = t, I()
			}), o.$on("instrumentChanged", function(e, t) {
				o.instrument.instrumentId === t.instrumentId && (o.instrument = t, I())
			}), o.changeAssetLevel = function(e) {
				return e == -1 ? void o.$emit("assetLevelChanged", o.idx, e) : (o.level = Math.round(e), o.asset.level = Math.round(e), I(), void o.$emit("updateShortTermAssetSelection", {
					index: o.idx,
					level: e
				}))
			}, o.openPosition = function(e, n, r, s) {
				if (o.viewModel && o.viewModel.isGuestMode) return a.showPopup(), void i.logTraderEvent("Promotion", "Open position by level", o.optionDurationLabels[o.level]);
				var l = {
					instrument: r,
					option: s,
					amount: n,
					direction: e
				};
				t.openPosition(l, !0)
			}, o.$on("$destroy", function() {
				s.removeClockTickedCallback("asset-by-level-" + o.idx)
			})
		}]
	}
}]),
	function(e) {
		"use strict";
		e.directive("spinner", ["$q", function(e) {
			return {
				restrict: "E",
				templateUrl: "/Scripts/Trader/Views/Directives/spinner.html",
				scope: {
					enabled: "="
				}
			}
		}])
	}(BX8Trader),
	function() {
		"use strict";
		BX8Trader.directive("svgIcon", [function() {
			return {
				restrict: "E",
				controller: ["$rootScope", "$scope", "$element", "$attrs", "$http", "ToolService", function(e, t, n, o, i, r) {
					var s = o.height,
						a = o.width,
						l = o.color,
						u = r.generateGuid();
					n.css("display", "inline-block"), i.get(o.src).then(function(e) {
						n.append(e.data);
						var t = n.find("svg").get(0);
						s && t.setAttribute("height", s), a && t.setAttribute("width", a), t.setAttribute("id", u);
						for (var o = t.querySelectorAll("style"), i = 0; i < o.length; i++) o[i].parentNode.removeChild(o[i]);
						if (l) {
							var r = document.createElement("style");
							r.innerText = "#" + u + " * { fill: " + l + "; color: " + l + ";}", document.head.appendChild(r)
						}
						0 === t.clientHeight && t.setAttribute("height", n.get(0).offsetHeight), 0 === t.clientWidth && t.setAttribute("width", n.get(0).offsetWidth)
					})
				}]
			}
		}])
	}(), BX8Trader.directive("tablePagination", ["ToolService", "ConfigurationService", function(e, t) {
	return {
		restrict: "E",
		templateUrl: "/Scripts/Trader/Views/Directives/tablePagination.html",
		scope: {
			count: "@",
			recordsPerPage: "@",
			page: "@"
		},
		controller: ["$scope", "$element", "$attrs", "$location", function(e, t, n, o) {
			e.displayPage = parseInt(e.page), e.$watch("count", function() {
				e.maxPage = Math.ceil(e.count / e.recordsPerPage)
			}), e.backward = function() {
				e.displayPage > 0 && (e.displayPage--, e.$emit("backward", parseInt(e.displayPage)))
			}, e.fastBackward = function() {
				e.displayPage = 0, e.$emit("fastBackward", parseInt(e.displayPage))
			}, e.forward = function() {
				e.displayPage < e.maxPage && (e.displayPage++, e.$emit("forward", parseInt(e.displayPage)))
			}, e.fastForward = function() {
				e.displayPage = e.maxPage - 1, e.$emit("fastForward", parseInt(e.displayPage))
			}, e.getCurrentPage = function() {
				var t = parseInt(e.displayPage);
				return t + 1
			}, e.maxPage = Math.ceil(e.count / e.recordsPerPage)
		}]
	}
}]);