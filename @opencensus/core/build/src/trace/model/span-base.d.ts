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
import { Logger } from '../../common/types';
import * as configTypes from '../config/types';
import * as types from './types';
/** Defines a base model for spans. */
export declare abstract class SpanBase implements types.Span {
    protected className: string;
    /** The clock used to mesure the beginning and ending of a span */
    private clock;
    /** Indicates if this span was started */
    private startedLocal;
    /** Indicates if this span was ended */
    private endedLocal;
    /** Indicates if this span was forced to end */
    private truncated;
    /** The Span ID of this span */
    readonly id: string;
    /** An object to log information to */
    logger: Logger;
    /** A set of attributes, each in the format [KEY]:[VALUE] */
    attributes: types.Attributes;
    /** A text annotation with a set of attributes. */
    annotations: types.Annotation[];
    /** An event describing a message sent/received between Spans */
    messageEvents: types.MessageEvent[];
    /** Pointers from the current span to another span */
    links: types.Link[];
    /** If the parent span is in another process. */
    remoteParent: boolean;
    /** The span ID of this span's parent. If it's a root span, must be empty */
    parentSpanId: string;
    /** The resource name of the span */
    name: string;
    /** Kind of span. */
    kind: types.SpanKind;
    /** A final status for this span */
    status: types.Status;
    /** set isRootSpan  */
    abstract readonly isRootSpan: boolean;
    /** Trace Parameters */
    activeTraceParams: configTypes.TraceParams;
    /** The number of dropped attributes. */
    droppedAttributesCount: number;
    /** The number of dropped links. */
    droppedLinksCount: number;
    /** The number of dropped annotations. */
    droppedAnnotationsCount: number;
    /** The number of dropped message events. */
    droppedMessageEventsCount: number;
    /** Constructs a new SpanBaseModel instance. */
    constructor();
    /** Gets the trace ID. */
    abstract readonly traceId: string;
    /** Gets the trace state */
    abstract readonly traceState: types.TraceState;
    /** Indicates if span was started. */
    readonly started: boolean;
    /** Indicates if span was ended. */
    readonly ended: boolean;
    /**
     * Gives a timestamp that indicates the span's start time in RFC3339 UTC
     * "Zulu" format.
     */
    readonly startTime: Date;
    /**
     * Gives a timestap that indicates the span's end time in RFC3339 UTC
     * "Zulu" format.
     */
    readonly endTime: Date;
    /**
     * Gives a timestap that indicates the span's duration in RFC3339 UTC
     * "Zulu" format.
     */
    readonly duration: number;
    /** Gives the TraceContext of the span. */
    readonly spanContext: types.SpanContext;
    /**
     * Adds an atribute to the span.
     * @param key Describes the value added.
     * @param value The result of an operation.
     */
    addAttribute(key: string, value: string | number | boolean): void;
    /**
     * Adds an annotation to the span.
     * @param description Describes the event.
     * @param attributes A set of attributes on the annotation.
     * @param timestamp A time, in milliseconds. Defaults to Date.now()
     */
    addAnnotation(description: string, attributes?: types.Attributes, timestamp?: number): void;
    /**
     * Adds a link to the span.
     * @param traceId The trace ID for a trace within a project.
     * @param spanId The span ID for a span within a trace.
     * @param type The relationship of the current span relative to the linked.
     * @param attributes A set of attributes on the link.
     */
    addLink(traceId: string, spanId: string, type: types.LinkType, attributes?: types.Attributes): void;
    /**
     * Adds a message event to the span.
     * @param type The type of message event.
     * @param id An identifier for the message event.
     * @param timestamp A time in milliseconds. Defaults to Date.now()
     */
    addMessageEvent(type: types.MessageEventType, id: string, timestamp?: number): void;
    /**
     * Sets a status to the span.
     * @param code The canonical status code.
     * @param message optional A developer-facing error message.
     */
    setStatus(code: types.CanonicalCode, message?: string): void;
    /** Starts the span. */
    start(): void;
    /** Ends the span. */
    end(): void;
    /** Forces the span to end. */
    truncate(): void;
}
