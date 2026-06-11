/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppStateProvider } from './store';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { AIStudio } from './components/AIStudio';
import { Guestbook } from './components/Guestbook';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen font-body-md bg-background text-on-background scroll-smooth">
        <Header />
        <main>
          <Hero />
          <Gallery />
          <AIStudio />
          <Guestbook />
        </main>
        <Footer />
      </div>
    </AppStateProvider>
  );
}
