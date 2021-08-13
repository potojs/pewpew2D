"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Globals = exports.AppState = void 0;
var AppState;
(function (AppState) {
    AppState[AppState["MENU"] = 0] = "MENU";
    AppState[AppState["JOINNING_PUBLIC"] = 1] = "JOINNING_PUBLIC";
    AppState[AppState["CREATING_CUSTOM_GAME"] = 2] = "CREATING_CUSTOM_GAME";
    AppState[AppState["CUSTOM_GAME_CREATED"] = 3] = "CUSTOM_GAME_CREATED";
    AppState[AppState["JOINNING_CUSTOM_GAME"] = 4] = "JOINNING_CUSTOM_GAME";
})(AppState = exports.AppState || (exports.AppState = {}));
exports.Globals = {
    state: AppState.MENU
};
