"use strict";
// export * from './errors'
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSkeleaError = exports.ToolCategory = void 0;
var ToolCategory;
(function (ToolCategory) {
    ToolCategory["WEB"] = "web";
    ToolCategory["CODE"] = "code";
    ToolCategory["DATA"] = "data";
    ToolCategory["FILES"] = "files";
    ToolCategory["MESSAGING"] = "messaging";
    ToolCategory["SHOPPING"] = "shopping";
    ToolCategory["TRADING"] = "trading";
    ToolCategory["CALENDAR"] = "calendar";
    ToolCategory["BROWSER"] = "browser";
    ToolCategory["APIS"] = "apis";
    ToolCategory["PAYMENTS"] = "payments";
    ToolCategory["CRM"] = "crm";
    ToolCategory["MEDIA"] = "media";
    ToolCategory["VOICE"] = "voice";
    ToolCategory["MEMORY"] = "memory";
    ToolCategory["APP_BUILDER"] = "app_builder";
    ToolCategory["MCP"] = "mcp";
})(ToolCategory || (exports.ToolCategory = ToolCategory = {}));
class OpenSkeleaError extends Error {
    code;
    context;
    constructor(code, message, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'OpenSkeleaError';
    }
}
exports.OpenSkeleaError = OpenSkeleaError;
