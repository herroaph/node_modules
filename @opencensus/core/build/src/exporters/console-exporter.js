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
const exporter_buffer_1 = require("./exporter-buffer");
/** Do not send span data */
class NoopExporter {
    onStartSpan(root) { }
    onEndSpan(root) { }
    publish(rootSpans) {
        return Promise.resolve();
    }
}
exports.NoopExporter = NoopExporter;
/** Format and sends span data to the console. */
class ConsoleExporter {
    /**
     * Constructs a new ConsoleLogExporter instance.
     * @param config Exporter configuration object to create a console log
     * exporter.
     */
    constructor(config) {
        this.buffer = new exporter_buffer_1.ExporterBuffer(this, config);
        this.logger = config.logger;
    }
    onStartSpan(root) { }
    /**
     * Event called when a span is ended.
     * @param root Ended span.
     */
    onEndSpan(root) {
        this.buffer.addToBuffer(root);
    }
    /**
     * Sends the spans information to the console.
     * @param rootSpans
     */
    publish(rootSpans) {
        rootSpans.map((root) => {
            const ROOT_STR = `RootSpan: {traceId: ${root.traceId}, spanId: ${root.id}, name: ${root.name} }`;
            const SPANS_STR = root.spans.map((span) => [`\t\t{spanId: ${span.id}, name: ${span.name}}`].join('\n'));
            const result = [];
            result.push(ROOT_STR + '\n\tChildSpans:\n' +
                `${SPANS_STR.join('\n')}`);
            console.log(`${result}`);
        });
        return Promise.resolve();
    }
}
exports.ConsoleExporter = ConsoleExporter;
/** Exporter that receives stats data and shows in the log console. */
class ConsoleStatsExporter {
    /**
     * Event called when a view is registered
     * @param view registered view
     * @param measure registered measure
     */
    onRegisterView(view) {
        console.log(`View registered: ${view.name}, Measure registered: ${view.measure.name}`);
    }
    /**
     * Event called when a measurement is recorded
     * @param view recorded view from measurement
     * @param measurement recorded measurement
     */
    onRecord(views, measurement, tags) {
        console.log(`Measurement recorded: ${measurement.measure.name}`);
    }
    /**
     * Starts the Console exporter that polls Metric from Metrics library and
     * shows in the log console..
     */
    start() {
        // TODO(mayurkale): dependency with PR#253.
    }
}
exports.ConsoleStatsExporter = ConsoleStatsExporter;
//# sourceMappingURL=console-exporter.js.map