(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27b7db82"],{"136e":function(e,t,a){"use strict";var i=a("5fb8"),n=a.n(i);n.a},"36f8":function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"atoms__radio"},[a("input",{ref:"radio",staticClass:"atoms__radio-input",attrs:{type:"radio",id:e.identifier,name:e.name},domProps:{value:e.identifier},on:{input:function(t){return e.updateRadio()}}}),a("label",{staticClass:"atoms__radio-label",attrs:{for:e.identifier}},[a("span",[e._v("\n              "+e._s(e.text)+"\n          ")])])])},n=[],r={props:["value","name","identifier","text"],methods:{updateRadio:function(){this.$emit("input",this.$refs.radio.value)}}},o=r,s=(a("dfcf"),a("2877")),l=Object(s["a"])(o,i,n,!1,null,null,null);t["a"]=l.exports},"38a8":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("h1",[e._v("Page in development  still")]),a("div",{staticClass:"analyze-votes__wrapper"},[a("h2",[e._v("First Group")]),a("h2",[e._v("Second Group")]),a("AnalyzeVotesGroup"),a("AnalyzeVotesGroup")],1)])},n=[],r=a("36f8"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"atoms__checkbox"},[a("input",{ref:"checkbox",staticClass:"atoms__checkbox-input",attrs:{type:"checkbox",id:e.identifier,name:e.name},domProps:{value:e.identifier},on:{input:function(t){return e.updateCheckbox()}}}),a("label",{staticClass:"atoms__checkbox-label",attrs:{for:e.identifier}},[a("span",[e._v("\n              "+e._s(e.text)+"\n          ")])])])},s=[],l={props:["value","name","identifier","text"],methods:{updateCheckbox:function(){this.$emit("input",this.$refs.checkbox.checked)}}},c=l,u=(a("c017"),a("2877")),v=Object(u["a"])(c,o,s,!1,null,null,null),d=v.exports,f=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",[e._m(0),a("div",[a("Radio",{attrs:{name:"sex",identifier:"male",text:"Male"},model:{value:e.sex,callback:function(t){e.sex=t},expression:"sex"}}),a("Radio",{attrs:{name:"sex",identifier:"female",text:"Female"},model:{value:e.sex,callback:function(t){e.sex=t},expression:"sex"}})],1)]),a("div",[e._m(1),a("div",[a("Checkbox",{attrs:{name:"age",identifier:"<25",text:"<25"},model:{value:e.ageLessThan25,callback:function(t){e.ageLessThan25=t},expression:"ageLessThan25"}}),a("Checkbox",{attrs:{name:"age",identifier:"26-35",text:"26-35"},model:{value:e.age26To35,callback:function(t){e.age26To35=t},expression:"age26To35"}}),a("Checkbox",{attrs:{name:"age",identifier:"36-50",text:"36-50"},model:{value:e.age36To50,callback:function(t){e.age36To50=t},expression:"age36To50"}}),a("Checkbox",{attrs:{name:"age",identifier:"51-60",text:"51-60"},model:{value:e.age51To60,callback:function(t){e.age51To60=t},expression:"age51To60"}}),a("Checkbox",{attrs:{name:"age",identifier:"61+",text:"61+"},model:{value:e.age61Plus,callback:function(t){e.age61Plus=t},expression:"age61Plus"}})],1)]),a("div",[e._m(2),a("div",[a("Checkbox",{attrs:{name:"driving-for-years",identifier:"0-2",text:"0-2"},model:{value:e.drivingFor0To2,callback:function(t){e.drivingFor0To2=t},expression:"drivingFor0To2"}}),a("Checkbox",{attrs:{name:"driving-for-years",identifier:"2-5",text:"2-5"},model:{value:e.drivingFor2To5,callback:function(t){e.drivingFor2To5=t},expression:"drivingFor2To5"}}),a("Checkbox",{attrs:{name:"driving-for-years",identifier:"6-10",text:"6-10"},model:{value:e.drivingFor6To10,callback:function(t){e.drivingFor6To10=t},expression:"drivingFor6To10"}}),a("Checkbox",{attrs:{name:"driving-for-years",identifier:"11+",text:"11+"},model:{value:e.drivingFor11Plus,callback:function(t){e.drivingFor11Plus=t},expression:"drivingFor11Plus"}})],1)]),a("div",[e._m(3),a("div",[a("select",{directives:[{name:"model",rawName:"v-model",value:e.region,expression:"region"}],attrs:{id:"region"},on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.region=t.target.multiple?a:a[0]}}},[a("option",{attrs:{value:""}},[e._v("Please select")]),a("option",{attrs:{value:"praha"}},[e._v("Praha")]),a("option",{attrs:{value:"stredocesky"}},[e._v("Stredocesky")]),a("option",{attrs:{value:"jihocesky"}},[e._v("Jihocesky")]),a("option",{attrs:{value:"plzensky"}},[e._v("Plzensky")]),a("option",{attrs:{value:"karlovarsky"}},[e._v("Karlovarsky")]),a("option",{attrs:{value:"ustecky"}},[e._v("Ustecky")]),a("option",{attrs:{value:"liberecky"}},[e._v("Liberecky")]),a("option",{attrs:{value:"liberecky"}},[e._v("Liberecky")]),a("option",{attrs:{value:"kralovohradecky"}},[e._v("Kralovohradecky")]),a("option",{attrs:{value:"pardubicky"}},[e._v("Pardubicky")]),a("option",{attrs:{value:"vysocina"}},[e._v("Vysocina")]),a("option",{attrs:{value:"jihomoravsky"}},[e._v("Jihomoravsky")]),a("option",{attrs:{value:"olomoucky"}},[e._v("Olomoucky")]),a("option",{attrs:{value:"zlinsky"}},[e._v("Zlinsky")]),a("option",{attrs:{value:"moravskoslezsky"}},[e._v("Moravskoslezsky")])])])]),a("div",[e._m(4),a("div",[a("select",{directives:[{name:"model",rawName:"v-model",value:e.education,expression:"education"}],attrs:{id:"education"},on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.education=t.target.multiple?a:a[0]}}},[a("option",{attrs:{value:""}},[e._v("Please select")]),a("option",{attrs:{value:"primary"}},[e._v("Primary")]),a("option",{attrs:{value:"secondary"}},[e._v("Secondary")]),a("option",{attrs:{value:"university"}},[e._v("University")])])])]),a("div",[e._m(5),a("div",[a("Checkbox",{attrs:{name:"vehicle",identifier:"bike",text:"Bike"},model:{value:e.bike,callback:function(t){e.bike=t},expression:"bike"}}),a("Checkbox",{attrs:{name:"vehicle",identifier:"car",text:"Car"},model:{value:e.car,callback:function(t){e.car=t},expression:"car"}}),a("Checkbox",{attrs:{name:"vehicle",identifier:"bus",text:"Bus"},model:{value:e.bus,callback:function(t){e.bus=t},expression:"bus"}}),a("Checkbox",{attrs:{name:"vehicle",identifier:"van",text:"Van"},model:{value:e.van,callback:function(t){e.van=t},expression:"van"}}),a("Checkbox",{attrs:{name:"vehicle",identifier:"truck",text:"Truck"},model:{value:e.truck,callback:function(t){e.truck=t},expression:"truck"}}),a("Checkbox",{attrs:{name:"vehicle",identifier:"tramway",text:"Tramway"},model:{value:e.tramway,callback:function(t){e.tramway=t},expression:"tramway"}})],1)])])},m=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"sex"}},[e._v("Sex")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"age"}},[e._v("Age")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"driving-for-years"}},[e._v("Driving for years")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"region"}},[e._v("Region")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"education"}},[e._v("Education")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{attrs:{for:"vehicle"}},[e._v("Vehicle")])])}],p={name:"analyze-votes-group",components:{Radio:r["a"],Checkbox:d},methods:{}},k=p,x=Object(u["a"])(k,f,m,!1,null,null,null),_=x.exports,b={name:"analyze-votes",components:{Radio:r["a"],Checkbox:d,AnalyzeVotesGroup:_},methods:{}},h=b,y=(a("136e"),Object(u["a"])(h,i,n,!1,null,null,null));t["default"]=y.exports},"5fb8":function(e,t,a){},"691d":function(e,t,a){},adec:function(e,t,a){},c017:function(e,t,a){"use strict";var i=a("691d"),n=a.n(i);n.a},dfcf:function(e,t,a){"use strict";var i=a("adec"),n=a.n(i);n.a}}]);
//# sourceMappingURL=chunk-27b7db82.19e1b34c.js.map