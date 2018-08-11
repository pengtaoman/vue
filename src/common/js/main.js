"use strict"
require([
    'vue',
    'vuex',
    'vue_router',
    'axios',
    'ELEMENT',
    'iview',
    'mockServer'
], function (Vue, Vuex, VueRouter, axios, element, iview, mockServer) {

    //JWT令牌设置
    var TOKEN_KEY = 'jwtTokenForVueRequire';
    mockServer.start();
    var getJwtToken = function() {
        return localStorage.getItem(TOKEN_KEY);
    }

    //设置ajax请求和返回拦截
    axios.defaults.headers = {
        "Content-Type": "application/json;charset=UTF-8"
    };

    axios.interceptors.request.use(
        function (config)
        {

            //console.log('AJAX 请求拦截 request config :: ' + JSON.stringify(config));
            if (config.url && _.endsWith(config.url,'.html')) {
                //require html file, do nothing
            } else {
                NProgress.start();
                config.headers.Authorization = "Bearer " + getJwtToken();
                config.headers['Content-Type'] = "application/json;charset=UTF-8";
            }
            //console.log('AJAX 请求拦截 request config :: ' + JSON.stringify(config));
            return config;
        },
        function (error) {
            alert(error);
        }
    );

    var tokenErr = [700,701,702];
    window.gotoLogin = function () {
        window.location.href = basePath + '/login.html';
    };
    axios.interceptors.response.use(function (response) {
        //console.log('AJAX 返回结果拦截 response:' + JSON.stringify(response));
        if (response.config.url && _.endsWith(response.config.url,'.html')) {
            NProgress.done();
            return response;
        }
        if (response.data) {
            NProgress.done();
            if (response.data.code) {
                if (!_.startsWith(response.data.code,'20')) {
                    console.log(JSON.stringify(response));

                    var isTokenError = false;
                    _.forEach(tokenErr,function (obj) {
                        if (obj == response.data.code) {
                            //setTimeout('window.gotoLogin()', 2000);
                            isTokenError = true;
                            return false;
                        }
                    });

                    if (isTokenError){
                        VueIn.openReloginModal();
                    } else {
                        var errMsg = response.data.msg?response.data.msg:response.data.message;
                        var err = response.data.code + ',错误信息:' + errMsg;
                        VueIn.showError('返回结果错误',err);
                    }
                    throw err;
                } else {
                    return response.data
                }
            }
        }
        return response;
    }, function (error) {
        VueIn.showError('返回结果错误',error);
        NProgress.done();
        return Promise.reject(error);
    });

    //动态路由解析
    var router = new VueRouter({
        //mode: 'history',
        base: basePath + '/',
        routes: [
            {
                path: '/:package/:model/:function',
                props: true
            }
        ]
    });


    //面包屑设置
    var menuParentsBread = function pb(menus, menu, mary) {
        _.forEach(menus, function (obj) {
            if (obj.fMenuId == menu.fParentMenuId) {
                if (obj.fParentMenuId == '') {
                    mary.push(obj);
                    return false;
                } else {
                    mary.push(obj);
                    pb(menus, obj, mary);
                }
            }
        });
        return mary;
    };

    var getBreadData = function (menus, pageLink) {
        if (pageLink == '/home/main/home') {
            VueIn.breads = [];
            return false;
        }
        _.forEach(menus, function (obj) {
            //console.log('============' + obj.fPageLink)
            if (obj.fPageLink == pageLink) {

                var breads = menuParentsBread(menus, obj, [obj]);
                _.reverse(breads);
                VueIn.breads = breads;
                VueIn.contentHeader = obj.fMenuName;
                return false;
            }
        });
    };

    /**  动态路由解析 */
    router.beforeEach(function (to, from, next) {
        //console.log('------ router.beforeEach -----------');
        /***************************
         * 每次路由，到后台验证一下*/
         // if (!getJwtToken()) {
         //     console.log('################### 未认证状态 ..................');
         //     window.location.href = basePath + '/login.html';
         //     return false;
         // }


        var rparam = to.params;
        if (to.matched.length == 0) {
            VueIn.showError('路由错误','<p>当前菜单路径:'+to.fullPath+'</p><p>菜单URL配置错误，' +
                '请使用/package/module/function方式配置菜单路径。</p>');
            return false;
        }

        to.matched[0].name = rparam.package + '_' + rparam.model + '_' + rparam.function;
        //console.log('------ router from : ' + from.fullPath);
        //console.log('------ router to : ' + to.fullPath);

        var htmlDomReq = axios.get(basePath + '/views/' + rparam.package + '/' + rparam.model + '/'
            + rparam.function + '.html');

        htmlDomReq.then(function (res) {

            require([basePath + '/views/' + rparam.package + '/' + rparam.model + '/' + rparam.function + '.js'], function (comp) {
                //console.log(comp);
                comp.template = res.data;
                to.matched[0].components = {
                    default: comp
                };

                //console.log(VueIn.$store.state.menuData)

                NProgress.done();
                //console.log('------ router next()');

                //面包屑和页面title
                var menus = VueIn.$store.state.priMenuData;
                var pageLink = '/' + rparam.package + '/' + rparam.model + '/' + rparam.function;
                if (menus.length == 0) {
                    console.log('------ menu data delay --------------------------');
                    window.ts = function () {
                        var ms = VueIn.$store.state.priMenuData;
                        var pl = pageLink;
                        var func = getBreadData;
                        next();
                        return func(ms, pl);
                    }
                    setTimeout('window.ts()', 100);
                } else {
                    getBreadData(menus, pageLink);
                    next();
                }
                NProgress.done();
            });

        });


    });


    NProgress.start();


    //VUE 配置
    Vue.use(Vuex);
    require(['./common/js/store/store'
        , './common/js/component/page_header_a'
        , './common/js/component/page_sider_a'
    ], function (store, pageHeader) {

        Vue.use(element);
        Vue.use(iview);
        Vue.use(VueRouter);

        Vue.component('page-head', pageHeader);

        var vueInst = new Vue({
            el: '#app'
            , data: function () {
                return {
                    pageHead: 'page-head',
                    breads: [],
                    contentHeader: 'VUE admin',
                    showReloginModal:false,
                    reloginForm:{
                        userName:'',
                        password:''
                    },
                    reloginRule:{
                        userName: [
                            { required: true, message: '请输入用户名', trigger: 'blur' }
                        ],
                        password: [
                            { required: true, message: '请输入密码', trigger: 'blur' }
                        ]
                    }
                }
            }
            , store: store
            , router: router
            //,computed: Vuex.mapState(['contentHeader'])
            , beforeCreate: function () {

            }
            , created: function () {

            }
            , methods: {
                showError : function(title, content) {
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                },
                openReloginModal: function () {
                    this.showReloginModal = true;
                },
                setJwtToken:function(token) {
                    localStorage.setItem(TOKEN_KEY, token);
                },

                removeJwtToken : function() {
                    localStorage.removeItem(TOKEN_KEY);
                },
                doRelogin:function () {
                    var _vm = this;
                    this.$refs.reloginForm.validate(function(valid) {
                        if (valid) {
                            axios.post('/auth',_vm.reloginForm).then(function(result) {
                                if (result.content && result.content.token) {
                                    _vm.setJwtToken(result.content.token);
                                    _vm.showReloginModal = false;
                                    window.location.reload();
                                }
                            }).catch(function(err) {
                                console.log('relogin error: ' + err)
                            });
                        }
                    });
                },
                forwardLogin:function () {
                    window.location.href = basePath + '/login.html';
                }
            }
            , mounted: function () {
                var urlSplit = _.split(location.href, '#', 2);
                if (!urlSplit[1] || (urlSplit[1] && _.split(urlSplit[1],'/').length <= 2)) {
                    router.push({path: '/home/main/home'})
                }

                this.$nextTick(function() {
                    // console.log($(".sidebar:first-child").find('ul')[0]);
                    // $(".sidebar:first-child").find('ul').get(0).click();
                    //$(".sidebar-menu:first-child").addClass("menu-open");
                });
            }
        });
        window.VueIn = vueInst;

        NProgress.done();
    });


});