declare type ReduxSaga$Predicate<T> = (arg: T) => boolean;

declare interface ReduxSaga$Task {
    isRunning(): boolean,
    isCancelled(): boolean,
    result(): any,
    result<T>(): T,
    error(): any,
    done: Promise<any>,
    cancel(): void
}

declare interface ReduxSaga$Buffer<T> {
    isEmpty(): boolean,
    put(message: T): void,
    take(): T
}

declare interface ReduxSaga$Channel<T> {
    take(cb: (message: T) => void, matcher?: ReduxSaga$Predicate<T>): void,
    put(message: T): void,
    close(): void
}

declare module 'redux-saga/effects' {
    declare type Predicate<T> = ReduxSaga$Predicate<T>;
    declare type Task = ReduxSaga$Task;
    declare type Buffer<T> = ReduxSaga$Buffer<T>;
    declare type Channel<T> = ReduxSaga$Channel<T>;
    declare type Action = { type: $Subtype<string> };
    declare type Pattern<T> = string | Predicate<T> | (string | Predicate<T>)[];

    declare type Effect =
        | TakeEffect<any>
        | PutEffect<any>
        | RaceEffect
        | CallEffect
        | CpsEffect
        | ForkEffect
        | JoinEffect
        | CancelEffect
        | SelectEffect
        | ActionChannelEffect<any>
        | CancelledEffect
        | FlushEffect<any>;

    // take
    declare interface TakeEffectDescriptor<T> {
        pattern: Pattern<T>,
        channel: Channel<T>,
        maybe?: boolean
    }

    declare interface TakeEffect<T> {
        TAKE: TakeEffectDescriptor<T>
    }

    declare var take: {
        <T>(pattern: Pattern<T>): TakeEffect<T>,
        <T>(channel: Channel<T>): TakeEffect<T>,
        maybe: {
            <T>(pattern: Pattern<T>): TakeEffect<T>,
            <T>(channel: Channel<T>): TakeEffect<T>
        }
    };

    declare var takem: void;

    // put
    declare interface PutEffectDescriptor<T> {
        action: T,
        channel: Channel<T>
    }

    declare interface PutEffect<T> {
        PUT: PutEffectDescriptor<T>
    }

    declare var put: {
        <T: Action>(action: T): PutEffect<T>,
        <T: Action>(channel: Channel<T>, action: T): PutEffect<T>,
        resolve: {
            <T: Action>(action: T): PutEffect<T>,
            <T: Action>(channel: Channel<T>, action: T): PutEffect<T>
        },
        sync: void
    };

    // race
    declare type RaceEffectDescriptor = { [key: string]: Effect };

    declare interface RaceEffect {
        RACE: RaceEffectDescriptor
    }

    declare function race(effects: { [key: string]: Effect }): RaceEffect;

    // call & apply
    declare interface CallEffectDescriptor {
        context: any,
        fn: Function,
        args: any[]
    }

    declare type Collable0 = () => any;
    declare type Collable1<A> = (a: A) => any;
    declare type Collable2<A, B> = (a: A, b: B) => any;
    declare type Collable3<A, B, C> = (a: A, b: B, c: C) => any;
    declare type Collable4<A, B, C, D> = (a: A, b: B, c: C, d: D) => any;
    declare type Collable5<A, B, C, D, E> = (a: A, b: B, c: C, d: D, e: E) => any;
    declare type CollableR = (...args: mixed[]) => any;

    declare type CallEffectArg<F> = F | [any, F] | { context: any, fn: F };

    declare interface CallEffect {
        CALL: CallEffectDescriptor
    }

    declare type CallEffectFactory<R> = {
        (fn: CallEffectArg<Collable0>): R,
        <A>(fn: CallEffectArg<Collable1<A>>, a: A): R,
        <A, B>(fn: CallEffectArg<Collable2<A, B>>, a: A, b: B): R,
        <A, B, C>(fn: CallEffectArg<Collable3<A, B, C>>, a: A, b: B, c: C): R,
        <A, B, C, D>(fn: CallEffectArg<Collable4<A, B, C, D>>, a: A, b: B, c: C, d: D): R,
        <A, B, C, D, E>(
            fn: CallEffectArg<Collable5<A, B, C, D, E>>,
            a: A,
            b: B,
            c: C,
            d: D,
            e: E
        ): R,
        (fn: CallEffectArg<CollableR>, ...args: any[]): R
    };

    declare var call: CallEffectFactory<CallEffect>;

    declare var apply: {
        (context: any, fn: Collable0): CallEffect,
        <A>(context: any, fn: Collable1<A>, args: [A]): CallEffect,
        <A, B>(context: any, fn: Collable2<A, B>, args: [A, B]): CallEffect,
        <A, B, C>(context: any, fn: Collable3<A, B, C>, args: [A, B, C]): CallEffect,
        <A, B, C, D>(context: any, fn: Collable4<A, B, C, D>, args: [A, B, C, D]): CallEffect,
        <A, B, C, D, E>(
            context: any,
            fn: Collable5<A, B, C, D, E>,
            args: [A, B, C, D, E]
        ): CallEffect,
        (context: any, fn: CollableR, args: any[]): CallEffect
    };

    // cps
    declare interface CpsEffect {
        CPS: CallEffectDescriptor
    }

    declare type CpsCallback = (error: any, result: any) => void;

    declare var cps: {
        (fn: CallEffectArg<Collable1<CpsCallback>>): CpsEffect,
        <A>(fn: CallEffectArg<Collable2<A, CpsCallback>>, a: A): CpsEffect,
        <A, B>(fn: CallEffectArg<Collable3<A, B, CpsCallback>>, a: A, b: B): CpsEffect,
        <A, B, C>(fn: CallEffectArg<Collable4<A, B, C, CpsCallback>>, a: A, b: B, c: C): CpsEffect,
        <A, B, C, D>(
            fn: CallEffectArg<Collable5<A, B, C, D, CpsCallback>>,
            a: A,
            b: B,
            c: C,
            d: D
        ): CpsEffect
    };

    // fork & spawn
    declare interface ForkEffectDescriptor extends CallEffectDescriptor {
        detached?: boolean
    }

    declare interface ForkEffect {
        FORK: ForkEffectDescriptor
    }

    declare var fork: CallEffectFactory<ForkEffect>;
    declare var spawn: CallEffectFactory<ForkEffect>;

    // join
    declare interface JoinEffect {
        JOIN: Task
    }

    declare function join(task: Task): JoinEffect;

    // cancel
    declare interface CancelEffect {
        CANCEL: Task
    }

    declare function cancel(task: Task): CancelEffect;

    // select
    declare interface SelectEffectDescriptor {
        selector(state: any, ...args: any[]): any,
        args: any[]
    }

    declare interface SelectEffect {
        SELECT: SelectEffectDescriptor
    }

    declare var select: {
        (): SelectEffect,
        <S>(selector: Collable1<S>): SelectEffect,
        <S, A>(selector: Collable2<S, A>, a: A): SelectEffect,
        <S, A, B>(selector: Collable3<S, A, B>, a: A, b: B): SelectEffect,
        <S, A, B, C>(selector: Collable4<S, A, B, C>, a: A, b: B, c: C): SelectEffect,
        <S, A, B, C, D>(selector: Collable5<S, A, B, C, D>, a: A, b: B, c: C, d: D): SelectEffect,
        (selector: CollableR, ...rest: any[]): SelectEffect
    };

    // actionChannel
    declare interface ActionChannelEffectDescriptor<T> {
        pattern: Pattern<T>,
        buffer: Buffer<T>
    }

    declare interface ActionChannelEffect<T> {
        ACTION_CHANNEL: ActionChannelEffectDescriptor<T>
    }

    declare function actionChannel<T>(
        pattern: Pattern<T>,
        buffer?: Buffer<T>
    ): ActionChannelEffect<T>;

    // actionChannel
    declare interface CancelledEffect {
        CANCELLED: {}
    }

    declare function cancelled(): CancelledEffect;

    // flush
    declare interface FlushEffect<T> {
        FLUSH: Channel<T>
    }

    declare function flush<T>(channel: Channel<T>): FlushEffect<T>;

    // takeEvery & takeLatest
    declare type Workable0<A> = (action?: A) => any;
    declare type Workable1<A, B> = (b: B, action?: A) => any;
    declare type Workable2<A, B, C> = (b: B, c: C, action?: A) => any;
    declare type Workable3<A, B, C, D> = (b: B, c: C, d: D, action?: A) => any;
    declare type Workable4<A, B, C, D, E> = (b: B, c: C, d: D, e: E, action?: A) => any;
    declare type WorkableR<A, B, C, D, E, F> = (
        b: B,
        c: C,
        d: D,
        e: E,
        f: F,
        ...args: mixed[]
    ) => any;

    declare interface TakeHelper {
        <A>(pattern: Pattern<A>, worker: Workable0<A>): ForkEffect,
        <A, B>(pattern: Pattern<A>, worker: Workable1<A, B>, b: B): ForkEffect,
        <A, B, C>(pattern: Pattern<A>, worker: Workable2<A, B, C>, b: B, c: C): ForkEffect,
        <A, B, C, D>(
            pattern: Pattern<A>,
            worker: Workable3<A, B, C, D>,
            b: B,
            c: C,
            d: D
        ): ForkEffect,
        <A, B, C, D, E>(
            pattern: Pattern<A>,
            worker: Workable4<A, B, C, D, E>,
            b: B,
            c: C,
            d: D,
            e: E
        ): ForkEffect,
        <A, B, C, D, E, F>(
            pattern: Pattern<A>,
            worker: WorkableR<A, B, C, D, E, F>,
            b: B,
            c: C,
            d: D,
            e: E,
            f: F,
            ...rest: any[]
        ): ForkEffect
    }

    declare var takeEvery: TakeHelper;
    declare var takeLatest: TakeHelper;

    // throttle
    declare var throttle: {
        <A>(ms: number, pattern: Pattern<A>, worker: Workable0<A>): ForkEffect,
        <A, B>(ms: number, pattern: Pattern<A>, worker: Workable1<A, B>, b: B): ForkEffect,
        <A, B, C>(
            ms: number,
            pattern: Pattern<A>,
            worker: Workable2<A, B, C>,
            b: B,
            c: C
        ): ForkEffect,
        <A, B, C, D>(
            ms: number,
            pattern: Pattern<A>,
            worker: Workable3<A, B, C, D>,
            b: B,
            c: C,
            d: D
        ): ForkEffect,
        <A, B, C, D, E>(
            ms: number,
            pattern: Pattern<A>,
            worker: Workable4<A, B, C, D, E>,
            b: B,
            c: C,
            d: D,
            e: E
        ): ForkEffect,
        <A, B, C, D, E, F>(
            ms: number,
            pattern: Pattern<A>,
            worker: WorkableR<A, B, C, D, E, F>,
            b: B,
            c: C,
            d: D,
            e: E,
            f: F,
            ...rest: any[]
        ): ForkEffect
    };
}

declare module 'redux-saga/utils' {
    import type {
        Effect,
        TakeEffectDescriptor,
        PutEffectDescriptor,
        RaceEffectDescriptor,
        CallEffectDescriptor,
        ForkEffectDescriptor,
        SelectEffectDescriptor,
        ActionChannelEffectDescriptor
    } from 'redux-saga/effects';

    declare type Task = ReduxSaga$Task;
    declare type Channel<T> = ReduxSaga$Channel<T>;
    declare type Is = ReduxSaga$Predicate<*>;
    declare interface Deferred<R> {
        resolve(result: R): void,
        reject(error: any): void,
        promise: Promise<R>
    }
    declare interface MockTask extends Task {
        setRunning(running: boolean): void,
        setResult(result: any): void,
        setError(error: any): void
    }

    declare var TASK: '@@redux-saga/TASK';

    declare var SAGA_ACTION: '@@redux-saga/SAGA_ACTION';

    declare function noop(): void;

    declare var is: {
        undef: Is,
        notUndef: Is,
        func: Is,
        number: Is,
        array: Is,
        promise: Is,
        iterator: Is,
        task: Is,
        observable: Is,
        buffer: Is,
        pattern: Is,
        channel: Is,
        helper: Is,
        stringableFunc: Is
    };

    declare function deferred<T, R>(props?: T): T & Deferred<R>;

    declare function arrayOfDeffered<T>(length: number): Deferred<T>[];

    declare function createMockTask(): MockTask;

    declare var asEffect: {
        take<T>(effect: Effect): ?TakeEffectDescriptor<T>,
        put<T>(effect: Effect): ?PutEffectDescriptor<T>,
        race(effect: Effect): ?RaceEffectDescriptor,
        call(effect: Effect): ?CallEffectDescriptor,
        cps(effect: Effect): ?CallEffectDescriptor,
        fork(effect: Effect): ?ForkEffectDescriptor,
        join(effect: Effect): ?Task,
        cancel(effect: Effect): ?Task,
        select(effect: Effect): ?SelectEffectDescriptor,
        actionChannel<T>(effect: Effect): ?ActionChannelEffectDescriptor<T>,
        cancelled(effect: Effect): ?{},
        flush<T>(effect: Effect): ?Channel<T>
    };

    declare var CHANNEL_END: {
        toString(): '@@redux-saga/CHANNEL_END'
    };
}

declare module 'redux-saga' {
    import type { Middleware } from 'redux';
    import type { Effect } from 'redux-saga/effects';
    import typeof * as Effects from 'redux-saga/effects';
    import typeof * as Utils from 'redux-saga/utils';

    declare export type Predicate<T> = ReduxSaga$Predicate<T>;
    declare export type Task = ReduxSaga$Task;
    declare export type Buffer<T> = ReduxSaga$Buffer<T>;
    declare export type Channel<T> = ReduxSaga$Channel<T>;

    declare export interface SagaMonitor {
        effectTriggered(options: {
            effectId: number,
            parentEffectId: number,
            label: string,
            root?: boolean,
            effect: Effect
        }): void,
        effectResolved(effectId: number, result: any): void,
        effectRejected(effectId: number, err: any): void,
        effectCancelled(effectId: number): void,
        actionDispatched<A>(action: A): void
    }

    declare type Saga0 = () => Generator<*, *, *>;
    declare type Saga1<A> = (a: A) => Generator<*, *, *>;
    declare type Saga2<A, B> = (a: A, b: B) => Generator<*, *, *>;
    declare type Saga3<A, B, C> = (a: A, b: B, c: C) => Generator<*, *, *>;
    declare type Saga4<A, B, C, D> = (a: A, b: B, c: C, d: D) => Generator<*, *, *>;
    declare type SagaR = (...args: mixed[]) => Generator<*, *, *>;

    declare export type SagaMiddleware<S, A> = Middleware<S, A> & {
        run(saga: Saga0): Task,
        run<A>(saga: Saga1<A>, a: A): Task,
        run<A, B>(saga: Saga2<A, B>, a: A, B: B): Task,
        run<A, B, C>(saga: Saga3<A, B, C>, a: A, B: B, c: C): Task,
        run<A, B, C, T4>(saga: Saga4<A, B, C, T4>, a: A, B: B, c: C, d: T4): Task,
        run(saga: SagaR, ...args: any[]): Task
    };

    declare export type Emit<T> = (input: T) => void;

    declare export default function createSagaMiddleware<T>(options?: {
        sagaMonitor?: SagaMonitor,
        emitter: (emit: Emit<T>) => Emit<T>
    }): SagaMiddleware<*, *>;

    declare export type Unsubscribe = () => void;
    declare export type Subscribe<T> = (cb: (input: T) => void) => Unsubscribe;
    declare export type Logger = (level: 'info' | 'warning' | 'error', ...args: Array<any>) => void;

    declare export function runSaga<S, SA, DA>(
        saga: Generator<*, *, *>,
        io: {
            subscribe?: Subscribe<SA>,
            dispatch?: (input: DA) => any,
            getState?: () => S,
            sagaMonitor?: SagaMonitor,
            logger?: Logger,
            onError?: void
        }
    ): Task;

    declare export var END: { type: '@@redux-saga/CHANNEL_END' };

    declare export function eventChannel<T>(
        subscribe: Subscribe<T>,
        buffer?: Buffer<T>,
        matcher?: Predicate<T>
    ): Channel<T>;

    declare export function channel<T>(buffer?: Buffer<T>): Channel<T>;

    declare export var buffers: {
        none<T>(): Buffer<T>,
        fixed<T>(limit?: number): Buffer<T>,
        dropping<T>(limit?: number): Buffer<T>,
        sliding<T>(limit?: number): Buffer<T>,
        expanding<T>(limit?: number): Buffer<T>
    };

    // deprecate
    declare export var takeEvery: void;
    declare export var takeLatest: void;
    declare export var throttle: void;

    declare export function delay(ms: number, rest: void): Promise<boolean>;
    declare export function delay<T>(ms: number, val: T): Promise<T>;

    declare export var CANCEL: '@@redux-saga/cancelPromise';

    declare export var effects: Effects;
    declare export var utils: Utils;
}
