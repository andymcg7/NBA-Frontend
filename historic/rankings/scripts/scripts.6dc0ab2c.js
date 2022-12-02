"use strict";angular.module("NBAApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngMaterial","ui.bootstrap","angularUtils.directives.dirPagination"]).config(["$routeProvider",function(a){a.when("/all/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/player/:param",{templateUrl:"views/player.html",controller:"PlayerCtrl",reloadOnSearch:!1}).when("/:param",{templateUrl:"views/rankings.html",controller:"RankingsCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/all/"})}]),angular.module("NBAApp").controller("MainCtrl",["$scope","$filter","$location","$q","dataService","playerService","clubsService",function(a,b,c,d,e,f,g){function h(b){return-1!==b.name.toLowerCase().indexOf(a.search.toLowerCase())?!0:!1}a.search="",a.selected=[],a.loadingData=!0;var i=c.search(),j=0;i.hasOwnProperty("club")&&(j=i.club),e.isInitialised()?(a.loadingData=!1,a.players=f.getAllPlayers()):a.loadingPromise=e.initialise().then(function(){a.noConnection=!1,a.dataSuccess=!0,a.players=f.getAllPlayers(),a.loadingData=!1},function(){a.noConnection=!0,a.dataSuccess=!1,a.loadingData=!1,a.players=[],a.filteredPlayers=[]}),a.sort=function(b){a.sortKey=b,a.reverse=!a.reverse},a.filterFn=function(a){return void 0===j||0===j?h(a):a.primaryClub===j||a.secondaryClub===j?h(a):!1},a.orderByFunction=function(b){return isNaN(b[a.sortKey])?b[a.sortKey]:Number(b[a.sortKey])},a.getClubDisplay=g.getClubDisplay,a.sortKey="name",a.reverse=!1}]),angular.module("NBAApp").controller("PlayerCtrl",["$scope","$routeParams","$location","dataService","playerService","matchesService","matchUtilityService","separateMatchesService","clubsService","gradeService",function(a,b,c,d,e,f,g,h,i,j){function k(){a.player=e.getPlayer(b.param),f.hasPlayersMatches(a.player.id)?(a.matches=f.getMatchesForPlayerFromExistingData(a.player.id),m()):a.loadingPromise=d.getMatchesForPlayer(a.player.id).then(function(){a.noConnection=!1,a.dataSuccess=!0,a.matches=f.getMatchesForPlayerFromExistingData(a.player.id),m()},function(){a.noConnection=!0,a.dataSuccess=!1})}function l(){n=!0;var b=c.search();if(b.hasOwnProperty("view"))switch(b.view){case"doubles":a.selectedTabIndex=1,a.viewTab="doubles";break;case"mixed":a.selectedTabIndex=2,a.viewTab="mixed";break;default:a.selectedTabIndex=0,a.viewTab="singles"}else a.selectedTabIndex=0}function m(){h.separateMatches(f.returnPlayerMatches()),a.singlesGradeHistoryDisplay=a.player.singlesGradeHistory.split("|"),a.doublesGradeHistoryDisplay=a.player.doublesGradeHistory.split("|"),a.mixedGradeHistoryDisplay=a.player.mixedGradeHistory.split("|"),a.activeInSingles=a.player.singlesMatchesPlayed>0,a.activeInDoubles=a.player.doublesMatchesPlayed>0,a.activeInMixed=a.player.mixedMatchesPlayed>0,a.getClubDisplay=i.getClubDisplay,a.getGradePromotionValue=j.getPromotionValue,a.getGradeDemotionValue=j.getDemotionValue,a.singles={},a.doubles={},a.mixed={},a.singles.matches=h.getSinglesMatches();var b=j.getPlayerStatus(a.player.singlesGrade,a.player.singlesAverage,a.player.singlesDemotionAverage);"promotion"===b?(a.singles.promotion=!0,a.singles.demotion=!1,a.singles.remain=!1):"demotion"===b?(a.singles.promotion=!1,a.singles.demotion=!0,a.singles.remain=!1):(a.singles.promotion=!1,a.singles.demotion=!1,a.singles.remain=!0),a.doubles.matches=h.getDoublesMatches();var c=j.getPlayerStatus(a.player.doublesGrade,a.player.doublesAverage,a.player.doublesDemotionAverage);"promotion"===c?(a.doubles.promotion=!0,a.doubles.demotion=!1,a.doubles.remain=!1):"demotion"===c?(a.doubles.promotion=!1,a.doubles.demotion=!0,a.doubles.remain=!1):(a.doubles.promotion=!1,a.doubles.demotion=!1,a.doubles.remain=!0),a.mixed.matches=h.getMixedMatches();var d=j.getPlayerStatus(a.player.mixedGrade,a.player.mixedAverage,a.player.mixedDemotionAverage);"promotion"===d?(a.mixed.promotion=!0,a.mixed.demotion=!1,a.mixed.remain=!1):"demotion"===d?(a.mixed.promotion=!1,a.mixed.demotion=!0,a.mixed.remain=!1):(a.mixed.promotion=!1,a.mixed.demotion=!1,a.mixed.remain=!0),l()}a.singlesGradeHistoryDisplay=[],a.doublesGradeHistoryDisplay=[],a.mixedGradeHistoryDisplay=[],a.loadingData=!0,a.viewTab="singles";var n=!1;a.$on("$routeUpdate",function(){l()}),setTimeout(function(){a.$apply(function(){d.isInitialised()?(a.loadingData=!1,k()):a.loadingPromise=d.initialise().then(function(){a.noConnection=!1,a.dataSuccess=!0,a.loadingData=!1,k()},function(){a.noConnection=!0,a.dataSuccess=!1,a.loadingData=!1})})},50),a.formatMatchDate=function(a){var b=new Date(parseInt(a));return b.getDate()+"/"+(b.getMonth()+1)+"/"+b.getFullYear()},a.getMatchResult=g.getShortMatchResult,a.getOpponentName=g.getOpponentName,a.getPartnerName=g.getPartnerName,a.getPartnerGrade=g.getPartnerGrade,a.getPartnerID=g.getPartnerID,a.getMatchScore=g.getMatchScore,a.getOpponentGrade=g.getOpponentGrade,a.getOpponentID=g.getOpponentID,a.getMatchPoints=function(b){return"Won"===g.getShortMatchResult(b,a.player.id)?j.getGradeValue(j.getOpponentGrade(b,a.player)):0},a.hasValidGradeHistory=function(b){return"Singles"===b?a.singlesGradeHistoryDisplay.length>0&&""!==a.singlesGradeHistoryDisplay[0]:"Doubles"===b?a.doublesGradeHistoryDisplay.length>0&&""!==a.doublesGradeHistoryDisplay[0]:a.mixedGradeHistoryDisplay.length>0&&""!==a.mixedGradeHistoryDisplay[0]},a.singlesSort=function(b){a.singlesSortKey=b,a.singlesReverse=!a.singlesReverse},a.doublesSort=function(b){a.doublesSortKey=b,a.doublesReverse=!a.doublesReverse},a.mixedSort=function(b){a.mixedSortKey=b,a.mixedReverse=!a.mixedReverse},a.singlesOrderByFunction=function(b){switch(a.singlesSortKey){case"match":return b.title;case"score":return a.getMatchResult(b,a.player.id);case"result":return a.getMatchResult(b,a.player.id);case"opponent":return a.getOpponentName(b,a.player);case"points":return a.getMatchPoints(b);case"date":return Number(b[a.singlesSortKey]);case"opponentGrade":return a.getOpponentGrade(b,a.player)}},a.doublesOrderByFunction=function(b){switch(a.doublesSortKey){case"match":return b.title;case"score":return a.getMatchResult(b,a.player.id);case"result":return a.getMatchResult(b,a.player.id);case"partner":return a.getPartnerName(b,a.player);case"opponent":return a.getOpponentName(b,a.player);case"points":return a.getMatchPoints(b);case"date":return Number(b[a.doublesSortKey]);case"opponentGrade":return a.getOpponentGrade(b,a.player);case"partnerGrade":return a.getPartnerGrade(b,a.player)}},a.mixedOrderByFunction=function(b){switch(a.mixedSortKey){case"match":return b.title;case"score":return a.getMatchResult(b,a.player.id);case"result":return a.getMatchResult(b,a.player.id);case"partner":return a.getPartnerName(b,a.player);case"opponent":return a.getOpponentName(b,a.player);case"points":return a.getMatchPoints(b);case"date":return Number(b[a.mixedSortKey]);case"opponentGrade":return a.getOpponentGrade(b,a.player);case"partnerGrade":return a.getPartnerGrade(b,a.player)}},a.onTabSelected=function(){if(n)switch(a.selectedTabIndex){case 0:c.search("view","singles");break;case 1:c.search("view","doubles");break;case 2:c.search("view","mixed")}},a.singlesSortKey="name",a.singlesReverse=!1,a.doublesSortKey="name",a.doublesReverse=!1,a.mixedSortKey="name",a.mixedReverse=!1}]),angular.module("NBAApp").controller("RankingsCtrl",["$scope","$filter","$location","$routeParams","$q","dataService","playerService","clubsService","calculateRankingsService",function(a,b,c,d,e,f,g,h,i){function j(){var b=c.search();b.hasOwnProperty("club")?a.selectedClub=a.clubs.find(function(a){return a.id===b.club}):a.selectedClub=a.clubs[0],b.hasOwnProperty("grade")?"All"===b.grade?a.selectedGrade=a.grades[0]:a.selectedGrade=b.grade:a.selectedGrade=a.grades[0]}function k(b){return"All"===a.selectedGrade?!0:-1!==b[a.gradeField].indexOf(a.selectedGrade)}function l(b){return-1!==b.name.toLowerCase().indexOf(a.search.toLowerCase())?!0:!1}a.search="",a.selected=[],a.loadingData=!0,a.title="",a.reverse=!1,a.grades=["All","A","B","C","D","E","UG"];var m;a.sort=function(b){a.sortKey=b,a.reverse=!a.reverse},a.$on("$routeUpdate",function(){j()});var n=function(b){switch(m=b,a.clubs=h.getSortedClubDisplayList(),j(),m){case"ms":a.players=i.returnMSPlayers(),a.title="Mens Singles",a.rankingField="singlesRanking",a.averageField="singlesAverage",a.gradeField="singlesGrade",a.matchesPlayedField="singlesMatchesPlayed",a.viewTab="singles";break;case"ls":a.players=i.returnLSPlayers(),a.title="Ladies Singles",a.rankingField="singlesRanking",a.averageField="singlesAverage",a.gradeField="singlesGrade",a.matchesPlayedField="singlesMatchesPlayed",a.viewTab="singles";break;case"md":a.players=i.returnMDPlayers(),a.title="Mens Doubles",a.rankingField="doublesRanking",a.averageField="doublesAverage",a.gradeField="doublesGrade",a.matchesPlayedField="doublesMatchesPlayed",a.viewTab="doubles";break;case"ld":a.players=i.returnLDPlayers(),a.title="Ladies Doubles",a.rankingField="doublesRanking",a.averageField="doublesAverage",a.gradeField="doublesGrade",a.matchesPlayedField="doublesMatchesPlayed",a.viewTab="doubles";break;case"mxd":a.players=i.returnMXDPlayers(),a.title="Mens Mixed Doubles",a.rankingField="mixedRanking",a.averageField="mixedAverage",a.gradeField="mixedGrade",a.matchesPlayedField="mixedMatchesPlayed",a.viewTab="mixed";break;case"lxd":a.players=i.returnLXDPlayers(),a.title="Ladies Mixed Doubles",a.rankingField="mixedRanking",a.averageField="mixedAverage",a.gradeField="mixedGrade",a.matchesPlayedField="mixedMatchesPlayed",a.viewTab="mixed"}a.sort("average")};setTimeout(function(){a.$apply(function(){f.isInitialised()?(a.loadingData=!1,n(d.param)):a.loadingPromise=f.initialise().then(function(){a.noConnection=!1,a.dataSuccess=!0,a.loadingData=!1,n(d.param)},function(){a.noConnection=!0,a.dataSuccess=!1,a.loadingData=!1})})},50),a.orderByFunction=function(b){var c=a.sortKey;if("rank"===a.sortKey?c=a.rankingField:"average"===a.sortKey?c=a.averageField:"matchesPlayed"===a.sortKey?c=a.matchesPlayedField:"grade"===a.sortKey&&(c=a.gradeField),isNaN(b[c])){var d=b[c];return void 0===d?void 0:-1!==d.indexOf("=")?parseFloat(d):d}return Number(b[c])},a.gradeFilterClose=function(){c.search("grade",a.selectedGrade)},a.clubFilterClose=function(){c.search("club",a.selectedClub.id)},a.filterFn=function(b){return void 0===a.selectedClub.id||0===a.selectedClub.id||"all"===a.selectedClub.id?l(b)&&k(b):b.primaryClub===a.selectedClub.id||b.secondaryClub===a.selectedClub.id?l(b)&&k(b):!1},a.getClubDisplay=h.getClubDisplay,a.getRanking=function(a){switch(m){case"ms":case"ls":return a.singlesRanking;case"md":case"ld":return a.doublesRanking;case"mxd":case"lxd":return a.mixedRanking}},a.getGrade=function(a){switch(m){case"ms":case"ls":return a.singlesGrade;case"md":case"ld":return a.doublesGrade;case"mxd":case"lxd":return a.mixedGrade}},a.getMatchesPlayed=function(a){switch(m){case"ms":case"ls":return a.singlesMatchesPlayed;case"md":case"ld":return a.doublesMatchesPlayed;case"mxd":case"lxd":return a.mixedMatchesPlayed}},a.getAverage=function(a){switch(m){case"ms":case"ls":return Number(a.singlesAverage);case"md":case"ld":return Number(a.doublesAverage);case"mxd":case"lxd":return Number(a.mixedAverage)}}}]),angular.module("NBAApp").controller("TabCtrl",["$scope","$location",function(a,b){var c=!0;a.allPlayersClick=function(){if(c){var d=b.url();-1!==d.indexOf("/ms")?a.selectedIndex=1:-1!==d.indexOf("/ls")?a.selectedIndex=2:-1!==d.indexOf("/md")?a.selectedIndex=3:-1!==d.indexOf("/ld")?a.selectedIndex=4:-1!==d.indexOf("/mxd")?a.selectedIndex=5:-1!==d.indexOf("/lxd")?a.selectedIndex=6:-1!==d.indexOf("/player")?(a.selectedIndex=-1,c=!1):(a.selectedIndex=0,c=!1)}else b.url("/all")},a.msClick=function(){c?c=!1:b.url("/ms")},a.lsClick=function(){c?c=!1:b.url("/ls")},a.mdClick=function(){c?c=!1:b.url("/md")},a.ldClick=function(){c?c=!1:b.url("/ld")},a.mxdClick=function(){c?c=!1:b.url("/mxd")},a.lxdClick=function(){c?c=!1:b.url("/lxd")}}]),angular.module("NBAApp").service("playerService",function(){function a(a){return k[a]}function b(a){return parseInt(a.singlesMatchesPlayed)>0}function c(a){return parseInt(a.doublesMatchesPlayed)>0}function d(a){return parseInt(a.mixedMatchesPlayed)>0}function e(){return j}function f(a){j=a;for(var b=0;b<a.length;b++)k[a[b].id]=a[b]}function g(b){for(var c=0;c<b.length;c++)void 0===a(b[c].id)&&(j.push(b[c]),k[b[c].id]=b[c])}function h(a,b,c,d){var e=function(d){return"Mens Doubles"===b?d.primaryClub===a&&"Male"===d.gender:"Ladies Doubles"===b?d.primaryClub===a&&"Female"===d.gender:(d.primaryClub===a||d.secondaryClub===a)&&d.gender===c},f=j.filter(e).sort(i);if(d){var g={id:-1,name:""};f.unshift(g)}return f}function i(a,b){return a.name<b.name?-1:a.name>b.name?1:0}var j=[],k={};return{setPlayers:f,addPlayers:g,getAllPlayers:e,getPlayer:a,returnAllPlayers:e,activeInSingles:b,activeInDoubles:c,activeInMixed:d,getPlayersForClub:h}}),angular.module("NBAApp").service("clubsService",function(){function a(a){h=a,b(),c()}function b(){j=h.reduce(function(a,b){return a[b.id]=b.name,a},{})}function c(){i=h.map(function(a){return{id:a.id,name:a.name}}),i.sort(function(a,b){return a.name<b.name?-1:a.name>b.name?1:0}),i.unshift({id:"all",name:"All"})}function d(a){return void 0!==a?a.primaryClub===a.secondaryClub&&"0"!==a.primaryClub?e(a.primaryClub):"0"===a.primaryClub?"No club":e(a.primaryClub)+" / "+e(a.secondaryClub):""}function e(a){return j[a]}function f(){return i}function g(a){for(var b=0;b<h.length;b++)if(h[b].id===a)return h[b];return void 0}var h=[],i=[],j={};return{setClubs:a,getClubDisplay:d,getSortedClubDisplayList:f,getClub:g}}),angular.module("NBAApp").service("matchesService",function(){function a(a){return l||-1!==m.indexOf(a)}function b(a){for(var b=0;b<a.length;b++)if(Array.isArray(a[b]))for(var d=0;d<a[b].length;d++)c(a[b][d])||k.push(a[b][d]);else c(a[b])||k.push(a[b])}function c(a){for(var b=0;b<k.length;b++)if(k[b].id===a.id)return!0;return!1}function d(a){n=[];for(var b=0;b<k.length;b++)"true"!==k[b].matchPlayed||"yes"!==k[b].approved||k[b].player1!==a&&k[b].partner1!==a&&k[b].player2!==a&&k[b].partner2!==a||n.push(k[b]);return n}function e(){return k}function f(){return n}function g(a){k=a,l=!0}function h(a,c){m.push(c),b(a),d(c)}function i(a){b(a)}function j(a){for(var b=0;b<k.length;b++)if(k[b].id===a)return k[b];return void 0}var k=[],l=!1,m=[],n=[];return{setMatches:g,addMatches:i,setMatchesForPlayer:h,hasPlayersMatches:a,getMatchesForPlayerFromExistingData:d,returnMatches:e,returnPlayerMatches:f,getMatch:j}}),angular.module("NBAApp").service("matchUtilityService",["playerService",function(a){function b(a,b,c,d){var e=0,f=0;return parseInt(a)>parseInt(b)?e++:f++,parseInt(c)>parseInt(d)?e++:f++,e===f}function c(a,b){return a.player1===b||a.partner1===b?d(a.team1Score1,a.team2Score1,a.team1Score2,a.team2Score2,a.team1Score3,a.team2Score3)?"Won":"Lost":d(a.team1Score1,a.team2Score1,a.team1Score2,a.team2Score2,a.team1Score3,a.team2Score3)?"Lost":"Won"}function d(a,b,c,d,e,f){var g=0,h=0;return parseInt(a)>parseInt(b)?g++:h++,parseInt(c)>parseInt(d)?g++:h++,g===h&&(parseInt(e)>parseInt(f)?g++:h++),g>h}function e(a,c){var d="";return a.player1===c.id||a.partner1===c.id?(d=a.team1Score1+"-"+a.team2Score1+" "+a.team1Score2+"-"+a.team2Score2,b(a.team1Score1,a.team2Score1,a.team1Score2,a.team2Score2)&&(d+=" "+a.team1Score3+"-"+a.team2Score3)):(d=a.team2Score1+"-"+a.team1Score1+" "+a.team2Score2+"-"+a.team1Score2,b(a.team1Score1,a.team2Score1,a.team1Score2,a.team2Score2)&&(d+=" "+a.team2Score3+"-"+a.team1Score3)),d}function f(b,c){return-1!==b.discipline.indexOf("Doubles")?b.player1===c.id||b.partner1===c.id?{opponent1:a.getPlayer(b.player2).name,opponent2:a.getPlayer(b.partner2).name}:{opponent1:a.getPlayer(b.player1).name,opponent2:a.getPlayer(b.partner1).name}:b.player1===c.id?a.getPlayer(b.player2).name:a.getPlayer(b.player1).name}function g(b,c){var d={};return d="Mixed Doubles"===b.discipline?"mixedGrade":"doublesGrade",b.player1===c.id?a.getPlayer(b.partner1)[d]:b.partner1===c.id?a.getPlayer(b.player1)[d]:b.player2===c.id?a.getPlayer(b.partner2)[d]:b.partner2===c.id?a.getPlayer(b.player2)[d]:""}function h(b,c){var d={};return d="Mixed Doubles"===b.discipline?"mixedGrade":"doublesGrade",-1!==b.discipline.indexOf("Doubles")?b.player1===c.id||b.partner1===c.id?a.getPlayer(b.player2)[d]+"/ "+a.getPlayer(b.partner2)[d]:a.getPlayer(b.player1)[d]+"/ "+a.getPlayer(b.partner1)[d]:b.player1===c.id?a.getPlayer(b.player2)[d]:a.getPlayer(b.player1)[d]}function i(b,c){return-1!==b.discipline.indexOf("Doubles")?b.player1===c.id||b.partner1===c.id?'<a href="#player/'+b.player2+'">'+a.getPlayer(b.player2).name+'</a>/ <a href="#player?playerid='+b.partner2+'">'+a.getPlayer(b.partner2).name+"</a>":'<a href="#player/'+b.player1+'">'+a.getPlayer(b.player1).name+'</a>/ <a href="#player?playerid='+b.partner1+'">'+a.getPlayer(b.partner1).name+"</a>":b.player1===c.id?'<a href="#/player/'+b.player2+'">'+a.getPlayer(b.player2).name+"</a>":'<a href="#/player/'+b.player1+'">'+a.getPlayer(b.player1).name+"</a>"}function j(b,c){var d={};return d="Mixed Doubles"===b.discipline?"mixedGrade":"doublesGrade",b.player1===c.id?a.getPlayer(b.partner1).name:b.partner1===c.id?a.getPlayer(b.player1).name:b.player2===c.id?a.getPlayer(b.partner2).name:a.getPlayer(b.player2).name}function k(a,b){return a.player1===b.id?a.partner1:a.partner1===b.id?a.player1:a.player2===b.id?a.partner2:a.player2}function l(b,c){var d={};return d="Mixed Doubles"===b.discipline?"mixedGrade":"doublesGrade",b.player1===c.id?'<a href="#player/'+b.partner1+'">'+a.getPlayer(b.partner1).name+"</a> ("+a.getPlayer(b.partner1)[d]+")":b.partner1===c.id?'<a href="#player/'+b.player1+'">'+a.getPlayer(b.player1).name+"</a> ("+a.getPlayer(b.player1)[d]+")":b.player2===c.id?'<a href="#player/'+b.partner2+'">'+a.getPlayer(b.partner2).name+"</a> ("+a.getPlayer(b.partner2)[d]+")":'<a href="#player/'+b.player2+'">'+a.getPlayer(b.player2).name+"</a> ("+a.getPlayer(b.player2)[d]+")"}function m(a,b){return-1!==a.discipline.indexOf("Doubles")?a.player1===b.id||a.partner1===b.id?{opponent:a.player2,partner:a.partner2}:{opponent:a.player1,partner:a.partner1}:a.player1===b.id?{opponent:a.player2}:{opponent:a.player1}}return{getMatchResult:d,getShortMatchResult:c,getPartnerName:j,getPartnerNameWithLink:l,getPartnerID:k,getPartnerGrade:g,getOpponentName:f,getOpponentNameWithLink:i,getOpponentID:m,getOpponentGrade:h,getMatchScore:e}}]),angular.module("NBAApp").service("separateMatchesService",function(){function a(a){b=[],c=[],d=[];var e=function(a){return-1!==a.discipline.indexOf("Singles")},f=function(a){return-1!==a.discipline.indexOf("Mixed")},g=function(a){return-1!==a.discipline.indexOf("Mens Doubles")||-1!==a.discipline.indexOf("Ladies Doubles")};b=a.filter(e),d=a.filter(f),c=a.filter(g)}var b=[],c=[],d=[];return{separateMatches:a,getSinglesMatches:function(){return b},getDoublesMatches:function(){return c},getMixedMatches:function(){return d}}}),angular.module("NBAApp").service("calculateRankingsService",["playerService",function(a){function b(a,b,c){var d=!1,e=0,f="";g=[],h=[],i=[],j=[],k=[],l=[],-1!==b.indexOf("Mens")&&(d=!0);var m=function(a){if("Male"===a.gender&&d||"Female"===a.gender&&!d){if(-1!==b.indexOf("Singles")?(e=a.singlesMatchesPlayed,f=a.singlesGrade):-1!==b.indexOf("Mixed")?(e=a.mixedMatchesPlayed,f=a.mixedGrade):-1!==b.indexOf("Doubles")&&(e=a.doublesMatchesPlayed,f=a.doublesGrade),"0"!==e){switch(void 0!==c&&c.indexOf(-1===a)&&c.push(a),f.charAt(0)){case"A":h.push(a);break;case"B":i.push(a);break;case"C":j.push(a);break;case"D":k.push(a);break;case"E":l.push(a)}return!0}return!1}};g=a.filter(m)}function c(a,b,c){var d=-1,e=1,f=null;a.sort(function(a,c){return c[b+"Average"]-a[b+"Average"]});for(var g=0;g<a.length;g++){var h=a[g],i=h[b+"Average"];i===d?-1===f[b+"Ranking"+c].indexOf("=")?(h[b+"Ranking"+c]=f[b+"Ranking"+c]+"=",f[b+"Ranking"+c]+="="):h[b+"Ranking"+c]=f[b+"Ranking"+c]:h[b+"Ranking"+c]=e.toString(),h[b+"RankingsTotal"+c]=a.length,e++,f=h,d=i}}function d(a,d,e){b(a,d,e);var f="";f=-1!==d.indexOf("Singles")?"singles":-1!==d.indexOf("Mixed")?"mixed":"doubles",c(g,f,""),c(h,f,"WithinGrade"),c(i,f,"WithinGrade"),c(j,f,"WithinGrade"),c(k,f,"WithinGrade"),c(l,f,"WithinGrade")}function e(){if(!s){var b=a.returnAllPlayers();d(b,"Mens Singles",m),d(b,"Ladies Singles",n),d(b,"Mens Doubles",o),d(b,"Ladies Doubles",p),d(b,"Mens Mixed Doubles",q),d(b,"Ladies Mixed Doubles",r)}s=!0}function f(){var b=a.returnAllPlayers();d(b,"Mens Singles",void 0),d(b,"Ladies Singles",void 0),d(b,"Mens Doubles",void 0),d(b,"Ladies Doubles",void 0),d(b,"Mens Mixed Doubles",void 0),d(b,"Ladies Mixed Doubles",void 0)}var g=[],h=[],i=[],j=[],k=[],l=[],m=[],n=[],o=[],p=[],q=[],r=[],s=!1;return{calculateOverallRankingsAndStore:e,calculateOverallRankings:f,returnAllPlayers:function(){return g},returnAPlayers:function(){return h},returnBPlayers:function(){return i},returnCPlayers:function(){return j},returnDPlayers:function(){return k},returnEPlayers:function(){return l},returnMSPlayers:function(){return m},returnLSPlayers:function(){return n},returnMDPlayers:function(){return o},returnLDPlayers:function(){return p},returnMXDPlayers:function(){return q},returnLXDPlayers:function(){return r}}}]),angular.module("NBAApp").service("gradeService",["playerService",function(a){function b(a,b){for(var c=-1,d=-1,g=0;g<f.length;g++)f[g].grade===a&&(c=g),f[g].grade===b&&(d=g);if(-1===c||-1===d)return-1;var h=d-c;if(0===h)return e(a);if(h%2===0){var i=h/2,j=c+i;return f[j].points}var k,l;if(1===h||-1===h)return k=e(a),l=e(b),(k+l)/2;var m=h/2,n=c+m-.01,o=d-m-.01;return n=Math.round(n),o=Math.round(o),k=f[n].points,l=f[o].points,(k+l)/2}function c(a){for(var b=0;b<f.length;b++)if(f[b].grade===a){if(0===b)return"n/a";var c=f[b-1].points;return c/4}return"n/a"}function d(a){for(var b=0;b<f.length;b++)if(f[b].grade===a){if(b===f.length-1||b===f.length-2)return-1;var c=f[b+1].points,d=c/2;return d}return-1}function e(a){if(-1!==a.indexOf("/")){var c=a.substring(0,a.indexOf("/")),d=a.substring(a.indexOf("/")+1,a.length);return b(c,d)}for(var e=0;e<f.length;e++)if(f[e].grade===a)return f[e].points;return-1}var f=[{grade:"A2",points:1024},{grade:"B1",points:512},{grade:"B2",points:256},{grade:"C1",points:128},{grade:"C2",points:64},{grade:"D1",points:32},{grade:"D2",points:16},{grade:"E1",points:8},{grade:"E2",points:4},{grade:"UG",points:2}];return{getGradeValue:function(a){return e(a)},getGradeFromValue:function(a){for(var b=0;b<f.length;b++)if(f[b].points===a)return f[b].grade;return""},getOpponentGrade:function(b,c){return-1!==b.discipline.indexOf("Doubles")?b.player1===c.id||b.partner1===c.id?-1!==b.discipline.indexOf("Mixed")?a.getPlayer(b.player2).mixedGrade+"/"+a.getPlayer(b.partner2).mixedGrade:a.getPlayer(b.player2).doublesGrade+"/"+a.getPlayer(b.partner2).doublesGrade:-1!==b.discipline.indexOf("Mixed")?a.getPlayer(b.player1).mixedGrade+"/"+a.getPlayer(b.partner1).mixedGrade:a.getPlayer(b.player1).doublesGrade+"/"+a.getPlayer(b.partner1).doublesGrade:b.player1===c.id?a.getPlayer(b.player2).singlesGrade:a.getPlayer(b.player1).singlesGrade},getMatchPoints:function(){},getPromotionValue:function(a){return c(a)},getDemotionValue:function(a){return d(a)},getPlayerStatus:function(a,b,e){return b>=c(a)&&"A2"!==a?"promotion":e<d(a)&&"E2"!==a?"demotion":"remain"}}}]),angular.module("NBAApp").service("dataService",["playersDataService","clubsDataService","matchesDataService","$q","$resource","playerService","clubsService","matchesService","calculateRankingsService",function(a,b,c,d,e,f,g,h,i){function j(){var c=d.defer(),h=e(m);return h.get().$promise.then(function(e){if(e.$resolved){n=e.config;var h=b.fetchAllClubs(n.clubsAPI),j=a.fetchAllPlayers(n.playersAPI);d.all([h,j]).then(function(a){g.setClubs(a[0].data),f.setPlayers(a[1].data),i.calculateOverallRankingsAndStore(a[1].data),l=!0,c.resolve("Success")},function(){c.reject("Fail")})}else c.reject("Fail")}),c.promise}function k(a){var b=d.defer(),e=c.fetchMatchesForPlayer(n.matchesAPI,a);return d.resolve(e).then(function(c){h.setMatchesForPlayer(c.data,a),b.resolve("Success")},function(){b.reject("Fail")}),b.promise}var l=!1,m="offlineConfig.txt",n={};return{initialise:j,isInitialised:function(){return l},getMatchesForPlayer:k}}]),angular.module("NBAApp").service("clubsDataService",["$http",function(a){var b=function(b){return a.get(b,{params:{getClubs:!0}})};return{fetchAllClubs:b}}]),angular.module("NBAApp").service("playersDataService",["$http",function(a){var b=function(b){return a.get(b,{params:{getAllPlayers:!0}})};return{fetchAllPlayers:b}}]),angular.module("NBAApp").service("matchesDataService",["$http",function(a){var b=function(b){return a.get(b,{params:{getMatches:!0}})},c=function(b,c){var d={};d.playerID=parseInt(c);var e=encodeURIComponent(JSON.stringify(d));return a.get(b,{params:{getMatchesForPlayer:!0,sendData:e}})};return{fetchAllMatches:b,fetchMatchesForPlayer:c}}]);