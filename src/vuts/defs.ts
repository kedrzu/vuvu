import Vue, { Component } from 'vue';

export interface ComponentConstructor {
    new(...args: any[]): Vue;
}

export interface ComponentOptions {
    name?: string;
    components?: { [id: string]: Component };
}
