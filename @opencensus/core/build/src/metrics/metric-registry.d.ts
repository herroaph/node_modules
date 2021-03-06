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
import { MeasureUnit } from '../stats/types';
import { LabelKey, MetricProducer } from './export/types';
import { DerivedGauge } from './gauges/derived-gauge';
import { Gauge } from './gauges/gauge';
/**
 * Creates and manages application's set of metrics.
 */
export declare class MetricRegistry {
    private registeredMetrics;
    private metricProducer;
    private static readonly NAME;
    private static readonly DESCRIPTION;
    private static readonly UNIT;
    private static readonly LABEL_KEY;
    private static readonly LABEL_KEYS;
    constructor();
    /**
     * Builds a new Int64 gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param {string} name The name of the metric.
     * @param {string} description The description of the metric.
     * @param {MeasureUnit} unit The unit of the metric.
     * @param {LabelKey[]} labelKeys The list of the label keys.
     * @returns {Gauge} A Int64 Gauge metric.
     */
    addInt64Gauge(name: string, description: string, unit: MeasureUnit, labelKeys: LabelKey[]): Gauge;
    /**
     * Builds a new double gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param {string} name The name of the metric.
     * @param {string} description The description of the metric.
     * @param {MeasureUnit} unit The unit of the metric.
     * @param {LabelKey[]} labelKeys The list of the label keys.
     * @returns {Gauge} A Double Gauge metric.
     */
    addDoubleGauge(name: string, description: string, unit: MeasureUnit, labelKeys: LabelKey[]): Gauge;
    /**
     * Builds a new derived Int64 gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param {string} name The name of the metric.
     * @param {string} description The description of the metric.
     * @param {MeasureUnit} unit The unit of the metric.
     * @param {LabelKey[]} labelKeys The list of the label keys.
     * @returns {DerivedGauge} A Int64 DerivedGauge metric.
     */
    addDerivedInt64Gauge(name: string, description: string, unit: MeasureUnit, labelKeys: LabelKey[]): DerivedGauge;
    /**
     * Builds a new derived double gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param {string} name The name of the metric.
     * @param {string} description The description of the metric.
     * @param {MeasureUnit} unit The unit of the metric.
     * @param {LabelKey[]} labelKeys The list of the label keys.
     * @returns {DerivedGauge} A Double DerivedGauge metric.
     */
    addDerivedDoubleGauge(name: string, description: string, unit: MeasureUnit, labelKeys: LabelKey[]): DerivedGauge;
    /**
     * Registers metric to register.
     *
     * @param {string} name The name of the metric.
     * @param {Meter} meter The metric to register.
     */
    private registerMetric;
    /**
     * Gets a metric producer for registry.
     *
     * @returns {MetricProducer} The metric producer.
     */
    getMetricProducer(): MetricProducer;
}
