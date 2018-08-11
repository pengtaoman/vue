/**
 * Created by pengtao on 2018/3/25.
 */
define(['http://mockjs.com/dist/mock.js'],
    function(Mock) {
        return {
            start : function() {
                console.log('==============  MOCK2 SERVER started ===============');

                Mock.mock('http://localhost:8080/mvc/main/add09', {
                    'nameDDDDD'     : '@name',
                    'ageDDDD|1-100': 100,
                    'colorDDDD'    : '@color'
                });
            }
        }
    }
)