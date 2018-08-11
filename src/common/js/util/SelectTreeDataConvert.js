/**
 * Created by pengt on 2017/10/26.
 */

define([], function() {

    var optionsToSelectTree = [];

    var buildData = function(parentObj,  idKey, labelKey, childrenKey, parentEle) {

        if (parentObj[childrenKey] && parentObj[childrenKey].length > 0) {
            if (!parentObj.isAddedForTc) {
                optionsToSelectTree.push(parentEle);
                parentObj.isAddedForTc = 1;
            }
            _.forEach(parentObj[childrenKey], function(obj) {
                var eleChild = {id: obj[idKey], label:obj[labelKey]};
                if (parentEle[childrenKey] && parentEle[childrenKey].length >0) {
                    parentEle[childrenKey].push(eleChild);
                } else {
                    parentEle[childrenKey] = [];
                    parentEle[childrenKey].push(eleChild);
                }

                obj.isAddedForTc = 1;
                buildData(obj, idKey,labelKey, childrenKey, eleChild);
            });
        } else {
            if (parentObj.isAddedForTc) {

            } else {
                optionsToSelectTree.push(parentEle);
            }
            return false;
        }
    };

    return {
        //data format is [{xx:xx,children:[{xx:xx}]}], converted data is [{id:xx,label:xx, children[..]}]
        convert: function (data, idKey, labelKey, childrenKey) {
            optionsToSelectTree = [];
            _.forEach(data, function(obj) {
                var ele = {id: obj[idKey], label: obj[labelKey]};
                buildData(obj, idKey, labelKey, childrenKey, ele);
            });

            return optionsToSelectTree;
        }
    };
});