/* eslint-disable camelcase */
'use strict';

module.exports = {
    apps: [
        {
            name: 'frontend-stage',
            script: 'npm run start-prod',
            autorestart: true,
        },
    ],
};
