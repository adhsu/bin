import * as _ from 'underscore'

function diff(a,b) {
    var r = {};
    _.each(a, function(v,k) {
        if(b[k] === v) return;
        // but what if it returns an empty object? still attach?
        r[k] = _.isObject(v)
                ? _.diff(v, b[k])
                : v
            ;
        });
    return r;
}

export default diff