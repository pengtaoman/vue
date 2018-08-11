require.config({
    urlArgs: "bust=v1.0.0",
    baseUrl: "./",
    paths: {
        'vue': basePath + '/node_modules/vue/dist/vue'
        ,'vuex': basePath +'/node_modules/vuex/dist/vuex'
        ,'vue_router': basePath +'/node_modules/vue-router/dist/vue-router'
        ,'ELEMENT': basePath +'/node_modules/element-ui/lib/index'
        ,'iview' : basePath + '/node_modules/iview/dist/iview.min'
        ,'text' : basePath +'/node_modules/text/text'
        ,'axios': basePath +'/node_modules/axios/dist/axios'
        ,'mockServer':basePath +'/common/js/mock_server'
        ,'main': basePath +'/common/js/main'
    },
    shim: {
        vue: {
            exports: 'Vue'
        },
        vuex : {
            export:'Vuex'
        },
        vue_router: {
            exports: 'VueRouter'
        },
        iview: [
            'vue'
        ],
    },

    deps:['main']

});

