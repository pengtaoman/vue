/**
 * Created by pengt on 2017/10/17.
 */
define([], function() {

    var getChildData = function (priData, idKey, parentKey, parentVal, parentNode) {
        if (!priData || priData.length == 0) {
            return;
        }
        priData = _.orderBy(priData, ['fOrder']);
        var childData = _.remove(priData, function (obj) {

            return obj[parentKey] == parentVal || obj[parentKey] == '';
        });
        if (!childData || childData.length == 0) {
            return;
        }
        parentNode.children = childData;
        _(childData).forEach(function (obj) {
            getChildData(priData, idKey, parentKey, obj[idKey], obj);
        });
    };

    return {
        convert: function (priData, idKey, parentKey, parentVal) {

            var parentD = _.remove(priData, function (obj) {
                return obj[parentKey] == parentVal || obj[parentKey] == '';
            });
            parentD = _.orderBy(parentD, ['fOrder']);
            _(parentD).forEach(function (obj) {
                getChildData(priData, idKey, parentKey, obj[idKey], obj);
            });

            return parentD;
        }
    };
});