webpackJsonp([11],{"/yRs":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,r=(s=n("8ebl")).default||s,a={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"vue-street-view-pano-container"},[t("div",{ref:"vue-street-view-pano",staticClass:"vue-street-view-pano"}),this._v(" "),this._t("default")],2)},staticRenderFns:[]};var i=n("VU/8")(r,a,!1,function(e){n("CjMs")},null,null);t.default=i.exports},"5ZbH":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,r=(s=n("hOwk")).default||s,a={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"vue-map-container"},[t("div",{ref:"vue-map",staticClass:"vue-map"}),this._v(" "),t("div",{staticClass:"vue-map-hidden"},[this._t("default")],2),this._v(" "),this._t("visible")],2)},staticRenderFns:[]};var i=n("VU/8")(r,a,!1,function(e){n("dtWn")},null,null);t.default=i.exports},"5cLx":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,r=(s=n("WgA/")).default||s,a={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("div",{ref:"flyaway"},[this._t("default")],2)])},staticRenderFns:[]},i=n("VU/8")(r,a,!1,null,null,null);t.default=i.exports},"7zck":function(e,t){},CjMs:function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("7+uW"),r={data:function(){return{appTitle:"ABCXyZ",sidebar:!1,menuItems:this.getMenu()}},methods:{getMenu:function(){var e=[];return e.push({title:"Home",path:"/"+this.$myStore.state.user.role,icon:"home"}),""==this.$myStore.state.user.username?(e.push({title:"Sign Up",path:"/signup",icon:"face"}),e.push({title:"Sign In",path:"/Login",icon:"lock_open"})):(e.push({title:this.$myStore.state.user.fullname,path:"/user",icon:"face"}),e.push({title:"Logout",path:"/logout",icon:"lock_open"})),e}},computed:{username:function(){return this.$myStore.state.user.username},fullname:function(){return this.$myStore.state.user.fullname}},watch:{username:function(e,t){console.log(t+" => "+e),this.menuItems=this.getMenu()},fullname:function(e,t){console.log(t+" => "+e),this.menuItems=this.getMenu()}}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-navigation-drawer",{attrs:{app:""},model:{value:e.sidebar,callback:function(t){e.sidebar=t},expression:"sidebar"}},[n("v-list",e._l(e.menuItems,function(t){return n("v-list-tile",{key:t.title,attrs:{to:t.path}},[n("v-list-tile-action",[n("v-icon",[e._v(e._s(t.icon))])],1),e._v(" "),n("v-list-tile-content",[e._v(e._s(t.title))])],1)}))],1),e._v(" "),n("v-toolbar",{attrs:{app:""}},[n("span",{staticClass:"hidden-sm-and-up"},[n("v-toolbar-side-icon",{on:{click:function(t){e.sidebar=!e.sidebar}}})],1),e._v(" "),n("v-toolbar-title",[n("router-link",{staticStyle:{cursor:"pointer"},attrs:{to:"/",tag:"span"}},[e._v("\n        "+e._s(e.appTitle)+"\n      ")])],1),e._v(" "),n("v-toolbar-items",{staticClass:"hidden-xs-only"},e._l(e.menuItems,function(t){return n("v-btn",{key:t.title,attrs:{flat:"",to:t.path}},[n("v-icon",{attrs:{left:"",dark:""}},[e._v(e._s(t.icon))]),e._v("\n        "+e._s(t.title)+"\n      ")],1)}))],1),e._v(" "),n("v-content",[n("router-view")],1)],1)},staticRenderFns:[]},i=n("VU/8")(r,a,!1,null,null,null).exports,o=n("Dd8w"),u=n.n(o),l=n("/ocq"),c=[{path:"/",component:"Home"},{path:"/login",component:"Login"},{path:"/signup",component:"Signup"},{path:"/user",component:"User"},{path:"/logout",component:"Logout"},{path:"/admin",component:"Admin"},{path:"/staffs/#Identifier",component:"StaffIdentifier"},{path:"/staffs/#Receiver",component:"StaffReceiver"},{path:"/driver",component:"Driver"}].map(function(e){return u()({},e,{component:function(){return n("mUJ2")("./"+e.component+".vue")}})});s.default.use(l.a);var p=new l.a({mode:"history",routes:c}),f=n("3EgV"),d=n.n(f),v=(n("7zck"),n("mtWM")),h=n.n(v),m=n("sA6N"),_=n("NYxO");s.default.use(_.a);var y=new _.a.Store({state:{count:0,user:{username:"",password:"",fullname:"",access_token:"",refresh_token:"",role:"",staff_role:"",phone:""},wepAPI:{url:"http://localhost:3000/"}},mutations:{increment:function(e){e.count++}}}),b={store:y,install:function(e,t){e.prototype.$myStore=y}};s.default.use(m,{load:{key:"AIzaSyC5VG3FK-hoCVGFc4huhykoR5sLHvS3IcE",libraries:"places"}}),s.default.use(_.a),s.default.use(b),s.default.use(d.a),s.default.config.productionTip=!1,s.default.prototype.$axios=h.a,new s.default({el:"#app",router:p,components:{App:i},template:"<App/>"})},T5eZ:function(e,t,n){"use strict";var s={render:function(){var e=this.$createElement,t=this._self._c||e;return t("label",[t("span",{domProps:{textContent:this._s(this.label)}}),this._v(" "),t("input",{ref:"input",class:this.className,attrs:{type:"text",placeholder:this.placeholder}})])},staticRenderFns:[]};t.a=s},YI6p:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("jIen"),r=n.n(s);for(var a in s)"default"!==a&&function(e){n.d(t,e,function(){return s[e]})}(a);var i=n("T5eZ"),o=n("VU/8")(r.a,i.a,!1,null,null,null);t.default=o.exports},dtWn:function(e,t){},mUJ2:function(e,t,n){var s={"./Admin.vue":["qbhH",9],"./Driver.vue":["AzZ2",8],"./HelloWorld.vue":["gORT",0],"./Home.vue":["lO7g",7],"./Login.vue":["xJsL",6],"./Logout.vue":["0Kyw",5],"./Signup.vue":["psOb",4],"./StaffIdentifier.vue":["THfL",3],"./StaffReceiver.vue":["8fwR",2],"./User.vue":["jyJz",1]};function r(e){var t=s[e];return t?n.e(t[1]).then(function(){return n(t[0])}):Promise.reject(new Error("Cannot find module '"+e+"'."))}r.keys=function(){return Object.keys(s)},r.id="mUJ2",e.exports=r},preG:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,r=(s=n("hQTS")).default||s,a={render:function(){var e=this.$createElement;return(this._self._c||e)("input",{ref:"input",attrs:{type:"text",placeholder:this.placeholder},domProps:{value:this.value}})},staticRenderFns:[]},i=n("VU/8")(r,a,!1,null,null,null);t.default=i.exports}},["NHnr"]);
//# sourceMappingURL=app.9e6f11f89afd3bfdd581.js.map