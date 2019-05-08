"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const daterangepicker_config_1 = require("./daterangepicker.config");
let LocaleService = class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        if (!this._config) {
            return daterangepicker_config_1.DefaultLocaleConfig;
        }
        return Object.assign({}, daterangepicker_config_1.DefaultLocaleConfig, this._config);
    }
};
LocaleService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(0, core_1.Inject(daterangepicker_config_1.LOCALE_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], LocaleService);
exports.LocaleService = LocaleService;
