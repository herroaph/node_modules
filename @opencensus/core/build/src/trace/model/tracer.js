"use strict";
/**
 * Copyright 2018, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../../common/console-logger");
const cls = require("../../internal/cls");
const sampler_1 = require("../sampler/sampler");
const root_span_1 = require("./root-span");
/**
 * This class represent a tracer.
 */
class CoreTracer {
    /** Constructs a new TraceImpl instance. */
    constructor() {
        /** A list of end span event listeners */
        this.eventListenersLocal = [];
        /** A list of ended root spans */
        // @ts-ignore
        this.endedTraces = [];
        /** Bit to represent whether trace is sampled or not. */
        this.IS_SAMPLED = 0x1;
        /** A configuration for starting the tracer */
        this.logger = logger.logger();
        this.activeLocal = false;
        this.contextManager = cls.createNamespace();
        this.clearCurrentTrace();
        this.activeTraceParams = {};
    }
    /** Gets the current root span. */
    get currentRootSpan() {
        return this.contextManager.get('rootspan');
    }
    /** Sets the current root span. */
    set currentRootSpan(root) {
        if (this.contextManager.active) {
            this.contextManager.set('rootspan', root);
        }
    }
    /** A propagation instance */
    get propagation() {
        return this.config ? this.config.propagation : null;
    }
    /**
     * Starts a tracer.
     * @param config A tracer configuration object to start a tracer.
     */
    start(config) {
        this.activeLocal = true;
        this.config = config;
        this.logger = this.config.logger || logger.logger();
        this.sampler = sampler_1.SamplerBuilder.getSampler(config.samplingRate);
        if (config.traceParams) {
            this.activeTraceParams.numberOfAnnontationEventsPerSpan =
                sampler_1.TraceParamsBuilder.getNumberOfAnnotationEventsPerSpan(config.traceParams);
            this.activeTraceParams.numberOfAttributesPerSpan =
                sampler_1.TraceParamsBuilder.getNumberOfAttributesPerSpan(config.traceParams);
            this.activeTraceParams.numberOfMessageEventsPerSpan =
                sampler_1.TraceParamsBuilder.getNumberOfMessageEventsPerSpan(config.traceParams);
            this.activeTraceParams.numberOfLinksPerSpan =
                sampler_1.TraceParamsBuilder.getNumberOfLinksPerSpan(config.traceParams);
        }
        return this;
    }
    /** Stops the tracer. */
    stop() {
        this.activeLocal = false;
        return this;
    }
    /** Gets the list of event listeners. */
    get eventListeners() {
        return this.eventListenersLocal;
    }
    /** Indicates if the tracer is active or not. */
    get active() {
        return this.activeLocal;
    }
    /**
     * Starts a root span.
     * @param options A TraceOptions object to start a root span.
     * @param fn A callback function to run after starting a root span.
     */
    startRootSpan(options, fn) {
        return this.contextManager.runAndReturn((root) => {
            let newRoot = null;
            if (this.active) {
                let propagatedSample = null;
                // if there is a context propagation, keep the decistion
                if (options && options.spanContext) {
                    if (options.spanContext.options) {
                        propagatedSample =
                            ((options.spanContext.options & this.IS_SAMPLED) !== 0);
                    }
                    if (!propagatedSample) {
                        options.spanContext = null;
                    }
                }
                const aRoot = new root_span_1.RootSpan(this, options);
                let sampleDecision = propagatedSample;
                if (!sampleDecision) {
                    sampleDecision = this.sampler.shouldSample(aRoot.traceId);
                }
                if (sampleDecision) {
                    this.currentRootSpan = aRoot;
                    aRoot.start();
                    newRoot = aRoot;
                }
            }
            else {
                this.logger.debug('Tracer is inactive, can\'t start new RootSpan');
            }
            return fn(newRoot);
        });
    }
    onStartSpan(root) {
        if (this.active) {
            if (!root) {
                return this.logger.debug('cannot start trace - no active trace found');
            }
            if (this.currentRootSpan !== root) {
                this.logger.debug('currentRootSpan != root on notifyStart. Need more investigation.');
            }
            this.notifyStartSpan(root);
        }
    }
    /**
     * Is called when a span is ended.
     * @param root The ended span.
     */
    onEndSpan(root) {
        if (this.active) {
            if (!root) {
                return this.logger.debug('cannot end trace - no active trace found');
            }
            if (this.currentRootSpan !== root) {
                this.logger.debug('currentRootSpan != root on notifyEnd. Need more investigation.');
            }
            this.notifyEndSpan(root);
        }
    }
    /**
     * Registers an end span event listener.
     * @param listener The listener to register.
     */
    registerSpanEventListener(listener) {
        this.eventListenersLocal.push(listener);
    }
    /**
     * Unregisters an end span event listener.
     * @param listener The listener to unregister.
     */
    unregisterSpanEventListener(listener) {
        const index = this.eventListenersLocal.indexOf(listener, 0);
        if (index > -1) {
            this.eventListeners.splice(index, 1);
        }
    }
    notifyStartSpan(root) {
        this.logger.debug('starting to notify listeners the start of rootspans');
        if (this.eventListenersLocal && this.eventListenersLocal.length > 0) {
            for (const listener of this.eventListenersLocal) {
                listener.onStartSpan(root);
            }
        }
    }
    notifyEndSpan(root) {
        if (this.active) {
            this.logger.debug('starting to notify listeners the end of rootspans');
            if (this.eventListenersLocal && this.eventListenersLocal.length > 0) {
                for (const listener of this.eventListenersLocal) {
                    listener.onEndSpan(root);
                }
            }
        }
        else {
            this.logger.debug('this tracer is inactivate cant notify endspan');
        }
    }
    /** Clears the current root span. */
    clearCurrentTrace() {
        this.currentRootSpan = null;
    }
    /**
     * Starts a span.
     * @param name The span name.
     * @param kind optional The span kind.
     * @param parentSpanId The parent span ID.
     */
    startChildSpan(name, kind) {
        let newSpan = null;
        if (!this.currentRootSpan) {
            this.logger.debug('no current trace found - must start a new root span first');
        }
        else {
            newSpan = this.currentRootSpan.startChildSpan(name, kind);
        }
        return newSpan;
    }
    /**
     * Binds the trace context to the given function.
     * This is necessary in order to create child spans correctly in functions
     * that are called asynchronously (for example, in a network response
     * handler).
     * @param fn A function to which to bind the trace context.
     */
    wrap(fn) {
        if (!this.active) {
            return fn;
        }
        const namespace = this.contextManager;
        return namespace.bind(fn);
    }
    /**
     * Binds the trace context to the given event emitter.
     * This is necessary in order to create child spans correctly in event
     * handlers.
     * @param emitter An event emitter whose handlers should have
     * the trace context binded to them.
     */
    wrapEmitter(emitter) {
        if (!this.active) {
            return;
        }
        const namespace = this.contextManager;
        namespace.bindEmitter(emitter);
    }
}
exports.CoreTracer = CoreTracer;
//# sourceMappingURL=tracer.js.map