"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var NgxDaterangepickerMd_1;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const daterangepicker_component_1 = require("./daterangepicker.component");
const daterangepicker_directive_1 = require("./daterangepicker.directive");
const daterangepicker_config_1 = require("./daterangepicker.config");
const locale_service_1 = require("./locale.service");
let NgxDaterangepickerMd = NgxDaterangepickerMd_1 = class NgxDaterangepickerMd {
    constructor() {
    }
    static forRoot(config = {}) {
        return {
            ngModule: NgxDaterangepickerMd_1,
            providers: [
                { provide: daterangepicker_config_1.LOCALE_CONFIG, useValue: config },
                { provide: locale_service_1.LocaleService, useClass: locale_service_1.LocaleService, deps: [daterangepicker_config_1.LOCALE_CONFIG] }
            ]
        };
    }
};
NgxDaterangepickerMd = NgxDaterangepickerMd_1 = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [
            daterangepicker_component_1.DaterangepickerComponent,
            daterangepicker_directive_1.DaterangepickerDirective
        ],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        providers: [],
        exports: [
            daterangepicker_component_1.DaterangepickerComponent,
            daterangepicker_directive_1.DaterangepickerDirective
        ],
        entryComponents: [
            daterangepicker_component_1.DaterangepickerComponent
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [])
], NgxDaterangepickerMd);
exports.NgxDaterangepickerMd = NgxDaterangepickerMd;
