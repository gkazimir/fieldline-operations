import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

const FieldlinePreset = definePreset(Aura, {
  primitive: {
    orange: { 100: '#feeed7', 600: '#ce5109', 800: '#703100' },
    green: { 100: '#e1f4eb', 800: '#0f5236' },
    red: { 100: '#fce9e8', 600: '#b62520', 800: '#86181d' },
  },
  semantic: {
    transitionDuration: '120ms',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.400}',
      offset: '2px',
      shadow: 'none',
    },
    primary: {
      50: '#eff7fa',
      100: '#dcedf4',
      200: '#badbe8',
      300: '#7dbbd4',
      400: '#2d95be',
      500: '#117197',
      600: '#085c7d',
      700: '#054761',
      800: '#043549',
      900: '#032735',
      950: '#031c26',
      color: '{primary.500}',
      contrastColor: '#ffffff',
      hoverColor: '{primary.600}',
      activeColor: '{primary.700}',
    },
    surface: {
      0: '#ffffff',
      50: '#f8f8f6',
      100: '#f2f3ef',
      200: '#e6e7e1',
      300: '#d4d6cc',
      400: '#868a75',
      500: '#676a58',
      600: '#545747',
      700: '#3f4234',
      800: '#2d2f23',
      900: '#1f2118',
      950: '#14150f',
    },
    text: {
      color: '{surface.900}',
      mutedColor: '{surface.600}',
    },
    content: {
      borderColor: '{surface.300}',
    },
    highlight: {
      background: '{primary.50}',
      focusBackground: '{primary.100}',
      color: '{primary.700}',
      focusColor: '{primary.800}',
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.40625rem',
      borderRadius: '{border.radius.sm}',
      borderColor: '{surface.400}',
      hoverBorderColor: '{surface.500}',
      focusBorderColor: '{primary.500}',
      placeholderColor: '{surface.500}',
      disabledColor: '{surface.500}',
      shadow: 'none',
      focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}',
      },
    },
    overlay: {
      select: { borderColor: '{surface.300}', shadow: 'none' },
      popover: { borderColor: '{surface.300}', shadow: 'none' },
      modal: { borderColor: '{surface.300}', borderRadius: '{border.radius.md}', shadow: 'none' },
      navigation: { shadow: 'none' },
    },
  },
  components: {
    button: {
      root: {
        label: { fontWeight: '600' },
        primary: {
          focusRing: { color: '{focus.ring.color}', shadow: 'none' },
        },
        secondary: {
          focusRing: { color: '{focus.ring.color}', shadow: 'none' },
        },
      },
    },
    select: {
      root: { paddingY: '0.3125rem' },
    },
    multiselect: {
      root: { paddingY: '0.359375rem' },
    },
    card: {
      root: {
        background: '{surface.0}',
        borderRadius: '{border.radius.md}',
        shadow: 'none',
      },
      body: { padding: '1rem 1.25rem' },
      title: { fontSize: '1.0625rem', fontWeight: '600' },
    },
    tag: {
      root: {
        fontWeight: '600',
        padding: '0.125rem 0.5rem',
        borderRadius: '{border.radius.sm}',
      },
      primary: { background: '{primary.100}', color: '{primary.800}' },
      secondary: { background: '{surface.100}', color: '{surface.700}' },
      success: { background: '{green.100}', color: '{green.800}' },
      warn: { background: '{orange.100}', color: '{orange.800}' },
      danger: { background: '{red.100}', color: '{red.800}' },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: FieldlinePreset,
        options: {
          darkModeSelector: false,
        },
      },
      ripple: false,
    }),
  ],
};
