/**
 * Created by pengt on 2017/12/25.
 */
define(['vuex'
        ,'axios'
        ,'../../demo/table/util.js'],
    function(Vuex, axios, util) {

    return {
        data : function() {
            return {
                name : ' :: PPPQQQQQ11111111111 :: ' + util.getName(),
                activeIndex: '1',
                activeIndex2: '1',
                visible: false,

                value2: ['jiangsu', 'suzhou', 'zhuozhengyuan'],
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
            }
        },
        props: ['package']
        ,computed: Vuex.mapState(['messages', 'contentHeader'])
        ,methods : {
            cli : function() {
                alert('CLI demo1!!!!!' + this.package);
                this.$store.commit('pushMessage', ' VUEX MESSAGE!!!!');
            },
            test_mock1: function() {
                axios.post('/omanage/employee').then(function (res) {
                    console.log('!!!!!!!!!!!!!!!' + JSON.stringify(res));
                    console.log('!!!!!!!!!!!!!!!' + res.status);
                });
            },
            test_mock2: function() {
                axios.get('/jwt/test.do').then(function (res) {
                    console.log('!!!!!!!!!!!!!!!' + JSON.stringify(res));

                });
            },
            show: function () {
                this.visible = true;
            }
        }
        ,mounted : function() {
            this.$store.commit('setHeader', ' 测试No1');
            var _vm = this;
            var mm = this.$store.state.menuData;
            $('#faiconpicker').val('sdfasdfa');
            //console.log('------- VCCCCCCCCCCCCCCCC--------' + mm);
            //console.log('------- VCCCCCCCCCCCCCCCC--------' + _vm.name);
            //console.log('------- VCCCCCCCCCCCCCCCC--------' + _vm.pageHead);

        }
    };
});