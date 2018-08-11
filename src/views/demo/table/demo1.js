/**
 * Created by pengt on 2017/9/18.
 */
define(['vuex',basePath +'/demo/table/util.js','text!./css1.st'], function(Vuex, util, css) {

    return {
        data : function() {
            return {
                name : ' :: PPPQQQQQ11111111111 :: ' + util.getName(),
                activeIndex: '1',
                activeIndex2: '1'
            }
        },
        props: ['package']
        ,computed: Vuex.mapState(['messages', 'contentHeader'])
        ,methods : {
            cli : function() {
                alert('CLI demo1!!!!!' + this.package);
                this.$store.commit('pushMessage', ' VUEX MESSAGE!!!!');
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
        ,mounted : function() {
            this.$store.commit('setHeader', ' 测试No1');
            var _vm = this;
            var mm = this.$store.state.menuData;
            console.log('------- VCCCCCCCCCCCCCCCC--------' + mm);
            console.log('------- VCCCCCCCCCCCCCCCC--------' + _vm.name);
            console.log('------- VCCCCCCCCCCCCCCCC--------' + _vm.pageHead);
            $('#st').append(css);

        }
    };
});