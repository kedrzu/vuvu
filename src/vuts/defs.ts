import Vue, { Component } from 'vue';

export interface ComponentConstructor {
    new(...args: any[]): Vue;
}

export interface ComponentOptions {
    components?: { [id: string]: Component };
}
