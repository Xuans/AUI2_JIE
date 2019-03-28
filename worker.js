function isEmptyObject( obj ) {

    /* eslint-disable no-unused-vars */
    // See https://github.com/eslint/eslint/issues/6125
    var name;

    for ( name in obj ) {
        return false;
    }
    return true;
}

function normalizeObjV2(obj, objArray, withTemplate) {
    var name, i, cursor = -1,
        cache, objCache, objArrayCache,
        caches = [{
            obj: obj,
            objArray: objArray
        }];

    while (cache = caches[++cursor]) {
        objCache = cache.obj;
        objArrayCache = cache.objArray;

        if (objCache.active) {
            delete objCache.active;
        }
        if (Array.isArray(objArrayCache)) {
            objArrayCache.forEach(function(item, index) {
                
                var temp;
                name = item.name;
                if (!name && item.type !== 'tab') {
                    delete objCache[name];
                } else {
                    switch (item.type) {
                        case 'tab':
                            caches.push({
                                obj: objCache,
                                objArray: item.tabPanes
                            });
                            break;

                        case 'object':
                            if (isEmptyObject(objCache[name]) && !item.reserve) {
                                delete objCache[name];
                            } else {
                                objCache[name] && caches.push({
                                    obj: objCache[name],
                                    objArray: item.attr
                                });
                            }
                            break;

                        case 'array':

                            if (Array.isArray(objCache[name])) {
                                !withTemplate && objCache[name].shift();
                                if (objCache[name].length === 0 && !item.reserve) {
                                    !withTemplate && (delete objCache[name]);
                                } else {

                                    if (item.attrInEachElement === 'self') {
                                        item.attrInEachElement = JSON.parse(JSON.stringify(objArrayCache));
                                    }

                                    for (i = objCache[name].length; i > 0;) {
                                        temp = objCache[name][--i];
                                        if (temp.active === false || (item.mustHave && !temp[item.mustHave])) {
                                            objCache[name].splice(i, 1);
                                            if (objCache[name].length === 0 && !item.reserve) {

                                                delete objCache[name];
                                            }
                                        } else {
                                            caches.push({
                                                obj: objCache[name][i],
                                                objArray: item.attrInEachElement
                                            });
                                        }
                                    }
                                }
                            }
                            break;

                        case 'edmCollection':
                            !withTemplate && objCache[name].elements.shift();
                            if (objCache[name].elements.length === 0 && !item.reserve) {
                                !withTemplate && (delete objCache[name].elements);
                            } else {
                                for (i = objCache[name].elements.length; i > 0;) {
                                    temp = objCache[name].elements[--i];
                                    if (temp.active === false || (item.mustHave && !temp[item.mustHave])) {
                                        objCache[name].elements.splice(i, 1);
                                        if (objCache[name].elements.length === 0 && !item.reserve) {
                                            delete objCache[name].elements;
                                        }
                                    } else {
                                        caches.push({
                                            obj: objCache[name].elements[i],
                                            objArray: item.attrInEachElement
                                        });
                                    }
                                }
                            }
                            objCache[name] = {
                                edmID: objCache[name].edmID,
                                edmKey: objCache[name].edmKey,
                                elements: objCache[name].elements,
                                fields: objCache[name].fields,
                                keys: objCache[name].keys
                            };
                            break;

                        case 'multiple_select':
                            if (item.separator) {
                                objCache[name] = objCache[name].join(item.separator);
                            }
                            break;

                        case 'tags_input':
                            try {
                                objCache[name] = JSON.parse(objCache[name].replace(/\'/g, "\""));
                            } catch (e) {

                            }

                            break;

                        default:
                            if (typeof objCache[name] === 'undefined' && typeof item.reserve === 'undefined') {
                                delete objCache[name];
                            }

                            break;
                    }
                }
            })
        }
    }

    return obj;
}

function parseJSObject(obj) {
    var name, value, cache, cursor = -1,
        caches = [obj];

    while (cache = caches[++cursor]) {
        for (name in cache) {
            if (typeof (cache[name]) === 'string') {
                if (cache[name].indexOf('_parseObject_') === 0) {
                    cache[name] = JSON.parse(cache[name].replace(/_parseObject_/, ''));
                } else {
                    try {
                        value = cache[name].replace(/'/g, '"');
                        // value = cache[name];
                        value = JSON.parse(value);

                        if (typeof value !== 'string') {
                            cache[name] = value;
                        }
                    } catch (e) {/*
                     } catch (e) {
                     /*
                     if (e.message === "Unexpected token '") {

                     value=cache[name];

                     if(value.startsWith("'{") &&  value.endsWith("}'")){
                     value=value.substr(1,value.length-2);
                     }else{
                     value = value.replace(/'/g, '"');
                     }


                     value = JSON.parse(value);

                     if (typeof value !== 'string') {
                     cache[name] = value;
                     }
                     } */

                    }
                }
            } else if (typeof (cache[name]) === 'object') {
                caches.push(cache[name]);
            }
        }
    }
    return obj;
}

function getCleanedOption(option, objArray, withTemplate) {
    var optionCopy = JSON.parse(JSON.stringify(option));
    normalizeObjV2(optionCopy, objArray, withTemplate);
    parseJSObject(optionCopy);
    return optionCopy;
}

self.onmessage = function (evt) {
    'use strict';

    var evtData = JSON.parse(evt.data);

    postMessage(JSON.stringify(getCleanedOption(evtData.obj, evtData.objArray)));
};