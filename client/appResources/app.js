var app=angular.module("roast",["ngRoute"]);app.config(["$routeProvider","$locationProvider",function(e,o){e.when("/roast/:id",{templateUrl:"../views/roastPage.html",controller:"roastPageController"}).when("/",{templateUrl:"../views/roastTrending.html",controller:"roastTrendingController"}).when("/create",{templateUrl:"../views/roastCreate.html",controller:"roastCreateController"}).when("/roastList",{templateUrl:"../views/roastList.html",controller:"roastListController"}).when("/QandA/:id",{templateUrl:"../views/QandApage.html",controller:"QandApageController"}).when("/QandAlist",{templateUrl:"../views/QandAlist.html",controller:"QandAlistController"}).when("/replies/:id",{templateUrl:"../views/replyComments.html",controller:"replyCommentController"}).when("/repliesR/:id",{templateUrl:"../views/replyCommentsR.html",controller:"roastCommentController"}).when("/home",{templateUrl:"views/home.html",controller:"homeController"}).when("/aboutUs",{templateUrl:"views/aboutUs.html",controller:"aboutUsController"}).when("/404",{templateUrl:"views/404.html",controller:"errorController"}).when("/userInfo",{templateUrl:"/views/loadingUserData.html",controller:"loadingDataController"}).otherwise({redirectTo:"/404"}),o.html5Mode(!0)}]),app.controller("roastIndexController",["$scope","$http","$location","$interval","UserInfoProvider",function(e,o,t,n,i){e.goToCreate=function(){t.path("/create"),window.scrollTo(0,0),e.showToolBox()},e.goToTrending=function(){t.path("/"),window.scrollTo(0,0),e.showToolBox()},e.goToHome=function(){t.path("/home"),window.scrollTo(0,0),e.showToolBox(),e.commentsActive=!0,e.notifsActive=!1,e.settingsActive=!1},e.goToRoasts=function(){t.path("/roastList"),window.scrollTo(0,0),e.showToolBox()},e.goToQnAPage=function(){t.path("/QandAlist"),window.scrollTo(0,0),e.showToolBox()},e.goToAboutUs=function(){t.path("/aboutUs"),window.scrollTo(0,0),e.showToolBox()},e.toolBoxActive=!0,e.showToolBox=function(){e.toolBoxActive=!e.toolBoxActive},e.hideToolBox=function(){e.toolBoxActive=!0},me=this,me.coolWord="shizzlemnah",me.alert=function(e){window.alert(e)},e.modalOpen=!1,e.loginModal=function(){e.modalOpen=!e.modalOpen,window.scrollTo(0,0)},e.cancelModal=function(){e.modalOpen=!1},e.GoToGoogleLogin=function(){var e=document.forms.googleLogin;e.submit()},e.GoToFacebookLogin=function(){var e=document.forms.facebookLogin;e.submit()},e.commentsActive=!1,e.notifsActive=!1,e.settingsActive=!1,e.createdMember=!1,e.maiBaap=!1,e.notifObj={},e.memberData=function(){o.get("/memberData").success(function(t){if(0===t.length)e.createdMember===!1&&o.get("/memberInit").success(function(t){if(angular.isDefined(t.google)){var n="https://www.googleapis.com/plus/v1/people/"+t.google.id+"?fields=image&key=AIzaSyAV_28zxnOc67NpTvzpkQRcAK7fPfzYUjo";o.get(n).success(function(o){var t=o.image.url;e.imgUrlBig=t.replace("50","100"),e.imgUrlSm=t.replace("50","40-c"),e.createMember()}).error(function(){e.imgUrlBig="/images/user.png",e.imgUrlSm="../images/user.png",e.createMember()})}else angular.isDefined(t.facebook)&&(e.imgUrlBig="https://graph.facebook.com/"+t.facebook.id+"/picture?type=large",e.imgUrlSm="https://graph.facebook.com/"+t.facebook.id+"/picture?type=small",e.createMember())});else if('"NotLoggedIn"'===t)e.isLoggedin=!1,e.imgUserBig="/images/user.png";else{e.isLoggedin=!0,e.userName=t[0].name,e.email=t[0].email,e.imgUserBig=t[0].imgUrlLg,e.imgUserSmall=t[0].imgUrlXs,e.notifications=t[0].notifications,e.activity=t[0].comments;var i=e.notifications.length;e.count=0;for(var a=0;i>a;a++)"false"===e.notifications[a].read&&(e.count=e.count+1);e.countNull=0===e.count?!1:!0,n(e.getNotif,4e4),"indiaroasts@gmail.com"===e.email&&(console.log("sending dta"),o.get("/allMemData").success(function(o){e.maiBaap=!0,e.allMemData=o,e.allMemDataLength=o.length}))}}).error(function(){})},e.getNotif=function(){e.notifObj.email=e.email,o.post("/getNotif",e.notifObj).success(function(o){e.notifications=o[0].notifications;var t=e.notifications.length;e.count=0;for(var n=0;t>n;n++)"false"===e.notifications[n].read&&(e.count=e.count+1);e.countNull=0===e.count?!1:!0})},e.goToNotif=function(){t.path("/home"),window.scrollTo(0,0),e.notifsActive=!0,e.commentsActive=!1,e.settingsActive=!1},e.memberData(),e.createMember=function(){e.createMemObj={},e.createMemObj.imgUrlBig=e.imgUrlBig,e.createMemObj.imgUrlSm=e.imgUrlSm,o.post("/createMember",e.createMemObj).success(function(o){console.log(o),e.createdMember=!0,e.memberData()}).error(function(e){console.log(e)})},e.logout=function(){i.logout(),e.isLoggedin=!1,e.userName=null,e.email=null,e.maiBaap=!1,e.imgUserBig="/images/user.png",e.imgUserSmall=null}}]),app.controller("QandApageController",["$scope","$http","$routeParams","$location","$interval","$sce",function(e,o,t,n,i,a){e.postBlockActive=!1,e.appreciated=!1,e.appriValue="Appreciate",e.postAreply=!1,e.appri={},e.comment={},e.newDataQ={},e.repliesQ={},e.voteObject={},e.hideTextArea=function(){e.postBlockActive=!1,e.postAreply=!1,e.comment.comment=null,e.editBox=!1,e.editBoxQ=!1,e.comment.anonymous=null,e.showtext=!1},e.showTextArea=function(){e.postBlockActive=!0,null===e.userName||""===e.userName||angular.isUndefined(e.userName)?(e.anony=!0,e.comment.anonymous="Y",console.log("its working")):(e.comment.name=e.userName,e.repliesQ.name=e.userName,e.comment.email=e.email,e.repliesQ.email=e.email,e.repliesQ.imgUrl=e.imgUserSmall,e.comment.imgUrl=e.imgUserSmall,e.anony=!1)},e.goToRepliesQ=function(o){var t="/replies/"+e.questions.slug+o._id;console.log(t),n.path(t),window.scrollTo(0,0)},e.replyQ=function(o){e.postBlockActive=!0,e.postAreply=!0,e.repliesQ.id=o._id,e.repliesQ.name="Anonymous",e.repliesQ.comOwner=o.email,e.repliesQ.comContent=o.comment},e.editBox=!1,e.editBoxQ=!1,e.commentObj={},e.questionObj={},e.editQComment=function(o){console.log(o),(o.email===e.email||e.maiBaap===!0)&&(e.editBox=!0,e.showTextArea(),e.comment.comment=o.comment,console.log(o),e.commentObj.id=o._id)},e.updateQcomment=function(){e.commentObj.comment=e.comment.comment;var n="/editQComment/"+t.id;o.post(n,e.commentObj).success(function(){e.hideTextArea(),e.fetchComments()}).error(function(){})},e.editQuestion=function(o){(o.email===e.email||e.maiBaap===!0)&&(e.editBoxQ=!0,e.questionObj.slug=e.questions.slug,e.questionObj.id=e.questions._id,e.questionObj.debate=e.questions.debate)},e.delQ={},e.delQuestion=function(t){e.maiBaap===!0&&(e.delQ.qID=t._id,o.post("/delQuestion",e.delQ).success(function(){n.path("/QandAlist")}))},e.editY=function(){e.showtext=!0},e.yChar=10,e.nChar=10,e.qEditchar=150,e.$watch("questions.yBtnValue",function(){angular.isDefined(e.questions.yBtnValue)&&(e.yChar=10-e.questions.yBtnValue.length,0===e.yChar&&(e.yChar=0))}),e.$watch("questions.nBtnValue",function(){angular.isDefined(e.questions.nBtnValue)&&(e.nChar=10-e.questions.nBtnValue.length,0===e.nChar&&(e.nChar=0))}),e.$watch("questions.question",function(){angular.isDefined(e.questions.question)&&(e.qEditchar=150-e.questions.question.length,0===e.qEditchar&&(e.qEditchar=0))}),e.updateQuestion=function(){e.questionObj.question=e.questions.question,e.questionObj.qImgUrl=e.questions.qImgUrl,e.questionObj.yBtnValue=e.questions.yBtnValue,e.questionObj.nBtnValue=e.questions.nBtnValue;var n="/editQuestion/"+t.id;o.post(n,e.questionObj).success(function(o){e.hideTextArea(),console.log(o),e.getQuestion()}).error(function(){})},e.calcVote=function(){e.yesVotes=e.questions.yes,e.noVotes=e.questions.no,e.TotalVotes=e.yesVotes+e.noVotes;var o=e.yesVotes/e.TotalVotes*100,t=e.noVotes/e.TotalVotes*100;e.yRoundOff=Math.round(o),e.nRoundOff=Math.round(t)},e.showVoteBlock=!0;var r="/debateTitle/"+t.id;e.getQuestion=function(){o.get(r).success(function(o){console.log(o[0]),e.questions=o[0],e.comment.question=e.questions.question,e.comment.qCreator=e.questions.email,"Y"===e.questions.debate?e.calcVote():e.showVoteBlock=!1}).error(function(e){console.log(e)})},e.getQuestion(),e.goToCreateQ=function(){n.path("/create"),window.scrollTo(0,0)},e.vote=function(){e.voteObject.id=t.id,e.voteObject.email=e.email,e.voteObject.qCreator=e.questions.email,e.voteObject.question=e.questions.question,o.post("/vote",e.voteObject).success(function(e){console.log(e)}).error(function(){})};var s=t.id;e.votedY=function(){e.voteObject.value="Y",e.showVotes=!0,window.localStorage[s]="true",e.yesVotes=e.questions.yes+1,e.calcVote(),e.vote(),console.log()},e.votedN=function(){e.voteObject.value="N",e.showVotes=!0,window.localStorage[s]="true",e.noVotes=e.questions.no+1,e.calcVote(),e.vote()},"true"===window.localStorage[s]&&(e.showVotes=!0,console.log("its true localstorage")),e.comment.id=t.id,e.fetchComments=function(){console.log("intervals running");var n="/debateComments/"+t.id;o.get(n).success(function(o){e.QandA=o,e.newDataQ.oldDate=o[0].createdOn,angular.forEach(e.QandA,function(e){for(var o="",t=0;t<e.comment.length;t++)o+=10==e.comment.charCodeAt(t)?"<br/>":e.comment.charAt(t);e.htmlSafeComment=a.trustAsHtml(o)})}).error(function(){})},e.fetchComments(),e.newCommentsQ=function(){console.log("new comments"),e.newDataQ.id=t.id,o.post("/newQcomments",e.newDataQ).success(function(o){0!==o.length&&(e.newDataQ.oldDate=o[0].createdOn),angular.forEach(o.slice().reverse(),function(o){e.QandA.push(o);for(var t="",n=0;n<o.comment.length;n++)t+=10==o.comment.charCodeAt(n)?"<br/>":o.comment.charAt(n);o.htmlSafeComment=a.trustAsHtml(t)})}).error(function(){})},e.stopPromise=i(e.newCommentsQ,3e4),e.$on("$routeChangeStart",function(){console.log("Route Change Start"),i.cancel(e.stopPromise)}),e.qCommentChar=2e3,e.$watch("comment.comment",function(){angular.isDefined(e.comment.comment)&&(e.qCommentChar=2e3-e.comment.comment.length,0===e.qCommentChar&&(e.qCommentChar=0))});var l=null;e.post=function(){if(l=null===e.comment.comment||""===e.comment.comment||angular.isUndefined(e.comment.comment)?!1:!0,l===!0)if(e.btnDisable=!0,e.postAreply===!1)console.log(e.comment.anonymous),o.post("/debateComment",e.comment).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(e.fetchComments(),e.hideTextArea(),e.comment.comment=null,e.btnDisable=!1)}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")});else{e.repliesQ.anonymous=e.comment.anonymous,console.log(e.comment.anonymous),e.repliesQ.comment=e.comment.comment;var i="/debateReply/"+t.id;o.post(i,e.repliesQ).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(window.scrollTo(0,0),n.path("/replies/"+t.id+e.repliesQ.id))}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")})}}}]),app.controller("roastPageController",["$scope","$http","$location","$routeParams","$interval",function(e,o,t,n,i){var a="/roastTitle/"+n.id;o.get(a).success(function(o){e.roastTitle=o[0]}).error(function(e){console.log(e)}),e.roast={},e.newDataR={},e.repliesR={},e.postBlockActive=!1,e.appreciated=!1,e.postR=!1,e.appriValue="Appreciate",e.hideTextArea=function(){e.postBlockActive=!1,e.rComment.comment=null,e.postR=!1,e.rComment.anonymous=null},e.showTextArea=function(){e.postBlockActive=!0,null===e.userName||""===e.userName||angular.isUndefined(e.userName)?(e.anony=!0,e.rComment.anonymous="Y",console.log("its working")):(e.rComment.name=e.userName,e.repliesR.name=e.userName,e.rComment.email=e.email,e.repliesR.email=e.email,e.repliesR.imgUrl=e.imgUserSmall,e.rComment.imgUrl=e.imgUserSmall,e.anony=!1)},e.goToRepliesR=function(o){var n="/repliesR/"+e.roastTitle.slug+o._id;console.log(n),t.path(n),window.scrollTo(0,0)},e.replyR=function(o){e.postBlockActive=!0,e.postR=!0,e.repliesR.id=o._id,e.repliesR.name="Anonymous"},e.editBox=!1,e.roastObj={},e.editRComment=function(o){e.editBox=!0,e.showTextArea(),e.rComment.comment=o.comment,console.log(o),e.roastObj.id=o._id},e.btnDisable=!1,e.updateRcomment=function(){e.btnDisable=!0,e.roastObj.comment=e.rComment.comment;var t="/editRComment/"+n.id;o.post(t,e.roastObj).success(function(){e.hideTextArea(),e.fetchRComments(),e.btnDisable=!1}).error(function(){})};var r="/roastComments/"+n.id;e.fetchRComments=function(){o.get(r).success(function(o){e.roasts=o,e.newDataR.oldDate=o[0].createdOn}).error(function(){})},e.fetchRComments();var s=function(){console.log("new comments"),e.newDataR.id=n.id,o.post("/newRcomments",e.newDataR).success(function(o){0!==o.length&&(e.newDataR.oldDate=o[0].createdOn),angular.forEach(o,function(o){e.roasts.push(o)})}).error(function(){})};e.stopPromise=i(s,3e4),e.$on("$routeChangeStart",function(){i.cancel(e.stopPromise)}),e.rComment={},null===e.userName||""===e.userName||angular.isUndefined(e.userName)?(e.rComment.name="Anonymous",e.rComment.imgUrl="../images/user.png"):(e.rComment.name=e.userName,e.repliesR.imgUrl=e.imgUserSmall,e.rComment.imgUrl=e.imgUserSmall),e.rComment.id=n.id,e.rCommentChar=2e3,e.$watch("rComment.comment",function(){angular.isDefined(e.rComment.comment)&&(e.rCommentChar=2e3-e.rComment.comment.length,0===e.rCommentChar&&(e.rCommentChar=0))});var l=null;e.postRComment=function(){if(console.log(e.postR),l=null===e.rComment.comment||""===e.rComment.comment||angular.isUndefined(e.rComment.comment)?!1:!0,l===!0)if(e.btnDisable=!0,e.postR===!1)console.log("comments clicked"),o.post("/roastComment",e.rComment).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(s(),e.hideTextArea(),e.rComment.comment=null,e.btnDisable=!1)}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")});else{e.repliesR.comment=e.rComment.comment,e.repliesR.anonymous=e.rComment.anonymous;var i="/roastReply/"+n.id;o.post(i,e.repliesR).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(window.scrollTo(0,0),t.path("/repliesR/"+n.id+e.repliesR.id))}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")})}}}]),app.controller("roastTrendingController",["$scope","$location","$http","$routeParams",function(e,o,t){t.get("/trendingDebates").success(function(o){console.log(o[0]),e.questions=o}).error(function(e){console.log(e)}),t.get("/trendingRoasts").success(function(o){console.log(o[0]),e.trending=o}).error(function(e){console.log(e)}),e.goToRoast=function(e){window.scrollTo(0,0),console.log(e);var t="/roast/"+e.slug;o.path(t)},e.goToDebate=function(e){window.scrollTo(0,0);var t="/QandA/"+e.slug;o.path(t)}}]),app.controller("roastCreateController",["$scope","$http","$location","$routeParams",function(e,o,t){console.log("trending page"),e.roast={},e.debate={},e.debate.yes=1,e.debate.no=1,e.debate.createdOn=new Date,e.nameChar=50,e.descChar=150,e.qDescChar=300,e.qChar1=150,e.qChar2=150,e.btnDisable1=!1,e.btnDisable2=!1,e.$watch("roast.name",function(){angular.isDefined(e.roast.name)&&(e.nameChar=50-e.roast.name.length,0===e.nameChar&&(e.nameChar=0))}),e.$watch("roast.quote",function(){angular.isDefined(e.roast.quote)&&(e.descChar=150-e.roast.quote.length,0===e.descChar&&(e.descChar=0))}),e.$watch("debate.question1",function(){angular.isDefined(e.debate.question1)&&(e.qChar1=150-e.debate.question1.length,0===e.qChar1&&(e.qChar1=0))}),e.$watch("debate.description",function(){angular.isDefined(e.debate.description)&&(e.qDescChar=300-e.debate.description.length,0===e.qDescChar&&(e.qDescChar=0))}),e.$watch("debate.question2",function(){angular.isDefined(e.debate.question2)&&(e.qChar2=150-e.debate.question2.length,0===e.qChar2&&(e.qChar2=0))}),e.yChar=10,e.nChar=10,e.$watch("debate.yBtnValue",function(){angular.isDefined(e.debate.yBtnValue)&&(e.yChar=10-e.debate.yBtnValue.length,0===e.yChar&&(e.yChar=0))}),e.$watch("debate.nBtnValue",function(){angular.isDefined(e.debate.nBtnValue)&&(e.nChar=10-e.debate.nBtnValue.length,0===e.nChar&&(e.nChar=0))}),e.showtext=!1,e.debate.yBtnValue="Yes",e.debate.nBtnValue="No",e.editY=function(){e.showtext=!0},e.doneBtn=function(){e.showtext=!1},e.single=function(t){var n=new FormData;n.append("image",t,t.name),o.post("upload",n,{headers:{"Content-Type":!1},transformRequest:angular.identity}).success(function(o){e.uploadedImgSrc=o.src,e.sizeInBytes=o.size})};var n=null;e.postRoast=function(){n=null===e.roast.name||""===e.roast.name||angular.isUndefined(e.roast.name)?!1:null===e.roast.quote||""===e.roast.quote||angular.isUndefined(e.roast.quote)?!1:!0,n===!0&&(e.roast.email=e.email,e.btnDisable=!0,e.waiting=!0,o.post("/createRoast",e.roast).success(function(o){e.waiting=!1;var n="/roast/"+o.slug;t.path(n),window.scrollTo(0,0)}).error(function(){e.waiting=!1}))};e.duplicateQ=!1,e.postQuestion=function(){e.debate.email=e.email,e.debate.name=e.userName,e.btnDisable=!0,e.waiting=!0,o.post("/createDebate",e.debate).success(function(o){if(e.waiting=!1,console.log(o),angular.isDefined(o[0])){var n="/QandA/"+o[0].slug;t.path(n),window.scrollTo(0,0)}else{var n="/QandA/"+o.slug;t.path(n),window.scrollTo(0,0)}}).error(function(){e.waiting=!1})},e.showError1=!1,e.showError2=!1,e.postQuestion1=function(){e.debate.question=e.debate.question1,null===e.debate.question||""===e.debate.question||angular.isUndefined(e.debate.question)?e.showError1=!0:e.postQuestion()},e.removeErr=function(){e.showError1=!1,e.showError2=!1},e.postQuestion2=function(){e.debate.question=e.debate.question2,e.debate.debate="Y",null===e.debate.question||""===e.debate.question||angular.isUndefined(e.debate.question)?e.showError2=!0:e.postQuestion()}}]),app.controller("roastListController",["$scope","$http","$location","$routeParams",function(e,o,t){o.get("/allRoasts").success(function(o){console.log("inside roast list"),e.roastList=o}).error(function(){}),e.goToRoast=function(e){window.scrollTo(0,0);var o="/roast/"+e.slug;t.path(o)}}]),app.controller("QandAlistController",["$scope","$http","$routeParams","$location",function(e,o,t,n){o.get("/allDebates").success(function(o){console.log(o[0]),e.questions=o}).error(function(e){console.log(e)}),e.delQ={},e.delQuestion=function(t){e.maiBaap===!0&&(e.delQ.qID=t._id,o.post("/delQuestion",e.delQ).success(function(){n.path("/QandAlist")}))},e.recentActv=!0,e.popularActv=!1,e.recentDiv=function(){e.recentActv=!0,e.popularActv=!1},e.popularDiv=function(){e.recentActv=!1,e.popularActv=!0},e.goToDebate=function(e){window.scrollTo(0,0);var o="/QandA/"+e.slug;n.path(o)}}]),app.controller("replyCommentController",["$scope","$http","$routeParams","$location","$interval",function(e,o,t,n,i){console.log("Its in loop"),e.comment={},e.repliesQ={},e.editBox=!1,e.editBoxQ=!1,e.commentObj={},e.questionObj={},e.editQComment=function(o){console.log(o),o.email===e.email&&(e.editBox=!0,e.showTextArea(),e.repliesQ.comment=o.comment,console.log(o),e.commentObj.id=o._id,e.commentObj.replyCom="N")},e.editQReply=function(o){console.log(o),o.email===e.email&&(e.editBox=!0,e.showTextArea(),e.repliesQ.comment=o.comment,console.log(o),e.commentObj.id=o._id,e.commentObj.replyCom="Y")},e.updateQcomment=function(){e.commentObj.replyPage="Y",e.commentObj.comment=e.repliesQ.comment;var n="/editQComment/"+t.id;o.post(n,e.commentObj).success(function(){e.hideTextArea(),e.fetchRepliesQ()}).error(function(){})},e.postBlockActive=!1,e.appreciated=!1,e.appriValue="Appreciate",e.hideTextArea=function(){e.postBlockActive=!1,e.repliesQ.comment=null,e.repliesQ.anonymous=null,e.editBox=!1},e.showTextArea=function(){e.postBlockActive=!0,null===e.userName||""===e.userName||angular.isUndefined(e.userName)?(e.repliesQ.name="Anonymous",e.anony=!0,e.repliesQ.anonymous="Y",console.log("its working")):(e.repliesQ.name=e.userName,e.repliesQ.email=e.email,e.repliesQ.imgUrl=e.imgUserSmall,e.anony=!1)},e.comment.id=t.id,console.log("Its in loop"),e.fetchRepliesQ=function(){console.log("intervals running");var n="/debateReplies/"+t.id;o.get(n).success(function(o){e.replyContent=o,e.repliesGot=o[0].replies,e.repliesQ.comContent=o[0].comment,e.repliesQ.comOwner=o[0].email}).error(function(){})},e.fetchRepliesQ(),e.repliesQ.name="Anonymous",e.btnDisable=!1,e.postReplyQ=function(){e.btnDisable=!0,e.repliesQ.id="replyPage";var n="/debateReply/"+t.id;o.post(n,e.repliesQ).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(e.btnDisable=!1,e.hideTextArea(),e.fetchRepliesQ())}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")})},e.stopPromise=i(e.fetchRepliesQ,3e4),e.$on("$routeChangeStart",function(){i.cancel(e.stopPromise)})}]),app.controller("roastCommentController",["$scope","$http","$routeParams","$location","$interval",function(e,o,t,n,i){console.log("Its in loop"),e.repliesR={},e.postBlockActive=!1,e.appreciated=!1,e.appriValue="Appreciate",e.hideTextArea=function(){e.postBlockActive=!1,e.repliesR.comment=null,e.repliesR.anonymous=null},e.showTextArea=function(){e.postBlockActive=!0,null===e.userName||""===e.userName||angular.isUndefined(e.userName)?(e.repliesR.name="Anonymous",e.anony=!0,e.repliesR.anonymous="Y",console.log("its working")):(e.repliesR.name=e.userName,e.repliesR.email=e.email,e.repliesR.imgUrl=e.imgUserSmall,e.anony=!1)},e.fetchRepliesR=function(){console.log("intervals running");var n="/roastReplies/"+t.id;o.get(n).success(function(o){e.replyContent=o,e.repliesGot=o[0].replies,console.log(o)}).error(function(){})},e.fetchRepliesR(),e.repliesR.name="Anonymous",e.btnDisable=!1,e.postReplyR=function(){e.btnDisable=!0,e.repliesR.id="replyPage";var n="/roastReply/"+t.id;o.post(n,e.repliesR).success(function(o){'"failure"'===o?window.alert("Bakchodi Nahi"):(e.btnDisable=!1,e.hideTextArea(),e.fetchRepliesR())}).error(function(e){'"failure"'===e&&window.alert("Bakchodi Nahi")})},e.stopPromise=i(e.fetchRepliesQ,3e4),e.$on("$routeChangeStart",function(){i.cancel(e.stopPromise)})}]),app.controller("homeController",["$scope","$location","$http",function(e,o,t){e.memberData(),e.notifRead=function(n){window.scrollTo(0,0),"false"===n.read&&t.post("/notifRead",n).success(function(){e.memberData()}),o.path(n.location)},e.goToQ=function(e){var t="/QandA/"+e.collectionID;window.scrollTo(0,0),o.path(t)},e.goToCom=function(e){if(null===e.commentID){var t="/QandA/"+e.collectionID;window.scrollTo(0,0),o.path(t)}else{var n="/replies/"+e.collectionID+e.commentID;window.scrollTo(0,0),o.path(n)}},e.settingsActive===!1&&e.notifsActive===!1&&(e.commentsActive=!0),e.notifsDiv=function(){e.commentsActive=!1,e.notifsActive=!0,e.settingsActive=!1},e.commentsDiv=function(){e.commentsActive=!0,e.notifsActive=!1,e.settingsActive=!1},e.settingsDiv=function(){e.commentsActive=!1,e.notifsActive=!1,e.settingsActive=!0}}]),app.controller("aboutUsController",["$scope",function(){}]),app.controller("errorController",["$scope",function(){}]),app.controller("loadingDataController",["$scope","$location","$http","UserInfoProvider",function(e,o,t,n){t.get("/user/me").success(function(e){console.log(e),n.setData(e.google),o.path("/"),window.scrollTo(0,0)}).error(function(e){console.log(e)})}]),app.directive("myMaxlength",function(){return{require:"ngModel",link:function(e,o,t,n){function i(e){if(e.length>a){var o=e.substring(0,a);return n.$setViewValue(o),n.$render(),o}return e}var a=Number(t.myMaxlength);n.$parsers.push(i)}}}),app.factory("socialLinker",["$window","$location",function(e,o){return function(t){return function(n,i,a){var r,s,l;return l="status=no, width="+(n.socialWidth||640)+", height="+(n.socialWidth||480)+", resizable=yes, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no",r=function(){return a.customUrl||o.absUrl()},a.$observe("customUrl",function(){var e;return e=t(n,r()),"A"!==i[0].nodeName||null!=a.href&&""!==a.href?void 0:i.attr("href",e)}),i.attr("rel","nofollow"),s=function(o){var i,a;return o.preventDefault(),i=t(n,r()),a=e.open(i,"popupwindow",l).focus()},null!=a.customHandler?i.on("click",s=function(e){var o;return o=t(n,r()),i.attr("href",o),n.handler({$event:e,$url:o})}):i.on("click",s),n.$on("$destroy",function(){return i.off("click",s)})}}}]),app.directive("socialFacebook",["socialLinker",function(e){return{restrict:"ACEM",scope:{handler:"&customHandler"},link:e(function(e,o){var t;return t=["https://facebook.com/sharer.php?"],t.push("u="+encodeURIComponent(o)),t.join("")})}}]).directive("socialTwitter",["socialLinker",function(e){return{restrict:"ACEM",scope:angular.extend({status:"@status"},{handler:"&customHandler"}),link:e(function(e,o){return e.status||(e.status="India Roasts, an Online Debate and celeb Roasting! - "+o),"https://twitter.com/intent/tweet?text="+encodeURIComponent(e.status)})}}]).directive("socialGplus",["socialLinker",function(e){return{restrict:"ACEM",scope:{handler:"&customHandler"},link:e(function(e,o){return"https://plus.google.com/share?url="+encodeURIComponent(o)})}}]),app.service("UserInfoProvider",["$http",function(e){this.data=null;var o=this;this.setData=function(e){o.data=e},this.getUserName=function(){return o.data.name},this.getUserEmail=function(){return o.data.email},this.logout=function(){e.post("/logout"),o.data=null}}]);