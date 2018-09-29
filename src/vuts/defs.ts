import Vue, { Component } from 'vue';
import { AbstractConstructor } from '../types';

export interface ComponentConstructor {
    new(...args: any[]): Vue;
}

export interface ComponentOptions {
    components?: { [id: string]: Component };
}
