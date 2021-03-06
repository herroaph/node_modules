"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants = {
    MINIMUM_TRACE_DURATION: process.env.NODE_ENV === 'test' ? 0 : 1000 * 1000,
    DEFAULT_BUFFER_SIZE: 0,
    DEFAULT_BUFFER_TIMEOUT: 1000,
    DEFAULT_INSTRUMENTATION_MODULES: [],
    OPENCENSUS_SCOPE: '@opencensus',
    DEFAULT_PLUGIN_PACKAGE_NAME_PREFIX: 'instrumentation'
};
exports.Constants = constants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NlbnN1cy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFtQkEsTUFBTSxTQUFTLEdBQUc7SUFFaEIsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJO0lBRXpFLG1CQUFtQixFQUFFLENBQUM7SUFFdEIsc0JBQXNCLEVBQUUsSUFBSTtJQUU1QiwrQkFBK0IsRUFBRSxFQUFFO0lBRW5DLGdCQUFnQixFQUFFLGFBQWE7SUFFL0Isa0NBQWtDLEVBQUUsaUJBQWlCO0NBQ3RELENBQUE7QUFFcUIsOEJBQVMifQ==