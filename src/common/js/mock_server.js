/**
 * Created by pengtao on 2018/3/25.
 */
define(['./common/js/mock/mock1.js'],
    function(mocks) {
        return {
            start : function() {
                console.log('==============  MOCK SERVER started ===============');
                _.forEach(mocks,function(server) {
                    server.start();
                });
            },
            stop: function() {
                console.log('==============  MOCK SERVER stopped ===============');
            }
        }
    }
)