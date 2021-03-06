/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var axios = require('../../MapStore2/web/client/libs/ajax');
const moment = require('moment');

const MAP_CONFIG_LOADED = 'MAP_CONFIG_LOADED';
const MAP_CONFIG_LOAD_ERROR = 'MAP_CONFIG_LOAD_ERROR';

function configureMap(conf, mapId) {
    return {
        type: MAP_CONFIG_LOADED,
        config: conf,
        legacy: !!mapId,
        mapId: mapId
    };
}

function configureError(e) {
    return {
        type: MAP_CONFIG_LOAD_ERROR,
        error: e
    };
}

function loadMapConfig(configName, mapId, date) {
    return (dispatch) => {
        return axios.get(configName).then((response) => {
            if (typeof response.data === 'object') {
                response.data.map.layers.map((data) => {
                    if (data && data.params && data.params.map === "spazializzazioni") {
                        Object.assign(data, {params: {data: moment(date).format('YYYY-MM-DD'), map: "spazializzazioni"}});
                    }
                }, this);
                dispatch(configureMap(response.data, mapId));
            } else {
                try {
                    JSON.parse(response.data);
                } catch(e) {
                    dispatch(configureError('Configuration file broken (' + configName + '): ' + e.message));
                }
            }
        }).catch((e) => {
            dispatch(configureError(e));
        });
    };
}

module.exports = {
    MAP_CONFIG_LOADED,
    MAP_CONFIG_LOAD_ERROR,
    loadMapConfig,
    configureMap,
    configureError
};
