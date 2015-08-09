!function(e){e(document).ready(function(){"pgp.help"!=window.location.host&&"gaff.github.io"!=window.location.host||"https:"==window.location.protocol||(window.location.protocol="https")})}(jQuery);var pgpApp=angular.module("pgpApp",["ngAnimate","ui.router","ui.bootstrap"]);pgpApp.directive("autoselectall",["$window",function(e){return{restrict:"C",link:function(n,t,a){t.on("click",function(){e.getSelection().toString()||this.select()}),t.on("blur",function(){t.scrollTop(0)})}}}]),pgpApp.directive("focusOn",function(){return function(e,n,t){e.$on("focusOn",function(e,a){a===t.focusOn&&n[0].focus()})}}),pgpApp.factory("focus",["$rootScope","$timeout",function(e,n){return function(t){n(function(){e.$broadcast("focusOn",t)})}}]),pgpApp.config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/import"),e.state("permalink",{url:"/permalink?{pgp}",templateUrl:"templates/keyWork.html",controller:"KeyWorkCtrl",params:{pgp:null}}).state("key",{url:"/",templateUrl:"templates/keyWork.html",controller:"KeyWorkCtrl",params:{key:null,"private":null}}).state("import",{url:"/import?{pgp}",templateUrl:"templates/keyWork.html",controller:"KeyWorkCtrl",params:{key:null,"private":null,pgp:null}}).state("generate",{url:"/generate",templateUrl:"templates/keyGenerator.html",controller:"KeyGenerator"}).state("intro",{url:"/intro",templateUrl:"templates/intro.html"})}]),pgpApp.config(["$compileProvider",function(e){e.aHrefSanitizationWhitelist(/^\s*(https?|data|mailto):/)}]),pgpApp.controller("KeyListCtrl",["$scope","$location","$modal",function(e,n,t){e.$location=n,e.getUser=function(e){return e?"alias"in e?e.alias:"primaryKey"in e?e.getPrimaryUser().user.userId.userid:(console.log("Ooops - no idea what this key is:"),console.log(e),"Unknown key!"):""},e.getFingerprint=function(e){return e?"primaryKey"in e?e.primaryKey.fingerprint:void 0:""},e.getKeyId=function(e){return e?"primaryKey"in e?e.primaryKey.getKeyId().toHex():void 0:""},e.addOrUpdateKey=function(n){var t=e.getFingerprint(n),a=null;if(n.isPrivate()){var s=e.keyring.privateKeys.getForId(t);s?(key=s,key.update(n),a=key):(e.keyring.privateKeys.push(n),a=n)}else{var s=e.keyring.publicKeys.getForId(t);s?(key=s,key.update(n),a=key):(e.keyring.publicKeys.push(n),a=n)}return a},e.allKeys=function(){return e.keyring.getAllKeys()},e.publicKeys=function(){return e.keyring.publicKeys.keys},e.privateKeys=function(){return e.keyring.privateKeys.keys},e.keyring=new openpgp.Keyring,e.workstarted=e.allKeys().length>0?!0:!1,e.skipintro=e.allKeys().length>2?!0:!1,e.persist=e.workstarted,e.stored=e.persist,pgpkeys=openpgp.key.readArmored(myKey),openpgp.config.commentstring="https://pgp.help",e.addOrUpdateKey(pgpkeys.keys[0]),e.findKey=function(n,t){return n?t?e.keyring.privateKeys.getForId(n):e.keyring.publicKeys.getForId(n):null},e.$watch("$viewContentLoaded",function(){}),e.$watch("persist",function(){e.persist&&(e.workstarted=!0),e.saveKeys()}),e.isPrivate=function(e){return e?e.isPrivate():!1},e.isDecrypted=function(e){return e?e.primaryKey.isDecrypted:!1},e.$on("persist",function(n){e.persist=!0}),e.$on("newkey",function(n,t){e.addOrUpdateKey(t);t.isPrivate()&&(e.newidentityopts=!1,e.workstarted=!0),e.allKeys().length>1&&(e.workstarted=!0),e.allKeys().length>2&&(e.skipintro=!0),e.saveKeys()}),e.$on("deletekey",function(n,t){var a=e.getFingerprint(t);t.isPrivate()?e.keyring.privateKeys.removeForId(a):e.keyring.publicKeys.removeForId(a),e.saveKeys()}),e.loadKeys=function(){var e=new openpgp.Keyring;console.log(e)},e.saveKeys=function(){e.persist&&(e.keyring.store(),e.stored=!0)},e.purgeKeys=function(){var n=t.open({animation:e.animationsEnabled,templateUrl:"templates/chickenBox.html",controller:"chickenBoxCtrl",size:"lg",resolve:{content:function(){return{title:"Delete ALL key data!",danger:e.privateKeys().length>0}}}});n.result.then(function(n){e.keyring.clear(),e.keyring.store(),e.stored=!1,e.$state.go("key",{key:null,"private":!1})},function(){})}}]),pgpApp.controller("KeyWorkCtrl",["$scope","focus","$state","$stateParams","$modal",function(e,n,t,a,s){e.key=null,e.$stateParams=a,e.$state=t,e.init=function(){"pgp"in a&&a.pgp?(e.rawkey=decodeURIComponent(a.pgp),key=e.loadKey_raw(),key&&(e.key=key,n("message"))):(e.key=e.findKey(a.key,a["private"]),e.isNewKey()?(e.rawkey="",n("pgppub")):e.isPrivateKey()?(e.rawkey=e.key.toPublic().armor(),e.rawkey_private=e.key.armor(),n(e.isDecryptedKey()?"pmessage":"passphrase")):(e.rawkey=e.key.armor(),n("message")))},e.isNewKey=function(){return null==e.key},e.isPrivateKey=function(){return e.key?e.isPrivate(e.key):e.$stateParams["private"]},e.isDecryptedKey=function(){return e.key?e.isDecrypted(e.key):!1},e.deleteKey=function(){var n=s.open({animation:e.animationsEnabled,templateUrl:"templates/chickenBox.html",controller:"chickenBoxCtrl",size:"lg",resolve:{content:function(){return{title:"Delete key data",danger:e.isPrivateKey()}}}});n.result.then(function(n){e.$emit("deletekey",e.key),e.$state.go("key",{key:null,"private":!1})},function(){})},e.mailit=function(){var n=e.getUser(e.key).match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\b/);if(!n)return"";var t=n[0],a=e.resulttext;return"mailto:"+t+"?subject="+encodeURIComponent("Sent from pgp.help")+"&body="+encodeURIComponent(a)},e.encodeURIComponent=function(e){var n=encodeURIComponent(e);return n},e.loadKey_raw=function(){var t;try{var t=openpgp.key.readArmored(e.rawkey)}catch(a){return e.pgperror=!0,null}if(t.err)return e.pgperror=!0,null;for(e.pgperror=!1,key=t.keys[t.keys.length-1],e.smartfade="smartfade",n("message"),i=0;i<t.keys.length;i++)e.$emit("newkey",t.keys[i]);return key},e.loadKey=function(){if(key=e.loadKey_raw(),key){var n={key:e.getFingerprint(key),"private":e.isPrivate(key)};e.$state.go("key",n)}},e.encryptMessage=function(){e.resulttext="",e.message&&!e.isNewKey()&&openpgp.encryptMessage(e.key,e.message).then(function(n){e.resulttext=n,e.$apply()})["catch"](function(n){e.resulttext=n,e.$apply()})},e.applyPassword=function(){if(e.passworderror=!1,e.password){var t=e.key.decrypt(e.password);e.passworderror=!t,t&&(e.password="",n("pmessage")),t&&e.pmessage&&e.decryptMessage()}},e.blockquote=function(e){var n="    "+e.replace(/\n/g,"\n    ");return n},e.decryptMessage=function(){if(e.resulttext="",e.pmessageerror=!1,!e.isNewKey()&&e.pmessage){var t;try{t=openpgp.message.readArmored(e.pmessage)}catch(a){return e.resulttext=a.message,void(e.pmessageerror=!0)}return e.isDecryptedKey()?void openpgp.decryptMessage(e.key,t).then(function(n){e.resulttext=n,e.$apply()})["catch"](function(n){e.resulttext=n.message,e.$apply()}):void n("passphrase")}},e.init()}]),pgpApp.controller("KeyGenerator",["$scope","$state","focus",function(e,n,t){e.working=!1,e.$state=n,e.generateKeyPair=function(){var n;n=e.user?e.email?e.user+" <"+e.email+">":e.user:e.email;var t={numBits:2048,userId:n,passphrase:e.passphrase};e.working=!0,openpgp.generateKeyPair(t).then(function(n){e.working=!1;var t=openpgp.key.readArmored(n.publicKeyArmored);e.$emit("persist"),e.$emit("newkey",t.keys[0]),e.$emit("newkey",n.key),e.$state.go("key",{key:e.getFingerprint(n.key),"private":!0})})["catch"](function(n){e.working=!1,console.log(n),e.$apply()})}}]),pgpApp.controller("chickenBoxCtrl",["$scope","$modalInstance","content",function(e,n,t){e.content=t,e.ok=function(){n.close(!0)},e.cancel=function(){n.dismiss("cancel")}}]);var myKey=["-----BEGIN PGP PUBLIC KEY BLOCK-----","Version: OpenPGP.js v1.2.0","Comment: https://pgp.help","","xsBNBFW7TH8BCADccz73OFQprAsBLNTFNZFTPzDUbmwKn5BMFFK7rYf7v8Gj","PyYQrl9DupBTiP6ISyTIvn/pT0/+G1yTYzliej4UZP7LOUz+pg59/X2JP7Ko","3UzH9qoO3FYXl85ok/daSNRt0VrKSoGcMuoLw7CT48hHZdIXSwoPFP//n8Qo","3u1J3LghZQLPdnZfWHPA6ZKLvcgQaByCABsRrH7L75+Qw49Wb3VeBiE5u26E","j3NXUc1GskMvFHp8pUnfzFxF4sCzk/o+zqJW8NtIje48beufH4eMBF2NK6nF","1Et8ESCM7jE10rpWm+nsl8lMooQEbUXoMp2z2s2zuYmaiV+ONaa3UT6fABEB","AAHNGVBncCBIZWxwIDxoZWxsb0BwZ3AuaGVscD7CwHIEEAEIACYFAlW7TIAG","CwkIBwMCCRAj/Z8+mwZ1aQQVCAIKAxYCAQIbAwIeAQAApGkIAJCtB3PD5aka","rGPzePxmqc37cpOGx/ArO8M7ouXDkc75xt3MOMvAFB4y8lytwteXbLG50Kl0","1KHp1NkUEJM0eR8SxGaPipEgN0PRoEDhN8VgR3m4Lq5RlTMFq1yXQgjPGndB","sP+KIDSfBEPZOlMW9VgdzThjqj8WqVxvaoRPbazLpS+WYrGTx4WjcsoS53ou","b7Fd6rkOdZcbgmUooDHRiNSNJq+RCwZnffxLlJQp3r3U0Ll4Mrsb/pxcOjde","7Cnc1SildK3m5iIuteGSIl8qXXTidcw5vV9w1xDLu7mPztaXlM72KaVkuhJN","/mSaCFTAAgECmvgP88ByG0uDu4SpeFrOwE0EVbtMfwEIAM/+tJfjT8ER4qe0","VJJPCqAcUffyXyABnN4NymDxz97ol9xwi2boTb2oDtTkAXmTU5pKKOjZFtV1","FizpVemVoGWBnmEZBaOUMZy2qFEIHrPh0OWaiuCSr+m/VjvOWota//bJZg1H","/o9JaMXSefE+lWak/BZagMAX/EOWUfzYfNSfHViua5HxKA5PoQ7Blcxt7T1f","5427XhoSpZzdbi9XjlYZmFlQ08MYG18wTVa6g8MJ7qr9TIVZPRnSrtE15iP1","8py3tXn97PToLd78ZkTfnlKZwrMxuFHcNCHMpVbEXD6zVWATeMMNRo5an3kg","dE9+9odr2zZWdJgnN1PDwbGKeEEAEQEAAcLAXwQYAQgAEwUCVbtMgQkQI/2f","PpsGdWkCGwwAAL2qCACSkHd3SDv1XTJJcwsazkXr+NMJaNSN7qQFPMboDS0Z","3pX27Rn1ev1UHTqFKBYgogxyeUOnbeXE+VAFYuoeNCbFYY1TFhvGVWRax/rf","PBuVQ4d1+g87nxSL3JFwvSGzTjPkJiU+rGOIkOqYK0JA/T8+ZqrXTQoH2d7i","r1vldA2CakQ+Mf+BjHjG06doQlrbuGBYXLWJbATpcKmK++kWaGE01h5rFbx8","JmS3SZME1N2bdm99TJVzbWbHqcJge/1lfEY1PecjweX2McXQEVGmZLPdN6dF","HLrZ5SS/qnXSXE79odO4Cd/gx1nJrovmut1vZfxh3yyLOnh9+BZX/NeU9FWu","","=MMEa","-----END PGP PUBLIC KEY BLOCK-----"].join("\n");angular.module("pgpApp").run(["$templateCache",function(e){e.put("templates/chickenBox.html",'<div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal">&times;</button>\n  <h4 class="modal-title">{{content.title}}</h4>\n</div>\n<div class="modal-body">\n  <div class="panel panel-danger" ng-show="content.danger">\n    <div class="panel-heading">\n      <h3 class="panel-title">This action is irreversible!</h3>\n    </div>\n    <div class="panel-body">\n      <p>This will permanently delete the key data! There will be no way to recover this identity unless YOU made a backup.</p>\n      <p>Are you sure you wish to do this?</p>\n    </div>\n  </div>\n  <div ng-show="!content.danger">\n    Are you sure? This action cannot be reversed.\n  </div>\n</div>\n<div class="modal-footer">\n  <button type="button" class="btn" ng-class="content.danger ? \'btn-danger\' : \'btn-warning\'" ng-click="ok()">Delete!</button>\n  <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button>\n</div>'),e.put("templates/intro.html",'<div class="jumbotron">\n  <h1>Get started with PGP</h1>\n  <p class="lead">This website helps you send encrypted messages using PGP.</p>\n  <p>\n    <a class="btn btn-lg btn-success" ng-click="showwhat = true">What is PGP?</a>\n    <a class="btn btn-lg btn-success" ng-click="showrisks = true">Is pgp.help secure?</a>\n  </p>\n</div>\n<div id="#what" class="row" ng-show="showwhat">\n  <div class="col-lg-12">\n    <h3>What is PGP?</h3>\n    <ul>\n      <li>PGP allows you to send encrypted messages. Encrypted messages can only be read by the recipient and no-one else.</li>\n      <li>To send a message you need the recipient&#8217;s <b>public key</b>. You will have to ask them to give you this.</li>\n      <li>To receive messages you need a <b>private key</b>. We can generate one for you.</i>\n    </ul>\n  </div>\n</div>\n<div id="#what" class="row" ng-show="showrisks">\n  <div class="col-lg-12">\n    <h3>Is pgp.help secure?</h3>\n    <p class="text-danger">This website is not 100% secure! If privacy is important to you then make sure you understand the risks!</p>\n    <ul>\n      <li>All the code in this website runs locally inside your browser. No data is ever sent over the internet.</li>\n      <li>However web browsers occasionally have security vulnerabilities, and are often targeted by hackers</li>\n      <li>Additionally since the website itself is loaded over the internet which presents an inherent risk.</li>\n      <li>This website is only intended for casual PGP usage. <em class="text-danger">Do not use this website if privacy is critical for you.</em></ii>\n    </ul>\n  </div>\n</div>\n<div class="row">\n  <div class="col-lg-4">\n    <h3>Send a PGP Message</h3>\n    <p>If you want to send an encrypted message and already have their PGP key it&#8217;s really simple:<p>\n    <ol>\n      <li>Paste their PGP key into the form.</li>\n      <li>Type your message.</li>\n      <li>Copy the encrypted result and send it to your recipient</li>\n    </ol>\n    <p>\n      <a class="btn btn-primary" ui-sref="key">Get Started »</a>\n    </p>\n  </div>\n  <div class="col-lg-4">\n    <h3>Don&#8217;t have a PGP key?</h3>\n    <p>You need to ask your recipient for their key, or suggest they go to <a href="https://pgp.help/generate">pgp.help</a> to generate one themselves.</p>\n    <p>If you want to try out PGP why not use our key to send us a message?</p>\n    <p>\n      <a class="btn btn-primary" ui-sref="key({key:\'1dfa77312bac1781f699e78223fd9f3e9b067569\'})">Send us a Message »</a>\n    </p>\n  </div>\n  <div class="col-lg-4">\n    <h3>Want to Receive Messages?</h3>\n    <p>We can generate a PGP key pair for you and store it inside your browser</p>\n    <p>\n      <a class="btn btn-primary" ui-sref="generate">Generate private key »</a>\n    </p>\n  </div>\n</div>'),e.put("templates/keyGenerator.html",'<form action="/" class="form-horizontal" method="get">\n  <fieldset>\n    <legend>Generate New Identity</legend>\n    <div class="form-group">\n      <label class="col-lg-2 control-label">Name</label>\n      <div class="col-lg-6 controls">\n        <div class="input-append">\n          <input class="form-control" type="text" ng-model="user"/>\n        </div>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-lg-2 control-label">Email</label>\n      <div class="col-lg-6 controls">\n        <div class="input-append">\n          <input class="form-control" type="email" ng-model="email"/>\n        </div>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-lg-2 control-label">Passphrase</label>\n      <div class="col-lg-6 controls">\n        <div class="input-append">\n          <input class="form-control" type="password" ng-model="passphrase"/>\n        </div>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-lg-2 control-label"></label>\n      <div class="col-lg-6 controls">\n        <div class="btn btn-large btn-primary" ng-show="!working" ng-click="generateKeyPair()">Generate New Key Pair</div>\n        <div class="btn btn-large btn-primary" disabled=\'true\' ng-show="working">Working...</div>\n      </div>\n    </div>\n  </fieldset>\n</form>'),e.put("templates/keyWork.html",'<!-- <pre>{{$stateParams}}</pre> -->\n<form action="/" class="form-horizontal" method="get">\n  <fieldset>\n    <legend>{{isPrivateKey() ? \'Decrypt\' : \'Encrypt\'}} Message</legend>\n\n    <div class="form-group" ng-class="[smartfade, {\'has-error\': pgperror}]" ng-show="isNewKey()">\n      <label class="col-lg-2 control-label" for="pgppub">{{isPrivateKey() ? \'Private\' : \'Public\'}} Key</label>\n      <div class="col-lg-10 controls">\n        <textarea class="form-control autoselectall" focus-on="pgppub" rows="4" spellcheck="false" placeholder="Paste PGP key here."\n          ng-model="rawkey" ng-model-options="{debounce:500}" ng-change="loadKey()"></textarea>\n      </div>\n    </div>\n    <div ng-show="!isNewKey()">\n      <div class="form-group">\n        <label class="col-lg-2 control-label" for="username">Username</label>\n        <div class="col-lg-5 controls">\n          <div class="input-append">\n            <input class="form-control" type="text" readonly="readonly" ng-value="getUser(key)"/>\n          </div>\n        </div>\n        <label class="col-lg-2 control-label" for="keyId">Key ID</label>\n        <div class="col-lg-3 controls">\n          <div class="input-append">\n            <input class="form-control autoselectall" type="text" readonly="readonly" ng-value="getKeyId(key)"/>\n          </div>\n        </div>\n      </div>\n      <div class="form-group" ng-show="isPrivateKey() && !isNewKey()">\n        <label class="col-lg-2 control-label" for="passphrase">Password</label>\n        <div class="col-lg-10 controls">\n          <div class="input-append" ng-class="{\'has-error\':passworderror}">\n            <input type="password" class="form-control" focus-on="passphrase" ng-model-options="{debounce:500}"\n              placeholder="{{isDecryptedKey() ? \'Key already decrypted\' : \'Password for private key\'}}"\n              ng-model="password" ng-change="applyPassword()" ng-readonly="isDecryptedKey()"></input>\n          </div>\n        </div>\n      </div>\n      <div class="form-group" ng-click="showdetails = !showdetails">\n        <a class="col-lg-10 col-lg-offset-2">{{showdetails ? \'Hide\' : \'Show\'}} key details\n          <span class="pull-left"><i class="glyphicon"\n              ng-class="{\'glyphicon-chevron-up\':showdetails, \'glyphicon-chevron-down\':!showdetails}"></i>\n          </span>\n        </a>\n\n      </div>\n      <div ng-show="showdetails">\n        <div class="form-group">\n          <label class="col-lg-2 control-label" for="fingerprint">Fingerprint</label>\n          <div class="col-lg-10 controls">\n            <div class="input-append">\n              <input class="form-control autoselectall" type="text" readonly="readonly" ng-value="getFingerprint(key)"/>\n            </div>\n          </div>\n        </div>\n        <div class="form-group">\n          <label class="col-lg-2 control-label">Public Key</label>\n          <div class="col-lg-10 controls">\n            <textarea class="form-control autoselectall" id="dest" readonly="readonly" rows="8"\n                placeholder="Raw PGP key.">{{applyBlockquote ? blockquote(rawkey) : rawkey}}</textarea>\n          </div>\n        </div>\n        <div class="forum-group row">\n          <div class="col-lg-10 col-lg-offset-2">\n            <a class="btn btn-default" download="publickey.txt" ng-href="data:text/plain;charset=utf-16le,{{encodeURIComponent(rawkey)}}">Save As</a>\n            <a class="btn btn-default" ng-show="isPrivateKey()" data-toggle="modal" data-target="#keyExport">Export Private Key</a>\n            <a class="btn btn-default" ng-show="workstarted" ng-click="deleteKey()">Delete Key</a>\n            <div class="pull-right">(<a ui-sref="permalink({pgp:rawkey})">permalink</a>)</div>\n          </div>\n          <!-- Modals -->\n          <div id="keyExport" class="modal fade" role="dialog">\n            <div class="modal-dialog modal-lg">\n              <!-- Modal content-->\n              <div class="modal-content">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal">&times;</button>\n                  <h4 class="modal-title">Export Key Data</h4>\n                </div>\n                <div class="modal-body">\n                  <div class="panel panel-warning">\n                    <div class="panel-heading">\n                      <h3 class="panel-title">Do not share this data with anyone!</h3>\n                    </div>\n                    <div class="panel-body">\n                      <p>This data should be used to backup the private key, and import it to other pgp apps that you own.</p>\n                      <p>Do NOT give this data to anyone as it will allow them to read your messages, or steal your identity!</p>\n                    </div>\n                  </div>\n\n                  <div class="form-group">\n                    <label class="col-lg-2 control-label">Private Key</label>\n                    <div class="col-lg-10 controls">\n                      <textarea class="form-control autoselectall" id="dest" readonly="readonly" rows="8"\n                          placeholder="Encrypted text will appear here.">{{rawkey_private}}</textarea>\n                    </div>\n                  </div>\n                </div>\n                <div class="modal-footer">\n                  <a class="btn btn-default" download="privatekey.txt" ng-href="data:text/plain;charset=utf-16le,{{encodeURIComponent(rawkey_private)}}">Save As</a>\n                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                </div>\n              </div>\n            </div>\n          </div>\n          <!-- Modals finish here -->\n        </div>\n      </div>\n    </div>\n    <hr/>\n    <div class="form-group">\n      <label class="col-lg-2 control-label" for="src">Message</label>\n      <div class="col-lg-10 controls" ng-show="!isPrivateKey()">\n        <textarea class="form-control" focus-on="message" rows="8" spellcheck="false" placeholder="Type your mesage here."\n          ng-model="message" ng-model-options="{debounce:500}" ng-change="encryptMessage()"></textarea>\n      </div>\n      <div class="col-lg-10 controls" ng-show="isPrivateKey()" ng-class="{\'has-error\': pmessageerror}">\n        <textarea class="form-control autoselectall" focus-on="pmessage" rows="8" spellcheck="false" placeholder="Paste encrypted message here."\n          ng-model="pmessage" ng-model-options="{debounce:500}" ng-change="decryptMessage()"></textarea>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-lg-2 control-label" for="dest">Result</label>\n      <div class="col-lg-10 controls">\n        <textarea class="form-control autoselectall" id="dest" readonly="readonly" rows="8"\n            placeholder="Encrypted text will appear here.">{{applyBlockquote && !isPrivateKey() ? blockquote(resulttext) : resulttext}}</textarea>\n        <div class="checkbox" ng-show="(resulttext && !isPrivateKey() || showdetails)">\n          <label><input type="checkbox" ng-model="applyBlockquote">Markdown blockquote (for reddit etc)</label>\n        </div>       \n        <div class="pull-right" ng-show="resulttext && mailit()">(<a ng-href="{{mailit()}}">send in email</a>)</div>\n        <div>\n          <span id="hint_to">&nbsp;</span>&nbsp;\n        </div>\n      </div>\n    </div>\n  </fieldset>\n</form>')}]);