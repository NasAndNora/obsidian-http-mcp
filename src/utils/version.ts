// Version management - single source of truth from package.json

import pkg from '../../package.json' with { type: 'json' };

export const VERSION = pkg.version;
