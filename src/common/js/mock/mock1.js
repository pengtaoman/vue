/**
 * Created by pengtao on 2018/3/25.
 */
define(['http://mockjs.com/dist/mock.js'],
    function(Mock) {
        return {
            start : function() {
                console.log('==============  MOCK1 SERVER started ===============');

                Mock.mock('/sys.menu', {
                    'name'     : '@name',
                    'age|1-100': 100,
                    'color'    : '@color'
                });
            }
        }
    }
)